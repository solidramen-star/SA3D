import { describe, expect, it } from 'vitest';
import { defaultModel, FIXED, type ModelData, type Restraint } from '../src/model/types';
import { csvField, parseCsv, parseUnitsCell, readSav, SavError, writeSav, type SavInfo } from '../src/io/savFormat';
import { unitSystem } from '../src/model/units';
import { analyzeAll } from '../src/solver/analyze';

function sample(): ModelData {
  const d = defaultModel();
  d.settings.selfWeight = true;
  d.settings.workPlane = 'XZ';
  d.materials.push({ name: 'Wood, "glulam"', E: 1.1e7, nu: 0.35, gamma: 5 });
  d.joints = [
    { id: 1, x: 0, y: 0, z: 0, r: [...FIXED] as Restraint },
    { id: 2, x: 0, y: 0, z: 3.5, r: [false, false, false, false, false, false] },
    { id: 3, x: 4.25, y: 0, z: 3.5, r: [false, false, false, false, false, false] },
    { id: 7, x: 4.25, y: 0, z: 0, r: [true, true, true, false, false, false] },
  ];
  d.frames = [
    { id: 1, i: 1, j: 2, material: 'STEEL', section: 'IWF300', beta: 90 },
    { id: 2, i: 2, j: 3, material: 'Wood, "glulam"', section: 'R300x500', beta: 0 },
    { id: 3, i: 7, j: 3, material: 'C30', section: 'PIPE168', beta: 0 },
  ];
  d.areas = [{ id: 1, joints: [1, 2, 3, 7], distribution: 'one-way' }];
  d.jointLoads = [{ case: 'DEAD', joint: 2, f: [10, 0, -5, 0, 1.5, 0] }];
  d.framePointLoads = [{ case: 'DEAD', frame: 2, dir: 'L2', P: -12.5, rd: 0.3 }];
  d.frameUniformLoads = [{ case: 'DEAD', frame: 2, dir: 'GRAV', w: 4 }];
  d.areaLoads = [{ case: 'DEAD', area: 1, q: 2.5 }];
  return d;
}

describe('.sav format', () => {
  it('quotes fields per RFC 4180', () => {
    expect(csvField('a,b')).toBe('"a,b"');
    expect(csvField('say "hi"')).toBe('"say ""hi"""');
    expect(csvField(1.5)).toBe('1.5');
    expect(parseCsv('a,"b,c","d""e"\r\nx,y\r\n')).toEqual([
      ['a', 'b,c', 'd"e'],
      ['x', 'y'],
    ]);
  });

  it('round-trips a model', () => {
    const d = sample();
    const text = writeSav(d);
    expect(text).toContain('TABLE,JOINTS\r\n');
    expect(readSav(text)).toEqual(d);
  });

  it('round-trips with results tables present (results are ignored on read)', () => {
    const d = sample();
    const r = analyzeAll(d);
    const text = writeSav(d, r);
    expect(text).toContain('Case,');
    expect(text).toContain('TABLE,RESULTS FRAME FORCES');
    expect(readSav(text)).toEqual(d);
  });

  it('accepts files re-saved by Excel (semicolons, trailing commas, BOM, reordered columns)', () => {
    const text =
      '\uFEFFTABLE;JOINTS;;\r\nY;ID;X;Z\r\n0;1;0;0\r\n0;2;5;0\r\n;;;\r\nTABLE;FRAMES\r\nID;JointI;JointJ\r\n1;1;2\r\n';
    const d = readSav(text);
    expect(d.joints.map((j) => j.x)).toEqual([0, 5]);
    expect(d.frames[0].material).toBe('STEEL');
  });

  it('writes in the chosen units and converts back to kN, m on read', () => {
    const d = sample();
    for (const id of ['N-mm', 'tonf-m', 'kgf-mm', 'kip-ft', 'kip-in', 'lb-in'] as const) {
      const text = writeSav(d, null, new Date(0), unitSystem(id)!);
      const info: SavInfo = {};
      const back = readSav(text, info);
      expect(info.units).toBe(id);
      expect(back.joints[2].x).toBeCloseTo(4.25, 9);
      expect(back.jointLoads[0].f[0]).toBeCloseTo(10, 9);
      expect(back.jointLoads[0].f[4]).toBeCloseTo(1.5, 9);
      expect(back.framePointLoads[0].P).toBeCloseTo(-12.5, 9);
      expect(back.frameUniformLoads[0].w).toBeCloseTo(4, 9);
      expect(back.areaLoads[0].q).toBeCloseTo(2.5, 9);
      expect(back.settings.gridSpacing).toBeCloseTo(d.settings.gridSpacing, 9);
      const wood = back.materials.find((m) => m.name.startsWith('Wood'))!;
      expect(wood.E / 1.1e7).toBeCloseTo(1, 9);
      expect(wood.gamma).toBeCloseTo(5, 9);
      d.sections.forEach((s, k) => s.dims.forEach((v, i) => expect(back.sections[k].dims[i] / v).toBeCloseTo(1, 9)));
    }
    const mm = writeSav(d, null, new Date(0), unitSystem('N-mm')!);
    expect(mm).toContain('X (mm)');
    expect(mm).toContain('N, mm, C');
    expect(mm).toMatch(/\r\n3,4250,0,3500\r\n/);
  });

  it('parses the Units cell', () => {
    expect(parseUnitsCell('ton, m')?.id).toBe('tonf-m');
    expect(parseUnitsCell('kip, ft, F')?.id).toBe('kip-ft');
    expect(parseUnitsCell('kN, m, C')?.id).toBe('kN-m');
    expect(parseUnitsCell('furlong')).toBeUndefined();
    expect(() => readSav('TABLE,PROGRAM\r\nProgram,Version,Units\r\nx,1,furlong\r\n')).toThrow(/unknown units/);
    const info: SavInfo = {};
    readSav('TABLE,JOINTS\r\nID,X,Y,Z\r\n1,0,0,0\r\n', info);
    expect(info.units).toBeUndefined();
  });

  it('reports bad data with the line number', () => {
    const text = 'TABLE,JOINTS\r\nID,X,Y,Z\r\n1,0,0,0\r\n2,abc,0,0\r\n';
    expect(() => readSav(text)).toThrow(SavError);
    expect(() => readSav(text)).toThrow(/Line 4/);
    expect(() => readSav('TABLE,FRAMES\nID,JointI,JointJ\n1,1,2\n')).toThrow(/joint 1 does not exist/);
  });
});

describe('.sav load cases and combinations', () => {
  it('round-trips custom cases, combos and the case of every load', () => {
    const d = sample();
    d.loadCases.push({ name: 'WIND X', type: 'Other' });
    d.loadCombos.push({ name: 'ENV', factors: [{ case: 'DEAD', factor: 0.9 }, { case: 'WIND X', factor: -1 }] });
    d.jointLoads[0].case = 'WIND X';
    const text = writeSav(d);
    expect(text).toContain('TABLE,LOAD CASES');
    expect(text).toContain('TABLE,LOAD COMBOS');
    const back = readSav(text);
    expect(back).toEqual(d);
    expect(back.jointLoads[0].case).toBe('WIND X');
  });

  it('opens older files without load case tables (all loads go to DEAD, default combo added)', () => {
    const text =
      'TABLE,JOINTS\r\nID,X,Y,Z\r\n1,0,0,0\r\n2,5,0,0\r\n\r\nTABLE,JOINT LOADS\r\nJoint,FX,FY,FZ,MX,MY,MZ\r\n2,0,0,-10,0,0,0\r\n';
    const d = readSav(text);
    expect(d.loadCases.map((c) => c.name)).toEqual(['DEAD', 'LIVE']);
    expect(d.loadCombos[0].name).toBe('COMBO1');
    expect(d.jointLoads[0].case).toBe('DEAD');
  });

  it('rejects loads that reference an unknown load case', () => {
    const text = writeSav(sample()).replace(/\r\nDEAD,Dead\r\n/, '\r\nDL,Dead\r\n');
    expect(() => readSav(text)).toThrow(SavError);
  });
});