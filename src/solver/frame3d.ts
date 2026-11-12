export type Vec3 = [number, number, number];

export const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
export const norm = (a: Vec3) => Math.hypot(a[0], a[1], a[2]);
export const scale = (a: Vec3, s: number): Vec3 => [a[0] * s, a[1] * s, a[2] * s];
export const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const normalize = (a: Vec3): Vec3 => scale(a, 1 / norm(a));

/**
 * Local axes (SAP2000-style): 1 = i→j; for non-vertical members the 1-2 plane is vertical with
 * local 2 pointing up; for vertical members local 2 = global +X. β rotates 2/3 about 1 (degrees).
 */
export function localAxes(pi: Vec3, pj: Vec3, betaDeg: number): [Vec3, Vec3, Vec3] {
  const d = sub(pj, pi);
  const L = norm(d);
  const e1 = scale(d, 1 / L);
  let e2: Vec3;
  let e3: Vec3;
  if (Math.hypot(d[0], d[1]) <= 1e-6 * L) {
    e2 = [1, 0, 0];
    e3 = normalize(cross(e1, e2));
    e2 = cross(e3, e1);
  } else {
    e3 = normalize(cross(e1, [0, 0, 1]));
    e2 = cross(e3, e1);
  }
  if (betaDeg) {
    const b = (betaDeg * Math.PI) / 180;
    const c = Math.cos(b);
    const s = Math.sin(b);
    const n2 = add(scale(e2, c), scale(e3, s));
    const n3 = add(scale(e2, -s), scale(e3, c));
    e2 = n2;
    e3 = n3;
  }
  return [e1, e2, e3];
}

/** 12×12 local stiffness (row-major Float64Array). DOFs: u1 u2 u3 r1 r2 r3 at i then j. */
export function localStiffness(E: number, G: number, A: number, I22: number, I33: number, J: number, L: number) {
  const k = new Float64Array(144);
  const set = (r: number, c: number, v: number) => {
    k[r * 12 + c] = v;
    k[c * 12 + r] = v;
  };
  const ea = (E * A) / L;
  set(0, 0, ea);
  set(0, 6, -ea);
  set(6, 6, ea);
  const gj = (G * J) / L;
  set(3, 3, gj);
  set(3, 9, -gj);
  set(9, 9, gj);
  // bending in 1-2 plane (about 3): v2, r3
  const a = (E * I33) / L ** 3;
  set(1, 1, 12 * a);
  set(1, 5, 6 * a * L);
  set(1, 7, -12 * a);
  set(1, 11, 6 * a * L);
  set(5, 5, 4 * a * L * L);
  set(5, 7, -6 * a * L);
  set(5, 11, 2 * a * L * L);
  set(7, 7, 12 * a);
  set(7, 11, -6 * a * L);
  set(11, 11, 4 * a * L * L);
  // bending in 1-3 plane (about 2): v3, r2
  const b = (E * I22) / L ** 3;
  set(2, 2, 12 * b);
  set(2, 4, -6 * b * L);
  set(2, 8, -12 * b);
  set(2, 10, -6 * b * L);
  set(4, 4, 4 * b * L * L);
  set(4, 8, 6 * b * L);
  set(4, 10, 2 * b * L * L);
  set(8, 8, 12 * b);
  set(8, 10, 6 * b * L);
  set(10, 10, 4 * b * L * L);
  return k;
}

/** Rotation matrix R (rows = local axes in global coords). */
export function rotation(axes: [Vec3, Vec3, Vec3]): number[] {
  return [...axes[0], ...axes[1], ...axes[2]];
}

/** v_local(12) = T v_global(12) where T = diag(R,R,R,R). */
export function toLocal12(R: number[], g: ArrayLike<number>): Float64Array {
  const out = new Float64Array(12);
  for (let b = 0; b < 4; b++)
    for (let r = 0; r < 3; r++)
      out[b * 3 + r] = R[r * 3] * g[b * 3] + R[r * 3 + 1] * g[b * 3 + 1] + R[r * 3 + 2] * g[b * 3 + 2];
  return out;
}

/** v_global(12) = Tᵀ v_local(12). */
export function toGlobal12(R: number[], l: ArrayLike<number>): Float64Array {
  const out = new Float64Array(12);
  for (let b = 0; b < 4; b++)
    for (let c = 0; c < 3; c++)
      out[b * 3 + c] = R[c] * l[b * 3] + R[3 + c] * l[b * 3 + 1] + R[6 + c] * l[b * 3 + 2];
  return out;
}

/** k_global = Tᵀ k_local T. */
export function globalStiffness(kl: Float64Array, R: number[]): Float64Array {
  const T = new Float64Array(144);
  for (let b = 0; b < 4; b++)
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) T[(b * 3 + r) * 12 + b * 3 + c] = R[r * 3 + c];
  const kt = new Float64Array(144); // k T
  for (let r = 0; r < 12; r++)
    for (let c = 0; c < 12; c++) {
      let s = 0;
      for (let m = 0; m < 12; m++) s += kl[r * 12 + m] * T[m * 12 + c];
      kt[r * 12 + c] = s;
    }
  const kg = new Float64Array(144);
  for (let r = 0; r < 12; r++)
    for (let c = 0; c < 12; c++) {
      let s = 0;
      for (let m = 0; m < 12; m++) s += T[m * 12 + r] * kt[m * 12 + c];
      kg[r * 12 + c] = s;
    }
  return kg;
}

/**
 * Fixed-end reactions (forces exerted by the clamps on the member, local coords) for a point load
 * with local components p at distance a from end i.
 */
export function pointFER(p: Vec3, a: number, L: number, out: Float64Array): void {
  const b = L - a;
  const L2 = L * L;
  const L3 = L2 * L;
  out[0] += (-p[0] * b) / L;
  out[6] += (-p[0] * a) / L;
  const vi = (b * b * (3 * a + b)) / L3;
  const vj = (a * a * (a + 3 * b)) / L3;
  const mi = (a * b * b) / L2;
  const mj = (a * a * b) / L2;
  out[1] += -p[1] * vi;
  out[5] += -p[1] * mi;
  out[7] += -p[1] * vj;
  out[11] += p[1] * mj;
  out[2] += -p[2] * vi;
  out[4] += p[2] * mi;
  out[8] += -p[2] * vj;
  out[10] += -p[2] * mj;
}

export const GAUSS3 = [
  { x: -Math.sqrt(3 / 5), w: 5 / 9 },
  { x: 0, w: 8 / 9 },
  { x: Math.sqrt(3 / 5), w: 5 / 9 },
];
