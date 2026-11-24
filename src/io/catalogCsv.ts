import type { Catalog, CatalogEntry } from '../model/catalog';
import { shapeProps, validateSection } from '../model/sections';
import type { SectionShape } from '../model/types';
import { csvDelimiter, csvField, parseCsv, parseCsvNumber } from './savFormat';

/**
 * Section catalog CSV (opens and saves in Excel). Layout:
 *   Units,mm                      (mm, cm, m or in; A in unit², I and J in unit⁴)
 *   Catalog,Name,Shape,d,bf,tf,tw,c,A,I33,I22,J,Mass (kg/m)
 *   EN IPE,IPE 200,I,200,100,8.5,5.6,,,,,,22.4
 * Rows before the header and rows starting with '#' are ignored, except "Units" and "Catalog,<name>".
 * Published A/I33/I22/J override the values computed from the dimensions.
 */

export const CATALOG_UNITS: Record<string, number> = { mm: 1e-3, cm: 1e-2, m: 1, in: 0.0254 };
const LB_FT_TO_KG_M = 1.48816394;

const SHAPE_ALIASES: Record<string, SectionShape> = {
  i: 'I', w: 'I', wf: 'I', iwf: 'I', h: 'I', hwf: 'I', ipe: 'I', ipn: 'I', hea: 'I', heb: 'I', hem: 'I', ub: 'I', uc: 'I',
  box: 'box', shs: 'box', rhs: 'box', hss: 'box', tube: 'box',
  pipe: 'pipe', chs: 'pipe',
  unp: 'unp', upn: 'unp', u: 'unp', channel: 'unp', pfc: 'unp', mc: 'unp',
  c: 'C', lipped: 'C', lippedchannel: 'C', clc: 'C', cfs: 'C',
  rect: 'rect', rectangle: 'rect',
  circle: 'circle', round: 'circle', bar: 'circle',
  general: 'general',
};

export function catalogShape(raw: string): SectionShape | undefined {
  return SHAPE_ALIASES[raw.toLowerCase().replace(/[\s_-]+/g, '')];
}

/** Catalog dimension columns for each shape, in the order of `Section.dims`. 't' = tw, or tf when tw is empty. */
const DIM_COLS: Record<SectionShape, string[]> = {
  I: ['d', 'bf', 'tf', 'tw'],
  box: ['d', 'bf', 'tf', 'tw'],
  unp: ['d', 'bf', 'tf', 'tw'],
  rect: ['d', 'bf'],
  circle: ['d'],
  pipe: ['d', 't'],
  C: ['d', 'bf', 'c', 't'],
  general: ['a', 'i33', 'i22', 'j'],
};

const HEADER_ALIASES: Record<string, string> = { b: 'bf', t: 'tw', kg: 'mass', 'kg/m': 'mass', weight: 'mass', 'lb/ft': 'mass' };

/** The delimiter is judged on the header row, since title and comment rows may have no delimiter at all. */
function catalogDelimiter(text: string): ',' | ';' {
  for (const ln of text.split(/\r?\n/)) {
    const s = ln.replace(/"[^"]*"/g, '');
    if (/\bname\b/i.test(s) && /\bshape\b/i.test(s)) return s.split(';').length > s.split(',').length ? ';' : ',';
  }
  return csvDelimiter(text);
}

export interface CatalogIssue {
  line: number;
  msg: string;
}

export interface CatalogParseResult {
  catalogs: Catalog[];
  errors: CatalogIssue[];
  warnings: CatalogIssue[];
  unit: string;
}

/** Parse a catalog CSV. Rows with errors are skipped and reported; `defaultName` is used when no Catalog is given. */
export function parseCatalogCsv(text: string, defaultName: string): CatalogParseResult {
  const delim = catalogDelimiter(text);
  const decimalComma = delim === ';';
  const errors: CatalogIssue[] = [];
  const warnings: CatalogIssue[] = [];
  const byName = new Map<string, Catalog>();
  let unit = '';
  let fileCatalog = '';
  let header: string[] | null = null;
  let massFactor = 1;

  parseCsv(text, delim).forEach((raw, idx) => {
    const line = idx + 1;
    const cells = raw.map((c) => c.trim());
    while (cells.length && cells[cells.length - 1] === '') cells.pop();
    if (!cells.length || cells[0].startsWith('#')) return;
    const lower = cells.map((c) => c.toLowerCase());
    if (!header) {
      const keys = lower.map((c) => c.replace(/\s*\(.*\)\s*$/, '').trim());
      if (keys.includes('name') && keys.includes('shape')) {
        header = keys.map((k) => HEADER_ALIASES[k] ?? k);
        if (lower.some((c) => c.includes('lb/ft'))) massFactor = LB_FT_TO_KG_M;
      } else if (keys[0] === 'units') {
        const u = (cells[1] ?? '').toLowerCase().replace(/^inch(es)?$/, 'in');
        if (u in CATALOG_UNITS) unit = u;
        else errors.push({ line, msg: `unknown units "${cells[1] ?? ''}" (use mm, cm, m or in)` });
      } else if (keys[0] === 'catalog' && cells[1]) fileCatalog = cells[1];
      return;
    }
    const hdr: string[] = header;
    const get = (k: string) => {
      const i = hdr.indexOf(k);
      return i >= 0 ? (cells[i] ?? '') : '';
    };
    const name = get('name');
    if (!name) return void errors.push({ line, msg: 'missing Name' });
    const where = `${name}: `;
    if (/[,;"]/.test(name)) return void errors.push({ line, msg: where + 'name cannot contain commas, semicolons or quotes' });
    const shape = catalogShape(get('shape'));
    if (!shape) return void errors.push({ line, msg: where + `unknown shape "${get('shape')}"` });

    let bad = '';
    const num = (k: string) => {
      const s = get(k);
      const v = parseCsvNumber(s, decimalComma);
      if (s !== '' && !Number.isFinite(v) && !bad) bad = `"${s}" is not a number (${k})`;
      return v;
    };
    const f = CATALOG_UNITS[unit || 'mm'];
    const props = [num('a') * f * f, num('i33') * f ** 4, num('i22') * f ** 4, num('j') * f ** 4];
    const dimRaw = DIM_COLS[shape].map((k) => (k === 't' ? (Number.isFinite(num('tw')) ? num('tw') : num('tf')) : num(k)));
    if (bad) return void errors.push({ line, msg: where + bad });
    const missing = DIM_COLS[shape].filter((_, i) => !Number.isFinite(dimRaw[i]));
    if (missing.length) return void errors.push({ line, msg: where + `missing ${missing.join(', ')} for shape ${shape}` });

    const entry: CatalogEntry = { name, shape, dims: shape === 'general' ? props : dimRaw.map((v) => v * f) };
    if (shape !== 'general') {
      const given = props.filter((v) => Number.isFinite(v)).length;
      if (given) {
        const calc = shapeProps({ name, shape, dims: entry.dims });
        const pub = { A: props[0], I33: props[1], I22: props[2], J: props[3] };
        if (given < 4) {
          warnings.push({ line, msg: where + 'some of A, I33, I22, J are empty; they are computed from the dimensions' });
          if (!Number.isFinite(pub.A)) pub.A = calc.A;
          if (!Number.isFinite(pub.I33)) pub.I33 = calc.I33;
          if (!Number.isFinite(pub.I22)) pub.I22 = calc.I22;
          if (!Number.isFinite(pub.J)) pub.J = calc.J;
        }
        if (calc.A > 0 && Math.abs(pub.A / calc.A - 1) > 0.25)
          warnings.push({ line, msg: where + `published A differs from the dimensions by ${Math.round((pub.A / calc.A - 1) * 100)}% — check the units` });
        entry.props = pub;
      }
    }
    const err = validateSection({ name, shape, dims: entry.dims, props: entry.props });
    if (err) return void errors.push({ line, msg: where + err });
    const mass = num('mass');
    if (mass > 0) entry.mass = mass * massFactor;

    const catName = get('catalog') || fileCatalog || defaultName;
    if (/[,;"]/.test(catName)) return void errors.push({ line, msg: where + 'catalog name cannot contain commas, semicolons or quotes' });
    let cat = byName.get(catName.toLowerCase());
    if (!cat) byName.set(catName.toLowerCase(), (cat = { name: catName, source: 'user', entries: [] }));
    if (cat.entries.some((e) => e.name.toLowerCase() === name.toLowerCase()))
      return void errors.push({ line, msg: where + `duplicate name in catalog "${catName}", row skipped` });
    cat.entries.push(entry);
  });

  if (!header) errors.push({ line: 0, msg: 'no header row found (it needs at least "Name" and "Shape" columns)' });
  else if (!unit) warnings.push({ line: 0, msg: 'no "Units" row; dimensions are read as mm' });
  return { catalogs: [...byName.values()], errors, warnings, unit: unit || 'mm' };
}

const fmt = (v: number | undefined) => (v === undefined || !Number.isFinite(v) ? '' : Number(v.toPrecision(10)));

/** Write catalogs as an Excel-friendly CSV in the given length unit. */
export function writeCatalogCsv(cats: Catalog[], unit: keyof typeof CATALOG_UNITS = 'mm', title = 'StructApp3D section catalog'): string {
  const f = CATALOG_UNITS[unit];
  const lines: (string | number)[][] = [
    [title],
    ['# Edit in Excel and save as CSV. One row per section. Dimensions in the Units below. A in unit^2 and I33 / I22 / J in unit^4.'],
    ['# Columns per shape: I / box / unp: d bf tf tw | rect: d bf | circle: d | pipe: d tw(wall) | C: d bf c(lip) tw(thickness) | general: A I33 I22 J only.'],
    ['# A, I33, I22, J are optional for other shapes: when filled in they replace the values computed from the dimensions.'],
    ['# Shapes: I, box, pipe, unp, C, rect, circle, general (also W, WF, H, IPE, HEA, HEB, SHS, RHS, HSS, CHS, UNP, PFC).'],
    ['Units', unit],
    ['Catalog', 'Name', 'Shape', 'd', 'bf', 'tf', 'tw', 'c', `A (${unit}2)`, `I33 (${unit}4)`, `I22 (${unit}4)`, `J (${unit}4)`, 'Mass (kg/m)'],
  ];
  for (const cat of cats) {
    for (const e of cat.entries) {
      const L = (k: number) => fmt(e.dims[k] !== undefined ? e.dims[k] / f : undefined);
      const cols: Record<string, number | ''> = { d: '', bf: '', tf: '', tw: '', c: '' };
      const map = DIM_COLS[e.shape];
      if (e.shape !== 'general') map.forEach((k, i) => (cols[k === 't' ? 'tw' : k] = L(i)));
      const p = e.shape === 'general' ? { A: e.dims[0], I33: e.dims[1], I22: e.dims[2], J: e.dims[3] } : e.props;
      lines.push([
        cat.name,
        e.name,
        e.shape,
        cols.d,
        cols.bf,
        cols.tf,
        cols.tw,
        cols.c,
        fmt(p ? p.A / f ** 2 : undefined),
        fmt(p ? p.I33 / f ** 4 : undefined),
        fmt(p ? p.I22 / f ** 4 : undefined),
        fmt(p ? p.J / f ** 4 : undefined),
        fmt(e.mass),
      ]);
    }
  }
  return lines.map((r) => r.map((c) => csvField(c)).join(',')).join('\r\n') + '\r\n';
}

/** A template with one example row per shape. */
export function catalogTemplateCsv(): string {
  const m = (v: number) => v / 1000;
  // published A / I33 / I22 show how the override columns work; J is left as computed
  const wf = [m(300), m(150), m(9), m(6.5)];
  const ex: CatalogEntry[] = [
    { name: 'WF 300x150x6.5x9', shape: 'I', dims: wf, props: { A: 46.78e-4, I33: 7210e-8, I22: 508e-8, J: shapeProps({ name: '', shape: 'I', dims: wf }).J }, mass: 36.7 },
    { name: 'SHS 100x100x4', shape: 'box', dims: [m(100), m(100), m(4), m(4)] },
    { name: 'CHS 168.3x7.1', shape: 'pipe', dims: [m(168.3), m(7.1)] },
    { name: 'UNP 200', shape: 'unp', dims: [m(200), m(75), m(11.5), m(8.5)] },
    { name: 'C 150x65x20x2.3', shape: 'C', dims: [m(150), m(65), m(20), m(2.3)] },
    { name: 'R 300x500', shape: 'rect', dims: [m(500), m(300)] },
    { name: 'D 400', shape: 'circle', dims: [m(400)] },
    { name: 'My general', shape: 'general', dims: [0.01, 1e-4, 1e-5, 1e-6] },
  ];
  return writeCatalogCsv([{ name: 'My catalog', source: 'user', entries: ex }], 'mm');
}
