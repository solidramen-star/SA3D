import { describe, expect, it } from 'vitest';
import { defaultModel, FIXED, type ModelData, type Restraint } from '../src/model/types';
import { analyze, analyzeAll, SolverError } from '../src/solver/analyze';
import { localDeflection, sampleAt } from '../src/solver/diagram';
import { sectionProps } from '../src/model/sections';

const E = 2e8;
// general section: A, I33, I22, J
const A = 0.01;
const I33 = 2e-4;
const I22 = 1e-4;
const J = 5e-5;

function base(): ModelData {
  const m = defaultModel();
  m.materials = [{ name: 'M', E, nu: 0.3, gamma: 78.5 }];
  m.sections = [{ name: 'S', shape: 'general', dims: [A, I33, I22, J] }];
  m.settings.selfWeight = false;
  return m;
}
function joint(m: ModelData, id: number, x: number, y: number, z: number, r: Restraint = [false, false, false, false, false, false]) {
  m.joints.push({ id, x, y, z, r });
}
function frame(m: ModelData, id: number, i: number, j: number, beta = 0) {
  m.frames.push({ id, i, j, material: 'M', section: 'S', beta });
}
const close = (a: number, b: number, rel = 1e-6) => expect(Math.abs(a - b)).toBeLessThanOrEqual(Math.abs(b) * rel + 1e-12);

describe('3D frame solver', () => {
  it('cantilever with tip load: δ = PL³/3EI and fixed-end moment PL', () => {
    const m = base();
    const L = 4;
    const P = 10;
    joint(m, 1, 0, 0, 0, [...FIXED] as Restraint);
    joint(m, 2, L, 0, 0);
    frame(m, 1, 1, 2);
    m.jointLoads.push({ case: 'DEAD', joint: 2, f: [0, 0, -P, 0, 0, 0] });
    const r = analyze(m);
    close(r.disp[2][2], -(P * L ** 3) / (3 * E * I33));
    close(r.reactions[1][2], P);
    close(Math.abs(r.reactions[1][4]), P * L);
    const fr = r.frames[0];
    close(fr.M3[0], -P * L); // hogging at support
    close(fr.V2[5], fr.V2[0]);
  });

  it('cantilever bending about the minor axis and axial and torsion', () => {
    const m = base();
    const L = 3;
    joint(m, 1, 0, 0, 0, [...FIXED] as Restraint);
    joint(m, 2, L, 0, 0);
    frame(m, 1, 1, 2);
    m.jointLoads.push({ case: 'DEAD', joint: 2, f: [5, 7, 0, 2, 0, 0] });
    const r = analyze(m);
    const G = E / (2 * 1.3);
    close(r.disp[2][0], (5 * L) / (E * A));
    close(r.disp[2][1], (7 * L ** 3) / (3 * E * I22));
    close(r.disp[2][3], (2 * L) / (G * J));
  });

  it('simply supported beam with UDL: midspan 5wL⁴/384EI and M = wL²/8', () => {
    const m = base();
    const L = 6;
    const w = 12;
    joint(m, 1, 0, 0, 0, [true, true, true, true, false, false]);
    joint(m, 2, L, 0, 0, [false, true, true, false, false, false]);
    frame(m, 1, 1, 2);
    m.frameUniformLoads.push({ case: 'DEAD', frame: 1, dir: 'GRAV', w });
    const r = analyze(m);
    const fr = r.frames[0];
    const mid = fr.x.findIndex((x) => Math.abs(x - L / 2) < 1e-9);
    close(fr.M3[mid], (w * L * L) / 8, 1e-9);
    close(fr.disp[mid][2], -(5 * w * L ** 4) / (384 * E * I33), 2e-3);
    close(r.reactions[1][2], (w * L) / 2);
    close(r.reactions[2][2], (w * L) / 2);
  });

  it('fixed-fixed beam with point load at midspan', () => {
    const m = base();
    const L = 8;
    const P = 20;
    joint(m, 1, 0, 0, 0, [...FIXED] as Restraint);
    joint(m, 2, L, 0, 0, [...FIXED] as Restraint);
    frame(m, 1, 1, 2);
    m.framePointLoads.push({ case: 'DEAD', frame: 1, dir: 'GRAV', P, rd: 0.5 });
    const r = analyze(m);
    const fr = r.frames[0];
    close(fr.M3[0], (-P * L) / 8, 1e-9);
    const mid = fr.x.findIndex((x) => Math.abs(x - L / 2) < 1e-9);
    close(fr.M3[mid], (P * L) / 8, 1e-9);
    close(fr.disp[mid][2], -(P * L ** 3) / (192 * E * I33), 5e-3);
  });

  it('portal frame with lateral load: equilibrium and antisymmetry', () => {
    const m = base();
    const H = 4;
    const B = 6;
    joint(m, 1, 0, 0, 0, [...FIXED] as Restraint);
    joint(m, 2, 0, 0, H);
    joint(m, 3, B, 0, H);
    joint(m, 4, B, 0, 0, [...FIXED] as Restraint);
    frame(m, 1, 1, 2);
    frame(m, 2, 2, 3);
    frame(m, 3, 4, 3);
    m.jointLoads.push({ case: 'DEAD', joint: 2, f: [10, 0, 0, 0, 0, 0] });
    const r = analyze(m);
    close(r.reactions[1][0] + r.reactions[4][0], -10);
    close(r.reactions[1][2], -r.reactions[4][2]);
    close(r.disp[2][0], r.disp[3][0], 0.05); // differs only by beam axial shortening
  });

  it('3D space frame with area load balances total load', () => {
    const m = base();
    m.settings.selfWeight = true;
    const H = 3;
    let id = 1;
    for (const [x, y] of [
      [0, 0],
      [5, 0],
      [5, 4],
      [0, 4],
    ]) {
      joint(m, id, x, y, 0, [...FIXED] as Restraint);
      joint(m, id + 4, x, y, H);
      frame(m, id, id, id + 4);
      id++;
    }
    frame(m, 5, 5, 6);
    frame(m, 6, 6, 7);
    frame(m, 7, 7, 8);
    frame(m, 8, 8, 5);
    m.areas.push({ id: 1, joints: [5, 6, 7, 8], distribution: 'two-way' });
    m.areaLoads.push({ case: 'DEAD', area: 1, q: 5 });
    m.frameUniformLoads.push({ case: 'DEAD', frame: 5, dir: 'GY', w: 2 });
    const r = analyze(m);
    const sw = 78.5 * A * (4 * H + 2 * 5 + 2 * 4);
    const total = 5 * 20 + sw;
    close(r.stats.sumLoad[2], -total, 1e-9);
    close(r.stats.sumReaction[2], total, 1e-9);
    close(r.stats.sumReaction[1], -2 * 5, 1e-9);
    expect(r.warnings).toEqual([]);
  });

  it('one-way area load goes to the long edges only', () => {
    const m = base();
    joint(m, 1, 0, 0, 0, [...FIXED] as Restraint);
    joint(m, 2, 8, 0, 0, [...FIXED] as Restraint);
    joint(m, 3, 8, 2, 0, [...FIXED] as Restraint);
    joint(m, 4, 0, 2, 0, [...FIXED] as Restraint);
    frame(m, 1, 1, 2);
    frame(m, 2, 2, 3);
    frame(m, 3, 3, 4);
    frame(m, 4, 4, 1);
    m.areas.push({ id: 1, joints: [1, 2, 3, 4], distribution: 'one-way' });
    m.areaLoads.push({ case: 'DEAD', area: 1, q: 3 });
    const r = analyze(m);
    const shortFrame = r.frames.find((f) => f.id === 2)!;
    expect(shortFrame.loads.dists.length).toBe(0);
    const longFrame = r.frames.find((f) => f.id === 1)!;
    close(longFrame.loads.dists[0].w1, 3); // q * span/2 = 3 * 1
  });

  it('beta rotation swaps strong and weak axis', () => {
    const m = base();
    joint(m, 1, 0, 0, 0, [...FIXED] as Restraint);
    joint(m, 2, 2, 0, 0);
    frame(m, 1, 1, 2, 90);
    m.jointLoads.push({ case: 'DEAD', joint: 2, f: [0, 0, -1, 0, 0, 0] });
    const r = analyze(m);
    close(r.disp[2][2], -(2 ** 3) / (3 * E * I22));
  });

  it('detects mechanisms', () => {
    const m = base();
    joint(m, 1, 0, 0, 0, [true, true, true, false, false, false]);
    joint(m, 2, 3, 0, 0);
    frame(m, 1, 1, 2);
    expect(() => analyze(m)).toThrow(SolverError);
  });

  it('vertical member local axes and gravity', () => {
    const m = base();
    joint(m, 1, 0, 0, 0, [...FIXED] as Restraint);
    joint(m, 2, 0, 0, 5);
    frame(m, 1, 1, 2);
    m.jointLoads.push({ case: 'DEAD', joint: 2, f: [0, 0, -100, 0, 0, 0] });
    const r = analyze(m);
    close(r.disp[2][2], (-100 * 5) / (E * A));
    close(r.frames[0].P[3], -100);
  });
});

describe('section properties', () => {
  it('rectangle', () => {
    const p = sectionProps({ name: 'r', shape: 'rect', dims: [0.5, 0.3] });
    close(p.A, 0.15);
    close(p.I33, (0.3 * 0.5 ** 3) / 12);
    close(p.I22, (0.5 * 0.3 ** 3) / 12);
  });
  it('I section', () => {
    const p = sectionProps({ name: 'i', shape: 'I', dims: [0.3, 0.15, 0.009, 0.0065] });
    close(p.A, 2 * 0.15 * 0.009 + 0.282 * 0.0065);
    close(p.As2, 0.3 * 0.0065);
    close(p.As3, (5 / 3) * 0.15 * 0.009);
  });
  it('shear areas', () => {
    const r = sectionProps({ name: 'r', shape: 'rect', dims: [0.5, 0.3] });
    close(r.As2, (5 / 6) * 0.15);
    close(r.As3, (5 / 6) * 0.15);
    const b = sectionProps({ name: 'b', shape: 'box', dims: [0.4, 0.2, 0.01, 0.008] });
    close(b.As2, 2 * 0.4 * 0.008);
    close(b.As3, 2 * 0.2 * 0.01);
    const u = sectionProps({ name: 'u', shape: 'unp', dims: [0.2, 0.075, 0.0115, 0.0085] });
    close(u.As2, 0.2 * 0.0085);
    close(u.As3, (5 / 3) * 0.075 * 0.0115);
    const g = sectionProps({ name: 'g', shape: 'general', dims: [A, I33, I22, J] });
    expect(g.As2).toBe(0);
    expect(g.As3).toBe(0);
  });
});

describe('shear deformation (Timoshenko)', () => {
  // deep rectangle so that shear deflection is significant
  const h = 0.6;
  const bw = 0.3;
  const G = E / (2 * 1.3);
  const Ar = h * bw;
  const As = (5 / 6) * Ar;
  const Imaj = (bw * h ** 3) / 12;
  const Imin = (h * bw ** 3) / 12;
  function rectModel(): ModelData {
    const m = base();
    m.sections = [{ name: 'S', shape: 'rect', dims: [h, bw] }];
    return m;
  }

  it('cantilever tip load, major and minor plane: δ = PL³/3EI + PL/GAs', () => {
    const m = rectModel();
    const L = 3;
    const P = 50;
    joint(m, 1, 0, 0, 0, [...FIXED] as Restraint);
    joint(m, 2, L, 0, 0);
    frame(m, 1, 1, 2);
    m.jointLoads.push({ case: 'DEAD', joint: 2, f: [0, P, -P, 0, 0, 0] });
    const r = analyze(m);
    close(r.disp[2][2], -((P * L ** 3) / (3 * E * Imaj) + (P * L) / (G * As)));
    close(r.disp[2][1], (P * L ** 3) / (3 * E * Imin) + (P * L) / (G * As));
    close(Math.abs(r.reactions[1][4]), P * L); // moments unchanged by shear flexibility
    const fr = r.frames[0];
    const mid = fr.x.findIndex((x) => Math.abs(x - L / 2) < 1e-9);
    const x = L / 2;
    close(fr.disp[mid][2], -((P * x * x * (3 * L - x)) / (6 * E * Imaj) + (P * x) / (G * As)), 2e-3);
  });

  it('simply supported UDL: midspan 5wL⁴/384EI + wL²/8GAs', () => {
    const m = rectModel();
    const L = 4;
    const w = 30;
    joint(m, 1, 0, 0, 0, [true, true, true, true, false, false]);
    joint(m, 2, L, 0, 0, [false, true, true, false, false, false]);
    frame(m, 1, 1, 2);
    m.frameUniformLoads.push({ case: 'DEAD', frame: 1, dir: 'GRAV', w });
    const fr = analyze(m).frames[0];
    const mid = fr.x.findIndex((x) => Math.abs(x - L / 2) < 1e-9);
    close(fr.M3[mid], (w * L * L) / 8, 1e-9);
    close(fr.disp[mid][2], -((5 * w * L ** 4) / (384 * E * Imaj) + (w * L * L) / (8 * G * As)), 2e-3);
  });

  it('fixed-fixed UDL: end moments wL²/12, midspan wL⁴/384EI + wL²/8GAs', () => {
    const m = rectModel();
    const L = 4;
    const w = 30;
    joint(m, 1, 0, 0, 0, [...FIXED] as Restraint);
    joint(m, 2, L, 0, 0, [...FIXED] as Restraint);
    frame(m, 1, 1, 2);
    m.frameUniformLoads.push({ case: 'DEAD', frame: 1, dir: 'GRAV', w });
    const fr = analyze(m).frames[0];
    close(fr.M3[0], (-w * L * L) / 12, 1e-9);
    const mid = fr.x.findIndex((x) => Math.abs(x - L / 2) < 1e-9);
    close(fr.disp[mid][2], -((w * L ** 4) / (384 * E * Imaj) + (w * L * L) / (8 * G * As)), 5e-3);
  });

  it('off-centre member point load matches a joint load on a split member', () => {
    const L = 5;
    const a = 1.5;
    const P = 40;
    const m1 = rectModel();
    joint(m1, 1, 0, 0, 0, [...FIXED] as Restraint);
    joint(m1, 2, L, 0, 0, [...FIXED] as Restraint);
    frame(m1, 1, 1, 2);
    m1.framePointLoads.push({ case: 'DEAD', frame: 1, dir: 'GRAV', P, rd: a / L });
    m1.framePointLoads.push({ case: 'DEAD', frame: 1, dir: 'GY', P, rd: a / L });
    const r1 = analyze(m1);

    const m2 = rectModel();
    joint(m2, 1, 0, 0, 0, [...FIXED] as Restraint);
    joint(m2, 3, a, 0, 0);
    joint(m2, 2, L, 0, 0, [...FIXED] as Restraint);
    frame(m2, 1, 1, 3);
    frame(m2, 2, 3, 2);
    m2.jointLoads.push({ case: 'DEAD', joint: 3, f: [0, P, -P, 0, 0, 0] });
    const r2 = analyze(m2);

    for (const jid of [1, 2]) for (let k = 0; k < 6; k++) close(r1.reactions[jid][k], r2.reactions[jid][k], 1e-9);
    const fr = r1.frames[0];
    const at = fr.x.findIndex((x) => Math.abs(x - a) < 1e-9);
    close(fr.disp[at][2], r2.disp[3][2], 5e-3);
    close(fr.disp[at][1], r2.disp[3][1], 5e-3);
  });
});

describe('load cases and combinations', () => {
  function beam(): ModelData {
    const m = base();
    m.settings.selfWeight = false;
    joint(m, 1, 0, 0, 0, [true, true, true, true, false, false]);
    joint(m, 2, 6, 0, 0, [false, true, true, false, false, false]);
    frame(m, 1, 1, 2);
    m.frameUniformLoads.push({ case: 'DEAD', frame: 1, dir: 'GZ', w: -3 });
    m.framePointLoads.push({ case: 'LIVE', frame: 1, dir: 'GZ', P: -10, rd: 0.5 });
    return m;
  }

  it('analyses each case separately and combines by superposition', () => {
    const m = beam();
    m.loadCombos = [{ name: 'C1', factors: [{ case: 'DEAD', factor: 1.2 }, { case: 'LIVE', factor: 1.6 }] }];
    const set = analyzeAll(m);
    expect(set.items).toEqual([
      { name: 'DEAD', kind: 'case' },
      { name: 'LIVE', kind: 'case' },
      { name: 'C1', kind: 'combo' },
    ]);
    const D = set.results.DEAD;
    const Lv = set.results.LIVE;
    const C = set.results.C1;
    close(D.reactions[1][2], 9);
    close(Lv.reactions[1][2], 5);
    close(C.reactions[1][2], 1.2 * 9 + 1.6 * 5);
    close(C.disp[2][4], 1.2 * D.disp[2][4] + 1.6 * Lv.disp[2][4]);
    const mid = (r: typeof D) => sampleAt(r.frames[0].x, r.frames[0].M3, 3).left;
    close(mid(C), 1.2 * mid(D) + 1.6 * mid(Lv));
    close(Math.abs(mid(D)), (3 * 36) / 8);
    close(Math.abs(mid(Lv)), (10 * 6) / 4);
  });

  it('adds self weight to the first Dead case only', () => {
    const m = beam();
    m.frameUniformLoads = [];
    m.framePointLoads = [];
    m.settings.selfWeight = true;
    const set = analyzeAll(m);
    close(set.results.DEAD.reactions[1][2] + set.results.DEAD.reactions[2][2], 78.5 * A * 6);
    close(set.results.LIVE.reactions[1][2], 0);
  });
});

describe('diagram helpers', () => {
  it('interpolates and reports both sides of a jump', () => {
    const xs = [0, 1, 1, 2];
    const ys = [0, 4, -6, 0];
    expect(sampleAt(xs, ys, 0.5)).toEqual({ left: 2, right: 2 });
    expect(sampleAt(xs, ys, 1)).toEqual({ left: 4, right: -6 });
    expect(sampleAt(xs, ys, 1.5).left).toBeCloseTo(-3, 12);
    expect(sampleAt(xs, ys, 2)).toEqual({ left: 0, right: 0 });
  });

  it('chord-relative deflection removes support settlement', () => {
    const m = base();
    joint(m, 1, 0, 0, 0, [true, true, true, true, false, false]);
    joint(m, 2, 4, 0, 0, [false, true, false, false, false, false]);
    joint(m, 3, 4, 0, -1, [true, true, true, true, true, true]);
    frame(m, 1, 1, 2);
    frame(m, 2, 2, 3);
    m.frameUniformLoads.push({ case: 'DEAD', frame: 1, dir: 'GZ', w: -5 });
    const fr = analyze(m).frames.find((f) => f.id === 1)!;
    const abs = localDeflection(fr, 1, false);
    const rel = localDeflection(fr, 1, true);
    close(rel[0], 0);
    close(rel[rel.length - 1], 0);
    expect(Math.abs(abs[abs.length - 1])).toBeGreaterThan(0);
  });
});