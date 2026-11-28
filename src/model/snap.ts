import { COORD_TOL } from './model';
import { dot, type Vec3 } from './vec3';
type P = { x: number; y: number; z: number };

/** 2D distance from point p to segment a–b (screen space). */
export function segDist(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax;
  const dy = by - ay;
  const l2 = dx * dx + dy * dy;
  const t = l2 > 0 ? Math.min(1, Math.max(0, ((px - ax) * dx + (py - ay) * dy) / l2)) : 0;
  return Math.hypot(px - ax - dx * t, py - ay - dy * t);
}

/** Closest points of segments a0–a1 and b0–b1: parameters s (on a) and t (on b) in [0,1] and their distance. */
function closestSegSeg(a0: P, a1: P, b0: P, b1: P): { s: number; t: number; dist: number } {
  const d1: Vec3 = [a1.x - a0.x, a1.y - a0.y, a1.z - a0.z];
  const d2: Vec3 = [b1.x - b0.x, b1.y - b0.y, b1.z - b0.z];
  const r: Vec3 = [a0.x - b0.x, a0.y - b0.y, a0.z - b0.z];
  const a = dot(d1, d1);
  const e = dot(d2, d2);
  const f = dot(d2, r);
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  let s: number;
  let t: number;
  if (a < 1e-24 && e < 1e-24) {
    s = t = 0;
  } else if (a < 1e-24) {
    s = 0;
    t = clamp(f / e);
  } else {
    const c = dot(d1, r);
    if (e < 1e-24) {
      t = 0;
      s = clamp(-c / a);
    } else {
      const b = dot(d1, d2);
      const den = a * e - b * b;
      s = den > 1e-24 * a * e ? clamp((b * f - c * e) / den) : 0;
      t = (b * s + f) / e;
      if (t < 0) {
        t = 0;
        s = clamp(-c / a);
      } else if (t > 1) {
        t = 1;
        s = clamp((b - c) / a);
      }
    }
  }
  const px = a0.x + d1[0] * s - (b0.x + d2[0] * t);
  const py = a0.y + d1[1] * s - (b0.y + d2[1] * t);
  const pz = a0.z + d1[2] * s - (b0.z + d2[2] * t);
  return { s, t, dist: Math.hypot(px, py, pz) };
}

/**
 * Crossing point of two frames: the segments meet (3D distance ≤ COORD_TOL) at a point strictly inside both
 * (farther than COORD_TOL from every end joint). Returns the point and the relative distances on each frame.
 */
export function frameCrossing(a0: P, a1: P, b0: P, b1: P): { x: number; y: number; z: number; ta: number; tb: number } | null {
  const c = closestSegSeg(a0, a1, b0, b1);
  if (c.dist > COORD_TOL) return null;
  const la = Math.hypot(a1.x - a0.x, a1.y - a0.y, a1.z - a0.z);
  const lb = Math.hypot(b1.x - b0.x, b1.y - b0.y, b1.z - b0.z);
  if (c.s * la <= COORD_TOL || (1 - c.s) * la <= COORD_TOL) return null;
  if (c.t * lb <= COORD_TOL || (1 - c.t) * lb <= COORD_TOL) return null;
  return {
    x: a0.x + (a1.x - a0.x) * c.s,
    y: a0.y + (a1.y - a0.y) * c.s,
    z: a0.z + (a1.z - a0.z) * c.s,
    ta: c.s,
    tb: c.t,
  };
}
