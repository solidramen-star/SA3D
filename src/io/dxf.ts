/* ASCII DXF import / export (roadmap 2.2).
   Import: LINE, LWPOLYLINE, POLYLINE (2D and 3D), 3DFACE and POINT from the ENTITIES section.
   Export: AutoCAD R12 (AC1009) wireframe with model geometry, deformed shape and force diagrams on separate layers. */

import { COORD_TOL, type Model } from '../model/model';
import { FREE, type ModelData, type Restraint } from '../model/types';
import type { FrameResult, Results } from '../solver/analyze';
import { cross, normalize } from '../model/vec3';

export type P3 = [number, number, number];

export interface DxfEntity {
  kind: 'line' | 'poly' | 'face' | 'point';
  layer: string;
  pts: P3[];
  closed: boolean;
}

export interface DxfDoc {
  /** `$INSUNITS` header value (0 = unitless / not set). */
  insUnits: number;
  entities: DxfEntity[];
  /** Entity count per layer (supported entities only). */
  layers: Record<string, number>;
  /** Unsupported entity types → count. */
  skipped: Record<string, number>;
  /** Polyline arc segments (bulges) that were imported as straight lines. */
  bulges: number;
}

export class DxfError extends Error {}

/** Metres per drawing unit for a `$INSUNITS` code, or null when unitless/unknown. */
export function dxfUnitScale(code: number): number | null {
  const m: Record<number, number> = {
    1: 0.0254,
    2: 0.3048,
    3: 1609.344,
    4: 0.001,
    5: 0.01,
    6: 1,
    7: 1000,
    8: 2.54e-8,
    9: 2.54e-5,
    10: 0.9144,
    11: 1e-10,
    12: 1e-9,
    13: 1e-6,
    14: 0.1,
  };
  return m[code] ?? null;
}

/** `$INSUNITS` code for a length unit given in metres (0 if there is no matching code). */
function insUnitsFor(kL: number): number {
  const close = (a: number) => Math.abs(kL - a) < a * 1e-9;
  if (close(1)) return 6;
  if (close(0.001)) return 4;
  if (close(0.3048)) return 2;
  if (close(0.0254)) return 1;
  if (close(0.01)) return 5;
  return 0;
}

// ---------------------------------------------------------------- parsing

/** AutoCAD "arbitrary axis" algorithm: object coordinate system → world. */
function ocsToWcs(n: P3): (p: P3) => P3 {
  const len = Math.hypot(n[0], n[1], n[2]);
  if (len < 1e-12 || (Math.abs(n[0]) < 1e-12 && Math.abs(n[1]) < 1e-12 && n[2] > 0)) return (p) => p;
  const N: P3 = [n[0] / len, n[1] / len, n[2] / len];
  const Ax = normalize(Math.abs(N[0]) < 1 / 64 && Math.abs(N[1]) < 1 / 64 ? cross([0, 1, 0], N) : cross([0, 0, 1], N));
  const Ay = normalize(cross(N, Ax));
  return ([x, y, z]) => [x * Ax[0] + y * Ay[0] + z * N[0], x * Ax[1] + y * Ay[1] + z * N[1], x * Ax[2] + y * Ay[2] + z * N[2]];
}

type Pair = [number, string];

export function parseDxf(text: string): DxfDoc {
  if (text.startsWith('AutoCAD Binary DXF')) throw new DxfError('Binary DXF is not supported. Save the drawing as ASCII DXF.');
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/);
  const pairs: Pair[] = [];
  for (let i = 0; i + 1 < lines.length; i += 2) {
    const code = Number(lines[i].trim());
    if (!Number.isInteger(code)) throw new DxfError(`Not a valid ASCII DXF file (bad group code on line ${i + 1}).`);
    pairs.push([code, lines[i + 1].trim()]);
  }

  const doc: DxfDoc = { insUnits: 0, entities: [], layers: {}, skipped: {}, bulges: 0 };
  const skip = (t: string) => (doc.skipped[t] = (doc.skipped[t] ?? 0) + 1);
  const add = (e: DxfEntity) => {
    doc.entities.push(e);
    doc.layers[e.layer] = (doc.layers[e.layer] ?? 0) + 1;
  };

  // split into sections, then into entities (each starts with group code 0)
  let section = '';
  let k = 0;
  const entities: { type: string; g: Pair[] }[] = [];
  while (k < pairs.length) {
    const [c, v] = pairs[k];
    if (c === 0 && v === 'SECTION') {
      section = pairs[k + 1]?.[0] === 2 ? pairs[k + 1][1].toUpperCase() : '';
      k += 2;
      continue;
    }
    if (c === 0 && v === 'ENDSEC') {
      section = '';
      k++;
      continue;
    }
    if (c === 0 && v === 'EOF') break;
    if (section === 'HEADER' && c === 9 && v === '$INSUNITS') {
      const n = pairs[k + 1];
      if (n && n[0] === 70) doc.insUnits = Number(n[1]) || 0;
      k += 2;
      continue;
    }
    if (section === 'ENTITIES' && c === 0) {
      const g: Pair[] = [];
      k++;
      while (k < pairs.length && pairs[k][0] !== 0) g.push(pairs[k++]);
      entities.push({ type: v.toUpperCase(), g });
      continue;
    }
    k++;
  }

  const num = (g: Pair[], code: number, def = 0) => {
    const p = g.find((x) => x[0] === code);
    const n = p ? Number(p[1]) : def;
    return Number.isFinite(n) ? n : def;
  };
  const layerOf = (g: Pair[]) => g.find((x) => x[0] === 8)?.[1] ?? '0';
  const pt = (g: Pair[], b: number): P3 => [num(g, 10 + b), num(g, 20 + b), num(g, 30 + b)];
  const extrusion = (g: Pair[]): P3 => [num(g, 210), num(g, 220), num(g, 230, 1)];

  for (let i = 0; i < entities.length; i++) {
    const { type, g } = entities[i];
    const layer = layerOf(g);
    switch (type) {
      case 'LINE':
        add({ kind: 'line', layer, pts: [pt(g, 0), pt(g, 1)], closed: false });
        break;
      case 'POINT':
        add({ kind: 'point', layer, pts: [pt(g, 0)], closed: false });
        break;
      case '3DFACE': {
        const p = [pt(g, 0), pt(g, 1), pt(g, 2), pt(g, 3)];
        const same = (a: P3, b: P3) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
        if (same(p[3], p[2])) p.pop();
        add({ kind: 'face', layer, pts: p, closed: true });
        break;
      }
      case 'LWPOLYLINE': {
        const z = num(g, 38);
        const toW = ocsToWcs(extrusion(g));
        const pts: P3[] = [];
        let x: number | null = null;
        for (const [c, v] of g) {
          if (c === 10) x = Number(v);
          else if (c === 20 && x !== null) {
            pts.push(toW([x, Number(v), z]));
            x = null;
          } else if (c === 42 && Number(v) !== 0) doc.bulges++;
        }
        if (pts.length >= 2) add({ kind: 'poly', layer, pts, closed: (num(g, 70) & 1) === 1 });
        break;
      }
      case 'POLYLINE': {
        const flags = num(g, 70);
        const verts: Pair[][] = [];
        while (i + 1 < entities.length && entities[i + 1].type === 'VERTEX') verts.push(entities[++i].g);
        if (entities[i + 1]?.type === 'SEQEND') i++;
        if (flags & (16 | 64)) {
          skip(flags & 64 ? 'POLYLINE (polyface mesh)' : 'POLYLINE (polygon mesh)');
          break;
        }
        const is3d = (flags & 8) !== 0;
        const toW = is3d ? (p: P3) => p : ocsToWcs(extrusion(g));
        const elev = num(g, 30);
        const pts: P3[] = [];
        for (const vg of verts) {
          if (num(vg, 70) & 16) continue; // spline frame control point
          if (num(vg, 42) !== 0) doc.bulges++;
          const p = pt(vg, 0);
          pts.push(toW(is3d ? p : [p[0], p[1], elev]));
        }
        if (pts.length >= 2) add({ kind: 'poly', layer, pts, closed: (flags & 1) === 1 });
        break;
      }
      case 'VERTEX':
      case 'SEQEND':
        break;
      default:
        skip(type);
    }
  }
  return doc;
}

// ---------------------------------------------------------------- import

export interface DxfImportOptions {
  /** Metres per drawing unit. */
  scale: number;
  /** Layers to import (all when omitted). */
  layers?: Set<string>;
  /** Replace the current geometry and loads instead of adding to them. */
  replace?: boolean;
  /** Endpoints closer than this (m) become one joint. */
  mergeTol?: number;
}

export interface DxfImportReport {
  joints: number;
  frames: number;
  areas: number;
  /** Frames / areas that already existed (or were repeated in the file). */
  duplicates: number;
  /** Zero-length segments after merging endpoints. */
  zeroLength: number;
  /** Layers whose name did not match any section or material. */
  unmatchedLayers: string[];
}

/** Normalised name used to compare layer tokens with section / material names. */
const layerToken = (s: string) => sanitizeLayer(s).toUpperCase();

export const isAreaLayer = (layer: string) => /^(SA3D_)?AREA/i.test(layer);

export function importDxf(model: Model, doc: DxfDoc, opts: DxfImportOptions): DxfImportReport {
  const tol = Math.max(opts.mergeTol ?? COORD_TOL, COORD_TOL);
  const s = opts.scale;
  const rep: DxfImportReport = { joints: 0, frames: 0, areas: 0, duplicates: 0, zeroLength: 0, unmatchedLayers: [] };
  model.commit('import DXF', (d) => {
    if (opts.replace) {
      d.joints = [];
      d.frames = [];
      d.areas = [];
      d.jointLoads = [];
      d.jointDisplacements = [];
      d.framePointLoads = [];
      d.frameUniformLoads = [];
      d.areaLoads = [];
    }
    // hash grid for endpoint merging (cell = tol, so a match is always in a neighbouring cell)
    const grid = new Map<string, { id: number; x: number; y: number; z: number }[]>();
    const cell = (v: number) => Math.floor(v / tol);
    const put = (id: number, x: number, y: number, z: number) => {
      const key = `${cell(x)},${cell(y)},${cell(z)}`;
      const list = grid.get(key);
      if (list) list.push({ id, x, y, z });
      else grid.set(key, [{ id, x, y, z }]);
    };
    for (const j of d.joints) put(j.id, j.x, j.y, j.z);
    let nextJ = d.joints.reduce((m, j) => Math.max(m, j.id), 0) + 1;
    const joint = (p: P3): number => {
      const r = (v: number) => Math.round(v * s * 1e9) / 1e9;
      const x = r(p[0]);
      const y = r(p[1]);
      const z = r(p[2]);
      const cx = cell(x);
      const cy = cell(y);
      const cz = cell(z);
      let best = -1;
      let bestD = Infinity;
      for (let a = -1; a <= 1; a++)
        for (let b = -1; b <= 1; b++)
          for (let c = -1; c <= 1; c++)
            for (const q of grid.get(`${cx + a},${cy + b},${cz + c}`) ?? []) {
              const dist = Math.hypot(q.x - x, q.y - y, q.z - z);
              if (dist <= tol && dist < bestD) {
                bestD = dist;
                best = q.id;
              }
            }
      if (best >= 0) return best;
      const id = nextJ++;
      d.joints.push({ id, x, y, z, r: [...FREE] as Restraint });
      put(id, x, y, z);
      rep.joints++;
      return id;
    };

    const sections = new Map(d.sections.map((x) => [layerToken(x.name), x.name]));
    const materials = new Map(d.materials.map((x) => [layerToken(x.name), x.name]));
    const props = new Map<string, { section: string; material: string }>();
    const unmatched = new Set<string>();
    const layerProps = (layer: string) => {
      let p = props.get(layer);
      if (!p) {
        p = { section: d.sections[0]?.name ?? '', material: d.materials[0]?.name ?? '' };
        let hit = false;
        for (const t of layer.split('@').map(layerToken)) {
          const sec = sections.get(t);
          const mat = materials.get(t);
          if (sec) p.section = sec;
          if (mat) p.material = mat;
          hit ||= !!(sec || mat);
        }
        if (!hit) unmatched.add(layer);
        props.set(layer, p);
      }
      return p;
    };

    const fkey = (i: number, j: number) => (i < j ? `${i}-${j}` : `${j}-${i}`);
    const frames = new Set(d.frames.map((f) => fkey(f.i, f.j)));
    let nextF = d.frames.reduce((m, f) => Math.max(m, f.id), 0) + 1;
    const frame = (i: number, j: number, layer: string) => {
      if (i === j) return void rep.zeroLength++;
      const key = fkey(i, j);
      if (frames.has(key)) return void rep.duplicates++;
      frames.add(key);
      const p = layerProps(layer);
      d.frames.push({ id: nextF++, i, j, material: p.material, section: p.section, beta: 0 });
      rep.frames++;
    };

    const akey = (js: number[]) => [...js].sort((a, b) => a - b).join(',');
    const areas = new Set(d.areas.map((a) => akey(a.joints)));
    let nextA = d.areas.reduce((m, a) => Math.max(m, a.id), 0) + 1;
    const area = (pts: P3[]) => {
      const js = pts.map(joint).filter((v, k, arr) => arr.indexOf(v) === k);
      if (js.length < 3) return void rep.zeroLength++;
      const key = akey(js);
      if (areas.has(key)) return void rep.duplicates++;
      areas.add(key);
      d.areas.push({ id: nextA++, joints: js, distribution: 'two-way' });
      rep.areas++;
    };

    for (const e of doc.entities) {
      if (opts.layers && !opts.layers.has(e.layer)) continue;
      if (e.kind === 'point') joint(e.pts[0]);
      else if (e.kind === 'face' || (e.kind === 'poly' && e.closed && isAreaLayer(e.layer))) area(e.pts);
      else {
        const js = e.pts.map(joint);
        for (let k = 0; k + 1 < js.length; k++) frame(js[k], js[k + 1], e.layer);
        if (e.closed && js.length > 2) frame(js[js.length - 1], js[0], e.layer);
      }
    }
    rep.unmatchedLayers = [...unmatched].sort();
  });
  return rep;
}

// ---------------------------------------------------------------- export

/** Replace characters that are not allowed in DXF layer names. `@` is kept as the section/material separator. */
export function sanitizeLayer(s: string): string {
  return s.trim().replace(/[\s<>/\\":;?*|=,`']+/g, '_') || '0';
}

export type ForceComp = 'P' | 'V2' | 'V3' | 'T' | 'M2' | 'M3';

export interface DxfWriteOptions {
  /** Metres per output length unit (coordinates are divided by this). */
  kL: number;
  results?: Results | null;
  /** Deformed shape: displacement multiplier (omit to skip the deformed layer). */
  deformScale?: number;
  /** Force diagrams to write, one layer each. */
  forceComps?: ForceComp[];
  /** Height (m) of the largest diagram ordinate. */
  diagramSize?: number;
  /** Text for a diagram value; default 4 significant digits in kN / kN·m. */
  label?: (v: number, qty: 'F' | 'M') => string;
  /** Text height (m). Default: 15% of `diagramSize`. */
  textHeight?: number;
}

const COMP_COLOR: Record<ForceComp, number> = { P: 4, V2: 3, V3: 3, T: 6, M2: 5, M3: 5 };

export function writeDxf(data: ModelData, o: DxfWriteOptions): string {
  const out: string[] = [];
  const g = (code: number, v: string | number) => out.push(String(code), typeof v === 'number' ? fmtNum(v) : v);
  const fmtNum = (v: number) => {
    const n = Number(v.toPrecision(12));
    return Object.is(n, -0) ? '0' : String(n);
  };
  const xyz = (p: P3, b = 0) => {
    g(10 + b, p[0] / o.kL);
    g(20 + b, p[1] / o.kL);
    g(30 + b, p[2] / o.kL);
  };

  type Ent = () => void;
  const layerColor = new Map<string, number>();
  const ents: Ent[] = [];
  const layer = (name: string, color: number) => {
    if (!layerColor.has(name)) layerColor.set(name, color);
    return name;
  };
  const line = (ly: string, a: P3, b: P3) =>
    ents.push(() => {
      g(0, 'LINE');
      g(8, ly);
      xyz(a);
      xyz(b, 1);
    });
  const poly = (ly: string, pts: P3[], closed: boolean) =>
    ents.push(() => {
      g(0, 'POLYLINE');
      g(8, ly);
      g(66, 1);
      xyz([0, 0, 0]);
      g(70, 8 | (closed ? 1 : 0));
      for (const p of pts) {
        g(0, 'VERTEX');
        g(8, ly);
        xyz(p);
        g(70, 32);
      }
      g(0, 'SEQEND');
      g(8, ly);
    });
  const text = (ly: string, p: P3, h: number, s: string) =>
    ents.push(() => {
      g(0, 'TEXT');
      g(8, ly);
      xyz(p);
      g(40, h / o.kL);
      g(1, s);
    });

  // ---- geometry
  const jm = new Map(data.joints.map((j) => [j.id, j]));
  const P = (id: number): P3 => {
    const j = jm.get(id)!;
    return [j.x, j.y, j.z];
  };
  const LJ = layer('SA3D_JOINTS', 2);
  for (const j of data.joints)
    ents.push(() => {
      g(0, 'POINT');
      g(8, LJ);
      xyz([j.x, j.y, j.z]);
    });
  for (const f of data.frames) {
    if (!jm.has(f.i) || !jm.has(f.j)) continue;
    line(layer(sanitizeLayer(`${f.section}@${f.material}`), 7), P(f.i), P(f.j));
  }
  const LA = layer('SA3D_AREAS', 8);
  for (const a of data.areas) {
    const pts = a.joints.filter((id) => jm.has(id)).map(P);
    if (pts.length < 3) continue;
    if (pts.length <= 4)
      ents.push(() => {
        g(0, '3DFACE');
        g(8, LA);
        for (let k = 0; k < 4; k++) xyz(pts[Math.min(k, pts.length - 1)], k);
      });
    else poly(LA, pts, true);
  }

  // ---- results
  const r = o.results;
  if (r) {
    const fm = new Map(data.frames.map((f) => [f.id, f]));
    const station = (fr: FrameResult, k: number): P3 | null => {
      const f = fm.get(fr.id);
      if (!f || !jm.has(f.i)) return null;
      const a = P(f.i);
      const e1 = fr.axes[0];
      return [a[0] + e1[0] * fr.x[k], a[1] + e1[1] * fr.x[k], a[2] + e1[2] * fr.x[k]];
    };
    if (o.deformScale !== undefined) {
      const LD = layer('SA3D_RESULT_DEFORMED', 1);
      for (const fr of r.frames) {
        const pts: P3[] = [];
        for (let k = 0; k < fr.x.length; k++) {
          const b = station(fr, k);
          if (!b) break;
          const u = fr.disp[k];
          const p: P3 = [b[0] + u[0] * o.deformScale, b[1] + u[1] * o.deformScale, b[2] + u[2] * o.deformScale];
          const last = pts[pts.length - 1];
          if (!last || Math.hypot(p[0] - last[0], p[1] - last[1], p[2] - last[2]) > 1e-12) pts.push(p);
        }
        if (pts.length >= 2) poly(LD, pts, false);
      }
    }
    const size = o.diagramSize ?? 1;
    const th = o.textHeight ?? size * 0.15;
    const lbl = o.label ?? ((v: number) => String(Number(v.toPrecision(4))));
    for (const comp of o.forceComps ?? []) {
      let maxAbs = 0;
      for (const fr of r.frames) for (const v of fr[comp]) maxAbs = Math.max(maxAbs, Math.abs(v));
      if (maxAbs < 1e-9) continue;
      const LF = layer(`SA3D_RESULT_${comp}`, COMP_COLOR[comp]);
      const scale = size / maxAbs;
      const qty = comp === 'P' || comp === 'V2' || comp === 'V3' ? 'F' : 'M';
      for (const fr of r.frames) {
        const [, a2, a3] = fr.axes;
        const off: P3 = comp === 'M3' ? [-a2[0], -a2[1], -a2[2]] : comp === 'M2' || comp === 'V3' ? a3 : a2;
        const vals = fr[comp];
        const tip = (k: number): P3 | null => {
          const b = station(fr, k);
          return b && [b[0] + off[0] * vals[k] * scale, b[1] + off[1] * vals[k] * scale, b[2] + off[2] * vals[k] * scale];
        };
        const n = fr.x.length - 1;
        const b0 = station(fr, 0);
        const bn = station(fr, n);
        if (!b0 || !bn) continue;
        const tips: P3[] = [];
        for (let k = 0; k <= n; k++) tips.push(tip(k)!);
        line(LF, b0, tips[0]);
        poly(LF, tips, false);
        line(LF, bn, tips[n]);
        const marks = new Set<number>([0, n]);
        let km = 0;
        for (let k = 1; k < n; k++) if (Math.abs(vals[k]) > Math.abs(vals[km])) km = k;
        if (Math.abs(vals[km]) > Math.max(Math.abs(vals[0]), Math.abs(vals[n])) * 1.02) marks.add(km);
        for (const k of marks) if (Math.abs(vals[k]) >= maxAbs * 0.01) text(LF, tips[k], th, lbl(vals[k], qty));
      }
    }
  }

  // ---- file
  g(0, 'SECTION');
  g(2, 'HEADER');
  g(9, '$ACADVER');
  g(1, 'AC1009');
  g(9, '$INSUNITS');
  g(70, insUnitsFor(o.kL));
  g(0, 'ENDSEC');
  g(0, 'SECTION');
  g(2, 'TABLES');
  g(0, 'TABLE');
  g(2, 'LTYPE');
  g(70, 1);
  g(0, 'LTYPE');
  g(2, 'CONTINUOUS');
  g(70, 0);
  g(3, 'Solid line');
  g(72, 65);
  g(73, 0);
  g(40, 0);
  g(0, 'ENDTAB');
  g(0, 'TABLE');
  g(2, 'LAYER');
  g(70, layerColor.size);
  for (const [name, color] of layerColor) {
    g(0, 'LAYER');
    g(2, name);
    g(70, 0);
    g(62, color);
    g(6, 'CONTINUOUS');
  }
  g(0, 'ENDTAB');
  g(0, 'ENDSEC');
  g(0, 'SECTION');
  g(2, 'ENTITIES');
  for (const e of ents) e();
  g(0, 'ENDSEC');
  g(0, 'EOF');
  return out.join('\r\n') + '\r\n';
}
