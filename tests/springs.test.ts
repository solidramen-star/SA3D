import { describe, expect, it } from 'vitest';
import { defaultModel, FIXED, type ModelData, type Restraint, type Springs } from '../src/model/types';
import { analyze, analyzeAll } from '../src/solver/analyze';
import { readSav, SavError, writeSav } from '../src/io/savFormat';

const E = 2e8;
const A = 0.01;
const I33 = 2e-4;
const I22 = 1e-4;
const J = 5e-5;
const FREE: Restraint = [false, false, false, false, false, false];

function base(): ModelData {
  const m = defaultModel();
  m.materials = [{ name: 'M', E, nu: 0.3, gamma: 78.5 }];
  m.sections = [{ name: 'S', shape: 'general', dims: [A, I33, I22, J] }];
  m.settings.selfWeight = false;
  return m;
}
function joint(m: ModelData, id: number, x: number, r: Restraint = FREE, k?: Springs) {
  m.joints.push({ id, x, y: 0, z: 0, r: [...r] as Restraint, ...(k ? { k } : {}) });
}
function frame(m: ModelData, id: number, i: number, j: number) {
  m.frames.push({ id, i, j, material: 'M', section: 'S', beta: 0 });
}
const close = (a: number, b: number, rel = 1e-6) => expect(Math.abs(a - b)).toBeLessThanOrEqual(Math.abs(b) * rel + 1e-12);
const DEAD = () => defaultModel().loadCases[0].name;

describe('joint springs', () => {
  it('cantilever tip on a vertical spring shares the load: δ = P / (k + 3EI/L³)', () => {
    const m = base();
    const L = 4;
    const P = 10;
    const k = 500;
    joint(m, 1, 0, FIXED);
    joint(m, 2, L, FREE, [0, 0, k, 0, 0, 0]);
    frame(m, 1, 1, 2);
    m.jointLoads.push({ case: DEAD(), joint: 2, f: [0, 0, -P, 0, 0, 0] });
    const r = analyze(m);
    const d = -P / (k + (3 * E * I33) / L ** 3);
    close(r.disp[2][2], d);
    close(r.reactions[2][2], -k * d);
    close(r.reactions[1][2] + r.reactions[2][2], P);
    close(r.stats.sumReaction[2], P);
  });

  it('a very stiff spring behaves like a roller (propped cantilever, prop reaction 5P/16)', () => {
    const m = base();
    const L = 6;
    const P = 16;
    joint(m, 1, 0, FIXED);
    joint(m, 2, L / 2);
    joint(m, 3, L, FREE, [0, 0, 1e12, 0, 0, 0]);
    frame(m, 1, 1, 2);
    frame(m, 2, 2, 3);
    m.jointLoads.push({ case: DEAD(), joint: 2, f: [0, 0, -P, 0, 0, 0] });
    const r = analyze(m);
    close(r.reactions[3][2], (5 * P) / 16, 1e-5);
    close(r.reactions[1][2], (11 * P) / 16, 1e-5);
  });

  it('rotational spring at the base adds a rigid-body rotation: δ = PL³/3EI + PL²/Kry', () => {
    const m = base();
    const L = 3;
    const P = 5;
    const kr = 2e4;
    joint(m, 1, 0, [true, true, true, true, false, true], [0, 0, 0, 0, kr, 0]);
    joint(m, 2, L);
    frame(m, 1, 1, 2);
    m.jointLoads.push({ case: DEAD(), joint: 2, f: [0, 0, -P, 0, 0, 0] });
    const r = analyze(m);
    close(Math.abs(r.disp[2][2]), (P * L ** 3) / (3 * E * I33) + (P * L * L) / kr);
    close(Math.abs(r.disp[1][4]), (P * L) / kr);
    close(Math.abs(r.reactions[1][4]), P * L);
  });

  it('a spring on a restrained DOF is ignored with a warning', () => {
    const m = base();
    joint(m, 1, 0, FIXED, [0, 0, 1000, 0, 0, 0]);
    joint(m, 2, 2);
    frame(m, 1, 1, 2);
    m.jointLoads.push({ case: DEAD(), joint: 2, f: [0, 0, -1, 0, 0, 0] });
    const r = analyze(m);
    expect(r.warnings.some((w) => w.includes('Joint 1') && w.includes('spring'))).toBe(true);
    close(r.disp[1][2], 0);
  });
});

describe('prescribed joint displacements', () => {
  it('settlement of a fixed-fixed beam: M = 6EIΔ/L², V = 12EIΔ/L³', () => {
    const m = base();
    const L = 5;
    const D = 0.01;
    joint(m, 1, 0, FIXED);
    joint(m, 2, L, FIXED);
    frame(m, 1, 1, 2);
    m.jointDisplacements.push({ case: DEAD(), joint: 2, d: [0, 0, -D, 0, 0, 0] });
    const r = analyze(m);
    close(r.disp[2][2], -D);
    const V = (12 * E * I33 * D) / L ** 3;
    const M = (6 * E * I33 * D) / L ** 2;
    close(Math.abs(r.reactions[1][2]), V);
    close(r.reactions[1][2] + r.reactions[2][2], 0);
    close(Math.abs(r.reactions[1][4]), M);
    close(Math.abs(r.reactions[2][4]), M);
    close(Math.abs(r.frames[0].M3[0]), M);
  });

  it('a displacement on a free DOF is ignored with a warning', () => {
    const m = base();
    joint(m, 1, 0, FIXED);
    joint(m, 2, 3);
    frame(m, 1, 1, 2);
    m.jointDisplacements.push({ case: DEAD(), joint: 2, d: [0, 0, -0.01, 0, 0, 0] });
    const r = analyze(m);
    expect(r.warnings.some((w) => w.includes('Joint 2') && w.includes('UZ'))).toBe(true);
    close(r.disp[2][2], 0);
  });

  it('settlement superposes with loads in a combination', () => {
    const m = base();
    const L = 4;
    m.loadCases.push({ name: 'SETTLE', type: 'Other' });
    m.loadCombos.push({ name: 'C1', factors: [{ case: DEAD(), factor: 1.2 }, { case: 'SETTLE', factor: 1 }] });
    joint(m, 1, 0, FIXED);
    joint(m, 2, L / 2);
    joint(m, 3, L, [true, true, true, false, false, false]);
    frame(m, 1, 1, 2);
    frame(m, 2, 2, 3);
    m.jointLoads.push({ case: DEAD(), joint: 2, f: [0, 0, -10, 0, 0, 0] });
    m.jointDisplacements.push({ case: 'SETTLE', joint: 3, d: [0, 0, -0.005, 0, 0, 0] });
    const set = analyzeAll(m);
    const a = set.results[DEAD()];
    const b = set.results.SETTLE;
    const c = set.results.C1;
    for (let k = 0; k < 6; k++) {
      close(c.disp[2][k], 1.2 * a.disp[2][k] + b.disp[2][k]);
      close(c.reactions[3][k], 1.2 * a.reactions[3][k] + b.reactions[3][k]);
    }
    close(b.disp[3][2], -0.005);
  });
});

describe('.sav springs and joint displacements', () => {
  it('round-trips SPRINGS and JOINT DISPLACEMENTS', () => {
    const m = base();
    joint(m, 1, 0, FIXED);
    joint(m, 2, 4, FREE, [100, 0, 2500, 0, 30, 0]);
    frame(m, 1, 1, 2);
    m.jointDisplacements.push({ case: DEAD(), joint: 1, d: [0, 0, -0.01, 0, 0.002, 0] });
    const text = writeSav(m);
    expect(text).toContain('TABLE,SPRINGS');
    expect(text).toContain('TABLE,JOINT DISPLACEMENTS');
    expect(readSav(text)).toEqual(readSav(writeSav(readSav(text))));
    const back = readSav(text);
    expect(back.joints[1].k?.map((v) => Math.round(v * 1e6) / 1e6)).toEqual([100, 0, 2500, 0, 30, 0]);
    expect(back.joints[0].k).toBeUndefined();
    expect(back.jointDisplacements).toEqual(m.jointDisplacements);
  });

  it('rejects negative spring stiffness', () => {
    const m = base();
    joint(m, 1, 0, FIXED);
    joint(m, 2, 4, FREE, [0, 0, 1, 0, 0, 0]);
    frame(m, 1, 1, 2);
    const text = writeSav(m).replace(/(TABLE,SPRINGS\r?\n[^\n]*\n2,)0,0,1/, '$1-5,0,1');
    expect(text).toContain('2,-5,0,1');
    expect(() => readSav(text)).toThrow(SavError);
  });
});
