/**
 * Symmetric skyline (profile) matrix with in-place LDLᵀ factorization.
 * Column j stores rows j-h[j] .. j; A[maxa[j] + (j - i)] = K(i, j).
 */
export class SkylineMatrix {
  readonly n: number;
  readonly maxa: Int32Array;
  readonly heights: Int32Array;
  readonly a: Float64Array;
  private diag0: Float64Array | null = null;

  constructor(heights: Int32Array) {
    this.n = heights.length;
    this.heights = heights;
    this.maxa = new Int32Array(this.n + 1);
    for (let j = 0; j < this.n; j++) this.maxa[j + 1] = this.maxa[j] + heights[j] + 1;
    this.a = new Float64Array(this.maxa[this.n]);
  }

  /** Add v to K(i,j) (and implicitly K(j,i)). Requires both inside the profile. */
  add(i: number, j: number, v: number): void {
    if (i > j) {
      const t = i;
      i = j;
      j = t;
    }
    const off = j - i;
    if (off > this.heights[j]) throw new Error('Skyline profile violated');
    this.a[this.maxa[j] + off] += v;
  }

  get(i: number, j: number): number {
    if (i > j) {
      const t = i;
      i = j;
      j = t;
    }
    const off = j - i;
    return off > this.heights[j] ? 0 : this.a[this.maxa[j] + off];
  }

  /**
   * Factorize in place. Returns index of first non-positive/near-zero pivot (instability) or -1.
   */
  factor(relTol = 1e-10): number {
    const { n, maxa, heights, a } = this;
    this.diag0 = new Float64Array(n);
    let maxDiag = 0;
    for (let j = 0; j < n; j++) {
      this.diag0[j] = a[maxa[j]];
      maxDiag = Math.max(maxDiag, Math.abs(a[maxa[j]]));
    }
    const absTol = maxDiag * 1e-15;
    for (let j = 0; j < n; j++) {
      const r0j = j - heights[j];
      const cj = maxa[j];
      // g_ij = K_ij - sum_k U_ki g_kj
      for (let i = r0j + 1; i < j; i++) {
        const r0i = i - heights[i];
        const m = Math.max(r0i, r0j);
        const ci = maxa[i];
        let s = a[cj + (j - i)];
        for (let k = m; k < i; k++) s -= a[ci + (i - k)] * a[cj + (j - k)];
        a[cj + (j - i)] = s;
      }
      let d = a[cj];
      for (let i = r0j; i < j; i++) {
        const idx = cj + (j - i);
        const g = a[idx];
        const l = g / a[maxa[i]];
        d -= l * g;
        a[idx] = l;
      }
      const ref = Math.abs(this.diag0[j]);
      if (!(d > relTol * ref) || !(d > absTol)) return j;
      a[cj] = d;
    }
    return -1;
  }

  /** Solve using factored matrix; overwrites and returns b. */
  solve(b: Float64Array): Float64Array {
    const { n, maxa, heights, a } = this;
    for (let j = 0; j < n; j++) {
      const cj = maxa[j];
      let s = b[j];
      for (let k = j - heights[j]; k < j; k++) s -= a[cj + (j - k)] * b[k];
      b[j] = s;
    }
    for (let j = 0; j < n; j++) b[j] /= a[maxa[j]];
    for (let j = n - 1; j >= 0; j--) {
      const cj = maxa[j];
      const xj = b[j];
      for (let k = j - heights[j]; k < j; k++) b[k] -= a[cj + (j - k)] * xj;
    }
    return b;
  }
}

/** Reverse Cuthill–McKee ordering for an undirected graph given adjacency lists. */
export function reverseCuthillMcKee(adj: number[][]): number[] {
  const n = adj.length;
  const visited = new Uint8Array(n);
  const order: number[] = [];
  const deg = adj.map((a) => a.length);
  const nodes = [...Array(n).keys()].sort((p, q) => deg[p] - deg[q]);
  for (const start of nodes) {
    if (visited[start]) continue;
    visited[start] = 1;
    const queue = [start];
    for (let h = 0; h < queue.length; h++) {
      const v = queue[h];
      order.push(v);
      const nb = adj[v].filter((w) => !visited[w]).sort((p, q) => deg[p] - deg[q]);
      for (const w of nb) {
        visited[w] = 1;
        queue.push(w);
      }
    }
  }
  return order.reverse();
}
