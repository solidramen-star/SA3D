import type { Section, SectionPropsOverride, SectionShape } from './types';

/**
 * Section catalogs (Phase 2.1). Built-in starter catalogs ship with the app; user catalogs are imported
 * from CSV files (edited in Excel) and kept in browser storage. All values are stored in m.
 */

export interface CatalogEntry {
  name: string;
  shape: SectionShape;
  dims: number[];
  /** Published properties; they override the shape formulas when the section is used. */
  props?: SectionPropsOverride;
  /** Nominal mass in kg/m. */
  mass?: number;
}

export interface Catalog {
  name: string;
  source: 'builtin' | 'user';
  entries: CatalogEntry[];
  /** Import time (ms since epoch), user catalogs only. */
  imported?: number;
}

const mm = (v: number) => v / 1000;

/** I-shape rows in mm: [name, d, bf, tf, tw, kg/m]. */
function iCatalog(name: string, rows: [string, number, number, number, number, number][]): Catalog {
  return {
    name,
    source: 'builtin',
    entries: rows.map(([n, d, bf, tf, tw, kg]) => ({ name: n, shape: 'I', dims: [mm(d), mm(bf), mm(tf), mm(tw)], mass: kg })),
  };
}

/**
 * Small starter set with nominal dimensions only: A, I and J are computed from the plates (no root fillets),
 * so they are slightly lower than the published tables. Import an official table as CSV for published values.
 */
export const BUILTIN_CATALOGS: Catalog[] = [
  iCatalog('EN IPE', [
    ['IPE 100', 100, 55, 5.7, 4.1, 8.1],
    ['IPE 120', 120, 64, 6.3, 4.4, 10.4],
    ['IPE 140', 140, 73, 6.9, 4.7, 12.9],
    ['IPE 160', 160, 82, 7.4, 5.0, 15.8],
    ['IPE 180', 180, 91, 8.0, 5.3, 18.8],
    ['IPE 200', 200, 100, 8.5, 5.6, 22.4],
    ['IPE 220', 220, 110, 9.2, 5.9, 26.2],
    ['IPE 240', 240, 120, 9.8, 6.2, 30.7],
    ['IPE 270', 270, 135, 10.2, 6.6, 36.1],
    ['IPE 300', 300, 150, 10.7, 7.1, 42.2],
    ['IPE 330', 330, 160, 11.5, 7.5, 49.1],
    ['IPE 360', 360, 170, 12.7, 8.0, 57.1],
    ['IPE 400', 400, 180, 13.5, 8.6, 66.3],
    ['IPE 450', 450, 190, 14.6, 9.4, 77.6],
    ['IPE 500', 500, 200, 16.0, 10.2, 90.7],
    ['IPE 550', 550, 210, 17.2, 11.1, 106],
    ['IPE 600', 600, 220, 19.0, 12.0, 122],
  ]),
  iCatalog('EN HEA', [
    ['HEA 100', 96, 100, 8, 5, 16.7],
    ['HEA 120', 114, 120, 8, 5, 19.9],
    ['HEA 140', 133, 140, 8.5, 5.5, 24.7],
    ['HEA 160', 152, 160, 9, 6, 30.4],
    ['HEA 180', 171, 180, 9.5, 6, 35.5],
    ['HEA 200', 190, 200, 10, 6.5, 42.3],
    ['HEA 220', 210, 220, 11, 7, 50.5],
    ['HEA 240', 230, 240, 12, 7.5, 60.3],
    ['HEA 260', 250, 260, 12.5, 7.5, 68.2],
    ['HEA 280', 270, 280, 13, 8, 76.4],
    ['HEA 300', 290, 300, 14, 8.5, 88.3],
  ]),
  iCatalog('EN HEB', [
    ['HEB 100', 100, 100, 10, 6, 20.4],
    ['HEB 120', 120, 120, 11, 6.5, 26.7],
    ['HEB 140', 140, 140, 12, 7, 33.7],
    ['HEB 160', 160, 160, 13, 8, 42.6],
    ['HEB 180', 180, 180, 14, 8.5, 51.2],
    ['HEB 200', 200, 200, 15, 9, 61.3],
    ['HEB 220', 220, 220, 16, 9.5, 71.5],
    ['HEB 240', 240, 240, 17, 10, 83.2],
    ['HEB 260', 260, 260, 17.5, 10, 93.0],
    ['HEB 280', 280, 280, 18, 10.5, 103],
    ['HEB 300', 300, 300, 19, 11, 117],
  ]),
  iCatalog('WF (JIS / SNI)', [
    ['WF 100x50x5x7', 100, 50, 7, 5, 9.3],
    ['WF 125x60x6x8', 125, 60, 8, 6, 13.2],
    ['WF 150x75x5x7', 150, 75, 7, 5, 14.0],
    ['WF 200x100x5.5x8', 200, 100, 8, 5.5, 21.3],
    ['WF 250x125x6x9', 250, 125, 9, 6, 29.6],
    ['WF 300x150x6.5x9', 300, 150, 9, 6.5, 36.7],
    ['WF 350x175x7x11', 350, 175, 11, 7, 49.6],
    ['WF 400x200x8x13', 400, 200, 13, 8, 66.0],
    ['WF 450x200x9x14', 450, 200, 14, 9, 76.0],
    ['WF 500x200x10x16', 500, 200, 16, 10, 89.6],
    ['WF 600x200x11x17', 600, 200, 17, 11, 106],
  ]),
];

const STORAGE_KEY = 'structapp3d.catalogs';

const storage = (): Storage | null => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
};

export function loadUserCatalogs(): Catalog[] {
  try {
    const s = storage()?.getItem(STORAGE_KEY);
    const list = s ? (JSON.parse(s) as Catalog[]) : [];
    return Array.isArray(list) ? list.filter((c) => c && typeof c.name === 'string' && Array.isArray(c.entries)).map((c) => ({ ...c, source: 'user' })) : [];
  } catch {
    return [];
  }
}

/** Returns false when the browser storage is full or disabled. */
export function saveUserCatalogs(list: Catalog[]): boolean {
  const st = storage();
  if (!st) return false;
  try {
    st.setItem(STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

/** User catalogs first; a user catalog with the same name as a built-in one replaces it. */
export function allCatalogs(user: Catalog[] = loadUserCatalogs()): Catalog[] {
  const names = new Set(user.map((c) => c.name.toLowerCase()));
  return [...user, ...BUILTIN_CATALOGS.filter((c) => !names.has(c.name.toLowerCase()))];
}

/** Add catalogs, replacing user catalogs with the same name. Returns false if they could not be stored. */
export function addUserCatalogs(cats: Catalog[]): boolean {
  const names = new Set(cats.map((c) => c.name.toLowerCase()));
  const now = Date.now();
  const list = [...loadUserCatalogs().filter((c) => !names.has(c.name.toLowerCase())), ...cats.map((c) => ({ ...c, source: 'user' as const, imported: now }))];
  return saveUserCatalogs(list);
}

export function deleteUserCatalog(name: string): boolean {
  return saveUserCatalogs(loadUserCatalogs().filter((c) => c.name !== name));
}

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '');

/** Entries whose name (spaces ignored) contains every word of the query; the catalog name also matches. */
export function searchCatalogs(query: string, cats: Catalog[] = allCatalogs(), limit = 60): { catalog: Catalog; entry: CatalogEntry }[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const out: { catalog: Catalog; entry: CatalogEntry }[] = [];
  for (const catalog of cats) {
    const cn = norm(catalog.name);
    for (const entry of catalog.entries) {
      const hay = norm(entry.name) + '|' + cn;
      if (words.every((w) => hay.includes(w))) {
        out.push({ catalog, entry });
        if (out.length >= limit) return out;
      }
    }
  }
  return out;
}

export function entryToSection(entry: CatalogEntry, catalog: string, name = entry.name): Section {
  const s: Section = { name, shape: entry.shape, dims: [...entry.dims], catalog };
  if (entry.props && entry.shape !== 'general') s.props = { ...entry.props };
  if (entry.mass) s.mass = entry.mass;
  return s;
}
