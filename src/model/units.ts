// Display unit systems. The model and solver always work internally in kN and m;
// values are converted only when shown, typed in, or written to / read from a .sav file.

export type UnitSystemId = 'kN-m' | 'N-mm' | 'tonf-m' | 'kgf-mm' | 'kip-ft' | 'kip-in' | 'lb-in';

/** Quantity kinds: L length, F force, M moment, FL force/length, FA force/area (stress, pressure), FV force/volume, A area, L4 second moment. */
export type Qty = 'L' | 'F' | 'M' | 'FL' | 'FA' | 'FV' | 'A' | 'L4';

export interface UnitSystem {
  id: UnitSystemId;
  label: string;
  force: string;
  length: string;
  /** kN per force unit */
  kF: number;
  /** m per length unit */
  kL: number;
  /** Unit used for small displacement read-outs in the viewport. */
  small: string;
  kSmall: number;
}

const G = 9.80665;
const LBF = 0.0044482216152605; // kN

export const UNIT_SYSTEMS: UnitSystem[] = [
  { id: 'kN-m', label: 'kN, m', force: 'kN', length: 'm', kF: 1, kL: 1, small: 'mm', kSmall: 1e-3 },
  { id: 'N-mm', label: 'N, mm', force: 'N', length: 'mm', kF: 1e-3, kL: 1e-3, small: 'mm', kSmall: 1e-3 },
  { id: 'tonf-m', label: 'ton, m', force: 'tonf', length: 'm', kF: G, kL: 1, small: 'mm', kSmall: 1e-3 },
  { id: 'kgf-mm', label: 'kg, mm', force: 'kgf', length: 'mm', kF: G / 1000, kL: 1e-3, small: 'mm', kSmall: 1e-3 },
  { id: 'kip-ft', label: 'kip, ft', force: 'kip', length: 'ft', kF: LBF * 1000, kL: 0.3048, small: 'in', kSmall: 0.0254 },
  { id: 'kip-in', label: 'kip, in', force: 'kip', length: 'in', kF: LBF * 1000, kL: 0.0254, small: 'in', kSmall: 0.0254 },
  { id: 'lb-in', label: 'lb, in', force: 'lb', length: 'in', kF: LBF, kL: 0.0254, small: 'in', kSmall: 0.0254 },
];

export const SI = UNIT_SYSTEMS[0];

/** [force exponent, length exponent] */
const DIM: Record<Qty, [number, number]> = { L: [0, 1], F: [1, 0], M: [1, 1], FL: [1, -1], FA: [1, -2], FV: [1, -3], A: [0, 2], L4: [0, 4] };

const STORE_KEY = 'structapp3d.units';

export function unitSystem(id: string | null | undefined): UnitSystem | undefined {
  return UNIT_SYSTEMS.find((s) => s.id === id);
}

function loadStored(): UnitSystem {
  try {
    return unitSystem(globalThis.localStorage?.getItem(STORE_KEY)) ?? SI;
  } catch {
    return SI;
  }
}

let current: UnitSystem = loadStored();
const listeners = new Set<(u: UnitSystem) => void>();

export const units = (): UnitSystem => current;

export function setUnits(id: UnitSystemId): void {
  const u = unitSystem(id);
  if (!u || u === current) return;
  current = u;
  try {
    globalThis.localStorage?.setItem(STORE_KEY, id);
  } catch {
    /* storage unavailable */
  }
  for (const fn of listeners) fn(u);
}

export function onUnitsChange(fn: (u: UnitSystem) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Size of one display unit of `q` expressed in SI (kN, m). */
export function factor(q: Qty, u: UnitSystem = current): number {
  const [a, b] = DIM[q];
  return u.kF ** a * u.kL ** b;
}

/** SI → display units */
export const toU = (v: number, q: Qty, u: UnitSystem = current) => v / factor(q, u);
/** display units → SI */
export const fromU = (v: number, q: Qty, u: UnitSystem = current) => v * factor(q, u);

const SUP: Record<number, string> = { 2: '²', 3: '³', 4: '⁴' };

/** Unit symbol for a quantity, e.g. "kN/m²". `ascii` gives Excel/CSV friendly text such as "kN/m2". */
export function uLabel(q: Qty, u: UnitSystem = current, ascii = false): string {
  const f = u.force;
  const l = u.length;
  const p = (n: number) => (ascii ? String(n) : SUP[n]);
  switch (q) {
    case 'L':
      return l;
    case 'F':
      return f;
    case 'M':
      return `${f}${ascii ? '-' : '·'}${l}`;
    case 'FL':
      return `${f}/${l}`;
    case 'FA':
      return `${f}/${l}${p(2)}`;
    case 'FV':
      return `${f}/${l}${p(3)}`;
    case 'A':
      return `${l}${p(2)}`;
    case 'L4':
      return `${l}${p(4)}`;
  }
}

export function fmt(v: number, digits = 4): string {
  if (!Number.isFinite(v)) return '—';
  if (Math.abs(v) < 1e-12) return '0';
  const a = Math.abs(v);
  if (a >= 1e5 || a < 1e-3) return v.toExponential(digits - 1);
  return String(Number(v.toPrecision(digits)));
}

/** Format an SI value in display units (number only). */
export const fmtU = (v: number, q: Qty, digits = 4) => fmt(toU(v, q), digits);
/** Format an SI value in display units with its unit symbol. */
export const withU = (v: number, q: Qty, digits = 4) => `${fmtU(v, q, digits)} ${uLabel(q)}`;
/** Value for an editable input: converted and stripped of floating-point noise. */
export const editU = (v: number, q: Qty) => Number(toU(v, q).toPrecision(10));
