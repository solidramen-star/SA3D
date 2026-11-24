import { describe, expect, it } from 'vitest';
import { BUILTIN_CATALOGS, allCatalogs, entryToSection, searchCatalogs, type Catalog } from '../src/model/catalog';
import { catalogShape, catalogTemplateCsv, parseCatalogCsv, writeCatalogCsv } from '../src/io/catalogCsv';
import { parseCsvNumber, readSav, writeSav } from '../src/io/savFormat';
import { sectionProps, shapeProps, validateSection } from '../src/model/sections';
import { defaultModel } from '../src/model/types';
import { unitSystem } from '../src/model/units';

const close = (a: number, b: number, tol = 1e-9) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol * Math.max(1, Math.abs(b)));

describe('CSV numbers', () => {
  it('reads dot and comma decimals', () => {
    expect(parseCsvNumber('1,234.5')).toBe(1234.5);
    expect(parseCsvNumber('1.234,5', true)).toBe(1234.5);
    expect(parseCsvNumber('8,5', true)).toBe(8.5);
    expect(parseCsvNumber(' 12 ')).toBe(12);
    expect(parseCsvNumber('')).toBeNaN();
    expect(parseCsvNumber('abc')).toBeNaN();
  });
});

describe('catalog CSV import', () => {
  it('reads a comma file with units, aliases and published properties', () => {
    const csv = [
      'My table',
      '# a comment, with a comma',
      'Units,mm',
      'Catalog,Name,Shape,d,bf,tf,tw,c,A (mm2),I33 (mm4),I22 (mm4),J (mm4),Mass (kg/m)',
      'Local WF,WF 200x100,WF,200,100,8,5.5,,2716,18400000,1340000,52000,21.3',
      'Local WF,SHS 100x4,SHS,100,100,4,4,,,,,,11.7',
      'Pipes,CHS 114.3x6,CHS,114.3,,,6,,,,,,',
      'Pipes,R 300x500,rectangle,500,300,,,,,,,,',
    ].join('\r\n');
    const r = parseCatalogCsv(csv, 'file');
    expect(r.errors).toEqual([]);
    expect(r.unit).toBe('mm');
    expect(r.catalogs.map((c) => c.name)).toEqual(['Local WF', 'Pipes']);
    const [wf, shs] = r.catalogs[0].entries;
    expect(wf.shape).toBe('I');
    expect(wf.dims).toEqual([0.2, 0.1, 0.008, 0.0055]);
    close(wf.props!.A, 2716e-6);
    close(wf.props!.I33, 1.84e-5);
    close(wf.props!.J, 5.2e-8);
    expect(wf.mass).toBe(21.3);
    expect(shs.shape).toBe('box');
    expect(shs.props).toBeUndefined();
    const [chs, rect] = r.catalogs[1].entries;
    expect(chs.shape).toBe('pipe');
    close(chs.dims[1], 0.006);
    expect(rect.dims).toEqual([0.5, 0.3]);
  });

  it('reads a semicolon file with decimal commas (Excel in European locales)', () => {
    const csv = ['Units;cm', 'Name;Shape;d;bf;tf;tw', 'IPE 200;IPE;20;10;0,85;0,56', 'Bar;general;;;;;'].join('\n');
    const r = parseCatalogCsv(csv, 'Euro');
    expect(r.catalogs).toHaveLength(1);
    expect(r.catalogs[0].name).toBe('Euro');
    const e = r.catalogs[0].entries[0];
    close(e.dims[2], 0.0085);
    close(e.dims[3], 0.0056);
    expect(r.errors).toHaveLength(1);
    expect(r.errors[0].line).toBe(4);
  });

  it('uses the Catalog row and defaults to mm with a warning', () => {
    const r = parseCatalogCsv(['Catalog,Mine', 'Name,Shape,d', 'D400,circle,400'].join('\n'), 'x');
    expect(r.catalogs[0].name).toBe('Mine');
    expect(r.catalogs[0].entries[0].dims).toEqual([0.4]);
    expect(r.warnings.some((w) => /mm/.test(w.msg))).toBe(true);
  });

  it('converts inch tables and lb/ft', () => {
    const r = parseCatalogCsv(['Units,in', 'Name,Shape,d,bf,tf,tw,Weight (lb/ft)', 'W8X31,W,8,8,0.435,0.285,31'].join('\n'), 'AISC');
    const e = r.catalogs[0].entries[0];
    close(e.dims[0], 0.2032);
    close(e.mass!, 31 * 1.48816394);
  });

  it('reports bad rows and keeps good ones', () => {
    const csv = [
      'Units,mm',
      'Name,Shape,d,bf,tf,tw,A',
      'Good,I,300,150,9,6.5,',
      'Bad shape,Z,300,150,9,6.5,',
      'Missing,I,300,150,,6.5,',
      'Text,I,300,abc,9,6.5,',
      'Thick,I,300,150,200,6.5,',
      '"A,B",I,300,150,9,6.5,',
      'Good,I,200,100,8,5,',
      'Units off,I,300,150,9,6.5,0.004678',
    ].join('\n');
    const r = parseCatalogCsv(csv, 'T');
    expect(r.catalogs[0].entries.map((e) => e.name)).toEqual(['Good', 'Units off']);
    expect(r.errors.map((e) => e.line)).toEqual([4, 5, 6, 7, 8, 9]);
    expect(r.warnings.some((w) => w.line === 10 && /units/.test(w.msg))).toBe(true);
    expect(r.warnings.some((w) => w.line === 10 && /computed/.test(w.msg))).toBe(true);
  });

  it('fails without a header row', () => {
    const r = parseCatalogCsv('just,some,text\n1,2,3', 'x');
    expect(r.catalogs).toEqual([]);
    expect(r.errors[0].msg).toMatch(/header/);
  });

  it('knows the shape aliases', () => {
    expect(catalogShape('HEA')).toBe('I');
    expect(catalogShape('rhs')).toBe('box');
    expect(catalogShape('Lipped channel')).toBe('C');
    expect(catalogShape('UPN')).toBe('unp');
    expect(catalogShape('zed')).toBeUndefined();
  });
});

describe('catalog CSV export', () => {
  it('round-trips through export and import, in mm and in', () => {
    const cats: Catalog[] = [
      {
        name: 'Mix',
        source: 'user',
        entries: [
          { name: 'I1', shape: 'I', dims: [0.3, 0.15, 0.009, 0.0065], props: { A: 4.678e-3, I33: 7.21e-5, I22: 5.08e-6, J: 1.2e-7 }, mass: 36.7 },
          { name: 'C1', shape: 'C', dims: [0.15, 0.065, 0.02, 0.0023] },
          { name: 'P1', shape: 'pipe', dims: [0.1683, 0.0071] },
          { name: 'G1', shape: 'general', dims: [0.01, 1e-4, 1e-5, 1e-6] },
        ],
      },
    ];
    for (const unit of ['mm', 'in'] as const) {
      const r = parseCatalogCsv(writeCatalogCsv(cats, unit), 'x');
      expect(r.errors).toEqual([]);
      expect(r.unit).toBe(unit);
      const got = r.catalogs[0].entries;
      expect(got).toHaveLength(4);
      got.forEach((e, k) => {
        const want = cats[0].entries[k];
        expect(e.shape).toBe(want.shape);
        e.dims.forEach((v, i) => close(v, want.dims[i], 1e-8));
        if (want.props) for (const key of ['A', 'I33', 'I22', 'J'] as const) close(e.props![key], want.props[key], 1e-8);
        else expect(e.props).toBeUndefined();
        expect(e.mass).toBe(want.mass);
      });
    }
  });

  it('template imports cleanly', () => {
    const r = parseCatalogCsv(catalogTemplateCsv(), 'x');
    expect(r.errors).toEqual([]);
    expect(r.catalogs[0].name).toBe('My catalog');
    expect(new Set(r.catalogs[0].entries.map((e) => e.shape)).size).toBe(8);
  });
});

describe('catalog library', () => {
  it('built-in entries are valid sections with a mass', () => {
    for (const c of BUILTIN_CATALOGS)
      for (const e of c.entries) {
        expect(validateSection(entryToSection(e, c.name))).toBeNull();
        expect(e.mass).toBeGreaterThan(0);
      }
  });

  it('built-in masses agree with the computed area within 10%', () => {
    for (const c of BUILTIN_CATALOGS)
      for (const e of c.entries) {
        const kgm = shapeProps(entryToSection(e, c.name)).A * 7850;
        expect(Math.abs(kgm / e.mass! - 1)).toBeLessThan(0.1);
      }
  });

  it('searches ignoring spaces and case, also by catalog name', () => {
    const hits = searchCatalogs('ipe200', BUILTIN_CATALOGS);
    expect(hits.map((x) => x.entry.name)).toContain('IPE 200');
    expect(searchCatalogs('hea 2', BUILTIN_CATALOGS).every((x) => x.catalog.name.includes('HEA'))).toBe(true);
    expect(searchCatalogs('nothing-like-this', BUILTIN_CATALOGS)).toEqual([]);
  });

  it('user catalogs shadow built-ins with the same name', () => {
    const mine: Catalog = { name: BUILTIN_CATALOGS[0].name.toUpperCase(), source: 'user', entries: [] };
    const all = allCatalogs([mine]);
    expect(all[0]).toBe(mine);
    expect(all.filter((c) => c.name.toLowerCase() === mine.name.toLowerCase())).toHaveLength(1);
  });
});

describe('published properties in sections and .sav', () => {
  const sec = { name: 'IPE 200', shape: 'I' as const, dims: [0.2, 0.1, 0.0085, 0.0056], props: { A: 2.85e-3, I33: 1.943e-5, I22: 1.42e-6, J: 6.98e-8 }, catalog: 'EN IPE', mass: 22.4 };

  it('override replaces A, I33, I22 and J but keeps shear areas', () => {
    const p = sectionProps(sec);
    const c = shapeProps(sec);
    expect(p.A).toBe(2.85e-3);
    expect(p.J).toBe(6.98e-8);
    expect(p.As2).toBe(c.As2);
    expect(p.depth).toBe(c.depth);
    expect(validateSection({ ...sec, props: { ...sec.props, J: 0 } })).not.toBeNull();
  });

  it('round-trips Override, Catalog and Mass through .sav in any unit system', () => {
    for (const id of ['kN-m', 'kip-in']) {
      const d = defaultModel();
      d.sections.push(sec, { name: 'Plain', shape: 'rect', dims: [0.5, 0.3] });
      const back = readSav(writeSav(d, null, new Date(), unitSystem(id)!));
      const s = back.sections.find((x) => x.name === 'IPE 200')!;
      expect(s.catalog).toBe('EN IPE');
      close(s.mass!, 22.4);
      for (const k of ['A', 'I33', 'I22', 'J'] as const) close(s.props![k], sec.props[k], 1e-9);
      const plain = back.sections.find((x) => x.name === 'Plain')!;
      expect(plain.props).toBeUndefined();
      expect(plain.catalog).toBeUndefined();
      expect(plain.mass).toBeUndefined();
    }
  });

  it('reads old .sav files without the new columns', () => {
    const d = defaultModel();
    const text = writeSav(d, null);
    const lines = text.split(/\r?\n/);
    const h = lines.findIndex((l) => l.includes('Override'));
    expect(h).toBeGreaterThan(-1);
    const cut = (l: string) => l.split(',').slice(0, l.split(',').length - 3).join(',');
    let k = h;
    while (k < lines.length && lines[k].trim() !== '') {
      lines[k] = cut(lines[k]);
      k++;
    }
    const back = readSav(lines.join('\r\n'));
    expect(back.sections.map((s) => s.name)).toEqual(d.sections.map((s) => s.name));
    expect(back.sections.every((s) => !s.props && !s.catalog && !s.mass)).toBe(true);
  });
});
