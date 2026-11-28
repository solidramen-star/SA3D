import type { App } from './app';
import type { FrameResult } from '../solver/analyze';
import { localDeflection, sampleAt } from '../solver/diagram';
import { fmt, fmtU, uLabel, units, type Qty } from '../model/units';
import { h } from './dom';

export type DiagramView = 'axial' | 'major' | 'minor';

interface Series {
  title: string;
  ys: number[];
  /** Display-unit conversion + label. */
  conv: (v: number) => string;
  unit: string;
  reversed?: boolean;
}

const SVG = 'http://www.w3.org/2000/svg';
const W = 360;
const H = 96;
const PAD_X = 14;
const PAD_Y = 14;

function svg<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}

interface State {
  app: App;
  frameId: number;
  caseName: string;
  view: DiagramView;
  relative: boolean;
  cursor: number | null; // x position along member (m)
  el: HTMLElement;
  body: HTMLElement;
}

let st: State | null = null;
let lastView: DiagramView = 'major';
let lastRelative = false;

const qSeries = (title: string, ys: number[], q: Qty): Series => ({ title, ys, conv: (v) => fmtU(v, q), unit: uLabel(q) });

function series(fr: FrameResult, view: DiagramView, relative: boolean): Series[] {
  const u = units();
  const defl = (axis: 1 | 2, name: string): Series => ({
    title: `Deflection ${name}${relative ? ' (relative to chord)' : ''}`,
    ys: localDeflection(fr, axis, relative),
    conv: (v) => fmt(v / u.kSmall),
    unit: u.small,
  });
  if (view === 'axial') return [qSeries('Axial force P', fr.P, 'F'), qSeries('Torsion T', fr.T, 'M')];
  if (view === 'major')
    return [
      qSeries('Shear V2', fr.V2, 'F'),
      { ...qSeries('Moment M3', fr.M3, 'M'), reversed: true },
      defl(1, 'δ2 (local 2)'),
    ];
  return [
    qSeries('Shear V3', fr.V3, 'F'),
    { ...qSeries('Moment M2', fr.M2, 'M'), reversed: true },
    defl(2, 'δ3 (local 3)'),
  ];
}

interface Plot {
  el: HTMLElement;
  setCursor: (cursor: number | null) => void;
}

function plot(fr: FrameResult, s: Series, onPick: (x: number) => void): Plot {
  const xs = fr.x;
  const L = fr.L || 1;
  let lo = Math.min(0, ...s.ys);
  let hi = Math.max(0, ...s.ys);
  if (hi - lo < 1e-12) {
    lo = -1;
    hi = 1;
  }
  const px = (x: number) => PAD_X + ((W - 2 * PAD_X) * x) / L;
  const py = (y: number) =>
    s.reversed
      ? PAD_Y + ((H - 2 * PAD_Y) * (y - lo)) / (hi - lo)
      : PAD_Y + ((H - 2 * PAD_Y) * (hi - y)) / (hi - lo);
  const root = svg('svg', { viewBox: `0 0 ${W} ${H}`, class: 'fd-svg', preserveAspectRatio: 'none' });

  const gid = 'fdg_' + Math.random().toString(36).slice(2, 9);
  const zeroY = py(0);
  const zeroPct = Math.min(Math.max((zeroY / H) * 100, 0), 100).toFixed(2);
  const cTop = s.reversed ? 'var(--neg)' : 'var(--pos)';
  const cBot = s.reversed ? 'var(--pos)' : 'var(--neg)';

  const defs = svg('defs', {});
  // userSpaceOnUse so the zero-line stop is measured against the full plot height, not the shape's bbox.
  const gradFill = svg('linearGradient', { id: `${gid}_f`, gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 0, y2: H });
  gradFill.append(
    svg('stop', { offset: '0%', 'stop-color': cTop, 'stop-opacity': 0.35 }),
    svg('stop', { offset: `${zeroPct}%`, 'stop-color': cTop, 'stop-opacity': 0.35 }),
    svg('stop', { offset: `${zeroPct}%`, 'stop-color': cBot, 'stop-opacity': 0.35 }),
    svg('stop', { offset: '100%', 'stop-color': cBot, 'stop-opacity': 0.35 }),
  );
  const gradLine = svg('linearGradient', { id: `${gid}_l`, gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 0, y2: H });
  gradLine.append(
    svg('stop', { offset: '0%', 'stop-color': cTop, 'stop-opacity': 1 }),
    svg('stop', { offset: `${zeroPct}%`, 'stop-color': cTop, 'stop-opacity': 1 }),
    svg('stop', { offset: `${zeroPct}%`, 'stop-color': cBot, 'stop-opacity': 1 }),
    svg('stop', { offset: '100%', 'stop-color': cBot, 'stop-opacity': 1 }),
  );
  defs.append(gradFill, gradLine);
  root.append(defs);

  const pts = xs.map((x, k) => `${px(x).toFixed(2)},${py(s.ys[k]).toFixed(2)}`);
  root.append(
    svg('polygon', { points: `${px(0)},${py(0)} ${pts.join(' ')} ${px(L)},${py(0)}`, class: 'fd-fill', fill: `url(#${gid}_f)` }),
    svg('line', { x1: px(0), y1: py(0), x2: px(L), y2: py(0), class: 'fd-axis' }),
    svg('polyline', { points: pts.join(' '), class: 'fd-line', stroke: `url(#${gid}_l)` }),
  );
  // Label the extreme values.
  let iMax = 0;
  let iMin = 0;
  s.ys.forEach((y, k) => {
    if (y > s.ys[iMax]) iMax = k;
    if (y < s.ys[iMin]) iMin = k;
  });
  const lbl = (k: number, above: boolean) => {
    if (Math.abs(s.ys[k]) < 1e-12) return;
    const x = Math.min(Math.max(px(xs[k]), 30), W - 30);
    const t = svg('text', { x, y: py(s.ys[k]) + (above ? -3 : 11), class: 'fd-val', 'text-anchor': 'middle' });
    t.textContent = s.conv(s.ys[k]);
    root.append(t);
  };
  lbl(iMax, !s.reversed);
  if (iMin !== iMax) lbl(iMin, !!s.reversed);
  const cur = svg('line', { x1: 0, y1: 2, x2: 0, y2: H - 2, class: 'fd-cursor', visibility: 'hidden' });
  root.append(cur);
  const pick = (e: PointerEvent) => {
    const r = root.getBoundingClientRect();
    const sx = ((e.clientX - r.left) / r.width) * W;
    onPick(Math.min(Math.max(((sx - PAD_X) / (W - 2 * PAD_X)) * L, 0), L));
  };
  root.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    root.setPointerCapture(e.pointerId);
    pick(e);
    const move = (ev: PointerEvent) => pick(ev);
    const up = () => {
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerup', up);
      root.removeEventListener('pointercancel', up);
    };
    root.addEventListener('pointermove', move);
    root.addEventListener('pointerup', up);
    root.addEventListener('pointercancel', up);
  });
  const readoutEl = h('span', { class: 'fd-readout' });
  // Updates the cursor in place so a drag keeps its pointer capture on `root`.
  const setCursor = (cursor: number | null) => {
    let readout = '';
    let readoutColor = '';
    if (cursor === null) cur.setAttribute('visibility', 'hidden');
    else {
      cur.setAttribute('x1', String(px(cursor)));
      cur.setAttribute('x2', String(px(cursor)));
      cur.removeAttribute('visibility');
      const v = sampleAt(xs, s.ys, cursor);
      const val = Math.abs(v.left) >= Math.abs(v.right) ? v.left : v.right;
      if (Math.abs(val) > 1e-12) {
        readoutColor = val > 0 ? 'var(--pos)' : 'var(--neg)';
      }
      readout = Math.abs(v.left - v.right) > 1e-9 * Math.max(1, Math.abs(v.left), Math.abs(v.right))
        ? `${s.conv(v.left)} / ${s.conv(v.right)} ${s.unit} (left / right)`
        : `${s.conv(v.left)} ${s.unit}`;
    }
    readoutEl.textContent = readout;
    readoutEl.style.color = readoutColor;
  };
  const el = h(
    'div',
    { class: 'fd-plot' },
    h('div', { class: 'fd-plot-head' }, h('span', { class: 'fd-plot-title' }, `${s.title} [${s.unit}]`), readoutEl),
    root,
  );
  return { el, setCursor };
}

function render(): void {
  if (!st) return;
  const s = st;
  const set = s.app.resultSet;
  if (!set) return closeFrameDiagrams();
  if (!set.results[s.caseName]) s.caseName = s.app.resultName;
  const fr = set.results[s.caseName]?.frames.find((f) => f.id === s.frameId);
  if (!fr) return closeFrameDiagrams();
  if (s.cursor !== null) s.cursor = Math.min(s.cursor, fr.L);

  const caseSel = h(
    'select',
    { class: 'fd-case', 'aria-label': 'Load case or combination' },
    ...set.items.map((it) => h('option', { value: it.name }, `${it.kind === 'combo' ? 'Combo' : 'Case'}: ${it.name}`)),
  ) as HTMLSelectElement;
  caseSel.value = s.caseName;
  caseSel.addEventListener('change', () => {
    s.caseName = caseSel.value;
    render();
  });
  const viewSel = h(
    'select',
    { class: 'fd-view', 'aria-label': 'Diagram' },
    h('option', { value: 'axial' }, 'Axial P & torsion T'),
    h('option', { value: 'major' }, 'Major: V2, M3, deflection'),
    h('option', { value: 'minor' }, 'Minor: V3, M2, deflection'),
  ) as HTMLSelectElement;
  viewSel.value = s.view;
  viewSel.addEventListener('change', () => {
    s.view = lastView = viewSel.value as DiagramView;
    render();
  });
  const controls = h('div', { class: 'fd-controls' }, caseSel, viewSel);
  if (s.view !== 'axial') {
    const rel = h('select', { class: 'fd-rel', 'aria-label': 'Deflection reference' }, h('option', { value: 'abs' }, 'Absolute deflection'), h('option', { value: 'rel' }, 'Relative to chord')) as HTMLSelectElement;
    rel.value = s.relative ? 'rel' : 'abs';
    rel.addEventListener('change', () => {
      s.relative = lastRelative = rel.value === 'rel';
      render();
    });
    controls.append(rel);
  }
  const posEl = h('div', { class: 'fd-pos muted small' });
  const sync = () => {
    posEl.textContent =
      s.cursor === null ? 'Tap or drag on a diagram to read values.' : `x = ${fmtU(s.cursor, 'L')} ${uLabel('L')} from joint i (L = ${fmtU(fr.L, 'L')} ${uLabel('L')})`;
    for (const p of plots) p.setCursor(s.cursor);
  };
  const pick = (x: number) => {
    s.cursor = x;
    sync();
  };
  const plots = series(fr, s.view, s.relative).map((ser) => plot(fr, ser, pick));
  sync();
  s.body.replaceChildren(controls, posEl, ...plots.map((p) => p.el));
  (s.el.querySelector('.fd-title') as HTMLElement).textContent = `Frame ${s.frameId} diagrams`;
}

function makeDraggable(panel: HTMLElement, handle: HTMLElement): void {
  handle.addEventListener('pointerdown', (e) => {
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    const r = panel.getBoundingClientRect();
    const ox = e.clientX - r.left;
    const oy = e.clientY - r.top;
    handle.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => {
      const left = Math.min(Math.max(ev.clientX - ox, 0), window.innerWidth - 60);
      const top = Math.min(Math.max(ev.clientY - oy, 0), window.innerHeight - 40);
      panel.style.left = `${left}px`;
      panel.style.top = `${top}px`;
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
    };
    const up = () => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', up);
      handle.removeEventListener('pointercancel', up);
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', up);
    handle.addEventListener('pointercancel', up);
  });
}

/** Opens (or retargets) the non-modal frame diagrams panel. */
export function frameDiagramsDialog(app: App, frameId: number): void {
  if (!app.resultSet) return;
  if (st) {
    st.frameId = frameId;
    st.cursor = null;
    st.caseName = app.resultName;
    render();
    return;
  }
  const body = h('div', { class: 'fd-body' });
  const close = h('button', { class: 'fd-close', 'aria-label': 'Close diagrams', title: 'Close' }, '✕');
  const head = h('div', { class: 'fd-head' }, h('span', { class: 'fd-title' }), close);
  const el = h('div', { class: 'frame-diagrams', role: 'dialog', 'aria-label': 'Frame diagrams' }, head, body);
  for (const ev of ['contextmenu', 'selectstart', 'dragstart'] as const) el.addEventListener(ev, (e) => e.preventDefault());
  // Keep canvas gestures and shortcuts from reacting to interaction inside the panel.
  el.addEventListener('pointerdown', (e) => e.stopPropagation());
  el.addEventListener('wheel', (e) => e.stopPropagation());
  close.addEventListener('click', () => closeFrameDiagrams());
  makeDraggable(el, head);
  document.body.append(el);
  st = { app, frameId, caseName: app.resultName, view: lastView, relative: lastRelative, cursor: null, el, body };
  render();
}

export function closeFrameDiagrams(): void {
  st?.el.remove();
  st = null;
}

/** Re-render after model/result/unit changes; closes the panel if its frame or results vanished. */
export function refreshFrameDiagrams(app: App): void {
  if (!st) return;
  st.app = app;
  render();
}
