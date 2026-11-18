import {
  defaultModel,
  DOF_NAMES,
  formatReleases,
  LOAD_CASE_TYPES,
  LOAD_DIRS,
  migrateModel,
  parseReleases,
  type Frame,
  type LoadCaseType,
  type LoadDir,
  type ModelData,
  type Restraint,
  type SectionShape,
  type WorkPlane,
} from '../model/types';
import { dimQty, sectionProps } from '../model/sections';
import { SI, UNIT_SYSTEMS, fromU, toU, uLabel, units, type Qty, type UnitSystem, type UnitSystemId } from '../model/units';
import type { ResultSet } from '../solver/analyze';

/**
 * .sav file = comma separated tables that open directly in Excel.
 * Each table: a title row "TABLE,<NAME>", a header row, data rows, then a blank row.
 * Values are written in the chosen display unit system, named in the PROGRAM table's Units cell
 * (e.g. "kN, m, C"); files without it are read as kN, m.
 */

/** Extra information returned by readSav. */
export interface SavInfo {
  units?: UnitSystemId;
}

const UNIT_ALIASES: Record<string, string> = { TON: 'TONF', KG: 'KGF', KIPS: 'KIP', LBF: 'LB', LBS: 'LB', FEET: 'FT', INCH: 'IN' };

/** Find the unit system named by a Units cell such as "kN, m, C" or "kip, ft". */
export function parseUnitsCell(cell: string): UnitSystem | undefined {
  const [f, l] = cell
    .split(/[\s,;/-]+/)
    .filter(Boolean)
    .map((t) => {
      const u = t.toUpperCase();
      return UNIT_ALIASES[u] ?? u;
    });
  return UNIT_SYSTEMS.find((s) => s.force.toUpperCase() === f && s.length.toUpperCase() === l);
}

export const PROGRAM_NAME = 'StructApp3D';
export const FORMAT_VERSION = '1.0';

export class SavError extends Error {}

const EOL = '\r\n';
const SHAPES: SectionShape[] = ['rect', 'circle', 'pipe', 'I', 'box', 'unp', 'C', 'general'];
const PLANES: WorkPlane[] = ['XY', 'XZ', 'YZ'];

export function csvField(v: string | number | boolean): string {
  let s = typeof v === 'number' ? fmtNum(v) : typeof v === 'boolean' ? (v ? 'Yes' : 'No') : v;
  if (/[",\r\n]/.test(s) || /^\s|\s$/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function fmtNum(n: number): string {
  if (!Number.isFinite(n)) return '0';
  if (Math.abs(n) < 1e-300) return '0';
  return String(Number(n.toPrecision(12)));
}

function row(cells: (string | number | boolean)[]): string {
  return cells.map(csvField).join(',');
}

function table(name: string, header: string[], rows: (string | number | boolean)[][]): string {
  const lines = [row(['TABLE', name]), row(header), ...rows.map(row)];
  return lines.join(EOL) + EOL + EOL;
}

const yn = (b: boolean) => (b ? 1 : 0);

function interp(xs: number[], ys: number[], x: number): number {
  if (x <= xs[0]) return ys[0];
  for (let k = 1; k < xs.length; k++) {
    if (x <= xs[k] + 1e-12) {
      const dx = xs[k] - xs[k - 1];
      if (dx <= 1e-12) return ys[k];
      return ys[k - 1] + ((ys[k] - ys[k - 1]) * (x - xs[k - 1])) / dx;
    }
  }
  return ys[ys.length - 1];
}

export function writeSav(d: ModelData, results?: ResultSet | null, savedAt = new Date(), u: UnitSystem = units()): string {
  const c = (v: number, q: Qty) => toU(v, q, u);
  const un = (q: Qty) => uLabel(q, u, true);
  const F = un('F');
  const M = un('M');
  const L = un('L');
  let out = '';
  out += table('PROGRAM', ['Program', 'Version', 'Units', 'Saved'], [
    [PROGRAM_NAME, FORMAT_VERSION, `${u.force}, ${u.length}, C`, savedAt.toISOString()],
  ]);
  const s = d.settings;
  out += table('SETTINGS', ['GridSpacing', 'GridLines', 'WorkPlane', 'Elevation', 'SelfWeight'], [
    [c(s.gridSpacing, 'L'), s.gridLines, s.workPlane, c(s.elevation, 'L'), yn(s.selfWeight)],
  ]);
  out += table(
    'MATERIALS',
    ['Name', `E (${un('FA')})`, 'Poisson', `UnitWeight (${un('FV')})`],
    d.materials.map((m) => [m.name, c(m.E, 'FA'), m.nu, c(m.gamma, 'FV')]),
  );
  out += table(
    'SECTIONS',
    ['Name', 'Shape', 'Dim1', 'Dim2', 'Dim3', 'Dim4', `A (${un('A')})`, `I33 (${un('L4')})`, `I22 (${un('L4')})`,     `J (${un('L4')})`, `As2 (${un('A')})`, `As3 (${un('A')})`],
    d.sections.map((sec) => {
      const p = sectionProps(sec);
      const dims = [0, 1, 2, 3].map((k) => (sec.dims[k] === undefined ? '' : c(sec.dims[k], dimQty(sec.shape, k))) as number | string);
          return [sec.name, sec.shape, ...dims, c(p.A, 'A'), c(p.I33, 'L4'), c(p.I22, 'L4'), c(p.J, 'L4'), c(p.As2, 'A'), c(p.As3, 'A')];
    }),
  );
  out += table(
    'SUPPORT TYPES',
    ['Name', ...DOF_NAMES],
    d.supportTypes.map((t) => [t.name, ...t.r.map(yn)]),
  );
  out += table(
    'JOINTS',
    ['ID', `X (${L})`, `Y (${L})`, `Z (${L})`],
    d.joints.map((j) => [j.id, c(j.x, 'L'), c(j.y, 'L'), c(j.z, 'L')]),
  );
  out += table(
    'JOINT RESTRAINTS',
    ['Joint', ...DOF_NAMES],
    d.joints.filter((j) => j.r.some(Boolean)).map((j) => [j.id, ...j.r.map(yn)]),
  );
  const jm = new Map(d.joints.map((j) => [j.id, j]));
  out += table(
    'FRAMES',
    ['ID', 'JointI', 'JointJ', 'Material', 'Section', 'Beta (deg)', 'Rel_I', 'Rel_J', `Length (${L})`],
    d.frames.map((f) => {
      const a = jm.get(f.i);
      const b = jm.get(f.j);
      const len = a && b ? Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z) : 0;
      return [f.id, f.i, f.j, f.material, f.section, f.beta, formatReleases(f.relI), formatReleases(f.relJ), c(len, 'L')];
    }),
  );
  out += table(
    'AREAS',
    ['ID', 'Joints', 'Distribution', 'NumJoints'],
    d.areas.map((a) => [a.id, a.joints.join(' '), a.distribution, a.joints.length]),
  );
  out += table(
    'LOAD CASES',
    ['Name', 'Type'],
    d.loadCases.map((lc) => [lc.name, lc.type]),
  );
  out += table(
    'LOAD COMBOS',
    ['Combo', 'LoadCase', 'Factor'],
    d.loadCombos.flatMap((cb) => (cb.factors.length ? cb.factors.map((f) => [cb.name, f.case, f.factor]) : [[cb.name, '', '']])),
  );
  out += table(
    'JOINT LOADS',
    ['Joint', `FX (${F})`, `FY (${F})`, `FZ (${F})`, `MX (${M})`, `MY (${M})`, `MZ (${M})`, 'LoadCase'],
    d.jointLoads.map((l) => [l.joint, ...l.f.map((v, k) => c(v, k < 3 ? 'F' : 'M')), l.case]),
  );
  out += table(
    'FRAME POINT LOADS',
    ['Frame', 'Direction', `P (${F})`, 'RelDist', 'LoadCase'],
    d.framePointLoads.map((l) => [l.frame, l.dir, c(l.P, 'F'), l.rd, l.case]),
  );
  out += table(
    'FRAME UNIFORM LOADS',
    ['Frame', 'Direction', `W (${un('FL')})`, 'LoadCase'],
    d.frameUniformLoads.map((l) => [l.frame, l.dir, c(l.w, 'FL'), l.case]),
  );
  out += table(
    'AREA LOADS',
    ['Area', `Q (${un('FA')}, downward)`, 'LoadCase'],
    d.areaLoads.map((l) => [l.area, c(l.q, 'FA'), l.case]),
  );

  if (results) {
    const all = results.items.map((it) => [it.name, results.results[it.name]] as const).filter(([, r]) => r);
    out += table(
      'RESULTS JOINT DISPLACEMENTS',
      ['Case', 'Joint', `UX (${L})`, `UY (${L})`, `UZ (${L})`, 'RX (rad)', 'RY (rad)', 'RZ (rad)'],
      all.flatMap(([name, r]) => Object.entries(r.disp).map(([id, dv]) => [name, Number(id), ...dv.map((v, k) => (k < 3 ? c(v, 'L') : v))])),
    );
    out += table(
      'RESULTS JOINT REACTIONS',
      ['Case', 'Joint', `FX (${F})`, `FY (${F})`, `FZ (${F})`, `MX (${M})`, `MY (${M})`, `MZ (${M})`],
      all.flatMap(([name, r]) => Object.entries(r.reactions).map(([id, rv]) => [name, Number(id), ...rv.map((v, k) => c(v, k < 3 ? 'F' : 'M'))])),
    );
    const rows: (string | number)[][] = [];
    for (const [name, r] of all)
    for (const fr of r.frames) {
      const n = 10;
      for (let k = 0; k <= n; k++) {
        const x = (fr.L * k) / n;
        rows.push([
          name,
          fr.id,
          c(x, 'L'),
          c(interp(fr.x, fr.P, x), 'F'),
          c(interp(fr.x, fr.V2, x), 'F'),
          c(interp(fr.x, fr.V3, x), 'F'),
          c(interp(fr.x, fr.T, x), 'M'),
          c(interp(fr.x, fr.M2, x), 'M'),
          c(interp(fr.x, fr.M3, x), 'M'),
        ]);
      }
    }
    out += table(
      'RESULTS FRAME FORCES',
      ['Case', 'Frame', `Station (${L})`, `P (${F})`, `V2 (${F})`, `V3 (${F})`, `T (${M})`, `M2 (${M})`, `M3 (${M})`],
      rows,
    );
  }
  return out;
}

/** RFC 4180 parser. Detects ';' delimiter (Excel in some locales) when the file has no commas. */
export function parseCsv(text: string): string[][] {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const firstLine = text.slice(0, text.search(/\r?\n|$/));
  const delim = !firstLine.includes(',') && firstLine.includes(';') ? ';' : ',';
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = '';
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQ = false;
      } else field += c;
    } else if (c === '"') inQ = true;
    else if (c === delim) {
      cur.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      cur.push(field);
      rows.push(cur);
      cur = [];
      field = '';
    } else field += c;
  }
  if (field !== '' || cur.length) {
    cur.push(field);
    rows.push(cur);
  }
  return rows;
}

interface RawTable {
  name: string;
  header: string[];
  rows: { cells: string[]; line: number }[];
}

function splitTables(rows: string[][]): RawTable[] {
  const tables: RawTable[] = [];
  let t: RawTable | null = null;
  let expectHeader = false;
  rows.forEach((r, idx) => {
    const cells = r.map((c) => c.trim());
    while (cells.length && cells[cells.length - 1] === '') cells.pop();
    if (!cells.length) {
      t = null;
      return;
    }
    if (cells[0].toUpperCase() === 'TABLE') {
      t = { name: (cells[1] ?? '').toUpperCase(), header: [], rows: [] };
      tables.push(t);
      expectHeader = true;
      return;
    }
    if (!t) return;
    if (expectHeader) {
      t.header = cells.map((h) => h.replace(/\s*\(.*\)\s*$/, '').trim().toUpperCase());
      expectHeader = false;
      return;
    }
    t.rows.push({ cells, line: idx + 1 });
  });
  return tables;
}

class Row {
  constructor(
    private t: RawTable,
    private cells: string[],
    readonly line: number,
  ) {}
  private idx(col: string, fallback: number): number {
    const i = this.t.header.indexOf(col.toUpperCase());
    return i >= 0 ? i : fallback;
  }
  str(col: string, fb: number, def?: string): string {
    const v = this.cells[this.idx(col, fb)];
    if (v == null || v === '') {
      if (def !== undefined) return def;
      throw new SavError(`Line ${this.line} (${this.t.name}): missing ${col}`);
    }
    return v;
  }
  num(col: string, fb: number, def?: number): number {
    const raw = this.cells[this.idx(col, fb)];
    if (raw == null || raw === '') {
      if (def !== undefined) return def;
      throw new SavError(`Line ${this.line} (${this.t.name}): missing ${col}`);
    }
    const v = Number(raw.replace(/\s/g, ''));
    if (!Number.isFinite(v)) throw new SavError(`Line ${this.line} (${this.t.name}): "${raw}" is not a number (${col})`);
    return v;
  }
  bool(col: string, fb: number): boolean {
    const v = (this.cells[this.idx(col, fb)] ?? '').toUpperCase();
    return v === '1' || v === 'YES' || v === 'TRUE' || v === 'Y';
  }
}

/**
 * Parse a .sav file. All values are converted to the internal kN, m units.
 * When `info` is given it receives the unit system the file was written in.
 */
export function readSav(text: string, info?: SavInfo): ModelData {
  const tables = splitTables(parseCsv(text));
  if (!tables.length) throw new SavError('No tables found. A .sav file must contain rows like "TABLE,JOINTS".');
  const get = (name: string) => tables.find((t) => t.name === name);
  const rowsOf = (name: string) => {
    const t = get(name);
    return t ? t.rows.map((r) => new Row(t, r.cells, r.line)) : [];
  };
  const d = defaultModel();

  const prog = rowsOf('PROGRAM')[0];
  const unitsCell = prog ? prog.str('Units', 2, '') : '';
  const u = unitsCell ? parseUnitsCell(unitsCell) : SI;
  if (!u) throw new SavError(`PROGRAM: unknown units "${unitsCell}". Use one of: ${UNIT_SYSTEMS.map((s) => `${s.force}, ${s.length}`).join(' / ')}`);
  if (info && unitsCell) info.units = u.id;
  const si = (v: number, q: Qty) => fromU(v, q, u);

  const st = rowsOf('SETTINGS')[0];
  if (st) {
    d.settings.gridSpacing = st.num('GridSpacing', 0, NaN);
    if (!Number.isFinite(d.settings.gridSpacing)) d.settings.gridSpacing = 1;
    else d.settings.gridSpacing = si(d.settings.gridSpacing, 'L');
    d.settings.gridLines = Math.round(st.num('GridLines', 1, 10));
    const wp = st.str('WorkPlane', 2, 'XY').toUpperCase() as WorkPlane;
    d.settings.workPlane = PLANES.includes(wp) ? wp : 'XY';
    d.settings.elevation = si(st.num('Elevation', 3, 0), 'L');
    d.settings.selfWeight = st.bool('SelfWeight', 4);
  }
  if (get('MATERIALS')) {
    d.materials = rowsOf('MATERIALS').map((r) => ({
      name: r.str('Name', 0),
      E: si(r.num('E', 1), 'FA'),
      nu: r.num('Poisson', 2, 0.3),
      gamma: si(r.num('UnitWeight', 3, 0), 'FV'),
    }));
  }
  if (get('SECTIONS')) {
    d.sections = rowsOf('SECTIONS').map((r) => {
      const shapeRaw = r.str('Shape', 1);
      const shape = SHAPES.find((s) => s.toUpperCase() === shapeRaw.toUpperCase());
      if (!shape) throw new SavError(`Line ${r.line} (SECTIONS): unknown shape "${shapeRaw}"`);
      const dims: number[] = [];
      for (let k = 1; k <= 4; k++) {
        const v = r.num('Dim' + k, 1 + k, NaN);
        if (Number.isFinite(v)) dims.push(si(v, dimQty(shape, k - 1)));
        else break;
      }
      return { name: r.str('Name', 0), shape, dims };
    });
  }
  if (get('SUPPORT TYPES')) {
    d.supportTypes = rowsOf('SUPPORT TYPES').map((r) => ({
      name: r.str('Name', 0),
      r: DOF_NAMES.map((n, k) => r.bool(n, k + 1)) as Restraint,
    }));
  }
  d.joints = rowsOf('JOINTS').map((r) => ({
    id: r.num('ID', 0),
    x: si(r.num('X', 1), 'L'),
    y: si(r.num('Y', 2), 'L'),
    z: si(r.num('Z', 3), 'L'),
    r: [false, false, false, false, false, false] as Restraint,
  }));
  const jm = new Map(d.joints.map((j) => [j.id, j]));
  if (jm.size !== d.joints.length) throw new SavError('JOINTS: duplicate joint IDs');
  for (const r of rowsOf('JOINT RESTRAINTS')) {
    const id = r.num('Joint', 0);
    const j = jm.get(id);
    if (!j) throw new SavError(`Line ${r.line} (JOINT RESTRAINTS): joint ${id} does not exist`);
    j.r = DOF_NAMES.map((n, k) => r.bool(n, k + 1)) as Restraint;
  }
  const needJoint = (id: number, r: Row, t: string) => {
    if (!jm.has(id)) throw new SavError(`Line ${r.line} (${t}): joint ${id} does not exist`);
    return id;
  };
  d.frames = rowsOf('FRAMES').map((r) => {
    const relI = parseReleases(r.str('Rel_I', -1, 'None'));
    const relJ = parseReleases(r.str('Rel_J', -1, 'None'));
    const f: Frame = {
      id: r.num('ID', 0),
      i: needJoint(r.num('JointI', 1), r, 'FRAMES'),
      j: needJoint(r.num('JointJ', 2), r, 'FRAMES'),
      material: r.str('Material', 3, d.materials[0]?.name ?? ''),
      section: r.str('Section', 4, d.sections[0]?.name ?? ''),
      beta: r.num('Beta', 5, 0),
    };
    if (relI) f.relI = relI;
    if (relJ) f.relJ = relJ;
    return f;
  });
  const fset = new Set(d.frames.map((f) => f.id));
  if (fset.size !== d.frames.length) throw new SavError('FRAMES: duplicate frame IDs');
  d.areas = rowsOf('AREAS').map((r) => {
    const joints = r
      .str('Joints', 1)
      .split(/[\s;|]+/)
      .filter(Boolean)
      .map(Number);
    joints.forEach((j) => needJoint(j, r, 'AREAS'));
    const dist = r.str('Distribution', 2, 'two-way').toLowerCase();
    return { id: r.num('ID', 0), joints, distribution: dist === 'one-way' ? ('one-way' as const) : ('two-way' as const) };
  });
  const aset = new Set(d.areas.map((a) => a.id));
  const parseDir = (r: Row): LoadDir => {
    const v = r.str('Direction', 1).toUpperCase() as LoadDir;
    if (!LOAD_DIRS.includes(v)) throw new SavError(`Line ${r.line}: unknown load direction "${v}"`);
    return v;
  };
  const needFrame = (id: number, r: Row) => {
    if (!fset.has(id)) throw new SavError(`Line ${r.line}: frame ${id} does not exist`);
    return id;
  };
  if (get('LOAD CASES')) {
    d.loadCases = rowsOf('LOAD CASES').map((r) => {
      const typeRaw = r.str('Type', 1, 'Other');
      const type = LOAD_CASE_TYPES.find((t) => t.toUpperCase() === typeRaw.toUpperCase()) ?? ('Other' as LoadCaseType);
      return { name: r.str('Name', 0), type };
    });
    if (new Set(d.loadCases.map((lc) => lc.name)).size !== d.loadCases.length) throw new SavError('LOAD CASES: duplicate names');
  }
  if (get('LOAD COMBOS')) {
    d.loadCombos = [];
    for (const r of rowsOf('LOAD COMBOS')) {
      const name = r.str('Combo', 0);
      let cb = d.loadCombos.find((x) => x.name === name);
      if (!cb) d.loadCombos.push((cb = { name, factors: [] }));
      const lc = r.str('LoadCase', 1, '');
      if (!lc) continue;
      if (!d.loadCases.some((x) => x.name === lc)) throw new SavError(`Line ${r.line} (LOAD COMBOS): load case "${lc}" does not exist`);
      cb.factors.push({ case: lc, factor: r.num('Factor', 2) });
    }
  }
  const caseOf = (r: Row) => {
    const lc = r.str('LoadCase', 99, '');
    if (lc && !d.loadCases.some((x) => x.name === lc)) throw new SavError(`Line ${r.line}: load case "${lc}" does not exist`);
    return lc;
  };
  d.jointLoads = rowsOf('JOINT LOADS').map((r) => ({
    case: caseOf(r),
    joint: needJoint(r.num('Joint', 0), r, 'JOINT LOADS'),
    f: ['FX', 'FY', 'FZ', 'MX', 'MY', 'MZ'].map((n, k) => si(r.num(n, k + 1, 0), k < 3 ? 'F' : 'M')) as [number, number, number, number, number, number],
  }));
  d.framePointLoads = rowsOf('FRAME POINT LOADS').map((r) => ({
    case: caseOf(r),
    frame: needFrame(r.num('Frame', 0), r),
    dir: parseDir(r),
    P: si(r.num('P', 2), 'F'),
    rd: Math.min(1, Math.max(0, r.num('RelDist', 3, 0.5))),
  }));
  d.frameUniformLoads = rowsOf('FRAME UNIFORM LOADS').map((r) => ({
    case: caseOf(r),
    frame: needFrame(r.num('Frame', 0), r),
    dir: parseDir(r),
    w: si(r.num('W', 2), 'FL'),
  }));
  d.areaLoads = rowsOf('AREA LOADS').map((r) => {
    const id = r.num('Area', 0);
    if (!aset.has(id)) throw new SavError(`Line ${r.line} (AREA LOADS): area ${id} does not exist`);
    return { case: caseOf(r), area: id, q: si(r.num('Q', 1), 'FA') };
  });
  migrateModel(d);
  return d;
}
