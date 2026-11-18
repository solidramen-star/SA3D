import type { Section, SectionShape } from './types';
import type { Qty } from './units';

export interface SectionProps {
  A: number;
  I33: number; // major axis (bending about local 3, depth along local 2)
  I22: number; // minor axis (bending about local 2)
  J: number;
  /** Effective shear areas for V2 / V3 (0 = shear deformation ignored, e.g. 'general'). */
  As2: number;
  As3: number;
  depth: number; // extent along local 2 (for drawing)
  width: number; // extent along local 3 (for drawing)
}

/** Dimension labels per shape (lengths, except 'general'). */
export const SHAPE_DIMS: Record<SectionShape, string[]> = {
  rect: ['Depth d', 'Width b'],
  circle: ['Diameter D'],
  pipe: ['Outer diameter D', 'Wall thickness t'],
  I: ['Depth d', 'Flange width bf', 'Flange thick. tf', 'Web thick. tw'],
  box: ['Depth d', 'Width b', 'Flange thick. tf', 'Web thick. tw'],
  unp: ['Depth d', 'Flange width bf', 'Flange thick. tf', 'Web thick. tw'],
  C: ['Depth d', 'Flange width b', 'Lip length c', 'Thickness t'],
  general: ['A', 'I33', 'I22', 'J'],
};

/** Physical quantity of each entry in `Section.dims`. */
export const dimQty = (shape: SectionShape, k: number): Qty => (shape === 'general' ? (k === 0 ? 'A' : 'L4') : 'L');

export const SHAPE_LABEL: Record<SectionShape, string> = {
  rect: 'Rectangle',
  circle: 'Circle',
  pipe: 'Pipe',
  I: 'I / Wide flange',
  box: 'Box / Tube',
  unp: 'UNP / Channel',
  C: 'C / Lipped channel',
  general: 'General',
};

function rectTorsion(a: number, b: number): number {
  const long = Math.max(a, b);
  const short = Math.min(a, b);
  if (long <= 0) return 0;
  return long * short ** 3 * (1 / 3 - 0.21 * (short / long) * (1 - short ** 4 / (12 * long ** 4)));
}

/** Axis-aligned rectangle [x0, x1, y0, y1]; x along local 3 (width), y along local 2 (depth). */
type Rect = [number, number, number, number];

/**
 * Channel sections as rectangles, web back at x = 0, flanges pointing to +x, symmetric about y = 0.
 * UNP: parallel-flange hot-rolled channel. C: cold-formed lipped channel of uniform thickness
 * (lip length c measured to the outer face of the flange).
 */
function channelRects(s: Section): Rect[] {
  const d = s.dims;
  if (s.shape === 'unp') {
    const [h, bf, tf, tw] = d;
    return [
      [0, tw, -h / 2 + tf, h / 2 - tf],
      [0, bf, h / 2 - tf, h / 2],
      [0, bf, -h / 2, -h / 2 + tf],
    ];
  }
  const [h, b, c, t] = d;
  return [
    [0, t, -h / 2, h / 2],
    [t, b, h / 2 - t, h / 2],
    [t, b, -h / 2, -h / 2 + t],
    [b - t, b, h / 2 - c, h / 2 - t],
    [b - t, b, -h / 2 + t, -h / 2 + c],
  ];
}

function compositeProps(rects: Rect[]) {
  let A = 0;
  let Sx = 0;
  for (const [x0, x1, y0, y1] of rects) {
    const a = (x1 - x0) * (y1 - y0);
    A += a;
    Sx += a * (x0 + x1) / 2;
  }
  const xc = A > 0 ? Sx / A : 0;
  let I33 = 0;
  let I22 = 0;
  let J = 0;
  for (const [x0, x1, y0, y1] of rects) {
    const w = x1 - x0;
    const hh = y1 - y0;
    const a = w * hh;
    const cy = (y0 + y1) / 2;
    const cx = (x0 + x1) / 2 - xc;
    I33 += (w * hh ** 3) / 12 + a * cy * cy;
    I22 += (hh * w ** 3) / 12 + a * cx * cx;
    J += (Math.max(w, hh) * Math.min(w, hh) ** 3) / 3;
  }
  return { A, I33, I22, J, xc };
}

/** Centroid distance from the web back of a channel (UNP / C) along local 3; 0 for other shapes. */
export function channelCentroid(s: Section): number {
  return s.shape === 'unp' || s.shape === 'C' ? compositeProps(channelRects(s)).xc : 0;
}

/** Closed outline of a channel section centred on its centroid ([x = local 3, y = local 2]); null for other shapes. */
export function channelOutline(s: Section): [number, number][] | null {
  if (s.shape !== 'unp' && s.shape !== 'C') return null;
  const xc = channelCentroid(s);
  let pts: [number, number][];
  if (s.shape === 'unp') {
    const [h, bf, tf, tw] = s.dims;
    pts = [
      [0, -h / 2],
      [bf, -h / 2],
      [bf, -h / 2 + tf],
      [tw, -h / 2 + tf],
      [tw, h / 2 - tf],
      [bf, h / 2 - tf],
      [bf, h / 2],
      [0, h / 2],
    ];
  } else {
    const [h, b, c, t] = s.dims;
    pts = [
      [0, -h / 2],
      [b, -h / 2],
      [b, -h / 2 + c],
      [b - t, -h / 2 + c],
      [b - t, -h / 2 + t],
      [t, -h / 2 + t],
      [t, h / 2 - t],
      [b - t, h / 2 - t],
      [b - t, h / 2 - c],
      [b, h / 2 - c],
      [b, h / 2],
      [0, h / 2],
    ];
  }
  return pts.map(([x, y]) => [x - xc, y]);
}

export function sectionProps(s: Section): SectionProps {
  const d = s.dims;
  switch (s.shape) {
    case 'rect': {
      const [h, b] = d;
      const A = b * h;
      return { A, I33: (b * h ** 3) / 12, I22: (h * b ** 3) / 12, J: rectTorsion(h, b), As2: (5 / 6) * A, As3: (5 / 6) * A, depth: h, width: b };
    }
    case 'circle': {
      const [D] = d;
      const I = (Math.PI * D ** 4) / 64;
      const A = (Math.PI * D * D) / 4;
      return { A, I33: I, I22: I, J: 2 * I, As2: 0.9 * A, As3: 0.9 * A, depth: D, width: D };
    }
    case 'pipe': {
      const [D, t] = d;
      const Di = Math.max(D - 2 * t, 0);
      const I = (Math.PI * (D ** 4 - Di ** 4)) / 64;
      const A = (Math.PI * (D * D - Di * Di)) / 4;
      return { A, I33: I, I22: I, J: 2 * I, As2: A / 2, As3: A / 2, depth: D, width: D };
    }
    case 'I': {
      const [h, bf, tf, tw] = d;
      const hw = h - 2 * tf;
      return {
        A: 2 * bf * tf + hw * tw,
        I33: (bf * h ** 3 - (bf - tw) * hw ** 3) / 12,
        I22: (2 * tf * bf ** 3) / 12 + (hw * tw ** 3) / 12,
        J: (2 * bf * tf ** 3 + (h - tf) * tw ** 3) / 3,
        As2: h * tw,
        As3: (5 / 3) * bf * tf,
        depth: h,
        width: bf,
      };
    }
    case 'box': {
      const [h, b, tf, tw] = d;
      const hi = h - 2 * tf;
      const bi = b - 2 * tw;
      const denom = b * tw + h * tf - tw * tw - tf * tf;
      return {
        A: b * h - bi * hi,
        I33: (b * h ** 3 - bi * hi ** 3) / 12,
        I22: (h * b ** 3 - hi * bi ** 3) / 12,
        J: denom > 0 ? (2 * tw * tf * (b - tw) ** 2 * (h - tf) ** 2) / denom : 0,
        As2: 2 * h * tw,
        As3: 2 * b * tf,
        depth: h,
        width: b,
      };
    }
    case 'unp':
    case 'C': {
      const p = compositeProps(channelRects(s));
      // shear areas: web (d·tw) for V2, both flanges (2·b·tf·5/6) for V3; C has uniform thickness t
      const [tf, tw] = s.shape === 'unp' ? [d[2], d[3]] : [d[3], d[3]];
      return { A: p.A, I33: p.I33, I22: p.I22, J: p.J, As2: d[0] * tw, As3: (5 / 3) * d[1] * tf, depth: d[0], width: d[1] };
    }
    case 'general': {
      const [A, I33, I22, J] = d;
      const size = Math.sqrt(Math.max(A, 1e-6));
      return { A, I33, I22, J, As2: 0, As3: 0, depth: size, width: size };
    }
  }
}

export function validateSection(s: Section): string | null {
  const need = SHAPE_DIMS[s.shape].length;
  if (s.dims.length < need) return 'Missing dimensions';
  if (s.dims.slice(0, need).some((v) => !(v > 0))) return 'All dimensions must be positive';
  if (s.shape === 'pipe' && 2 * s.dims[1] >= s.dims[0]) return 'Wall too thick for diameter';
  if ((s.shape === 'I' || s.shape === 'box') && 2 * s.dims[2] >= s.dims[0]) return 'Flanges too thick for depth';
  if (s.shape === 'I' && s.dims[3] >= s.dims[1]) return 'Web thicker than flange width';
  if (s.shape === 'box' && 2 * s.dims[3] >= s.dims[1]) return 'Webs too thick for width';
  if (s.shape === 'unp') {
    if (2 * s.dims[2] >= s.dims[0]) return 'Flanges too thick for depth';
    if (s.dims[3] >= s.dims[1]) return 'Web thicker than flange width';
  }
  if (s.shape === 'C') {
    const [h, b, c, t] = s.dims;
    if (2 * t >= h) return 'Thickness too large for depth';
    if (2 * t >= b) return 'Thickness too large for flange width';
    if (c <= t) return 'Lip must be longer than the thickness';
    if (2 * c >= h) return 'Lips too long for depth';
  }
  return null;
}
