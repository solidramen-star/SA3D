import { describe, expect, it } from 'vitest';
import { Model } from '../src/model/model';
import { FIXED } from '../src/model/types';
import { analyze } from '../src/solver/analyze';
import { DxfError, dxfUnitScale, importDxf, parseDxf, sanitizeLayer, writeDxf } from '../src/io/dxf';

/** Build an ASCII DXF from [code, value] pairs placed in the ENTITIES section. */
const dxf = (ents: (string | number)[][], header: (string | number)[][] = []) => {
  const pairs: (string | number)[][] = [];
  if (header.length) pairs.push([0, 'SECTION'], [2, 'HEADER'], ...header, [0, 'ENDSEC']);
  pairs.push([0, 'SECTION'], [2, 'ENTITIES'], ...ents, [0, 'ENDSEC'], [0, 'EOF']);
  return pairs.map(([c, v]) => `${c}\n${v}`).join('\n') + '\n';
};
const line = (layer: string, a: number[], b: number[]) => [
  [0, 'LINE'], [8, layer], [10, a[0]], [20, a[1]], [30, a[2]], [11, b[0]], [21, b[1]], [31, b[2]],
];

describe('DXF parsing', () => {
  it('reads LINE, POINT, 3DFACE, LWPOLYLINE (with OCS), 2D/3D POLYLINE and counts skipped entities', () => {
    const text = dxf(
      [
        ...line('L1', [0, 0, 0], [1, 2, 3]),
        [0, 'POINT'], [8, '0'], [10, 5], [20, 5], [30, 5],
        [0, '3DFACE'], [8, 'F'], [10, 0], [20, 0], [30, 0], [11, 1], [21, 0], [31, 0], [12, 1], [22, 1], [32, 0], [13, 1], [23, 1], [33, 0],
        // closed LWPOLYLINE at elevation 2 with extrusion (0,0,-1): OCS x is mirrored
        [0, 'LWPOLYLINE'], [8, 'P'], [90, 3], [70, 1], [38, 2], [10, 1], [20, 0], [10, 2], [20, 0], [42, 0.5], [10, 2], [20, 1], [210, 0], [220, 0], [230, -1],
        [0, 'POLYLINE'], [8, 'Q'], [66, 1], [70, 8], [0, 'VERTEX'], [8, 'Q'], [10, 0], [20, 0], [30, 1], [0, 'VERTEX'], [8, 'Q'], [10, 0], [20, 0], [30, 4], [0, 'SEQEND'],
        [0, 'CIRCLE'], [8, '0'], [10, 0], [20, 0], [30, 0], [40, 1],
      ],
      [[9, '$INSUNITS'], [70, 4]],
    );
    const doc = parseDxf(text);
    expect(doc.insUnits).toBe(4);
    expect(doc.skipped).toEqual({ CIRCLE: 1 });
    expect(doc.bulges).toBe(1);
    const [l, p, f, lw, pl] = doc.entities;
    expect(l).toMatchObject({ kind: 'line', layer: 'L1', pts: [[0, 0, 0], [1, 2, 3]] });
    expect(p).toMatchObject({ kind: 'point', pts: [[5, 5, 5]] });
    expect(f.kind).toBe('face');
    expect(f.pts.length).toBe(3);
    expect(lw.closed).toBe(true);
    expect(lw.pts.map((q) => q.map((v) => Math.round(v * 1e9) / 1e9 + 0))).toEqual([[-1, 0, -2], [-2, 0, -2], [-2, 1, -2]]);
    expect(pl).toMatchObject({ kind: 'poly', pts: [[0, 0, 1], [0, 0, 4]], closed: false });
  });

  it('rejects binary DXF and maps $INSUNITS to metres', () => {
    expect(() => parseDxf('AutoCAD Binary DXF\r\n\x1a\x00')).toThrow(DxfError);
    expect(dxfUnitScale(4)).toBe(0.001);
    expect(dxfUnitScale(6)).toBe(1);
    expect(dxfUnitScale(2)).toBeCloseTo(0.3048);
    expect(dxfUnitScale(0)).toBeNull();
  });
});

describe('DXF import', () => {
  it('scales, merges near endpoints, maps section@material layers and is one undo step', () => {
    const m = new Model();
    const doc = parseDxf(
      dxf([
        ...line('IWF300@C30', [0, 0, 0], [4000, 0, 0]),
        ...line('IWF300@C30', [4000.4, 0, 0], [4000, 0, 3000]), // 0.4 mm gap → merged
        ...line('IWF300@C30', [0, 0, 0], [4000, 0, 0]), // duplicate
        ...line('BEAMS', [0, 0, 0], [0, 0, 3000]),
        ...line('BEAMS', [0, 0, 3000], [0.2, 0, 3000]), // zero length after merge
      ]),
    );
    const before = m.data.joints.length;
    const rep = importDxf(m, doc, { scale: 0.001, mergeTol: 0.001 });
    expect(rep).toMatchObject({ joints: 4, frames: 3, duplicates: 1, zeroLength: 1, unmatchedLayers: ['BEAMS'] });
    expect(m.data.joints.length).toBe(before + 4);
    const f0 = m.data.frames[0];
    expect([f0.section, f0.material]).toEqual(['IWF300', 'C30']);
    expect(m.data.frames[2].section).toBe(m.data.sections[0].name);
    expect(m.frameLength(f0)).toBeCloseTo(4);
    m.undo();
    expect(m.data.frames.length).toBe(0);
  });

  it('turns 3DFACEs and closed polylines on AREA layers into areas, other closed polylines into frames', () => {
    const m = new Model();
    m.addFrame(m.addJoint(9, 9, 9), m.addJoint(9, 9, 10));
    const poly = (layer: string) => [
      [0, 'LWPOLYLINE'], [8, layer], [90, 4], [70, 1], [10, 0], [20, 0], [10, 2], [20, 0], [10, 2], [20, 2], [10, 0], [20, 2],
    ];
    const doc = parseDxf(dxf([...poly('SA3D_AREAS'), ...poly('RING')]));
    const rep = importDxf(m, doc, { scale: 1, replace: true });
    expect(rep).toMatchObject({ joints: 4, areas: 1, frames: 4 });
    expect(m.data.joints.length).toBe(4);
    expect(m.data.areas[0].joints.length).toBe(4);

    const only = importDxf(new Model(), doc, { scale: 1, layers: new Set(['RING']) });
    expect(only).toMatchObject({ areas: 0, frames: 4 });
  });
});

describe('DXF export', () => {
  const sample = () => {
    const m = new Model();
    const a = m.addJoint(0, 0, 0);
    const b = m.addJoint(3, 0, 0);
    const c = m.addJoint(3, 0, 2);
    m.addFrame(a, b);
    m.addFrame(b, c);
    m.addArea([a, b, c]);
    m.commit('fix', (d) => {
      d.joints[0].r = [...FIXED];
      d.frames[0].section = 'R300x500';
      d.frameUniformLoads.push({ case: 'DEAD', frame: d.frames[0].id, dir: 'GRAV', w: 5 });
    });
    return m;
  };

  it('round-trips geometry, layers and length units', () => {
    const m = sample();
    expect(sanitizeLayer('W 8x10 / A36')).toBe('W_8x10_A36');
    const text = writeDxf(m.data, { kL: 0.001 });
    expect(text).toContain('AC1009');
    expect(text).toContain('R300x500@STEEL');
    const doc = parseDxf(text);
    expect(doc.insUnits).toBe(4);
    const back = new Model();
    const rep = importDxf(back, doc, { scale: dxfUnitScale(doc.insUnits)! });
    expect(rep).toMatchObject({ joints: 3, frames: 2, areas: 1, unmatchedLayers: [] });
    expect(back.data.joints.map((j) => [j.x, j.y, j.z])).toEqual(m.data.joints.map((j) => [j.x, j.y, j.z]));
    expect(back.data.frames.map((f) => [f.section, f.material])).toEqual(m.data.frames.map((f) => [f.section, f.material]));
  });

  it('writes deformed shape and force diagram layers when results are given', () => {
    const m = sample();
    const results = analyze(m.data);
    const text = writeDxf(m.data, { kL: 1, results, deformScale: 50, forceComps: ['M3', 'V2'], diagramSize: 0.5 });
    const doc = parseDxf(text);
    expect(doc.layers['SA3D_RESULT_DEFORMED']).toBe(2);
    expect(doc.layers['SA3D_RESULT_M3']).toBeGreaterThan(0);
    expect(doc.layers['SA3D_RESULT_V2']).toBeGreaterThan(0);
    expect(doc.skipped.TEXT).toBeGreaterThan(0);
    // result layers are unselected on re-import in the app; importing everything else gives the original model
    const keep = new Set(Object.keys(doc.layers).filter((l) => !l.startsWith('SA3D_RESULT')));
    expect(importDxf(new Model(), doc, { scale: 1, layers: keep })).toMatchObject({ joints: 3, frames: 2, areas: 1 });
  });
});
