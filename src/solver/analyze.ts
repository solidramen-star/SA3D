import { sectionProps } from '../model/sections';
import { DOF_NAMES, migrateModel, type Joint, type LoadCombo, type ModelData } from '../model/types';
import {
  GAUSS3,
  globalStiffness,
  localAxes,
  localStiffness,
  pointFER,
  rotation,
  toGlobal12,
  toLocal12,
  type Vec3,
} from './frame3d';
import { dirLocal, distributeAreaLoads, type MemberLoads } from './loads';
import { reverseCuthillMcKee, SkylineMatrix } from './skyline';

export class SolverError extends Error {}

export interface FrameResult {
  id: number;
  L: number;
  axes: [Vec3, Vec3, Vec3];
  /** Member end forces in local coords acting ON the member: [N,V2,V3,T,M2,M3] at i then j. */
  endForces: number[];
  /** Station positions from end i (may contain duplicates at concentrated loads). */
  x: number[];
  P: number[];
  V2: number[];
  V3: number[];
  T: number[];
  M2: number[];
  M3: number[];
  /** Displacements at stations, in global coordinates. */
  disp: Vec3[];
  loads: MemberLoads;
}

export interface Results {
  /** jointId → [UX,UY,UZ,RX,RY,RZ] */
  disp: Record<number, number[]>;
  /** jointId → [FX,FY,FZ,MX,MY,MZ] (only restrained joints) */
  reactions: Record<number, number[]>;
  frames: FrameResult[];
  warnings: string[];
  stats: { joints: number; frames: number; equations: number; maxDisp: number; sumLoad: Vec3; sumReaction: Vec3 };
}

interface Elem {
  id: number;
  ji: number; // joint index
  jj: number;
  L: number;
  axes: [Vec3, Vec3, Vec3];
  R: number[];
  kl: Float64Array;
  E: number;
  A: number;
  I22: number;
  I33: number;
  selfWeight: number; // kN/m, gamma × A
}

const STATIONS = 40;

/** Add member FER for all loads on the member. */
function memberFER(loads: MemberLoads, L: number): Float64Array {
  const fer = new Float64Array(12);
  for (const p of loads.points) pointFER(p.p, p.a, L, fer);
  for (const d of loads.dists) {
    const half = (d.x2 - d.x1) / 2;
    const mid = (d.x1 + d.x2) / 2;
    for (const g of GAUSS3) {
      const x = mid + g.x * half;
      const t = d.x2 > d.x1 ? (x - d.x1) / (d.x2 - d.x1) : 0;
      const w = (d.w1 + (d.w2 - d.w1) * t) * g.w * half;
      pointFER([d.d[0] * w, d.d[1] * w, d.d[2] * w], x, L, fer);
    }
  }
  return fer;
}

/** Resultant force and moment (about cut point x) of loads acting on [0, x]. */
function loadsLeftOf(loads: MemberLoads, x: number, inclusive: boolean): { F: Vec3; M: Vec3 } {
  const F: Vec3 = [0, 0, 0];
  const M: Vec3 = [0, 0, 0];
  const addPoint = (p: Vec3, a: number) => {
    F[0] += p[0];
    F[1] += p[1];
    F[2] += p[2];
    const r = a - x;
    // (r,0,0) × p
    M[1] += -r * p[2];
    M[2] += r * p[1];
  };
  for (const p of loads.points) if (p.a < x || (inclusive && p.a === x)) addPoint(p.p, p.a);
  for (const d of loads.dists) {
    const x2 = Math.min(d.x2, x);
    if (x2 <= d.x1) continue;
    const half = (x2 - d.x1) / 2;
    const mid = (d.x1 + x2) / 2;
    for (const g of GAUSS3) {
      const xx = mid + g.x * half;
      const t = d.x2 > d.x1 ? (xx - d.x1) / (d.x2 - d.x1) : 0;
      const w = (d.w1 + (d.w2 - d.w1) * t) * g.w * half;
      addPoint([d.d[0] * w, d.d[1] * w, d.d[2] * w], xx);
    }
  }
  return { F, M };
}

/** Cumulative trapezoid integral of y over x. */
function cumtrapz(x: number[], y: number[]): number[] {
  const out = [0];
  for (let k = 1; k < x.length; k++) out.push(out[k - 1] + ((x[k] - x[k - 1]) * (y[k] + y[k - 1])) / 2);
  return out;
}

/** Solve f'' = c with f(0)=f0, f(L)=fL by double integration of the curvature samples. */
function integrateDeflection(x: number[], curv: number[], f0: number, fL: number): number[] {
  const slope = cumtrapz(x, curv);
  const f = cumtrapz(x, slope);
  const L = x[x.length - 1];
  const corr = (fL - f0 - f[f.length - 1]) / L;
  return f.map((v, k) => v + f0 + corr * x[k]);
}

/** Results of every load case and combination of one analysis run. */
export interface ResultSet {
  /** Load cases first, then combinations, in model order. */
  items: { name: string; kind: 'case' | 'combo' }[];
  results: Record<string, Results>;
}

const scale3 = (v: Vec3, s: number): Vec3 => [v[0] * s, v[1] * s, v[2] * s];

/** Member loads of one load case, keyed by frame id. */
function caseMemberLoads(
  data: ModelData,
  caseName: string,
  withSelfWeight: boolean,
  elems: Elem[],
  jointMap: Map<number, Joint>,
  warnings: string[],
): Map<number, MemberLoads> {
  const out = new Map<number, MemberLoads>();
  const inCase = (l: { case?: string }) => (l.case ?? data.loadCases[0]?.name) === caseName;
  const areaFrameLoads = distributeAreaLoads({ ...data, areaLoads: data.areaLoads.filter(inCase) }, jointMap, warnings);
  for (const e of elems) {
    const loads: MemberLoads = { points: [], dists: [] };
    for (const l of data.framePointLoads)
      if (l.frame === e.id && l.P && inCase(l)) {
        const d = dirLocal(l.dir, e.axes);
        loads.points.push({ a: Math.min(Math.max(l.rd, 0), 1) * e.L, p: scale3(d, l.P) });
      }
    for (const l of data.frameUniformLoads)
      if (l.frame === e.id && l.w && inCase(l)) loads.dists.push({ x1: 0, x2: e.L, w1: l.w, w2: l.w, d: dirLocal(l.dir, e.axes) });
    const grav = dirLocal('GRAV', e.axes);
    for (const seg of areaFrameLoads.get(e.id) ?? []) loads.dists.push({ ...seg, d: grav });
    if (withSelfWeight && e.selfWeight > 0) loads.dists.push({ x1: 0, x2: e.L, w1: e.selfWeight, w2: e.selfWeight, d: grav });
    out.set(e.id, loads);
  }
  return out;
}

/** Linear combination of results that share the same model (same joints, frames and stations). */
export function combineResults(template: Results, parts: [Results, number][]): Results {
  const sumArr = (get: (r: Results) => number[] | undefined) => {
    const base = get(template);
    if (!base) return undefined;
    const out = base.map(() => 0);
    for (const [r, s] of parts) {
      const a = get(r);
      if (a) for (let k = 0; k < out.length; k++) out[k] += s * a[k];
    }
    return out;
  };
  const disp: Record<number, number[]> = {};
  for (const id of Object.keys(template.disp)) disp[+id] = sumArr((r) => r.disp[+id])!;
  const reactions: Record<number, number[]> = {};
  for (const id of Object.keys(template.reactions)) reactions[+id] = sumArr((r) => r.reactions[+id])!;
  let maxDisp = 0;
  for (const v of Object.values(disp)) maxDisp = Math.max(maxDisp, Math.hypot(v[0], v[1], v[2]));
  const frames = template.frames.map((t, n): FrameResult => {
    const col = (key: 'P' | 'V2' | 'V3' | 'T' | 'M2' | 'M3') => sumArr((r) => r.frames[n][key])!;
    const dispSt = t.disp.map((_, k): Vec3 => {
      const v: Vec3 = [0, 0, 0];
      for (const [r, s] of parts) for (let c = 0; c < 3; c++) v[c] += s * r.frames[n].disp[k][c];
      maxDisp = Math.max(maxDisp, Math.hypot(v[0], v[1], v[2]));
      return v;
    });
    const loads: MemberLoads = { points: [], dists: [] };
    for (const [r, s] of parts) {
      if (!s) continue;
      for (const p of r.frames[n].loads.points) loads.points.push({ a: p.a, p: scale3(p.p, s) });
      for (const d of r.frames[n].loads.dists) loads.dists.push({ ...d, w1: d.w1 * s, w2: d.w2 * s });
    }
    return {
      id: t.id,
      L: t.L,
      axes: t.axes,
      endForces: sumArr((r) => r.frames[n].endForces)!,
      x: [...t.x],
      P: col('P'),
      V2: col('V2'),
      V3: col('V3'),
      T: col('T'),
      M2: col('M2'),
      M3: col('M3'),
      disp: dispSt,
      loads,
    };
  });
  const sum3 = (get: (r: Results) => Vec3): Vec3 => {
    const v: Vec3 = [0, 0, 0];
    for (const [r, s] of parts) for (let c = 0; c < 3; c++) v[c] += s * get(r)[c];
    return v;
  };
  const warnings = [...new Set(parts.filter(([, s]) => s !== 0).flatMap(([r]) => r.warnings))];
  return {
    disp,
    reactions,
    frames,
    warnings,
    stats: {
      ...template.stats,
      maxDisp,
      sumLoad: sum3((r) => r.stats.sumLoad),
      sumReaction: sum3((r) => r.stats.sumReaction),
    },
  };
}

function checkCases(data: ModelData, combos: LoadCombo[]): void {
  if (!data.loadCases?.length) throw new SolverError('Define at least one load case.');
  const names = new Set<string>();
  for (const c of data.loadCases) {
    if (names.has(c.name)) throw new SolverError(`Load case name "${c.name}" is used more than once.`);
    names.add(c.name);
  }
  for (const c of combos) {
    if (names.has(c.name)) throw new SolverError(`Load combination name "${c.name}" is already used by another case or combination.`);
    names.add(c.name);
    for (const f of c.factors)
      if (!data.loadCases.some((lc) => lc.name === f.case))
        throw new SolverError(`Load combination ${c.name} refers to unknown load case "${f.case}".`);
  }
}

function solveAll(data: ModelData, combos: LoadCombo[]): ResultSet {
  const globalWarnings: string[] = [];
  const jointMap = new Map<number, Joint>(data.joints.map((j) => [j.id, j]));
  const mats = new Map(data.materials.map((m) => [m.name, m]));
  const secs = new Map(data.sections.map((s) => [s.name, s]));

  if (data.frames.length === 0) throw new SolverError('The model has no frames to analyze.');
  checkCases(data, combos);

  // Connected joints
  const used = new Set<number>();
  for (const f of data.frames) {
    if (!jointMap.has(f.i) || !jointMap.has(f.j)) throw new SolverError(`Frame ${f.id} references a missing joint.`);
    used.add(f.i);
    used.add(f.j);
  }
  for (const j of data.joints) {
    if (!used.has(j.id) && data.jointLoads.some((l) => l.joint === j.id && l.f.some((v) => v !== 0)))
      globalWarnings.push(`Joint ${j.id} is not connected to any frame; its load is ignored.`);
  }
  const usedJoints = data.joints.filter((j) => used.has(j.id));
  const idxOf = new Map<number, number>(usedJoints.map((j, k) => [j.id, k]));
  const nJ = usedJoints.length;

  // Elements (stiffness only; loads are per case)
  const elems: Elem[] = [];
  for (const f of data.frames) {
    const a = jointMap.get(f.i)!;
    const b = jointMap.get(f.j)!;
    const pi: Vec3 = [a.x, a.y, a.z];
    const pj: Vec3 = [b.x, b.y, b.z];
    const L = Math.hypot(pj[0] - pi[0], pj[1] - pi[1], pj[2] - pi[2]);
    if (L < 1e-9) throw new SolverError(`Frame ${f.id} has zero length.`);
    const m = mats.get(f.material);
    if (!m) throw new SolverError(`Frame ${f.id}: material "${f.material}" is not defined.`);
    const s = secs.get(f.section);
    if (!s) throw new SolverError(`Frame ${f.id}: section "${f.section}" is not defined.`);
    const sp = sectionProps(s);
    if (!(m.E > 0)) throw new SolverError(`Material ${m.name}: E must be positive.`);
    if (!(sp.A > 0 && sp.I22 > 0 && sp.I33 > 0 && sp.J > 0))
      throw new SolverError(`Section ${s.name}: A, I22, I33 and J must be positive.`);
    const G = m.E / (2 * (1 + m.nu));
    const axes = localAxes(pi, pj, f.beta);
    elems.push({
      id: f.id,
      ji: idxOf.get(f.i)!,
      jj: idxOf.get(f.j)!,
      L,
      axes,
      R: rotation(axes),
      kl: localStiffness(m.E, G, sp.A, sp.I22, sp.I33, sp.J, L),
      E: m.E,
      A: sp.A,
      I22: sp.I22,
      I33: sp.I33,
      selfWeight: m.gamma > 0 ? m.gamma * sp.A : 0,
    });
  }

  // Joint ordering (RCM) and equation numbers
  const adj: number[][] = Array.from({ length: nJ }, () => []);
  for (const e of elems) {
    adj[e.ji].push(e.jj);
    adj[e.jj].push(e.ji);
  }
  const order = reverseCuthillMcKee(adj);
  const eq = new Int32Array(nJ * 6).fill(-1);
  let nEq = 0;
  for (const ji of order) {
    const j = usedJoints[ji];
    for (let k = 0; k < 6; k++) if (!j.r[k]) eq[ji * 6 + k] = nEq++;
  }
  const dofEq = (e: Elem) => {
    const out = new Int32Array(12);
    for (let k = 0; k < 6; k++) {
      out[k] = eq[e.ji * 6 + k];
      out[6 + k] = eq[e.jj * 6 + k];
    }
    return out;
  };

  // Stiffness: assembled and factored once for all load cases
  let K: SkylineMatrix | null = null;
  if (nEq > 0) {
    const heights = new Int32Array(nEq);
    const elemEqs = elems.map(dofEq);
    for (const eqs of elemEqs) {
      let mn = Infinity;
      for (const v of eqs) if (v >= 0 && v < mn) mn = v;
      for (const v of eqs) if (v >= 0) heights[v] = Math.max(heights[v], v - mn);
    }
    K = new SkylineMatrix(heights);
    elems.forEach((e, n) => {
      const kg = globalStiffness(e.kl, e.R);
      const eqs = elemEqs[n];
      for (let r = 0; r < 12; r++) {
        const er = eqs[r];
        if (er < 0) continue;
        for (let c = 0; c < 12; c++) {
          const ec = eqs[c];
          if (ec < 0 || ec < er) continue;
          K!.add(er, ec, kg[r * 12 + c]);
        }
      }
    });
    const bad = K.factor();
    if (bad >= 0) {
      let where = `equation ${bad}`;
      for (let ji = 0; ji < nJ; ji++)
        for (let k = 0; k < 6; k++)
          if (eq[ji * 6 + k] === bad) where = `joint ${usedJoints[ji].id} (${DOF_NAMES[k]})`;
      throw new SolverError(
        `The structure is unstable (mechanism) at ${where}. Check supports and connectivity.`,
      );
    }
  } else {
    globalWarnings.push('All degrees of freedom are restrained.');
  }

  // Self weight goes into the first Dead case
  const swCase = data.settings.selfWeight ? data.loadCases.find((c) => c.type === 'Dead')?.name : undefined;
  if (data.settings.selfWeight && !swCase) globalWarnings.push('Self weight is on but there is no Dead load case; it was ignored.');

  // Per-case member loads; stations are shared by all cases so combinations can be superposed
  const caseWarnings = new Map<string, string[]>();
  const caseLoads = new Map<string, Map<number, MemberLoads>>();
  for (const lc of data.loadCases) {
    const w: string[] = [];
    caseLoads.set(lc.name, caseMemberLoads(data, lc.name, lc.name === swCase, elems, jointMap, w));
    caseWarnings.set(lc.name, w);
  }
  const stations = new Map<number, { x: number; inc: boolean }[]>();
  for (const e of elems) {
    const xs: { x: number; inc: boolean }[] = [];
    for (let s = 0; s <= STATIONS; s++) xs.push({ x: (e.L * s) / STATIONS, inc: true });
    const seen: number[] = [];
    for (const loads of caseLoads.values())
      for (const p of loads.get(e.id)!.points)
        if (p.a > 1e-9 && p.a < e.L - 1e-9 && !seen.some((a) => Math.abs(a - p.a) < 1e-12)) {
          seen.push(p.a);
          xs.push({ x: p.a, inc: false }, { x: p.a, inc: true });
        }
    xs.sort((a, b) => a.x - b.x || Number(a.inc) - Number(b.inc));
    stations.set(e.id, xs);
  }

  const results: Record<string, Results> = {};
  for (const lc of data.loadCases) {
    const loadsOf = caseLoads.get(lc.name)!;
    const warnings = [...globalWarnings, ...caseWarnings.get(lc.name)!];
    const fers = elems.map((e) => memberFER(loadsOf.get(e.id)!, e.L));

    // Load vector (global, per joint DOF)
    const Fj = new Float64Array(nJ * 6);
    for (const l of data.jointLoads) {
      if ((l.case ?? data.loadCases[0].name) !== lc.name) continue;
      const ji = idxOf.get(l.joint);
      if (ji === undefined) continue;
      for (let k = 0; k < 6; k++) Fj[ji * 6 + k] += l.f[k];
    }
    const Fapplied = Float64Array.from(Fj); // joint loads only
    const sumLoad: Vec3 = [0, 0, 0];
    for (let ji = 0; ji < nJ; ji++) for (let k = 0; k < 3; k++) sumLoad[k] += Fj[ji * 6 + k];
    elems.forEach((e, n) => {
      const fg = toGlobal12(e.R, fers[n]);
      for (let k = 0; k < 6; k++) {
        Fj[e.ji * 6 + k] -= fg[k];
        Fj[e.jj * 6 + k] -= fg[6 + k];
      }
      for (let k = 0; k < 3; k++) sumLoad[k] -= fg[k] + fg[6 + k];
    });

    const D = new Float64Array(nJ * 6);
    if (K) {
      const b = new Float64Array(nEq);
      for (let i = 0; i < nJ * 6; i++) if (eq[i] >= 0) b[eq[i]] = Fj[i];
      K.solve(b);
      for (let i = 0; i < nJ * 6; i++) if (eq[i] >= 0) D[i] = b[eq[i]];
    }

    // Recovery
    const sumEnd = new Float64Array(nJ * 6);
    const frames: FrameResult[] = [];
    let maxDisp = 0;
    for (let i = 0; i < nJ; i++) maxDisp = Math.max(maxDisp, Math.hypot(D[i * 6], D[i * 6 + 1], D[i * 6 + 2]));

    elems.forEach((e, n) => {
      const loads = loadsOf.get(e.id)!;
      const dg = new Float64Array(12);
      for (let k = 0; k < 6; k++) {
        dg[k] = D[e.ji * 6 + k];
        dg[6 + k] = D[e.jj * 6 + k];
      }
      const dl = toLocal12(e.R, dg);
      const f = new Float64Array(12);
      for (let r = 0; r < 12; r++) {
        let s = fers[n][r];
        for (let c = 0; c < 12; c++) s += e.kl[r * 12 + c] * dl[c];
        f[r] = s;
      }
      const fg = toGlobal12(e.R, f);
      for (let k = 0; k < 6; k++) {
        sumEnd[e.ji * 6 + k] += fg[k];
        sumEnd[e.jj * 6 + k] += fg[6 + k];
      }

      const res: FrameResult = {
        id: e.id,
        L: e.L,
        axes: e.axes,
        endForces: Array.from(f),
        x: [],
        P: [],
        V2: [],
        V3: [],
        T: [],
        M2: [],
        M3: [],
        disp: [],
        loads,
      };
      for (const { x, inc } of stations.get(e.id)!) {
        const { F, M } = loadsLeftOf(loads, x, inc);
        // internal forces on the positive face = −(end i forces + loads on [0,x]) moved to x
        const Fx: Vec3 = [-(f[0] + F[0]), -(f[1] + F[1]), -(f[2] + F[2])];
        const r = -x; // from cut to end i
        const Mi: Vec3 = [f[3], f[4] + -r * f[2], f[5] + r * f[1]];
        const Mx: Vec3 = [-(Mi[0] + M[0]), -(Mi[1] + M[1]), -(Mi[2] + M[2])];
        res.x.push(x);
        res.P.push(Fx[0]);
        res.V2.push(Fx[1]);
        res.V3.push(Fx[2]);
        res.T.push(Mx[0]);
        res.M2.push(Mx[1]);
        res.M3.push(Mx[2]);
      }
      // axial: u' = N/EA, integrated once with a linear correction to match end values
      const ax = cumtrapz(res.x, res.P.map((p) => p / (e.E * e.A)));
      const axCorr = (dl[6] - dl[0] - ax[ax.length - 1]) / e.L;
      const u1 = res.x.map((x, k) => dl[0] + ax[k] + axCorr * x);
      const u2 = integrateDeflection(res.x, res.M3.map((m) => m / (e.E * e.I33)), dl[1], dl[7]);
      const u3 = integrateDeflection(res.x, res.M2.map((m) => -m / (e.E * e.I22)), dl[2], dl[8]);
      const [a1, a2, a3] = e.axes;
      for (let k = 0; k < res.x.length; k++) {
        const v: Vec3 = [
          a1[0] * u1[k] + a2[0] * u2[k] + a3[0] * u3[k],
          a1[1] * u1[k] + a2[1] * u2[k] + a3[1] * u3[k],
          a1[2] * u1[k] + a2[2] * u2[k] + a3[2] * u3[k],
        ];
        res.disp.push(v);
        maxDisp = Math.max(maxDisp, Math.hypot(v[0], v[1], v[2]));
      }
      frames.push(res);
    });

    const disp: Record<number, number[]> = {};
    const reactions: Record<number, number[]> = {};
    const sumReaction: Vec3 = [0, 0, 0];
    usedJoints.forEach((j, ji) => {
      disp[j.id] = Array.from(D.subarray(ji * 6, ji * 6 + 6));
      if (j.r.some(Boolean)) {
        const r = [0, 0, 0, 0, 0, 0];
        for (let k = 0; k < 6; k++) if (j.r[k]) r[k] = sumEnd[ji * 6 + k] - Fapplied[ji * 6 + k];
        reactions[j.id] = r;
        for (let k = 0; k < 3; k++) sumReaction[k] += r[k];
      }
    });
    for (const j of data.joints) if (!disp[j.id]) disp[j.id] = [0, 0, 0, 0, 0, 0];

    results[lc.name] = {
      disp,
      reactions,
      frames,
      warnings: [...new Set(warnings)],
      stats: { joints: nJ, frames: elems.length, equations: nEq, maxDisp, sumLoad, sumReaction },
    };
  }

  const items: ResultSet['items'] = data.loadCases.map((c) => ({ name: c.name, kind: 'case' as const }));
  const template = results[data.loadCases[0].name];
  for (const c of combos) {
    const r = combineResults(
      template,
      c.factors.map((f) => [results[f.case], f.factor] as [Results, number]),
    );
    if (c.factors.length === 0) r.warnings.push(`Load combination ${c.name} has no load cases.`);
    results[c.name] = r;
    items.push({ name: c.name, kind: 'combo' });
  }
  return { items, results };
}

/** Analyze every load case (one stiffness factorization) and build the load combinations by superposition. */
export function analyzeAll(data: ModelData): ResultSet {
  const d = migrateModel(JSON.parse(JSON.stringify(data)) as ModelData);
  return solveAll(d, d.loadCombos);
}

/** Results for all loads of all cases acting together (each case × 1). */
export function analyze(data: ModelData): Results {
  const ALL = '\u0000all';
  const d = migrateModel(JSON.parse(JSON.stringify(data)) as ModelData);
  const set = solveAll(d, [{ name: ALL, factors: d.loadCases.map((c) => ({ case: c.name, factor: 1 })) }]);
  return set.results[ALL];
}
