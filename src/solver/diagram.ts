import type { FrameResult } from './analyze';

/**
 * Value of a station diagram at position x. Stations may repeat at concentrated loads,
 * where the diagram jumps: `left` is the value just before x and `right` just after.
 */
export function sampleAt(xs: number[], ys: number[], x: number, tol = 1e-9): { left: number; right: number } {
  const n = xs.length;
  if (!n) return { left: 0, right: 0 };
  if (x <= xs[0] + tol) {
    let k = 0;
    while (k + 1 < n && xs[k + 1] <= xs[0] + tol) k++;
    return { left: ys[0], right: ys[k] };
  }
  if (x >= xs[n - 1] - tol) {
    let k = n - 1;
    while (k > 0 && xs[k - 1] >= xs[n - 1] - tol) k--;
    return { left: ys[k], right: ys[n - 1] };
  }
  for (let k = 1; k < n; k++) {
    if (Math.abs(xs[k] - x) <= tol) {
      let j = k;
      while (j + 1 < n && Math.abs(xs[j + 1] - x) <= tol) j++;
      return { left: ys[k], right: ys[j] };
    }
    if (xs[k] > x) {
      const dx = xs[k] - xs[k - 1];
      const v = dx <= tol ? ys[k] : ys[k - 1] + ((ys[k] - ys[k - 1]) * (x - xs[k - 1])) / dx;
      return { left: v, right: v };
    }
  }
  return { left: ys[n - 1], right: ys[n - 1] };
}

/**
 * Deflection of a frame along local axis 2 (`axis` = 1) or 3 (`axis` = 2) at each station.
 * `relative` subtracts the straight chord between the two end displacements,
 * leaving only the member's own bending deflection.
 */
export function localDeflection(fr: FrameResult, axis: 1 | 2, relative: boolean): number[] {
  const a = fr.axes[axis];
  const v = fr.disp.map((d) => d[0] * a[0] + d[1] * a[1] + d[2] * a[2]);
  if (!relative || v.length < 2 || fr.L <= 0) return v;
  const v0 = v[0];
  const v1 = v[v.length - 1];
  return v.map((y, k) => y - (v0 + ((v1 - v0) * fr.x[k]) / fr.L));
}
