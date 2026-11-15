import type { Area, Frame, Joint, LoadDir, ModelData } from '../model/types';
import { cross, dot, norm, sub, type Vec3 } from './frame3d';

/** Point load on a member in local components at distance a from end i. */
export interface MemberPointLoad {
  a: number;
  p: Vec3;
}
/** Linearly varying distributed load from x1 to x2: q(x) = d · (w1 + (w2 − w1)(x − x1)/(x2 − x1)). */
export interface MemberDistLoad {
  x1: number;
  x2: number;
  w1: number;
  w2: number;
  d: Vec3;
}

export interface MemberLoads {
  points: MemberPointLoad[];
  dists: MemberDistLoad[];
}

/** Unit direction in local coordinates. GRAV is −Z (positive magnitude = downward). */
export function dirLocal(dir: LoadDir, axes: [Vec3, Vec3, Vec3]): Vec3 {
  let g: Vec3;
  switch (dir) {
    case 'L1':
      return [1, 0, 0];
    case 'L2':
      return [0, 1, 0];
    case 'L3':
      return [0, 0, 1];
    case 'GX':
      g = [1, 0, 0];
      break;
    case 'GY':
      g = [0, 1, 0];
      break;
    case 'GZ':
      g = [0, 0, 1];
      break;
    case 'GRAV':
      g = [0, 0, -1];
      break;
  }
  return [dot(axes[0], g), dot(axes[1], g), dot(axes[2], g)];
}

/** Width profile along an edge: list of [s, width] with s from 0 to edge length. */
type Profile = [number, number][];

const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

function polygonArea(pts: Vec3[]): number {
  // Newell's method
  let nx = 0;
  let ny = 0;
  let nz = 0;
  for (let k = 0; k < pts.length; k++) {
    const a = pts[k];
    const b = pts[(k + 1) % pts.length];
    nx += (a[1] - b[1]) * (a[2] + b[2]);
    ny += (a[2] - b[2]) * (a[0] + b[0]);
    nz += (a[0] - b[0]) * (a[1] + b[1]);
  }
  return Math.hypot(nx, ny, nz) / 2;
}

function apexProfile(a: Vec3, b: Vec3, apex: Vec3): Profile {
  const e = sub(b, a);
  const Le = norm(e);
  const u: Vec3 = [e[0] / Le, e[1] / Le, e[2] / Le];
  const s = Math.min(Math.max(dot(sub(apex, a), u), 0), Le);
  const h = norm(cross(sub(apex, a), u));
  return [
    [0, 0],
    [s, h],
    [Le, 0],
  ];
}

function profileIntegral(p: Profile): number {
  let s = 0;
  for (let k = 0; k + 1 < p.length; k++) s += ((p[k + 1][0] - p[k][0]) * (p[k][1] + p[k + 1][1])) / 2;
  return s;
}

/** Tributary width profiles for each polygon edge k (pts[k] → pts[k+1]). */
export function areaEdgeProfiles(pts: Vec3[], distribution: Area['distribution'], warnings: string[], areaId: number): Profile[] {
  const n = pts.length;
  const lens = pts.map((p, k) => norm(sub(pts[(k + 1) % n], p)));
  let profiles: Profile[];
  if (n === 4 && distribution === 'one-way') {
    const avgA = (lens[0] + lens[2]) / 2;
    const avgB = (lens[1] + lens[3]) / 2;
    const longIsA = avgA >= avgB;
    const span = longIsA ? avgB : avgA;
    profiles = lens.map((Le, k) =>
      (k % 2 === 0) === longIsA
        ? [
            [0, span / 2],
            [Le, span / 2],
          ]
        : [
            [0, 0],
            [Le, 0],
          ],
    );
  } else if (n === 4) {
    const lx = Math.min((lens[0] + lens[2]) / 2, (lens[1] + lens[3]) / 2);
    const h = lx / 2;
    profiles = lens.map((Le) =>
      Le > 2 * h
        ? [
            [0, 0],
            [h, h],
            [Le - h, h],
            [Le, 0],
          ]
        : [
            [0, 0],
            [Le / 2, Le / 2],
            [Le, 0],
          ],
    );
  } else {
    if (distribution === 'one-way') warnings.push(`Area ${areaId}: one-way distribution needs 4 joints; two-way used.`);
    let apex: Vec3;
    if (n === 3) {
      const [A, B, C] = pts;
      const a = lens[1]; // opposite A (edge B→C)
      const b = lens[2]; // opposite B (edge C→A)
      const c = lens[0]; // opposite C (edge A→B)
      const s = a + b + c;
      apex = [(a * A[0] + b * B[0] + c * C[0]) / s, (a * A[1] + b * B[1] + c * C[1]) / s, (a * A[2] + b * B[2] + c * C[2]) / s];
    } else {
      apex = [0, 0, 0];
      for (const p of pts) {
        apex[0] += p[0] / n;
        apex[1] += p[1] / n;
        apex[2] += p[2] / n;
      }
    }
    profiles = pts.map((p, k) => apexProfile(p, pts[(k + 1) % n], apex));
  }
  // Conserve total load
  const total = profiles.reduce((s, p) => s + profileIntegral(p), 0);
  const A = polygonArea(pts);
  if (total > 0) {
    const f = A / total;
    for (const p of profiles) for (const pt of p) pt[1] *= f;
  }
  return profiles;
}

/**
 * Convert area loads to frame distributed loads in global gravity direction (positive = downward).
 * Returns map frameId → list of {x1,x2,w1,w2} measured from the frame's end i.
 */
export function distributeAreaLoads(
  data: ModelData,
  jointMap: Map<number, Joint>,
  warnings: string[],
): Map<number, { x1: number; x2: number; w1: number; w2: number }[]> {
  const out = new Map<number, { x1: number; x2: number; w1: number; w2: number }[]>();
  const frameByPair = new Map<string, Frame>();
  for (const f of data.frames) {
    frameByPair.set(`${f.i}-${f.j}`, f);
    frameByPair.set(`${f.j}-${f.i}`, f);
  }
  const loadByArea = new Map<number, number>();
  for (const l of data.areaLoads) loadByArea.set(l.area, (loadByArea.get(l.area) ?? 0) + l.q);

  for (const area of data.areas) {
    const q = loadByArea.get(area.id) ?? 0;
    if (!q) continue;
    const joints = area.joints.map((id) => jointMap.get(id));
    if (joints.some((j) => !j)) {
      warnings.push(`Area ${area.id}: references a missing joint; load ignored.`);
      continue;
    }
    const pts = joints.map((j) => [j!.x, j!.y, j!.z] as Vec3);
    const profiles = areaEdgeProfiles(pts, area.distribution, warnings, area.id);
    const n = pts.length;
    for (let k = 0; k < n; k++) {
      const prof = profiles[k];
      if (prof.every((p) => p[1] === 0)) continue;
      const a = area.joints[k];
      const b = area.joints[(k + 1) % n];
      const f = frameByPair.get(`${a}-${b}`);
      if (!f) {
        warnings.push(`Area ${area.id}: edge ${a}-${b} has no frame; its share of the load is ignored.`);
        continue;
      }
      const reversed = f.i !== a;
      const Le = profiles[k][prof.length - 1][0];
      const list = out.get(f.id) ?? [];
      for (let m = 0; m + 1 < prof.length; m++) {
        const [s1, h1] = prof[m];
        const [s2, h2] = prof[m + 1];
        if (s2 - s1 <= 1e-12) continue;
        if (reversed) list.push({ x1: Le - s2, x2: Le - s1, w1: q * h2, w2: q * h1 });
        else list.push({ x1: s1, x2: s2, w1: q * h1, w2: q * h2 });
      }
      out.set(f.id, list);
    }
  }
  return out;
}

export { lerp3 };
