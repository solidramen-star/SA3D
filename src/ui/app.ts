import type { Vector3 } from 'three';
import { Model } from '../model/model';
import { DEAD, defaultModel, FIXED, LIVE, type ModelData, type Restraint, type WorkPlane } from '../model/types';
import { DARK, FORCE_VIEWS, LIGHT, Viewer, fmt, parseKey, selKey, type DisplayOptions, type ResultView, type SelKey } from '../view/viewer';
import { Gestures } from '../input/gestures';
import { TOOL_HINT, ToolController, type ToolName } from '../input/tools';
import type { ResultSet, Results } from '../solver/analyze';
import { runAnalysis } from '../solver/client';
import { readSav, writeSav, SavError, type SavInfo } from '../io/savFormat';
import { autosave, clearAutosave, loadAutosave, openText, saveText, type FsFileHandle } from '../io/fileAccess';
import { alertDialog, closeMenus, confirmDialog, dialogOpen, h, isMenuOpenFor, showMenu, toast, type MenuItem } from './dom';
import * as D from './dialogs';
import { renderInspector } from './inspector';
import { UNIT_SYSTEMS, fmtU, onUnitsChange, setUnits, uLabel, units, type UnitSystemId } from '../model/units';

type SelectMode = 'replace' | 'add' | 'toggle';

/** Global axis normal to each work plane (the axis the plane offset is measured along). */
const PLANE_AXIS: Record<WorkPlane, 'X' | 'Y' | 'Z'> = { XY: 'Z', XZ: 'Y', YZ: 'X' };

const RESULT_VIEWS: [ResultView, string][] = [
  ['none', 'Undeformed'],
  ['deformed', 'Deformed shape'],
  ['P', 'Axial P'],
  ['V2', 'Shear V2'],
  ['V3', 'Shear V3'],
  ['T', 'Torsion T'],
  ['M2', 'Moment M2'],
  ['M3', 'Moment M3'],
  ['reactions', 'Support reactions'],
];

const ICON: Record<string, string> = {
  select: '<path d="M5 3l14 8-6 2-3 6z"/>',
  joint: '<circle cx="12" cy="12" r="4"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>',
  frame: '<circle cx="5" cy="19" r="2.2"/><circle cx="19" cy="5" r="2.2"/><path d="M6.5 17.5l11-11"/>',
  area: '<path d="M4 18l4-12h12l-4 12z" fill="currentColor" fill-opacity=".25"/>',
  box: '<rect x="4" y="5" width="16" height="14" rx="1" stroke-dasharray="3 2"/>',
  multi: '<rect x="3" y="7" width="11" height="11" rx="2"/><path d="M10 4h8a2 2 0 0 1 2 2v8"/>',
  done: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  fit: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  undo: '<path d="M9 7L4 12l5 5"/><path d="M4 12h10a6 6 0 0 1 0 12"/>',
  redo: '<path d="M15 7l5 5-5 5"/><path d="M20 12H10a6 6 0 0 0 0 12"/>',
  del: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  plane: '<path d="M3 15l6-5h12l-6 5z" fill="currentColor" fill-opacity=".2"/><path d="M17 4a5 5 0 0 1 3 4.5M20 8.5l.2-2.6M20 8.5l-2.5-.7"/>',
  planeUp: '<path d="M3 19l5-4h13l-5 4z" fill="currentColor" fill-opacity=".2"/><path d="M12 12V3M8.5 6.5L12 3l3.5 3.5"/>',
  planeDown: '<path d="M3 19l5-4h13l-5 4z" fill="currentColor" fill-opacity=".2"/><path d="M12 3v9M8.5 8.5L12 12l3.5-3.5"/>',
  run: '<path d="M7 4l13 8-13 8z" fill="currentColor"/>',
  panel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/>',
};
const svgIcon = (name: string) => {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('class', 'ico');
  s.innerHTML = ICON[name];
  return s;
};

export class App {
  readonly model = new Model();
  readonly viewer: Viewer;
  readonly tools: ToolController;
  selection = new Set<SelKey>();
  /** All load case / combination results of the last analysis. */
  resultSet: ResultSet | null = null;
  /** Case or combination currently displayed. */
  resultName = '';
  /** Last load case used in a load dialog. */
  lastLoadCase = '';
  /** Results of the displayed case or combination. */
  get results(): Results | null {
    return this.resultSet?.results[this.resultName] ?? null;
  }
  fileName = 'Untitled.sav';
  fileHandle: FsFileHandle | null = null;
  dirty = false;
  includeResults = true;
  /** log10 of deformation scale relative to the automatic scale. */
  deformRel = 0;
  forceRel = 0;
  theme: 'dark' | 'light' = 'light';
  busy = false;

  private root: HTMLElement;
  private viewport!: HTMLElement;
  private panel!: HTMLElement;
  private panelBody!: HTMLElement;
  private statusEl!: HTMLElement;
  private coordEl!: HTMLElement;
  private unitsEl!: HTMLSelectElement;
  private fileEl!: HTMLElement;
  private hintEl!: HTMLElement;
  private resultsBar!: HTMLElement;
  private toolButtons = new Map<string, HTMLButtonElement>();
  private autosaveTimer = 0;
  private suppressDirty = false;
  private rb!: {
    rcase: HTMLSelectElement;
    view: HTMLSelectElement;
    slider: HTMLInputElement;
    scale: HTMLInputElement;
    forceSlider: HTMLInputElement;
    animate: HTMLInputElement;
    values: HTMLInputElement;
    deformGroup: HTMLElement;
    forceGroup: HTMLElement;
  };

  constructor(root: HTMLElement) {
    this.root = root;
    const saved = localStorage.getItem('structapp.theme');
    if (saved === 'light' || saved === 'dark') this.theme = saved;
    this.buildLayout();
    this.viewer = new Viewer(this.viewport);
    this.tools = new ToolController(this);
    this.applyTheme();
    new Gestures(this.viewer.canvas, {
      tap: (x, y, e) => this.tools.tap(x, y, e),
      longPress: (x, y) => this.contextMenu(x, y),
      hover: (x, y, e) => this.tools.hover(x, y, e),
      orbit: (dx, dy) => this.viewer.orbit(dx, dy),
      pan: (dx, dy) => this.viewer.pan(dx, dy),
      zoom: (f, x, y) => this.viewer.zoom(f, x, y),
      wantsBox: (e) => this.tools.wantsBox(e),
      box: (x0, y0, x1, y1, phase) => this.tools.box(x0, y0, x1, y1, phase),
      wantsDrag: (x, y, e) => this.tools.wantsDrag(x, y, e),
      drag: (x, y, phase) => this.tools.drag(x, y, phase),
    });
    this.model.onChange((reason) => this.onModelChange(reason));
    this.installKeyboard();
    window.addEventListener('beforeunload', (e) => {
      if (this.dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
    this.refresh();
    this.viewer.fit();
    this.onToolChanged();
    void this.offerRecovery();
  }

  // ================================================================ layout
  private buildLayout(): void {
    const menus: [string, () => MenuItem[]][] = [
      ['File', () => this.fileMenu()],
      ['Edit', () => this.editMenu()],
      ['Define', () => this.defineMenu()],
      ['Draw', () => this.drawMenu()],
      ['Assign', () => this.assignMenu()],
      ['Loads', () => this.loadsMenu()],
      ['Analyze', () => this.analyzeMenu()],
      ['Display', () => this.displayMenu()],
      ['Help', () => this.helpMenu()],
    ];
    const menuBtns = menus.map(([label, items]) => {
      const b = h('button', { class: 'menu-btn', type: 'button' }, label) as HTMLButtonElement;
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isMenuOpenFor(b)) return closeMenus();
        const r = b.getBoundingClientRect();
        showMenu(items(), r.left, r.bottom + 2, b);
      });
      return b;
    });
    this.fileEl = h('span', { class: 'file-name' });
    const runBtn = h('button', { class: 'btn primary run-btn', type: 'button', title: 'Run analysis (F5)', onclick: () => void this.analyze() }, svgIcon('run'), h('span', null, 'Run'));
    const panelBtn = h('button', { class: 'icon-btn', type: 'button', title: 'Show/hide properties panel', onclick: () => this.togglePanel() }, svgIcon('panel'));
    const header = h(
      'header',
      { class: 'menubar' },
      h('div', { class: 'brand' }, 'StructApp 3D'),
      h('nav', { class: 'menus' }, ...menuBtns),
      h('div', { class: 'spacer' }),
      this.fileEl,
      runBtn,
      panelBtn,
    );

    const tb = (id: string, label: string, title: string, fn: () => void) => {
      const b = h('button', { class: 'tool-btn', type: 'button', title, 'aria-label': title, onclick: fn }, svgIcon(id), h('span', null, label)) as HTMLButtonElement;
      this.toolButtons.set(id, b);
      return b;
    };
    const toolbar = h(
      'nav',
      { class: 'toolbar' },
      tb('select', 'Select', 'Select (S)', () => this.tools.setTool('select')),
      tb('box', 'Box', 'Box/window select (B)', () => this.tools.setTool('box')),
      tb('multi', 'Multi', 'Multi-select: taps add to selection (M)', () => {
        this.tools.multi = !this.tools.multi;
        this.onToolChanged();
      }),
      tb('done', 'Done', 'Finish frame chain / close area (Enter)', () => this.tools.finishChain(true)),
      h('div', { class: 'tb-sep' }),
      tb('joint', 'Joint', 'Draw joints (J)', () => this.tools.setTool('joint')),
      tb('frame', 'Frame', 'Draw frames (L)', () => this.tools.setTool('frame')),
      tb('area', 'Area', 'Draw areas (A)', () => this.tools.setTool('area')),
      h('div', { class: 'tb-sep' }),
      tb('fit', 'Fit', 'Zoom to fit (F)', () => this.viewer.fit()),
      tb('undo', 'Undo', 'Undo (Ctrl+Z)', () => this.undo()),
      tb('redo', 'Redo', 'Redo (Ctrl+Y)', () => this.redo()),
      tb('del', 'Delete', 'Delete selected (Del)', () => void this.deleteSelected()),
      h('div', { class: 'tb-sep' }),
      tb('plane', 'XY', 'Rotate work plane XY → XZ → YZ (P)', () => this.rotateWorkPlane()),
      tb('planeUp', 'Up', 'Shift work plane +1 grid spacing (PgUp)', () => this.shiftWorkPlane(1)),
      tb('planeDown', 'Down', 'Shift work plane −1 grid spacing (PgDn)', () => this.shiftWorkPlane(-1)),
    );

    this.viewport = h('div', { class: 'viewport' });
    this.hintEl = h('div', { class: 'tool-hint' });
    this.resultsBar = this.buildResultsBar();
    const vpWrap = h('div', { class: 'viewport-wrap' }, this.viewport, this.hintEl, this.resultsBar);
    // Keep the browser's own context menu / text selection / iOS callout away from the 3D view and its labels.
    const noNative = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t && (this.viewport.contains(t) || t === this.viewport)) e.preventDefault();
    };
    vpWrap.addEventListener('contextmenu', noNative, true);
    vpWrap.addEventListener('selectstart', noNative, true);
    vpWrap.addEventListener('dragstart', noNative, true);

    this.panelBody = h('div', { class: 'panel-body' });
    const grip = h('div', { class: 'sheet-grip', onclick: () => this.togglePanel() });
    this.panel = h(
      'aside',
      { class: 'panel' },
      grip,
      h('div', { class: 'panel-head' }, h('span', null, 'Properties'), h('button', { class: 'icon-btn small', type: 'button', title: 'Close', onclick: () => this.togglePanel(false) }, '✕')),
      this.panelBody,
    );
    if (localStorage.getItem('structapp.panel') === 'closed' || window.innerWidth < 700) this.panel.classList.add('collapsed');

    this.statusEl = h('span', { class: 'status-text' });
    this.coordEl = h('span', { class: 'coord' });
    this.unitsEl = h(
      'select',
      { class: 'units', title: 'Units for all input and output values', 'aria-label': 'Units' },
      h('optgroup', { label: 'Metric' }, ...UNIT_SYSTEMS.slice(0, 4).map((u) => h('option', { value: u.id }, u.label))),
      h('optgroup', { label: 'Imperial' }, ...UNIT_SYSTEMS.slice(4).map((u) => h('option', { value: u.id }, u.label))),
    ) as HTMLSelectElement;
    this.unitsEl.value = units().id;
    this.unitsEl.addEventListener('change', () => setUnits(this.unitsEl.value as UnitSystemId));
    onUnitsChange(() => this.onUnitsChanged());
    const status = h('footer', { class: 'statusbar' }, this.statusEl, h('div', { class: 'spacer' }), this.coordEl, this.unitsEl);

    this.root.replaceChildren(header, h('div', { class: 'main' }, toolbar, vpWrap, this.panel), status);
  }

  private buildResultsBar(): HTMLElement {
    const view = h('select', { class: 'rb-view', 'aria-label': 'Result display' }, ...RESULT_VIEWS.map(([v, l]) => h('option', { value: v }, l))) as HTMLSelectElement;
    view.addEventListener('change', () => this.setResultView(view.value as ResultView));
    const slider = h('input', { type: 'range', min: '-3', max: '3', step: '0.05', value: '0', 'aria-label': 'Deformation scale' }) as HTMLInputElement;
    slider.addEventListener('input', () => {
      this.deformRel = Number(slider.value);
      this.applyDeformScale();
    });
    const scale = h('input', { type: 'text', inputmode: 'decimal', class: 'rb-scale', 'aria-label': 'Deformation scale factor' }) as HTMLInputElement;
    scale.addEventListener('change', () => {
      const v = Number(scale.value.replace(',', '.'));
      if (!(v > 0) || !Number.isFinite(v)) {
        toast('Scale must be a positive number', 'error');
        this.syncResultsBar();
        return;
      }
      this.deformRel = Math.log10(v / this.viewer.autoDeformScale);
      this.applyDeformScale(false);
    });
    const auto = h('button', { class: 'btn small', type: 'button', onclick: () => ((this.deformRel = 0), this.applyDeformScale()) }, 'Auto');
    const forceSlider = h('input', { type: 'range', min: '-1', max: '1', step: '0.05', value: '0', 'aria-label': 'Diagram scale' }) as HTMLInputElement;
    forceSlider.addEventListener('input', () => {
      this.forceRel = Number(forceSlider.value);
      this.viewer.setResultOptions({ forceScale: 10 ** this.forceRel });
    });
    const animate = h('input', { type: 'checkbox' }) as HTMLInputElement;
    animate.addEventListener('change', () => this.viewer.setResultOptions({ animate: animate.checked }));
    const values = h('input', { type: 'checkbox', checked: true }) as HTMLInputElement;
    values.addEventListener('change', () => this.viewer.setResultOptions({ showValues: values.checked }));
    const deformGroup = h('div', { class: 'rb-group' }, h('label', null, 'Scale'), slider, scale, auto, h('label', { class: 'check' }, animate, h('span', null, 'Animate')));
    const forceGroup = h('div', { class: 'rb-group' }, h('label', null, 'Size'), forceSlider);
    const rcase = h('select', { class: 'rb-case', 'aria-label': 'Load case or combination' }) as HTMLSelectElement;
    rcase.addEventListener('change', () => this.setResultCase(rcase.value));
    this.rb = { rcase, view, slider, scale, forceSlider, animate, values, deformGroup, forceGroup };
    return h(
      'div',
      { class: 'results-bar', hidden: true },
      rcase,
      view,
      deformGroup,
      forceGroup,
      h('label', { class: 'check' }, values, h('span', null, 'Values')),
      h('button', { class: 'btn small', type: 'button', onclick: () => D.resultsTablesDialog(this) }, 'Tables'),
      h('button', { class: 'icon-btn small', type: 'button', title: 'Hide results', onclick: () => this.setResultView('none') }, '✕'),
    );
  }

  private applyDeformScale(syncSlider = true): void {
    this.viewer.setResultOptions({ deformScale: this.viewer.autoDeformScale * 10 ** this.deformRel });
    this.syncResultsBar(syncSlider);
  }

  private syncResultsBar(syncSlider = true): void {
    const r = this.rb;
    const v = this.viewer.resultOpts.view;
    const items = this.resultSet?.items ?? [];
    const sig = items.map((it) => it.kind + ':' + it.name).join('|');
    if (r.rcase.dataset.sig !== sig) {
      r.rcase.dataset.sig = sig;
      r.rcase.replaceChildren(...items.map((it) => h('option', { value: it.name }, (it.kind === 'combo' ? 'Combo: ' : 'Case: ') + it.name)));
    }
    r.rcase.value = this.resultName;
    r.view.value = v;
    if (syncSlider) r.slider.value = String(Math.max(-3, Math.min(3, this.deformRel)));
    r.scale.value = fmt(this.viewer.autoDeformScale * 10 ** this.deformRel, 4);
    r.forceSlider.value = String(this.forceRel);
    r.animate.checked = this.viewer.resultOpts.animate;
    r.values.checked = this.viewer.resultOpts.showValues;
    r.deformGroup.hidden = v === 'none' || v === 'reactions';
    r.forceGroup.hidden = !FORCE_VIEWS.includes(v) && v !== 'reactions';
    this.resultsBar.hidden = !this.results;
  }

  clearResults(refresh = true): void {
    this.resultSet = null;
    this.viewer.setResults(null);
    this.viewer.setResultOptions({ view: 'none', animate: false });
    D.closeFrameDiagrams();
    if (refresh) this.refresh();
  }

  /** Show the results of another load case or combination. */
  setResultCase(name: string): void {
    if (!this.resultSet?.results[name]) return;
    this.resultName = name;
    this.viewer.setResults(this.results);
    this.viewer.setResultOptions({ deformScale: this.viewer.autoDeformScale * 10 ** this.deformRel });
    this.refresh();
  }

  setResultView(v: ResultView): void {
    if (!this.results && v !== 'none') return void toast('Run the analysis first', 'warn');
    this.viewer.setResultOptions({ view: v, deformScale: this.viewer.autoDeformScale * 10 ** this.deformRel });
    this.syncResultsBar();
    this.viewer.requestRender();
  }

  togglePanel(open?: boolean): void {
    const collapsed = open === undefined ? !this.panel.classList.contains('collapsed') : !open;
    this.panel.classList.toggle('collapsed', collapsed);
    localStorage.setItem('structapp.panel', collapsed ? 'closed' : 'open');
  }

  private applyTheme(): void {
    document.documentElement.dataset.theme = this.theme;
    this.viewer.setTheme(this.theme === 'dark' ? DARK : LIGHT);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', this.theme === 'dark' ? '#0f172a' : '#f8fafc');
  }

  // ================================================================ state
  private onModelChange(reason: string): void {
    if (this.resultSet) this.clearResults(false);
    for (const k of [...this.selection]) {
      const { kind, id } = parseKey(k);
      const ok = kind === 'j' ? this.model.joint(id) : kind === 'f' ? this.model.frame(id) : this.model.area(id);
      if (!ok) this.selection.delete(k);
    }
    if (reason === 'load') this.tools.cancel();
    if (!this.suppressDirty) {
      this.dirty = true;
      this.scheduleAutosave();
    }
    this.refresh();
  }

  private scheduleAutosave(): void {
    clearTimeout(this.autosaveTimer);
    this.autosaveTimer = window.setTimeout(() => {
      try {
        autosave(writeSav(this.model.data), this.fileName);
      } catch {
        /* storage full or unavailable */
      }
    }, 1200);
  }

  private onUnitsChanged(): void {
    this.unitsEl.value = units().id;
    this.coordEl.textContent = '';
    this.viewer.rebuildAll();
    renderInspector(this, this.panelBody);
    this.updateStatus();
    D.refreshFrameDiagrams(this);
    // keep the autosaved copy in the units now shown
    if (this.dirty) this.scheduleAutosave();
    toast(`Units: ${units().label}`);
  }

  refresh(): void {
    this.viewer.setData(this.model.data, this.selection, this.results);
    renderInspector(this, this.panelBody);
    this.updateStatus();
    this.syncResultsBar();
    D.refreshFrameDiagrams(this);
  }

  select(keys: SelKey[], mode: SelectMode): void {
    if (mode === 'replace') this.selection = new Set(keys);
    else if (mode === 'add') for (const k of keys) this.selection.add(k);
    else for (const k of keys) this.selection.has(k) ? this.selection.delete(k) : this.selection.add(k);
    this.viewer.setData(this.model.data, this.selection, this.results);
    renderInspector(this, this.panelBody);
    if (this.selection.size && window.innerWidth >= 700 && localStorage.getItem('structapp.panel') !== 'closed') this.togglePanel(true);
    this.updateStatus();
  }

  selected(): { joints: number[]; frames: number[]; areas: number[] } {
    const out = { joints: [] as number[], frames: [] as number[], areas: [] as number[] };
    for (const k of this.selection) {
      const { kind, id } = parseKey(k);
      (kind === 'j' ? out.joints : kind === 'f' ? out.frames : out.areas).push(id);
    }
    for (const a of Object.values(out)) a.sort((x, y) => x - y);
    return out;
  }

  selectAll(): void {
    const d = this.model.data;
    this.select([...d.joints.map((j) => selKey('j', j.id)), ...d.frames.map((f) => selKey('f', f.id)), ...d.areas.map((a) => selKey('a', a.id))], 'replace');
  }

  onToolChanged(): void {
    for (const t of ['select', 'joint', 'frame', 'area', 'box'] as ToolName[]) this.toolButtons.get(t)?.classList.toggle('active', this.tools.tool === t);
    this.toolButtons.get('multi')?.classList.toggle('active', this.tools.multi);
    this.viewer.canvas.dataset.tool = this.tools.tool;
    this.hintEl.textContent = TOOL_HINT[this.tools.tool];
    this.hintEl.hidden = this.tools.tool === 'select';
    this.updateStatus();
  }

  updateStatus(): void {
    const d = this.model.data;
    const s = this.selected();
    const sel = s.joints.length + s.frames.length + s.areas.length;
    const parts = [this.tools.statusText(), `${d.joints.length} joints · ${d.frames.length} frames · ${d.areas.length} areas`];
    if (sel) parts.push(`${sel} selected`);
    if (this.results) parts.push(`analysed, max disp ${fmt(this.results.stats.maxDisp / units().kSmall, 3)} ${units().small}`);
    this.statusEl.textContent = parts.filter(Boolean).join('  |  ');
    this.fileEl.textContent = (this.dirty ? '● ' : '') + this.fileName;
    document.title = `${this.dirty ? '* ' : ''}${this.fileName} – StructApp 3D`;
    this.toolButtons.get('undo')!.disabled = !this.model.canUndo;
    this.toolButtons.get('redo')!.disabled = !this.model.canRedo;
    this.toolButtons.get('del')!.disabled = sel === 0;
    const chain = this.tools.chain.length > 0;
    this.toolButtons.get('done')!.disabled = !chain;
    const { workPlane, elevation } = d.settings;
    const axis = PLANE_AXIS[workPlane];
    const setLabel = (id: string, text: string) => {
      const span = this.toolButtons.get(id)?.querySelector('span');
      if (span) span.textContent = text;
    };
    setLabel('plane', `${workPlane} ${axis}=${fmtU(elevation, 'L', 4)}`);
    setLabel('planeUp', `${axis} +`);
    setLabel('planeDown', `${axis} −`);
  }

  // ================================================================ work plane (view state, not undoable)
  private planeOffsets: Partial<Record<WorkPlane, number>> = {};

  private setWorkPlane(workPlane: WorkPlane, elevation: number): void {
    const st = this.model.data.settings;
    if (st.workPlane === workPlane && st.elevation === elevation) return;
    st.workPlane = workPlane;
    st.elevation = elevation;
    this.planeOffsets[workPlane] = elevation;
    this.dirty = true;
    this.scheduleAutosave();
    this.viewer.setData(this.model.data, this.selection, this.results);
    this.updateStatus();
  }

  rotateWorkPlane(): void {
    const order: WorkPlane[] = ['XY', 'XZ', 'YZ'];
    const st = this.model.data.settings;
    const next = order[(order.indexOf(st.workPlane) + 1) % order.length];
    // a single selected joint defines where the new plane passes through
    const { joints } = this.selected();
    const j = joints.length === 1 ? this.model.joint(joints[0]) : undefined;
    const coord = j ? (next === 'XY' ? j.z : next === 'XZ' ? j.y : j.x) : undefined;
    this.setWorkPlane(next, coord ?? this.planeOffsets[next] ?? 0);
  }

  shiftWorkPlane(steps: number): void {
    const st = this.model.data.settings;
    this.setWorkPlane(st.workPlane, Number((st.elevation + steps * st.gridSpacing).toFixed(9)));
  }

  setCoordReadout(p: Vector3 | null): void {
    this.coordEl.textContent = p ? `X ${fmtU(p.x, 'L', 4)}  Y ${fmtU(p.y, 'L', 4)}  Z ${fmtU(p.z, 'L', 4)} ${uLabel('L')}` : '';
  }

  // ================================================================ commands
  readonly commands: Record<string, () => void> = {
    jointLoad: () => this.need('joints') && D.jointLoadDialog(this),
    framePoint: () => this.need('frames') && D.framePointLoadDialog(this),
    frameUniform: () => this.need('frames') && D.frameUniformLoadDialog(this),
    areaLoad: () => this.need('areas') && D.areaLoadDialog(this),
    assignSupport: () => this.need('joints') && D.assignSupports(this),
    assignMaterial: () => this.need('frames') && D.assignFrameProps(this, 'material'),
    assignSection: () => this.need('frames') && D.assignFrameProps(this, 'section'),
    assignBeta: () => this.need('frames') && D.assignFrameProps(this, 'beta'),
    assignArea: () => this.need('areas') && D.assignAreaDistribution(this),
    move: () => D.moveDialog(this),
    replicate: () => D.replicateDialog(this),
    divide: () => this.need('frames') && D.divideDialog(this),
    delete: () => void this.deleteSelected(),
    resultsTables: () => D.resultsTablesDialog(this),
  };

  cmd(name: string): void {
    this.commands[name]?.();
  }

  private need(kind: 'joints' | 'frames' | 'areas'): boolean {
    if (this.selected()[kind].length) return true;
    toast(`Select one or more ${kind} first`, 'warn');
    return false;
  }

  undo(): void {
    if (!this.model.canUndo) return;
    this.tools.finishChain(false);
    this.keepWorkPlane(() => this.model.undo());
  }

  /** Undo/redo restore snapshots; keep the current work plane so it doesn't jump. */
  private keepWorkPlane(fn: () => void): void {
    const { workPlane, elevation } = this.model.data.settings;
    fn();
    const st = this.model.data.settings;
    if (st.workPlane !== workPlane || st.elevation !== elevation) {
      st.workPlane = workPlane;
      st.elevation = elevation;
      this.viewer.setData(this.model.data, this.selection, this.results);
      this.updateStatus();
    }
  }

  redo(): void {
    if (!this.model.canRedo) return;
    this.keepWorkPlane(() => this.model.redo());
  }

  async deleteSelected(): Promise<void> {
    const s = this.selected();
    const n = s.joints.length + s.frames.length + s.areas.length;
    if (!n) return;
    this.model.commit('delete', () => this.model.deleteObjects(s.joints, s.frames, s.areas));
    this.selection.clear();
    this.refresh();
    toast(`Deleted ${n} object${n > 1 ? 's' : ''} (Undo to restore)`, 'info');
  }

  async analyze(): Promise<void> {
    if (this.busy) return;
    this.tools.finishChain(true);
    const d = this.model.data;
    if (!d.frames.length) return void alertDialog('Nothing to analyse', 'Draw at least one frame and assign supports before running the analysis.');
    this.busy = true;
    document.body.classList.add('busy');
    const t0 = performance.now();
    try {
      const set = await runAnalysis(d);
      const keep = set.items.find((it) => it.name === this.resultName);
      this.resultSet = set;
      this.resultName = keep ? keep.name : (set.items.find((it) => it.kind === 'combo') ?? set.items[0]).name;
      const r = this.results!;
      this.viewer.setResults(r);
      this.deformRel = 0;
      this.viewer.setResultOptions({ view: 'deformed', deformScale: this.viewer.autoDeformScale });
      this.refresh();
      const warnings = [...new Set(set.items.flatMap((it) => set.results[it.name].warnings))];
      toast(`Analysis complete in ${Math.round(performance.now() - t0)} ms – ${r.stats.equations} equations, ${set.items.length} cases/combos`, 'ok');
      if (warnings.length) toast(warnings.slice(0, 3).join('\n') + (warnings.length > 3 ? `\n(+${warnings.length - 3} more)` : ''), 'warn', 7000);
    } catch (e) {
      void alertDialog('Analysis failed', e instanceof Error ? e.message : String(e));
    } finally {
      this.busy = false;
      document.body.classList.remove('busy');
    }
  }

  // ================================================================ files
  private loadData(data: ModelData, name: string, handle: FsFileHandle | null): void {
    this.suppressDirty = true;
    try {
      this.selection.clear();
      this.model.load(data);
    } finally {
      this.suppressDirty = false;
    }
    this.fileName = name;
    this.fileHandle = handle;
    this.planeOffsets = {};
    this.dirty = false;
    this.refresh();
    this.viewer.fit();
  }

  private async confirmDiscard(): Promise<boolean> {
    if (!this.dirty) return true;
    return confirmDialog('Unsaved changes', `Discard unsaved changes to ${this.fileName}?`, 'Discard', true);
  }

  async newModel(): Promise<void> {
    if (!(await this.confirmDiscard())) return;
    this.loadData(defaultModel(), 'Untitled.sav', null);
    clearAutosave();
  }

  async open(): Promise<void> {
    if (!(await this.confirmDiscard())) return;
    try {
      const f = await openText();
      if (!f) return;
      const info: SavInfo = {};
      const data = readSav(f.text, info);
      this.loadData(data, f.name, f.handle);
      clearAutosave();
      // show the model in the units the file was written in
      if (info.units) setUnits(info.units);
      toast(`Opened ${f.name} (${units().label})`, 'ok');
    } catch (e) {
      void alertDialog('Cannot open file', e instanceof SavError || e instanceof Error ? e.message : String(e));
    }
  }

  async save(saveAs = false): Promise<void> {
    this.tools.finishChain(true);
    try {
      const text = writeSav(this.model.data, this.includeResults ? this.resultSet : null);
      const name = this.fileName.toLowerCase().endsWith('.sav') ? this.fileName : this.fileName + '.sav';
      const res = await saveText(text, name, saveAs ? null : this.fileHandle);
      if (!res) return;
      this.fileName = res.name;
      this.fileHandle = res.handle;
      this.dirty = false;
      clearAutosave();
      this.updateStatus();
      toast(`Saved ${res.name}`, 'ok');
    } catch (e) {
      void alertDialog('Save failed', e instanceof Error ? e.message : String(e));
    }
  }

  private async offerRecovery(): Promise<void> {
    const a = loadAutosave();
    if (!a) return;
    let data: ModelData;
    try {
      data = readSav(a.text);
    } catch {
      clearAutosave();
      return;
    }
    if (!data.joints.length) return;
    const when = new Date(a.time).toLocaleString();
    const ok = await confirmDialog('Recover unsaved work?', `An auto-saved copy of "${a.name}" from ${when} was found (${data.joints.length} joints, ${data.frames.length} frames).`, 'Recover');
    if (ok) {
      this.loadData(data, a.name, null);
      this.dirty = true;
      this.updateStatus();
    } else clearAutosave();
  }

  async loadExample(): Promise<void> {
    if (!(await this.confirmDiscard())) return;
    const m = new Model();
    const bx = [0, 6, 12];
    const by = [0, 5];
    const hz = [0, 3.5, 7];
    m.commit('example', (d) => {
      d.sections.push({ name: 'WF400', shape: 'I', dims: [0.4, 0.2, 0.013, 0.008] });
      const id = (x: number, y: number, z: number) => m.addJoint(x, y, z);
      for (let k = 0; k < hz.length; k++)
        for (const x of bx)
          for (const y of by) {
            const j = id(x, y, hz[k]);
            if (k === 0) m.joint(j)!.r = [...FIXED] as Restraint;
          }
      for (let k = 1; k < hz.length; k++) {
        for (const x of bx)
          for (const y of by) {
            const f = m.addFrame(id(x, y, hz[k - 1]), id(x, y, hz[k]))!;
            m.frame(f)!.section = 'WF400';
            m.frame(f)!.material = 'STEEL';
          }
        for (const y of by)
          for (let i = 0; i < bx.length - 1; i++) {
            const f = m.addFrame(id(bx[i], y, hz[k]), id(bx[i + 1], y, hz[k]))!;
            m.frame(f)!.section = 'IWF300';
            m.frame(f)!.material = 'STEEL';
          }
        for (const x of bx) {
          const f = m.addFrame(id(x, 0, hz[k]), id(x, 5, hz[k]))!;
          m.frame(f)!.section = 'IWF300';
          m.frame(f)!.material = 'STEEL';
        }
        for (let i = 0; i < bx.length - 1; i++) {
          const a = m.addArea([id(bx[i], 0, hz[k]), id(bx[i + 1], 0, hz[k]), id(bx[i + 1], 5, hz[k]), id(bx[i], 5, hz[k])])!;
          d.areaLoads.push({ case: DEAD, area: a, q: 1.5 }, { case: LIVE, area: a, q: 2.5 });
        }
        for (const y of by) d.jointLoads.push({ case: 'WIND', joint: id(0, y, hz[k]), f: [5 * k, 0, 0, 0, 0, 0] });
      }
      d.loadCases.push({ name: 'WIND', type: 'Other' });
      d.loadCombos.push({
        name: 'COMBO2',
        factors: [
          { case: DEAD, factor: 1.2 },
          { case: LIVE, factor: 1 },
          { case: 'WIND', factor: 1 },
        ],
      });
      d.settings.gridSpacing = 1;
      d.settings.gridLines = 15;
      d.settings.selfWeight = true;
    });
    this.loadData(m.data, 'Example-2storey.sav', null);
    toast('Example loaded – tap Run to analyse', 'ok');
  }

  // ================================================================ menus
  private toggle(label: string, get: () => boolean, set: (v: boolean) => void): MenuItem {
    return { label, checked: get, action: () => set(!get()) };
  }

  private disp(label: string, key: keyof DisplayOptions): MenuItem {
    return this.toggle(
      label,
      () => this.viewer.display[key],
      (v) => {
        this.viewer.display[key] = v;
        this.viewer.rebuildAll();
      },
    );
  }

  private fileMenu(): MenuItem[] {
    return [
      { label: 'New', shortcut: 'Ctrl+N', action: () => void this.newModel() },
      { label: 'Open .sav…', shortcut: 'Ctrl+O', action: () => void this.open() },
      { label: 'Save', shortcut: 'Ctrl+S', action: () => void this.save() },
      { label: 'Save As…', shortcut: 'Ctrl+Shift+S', action: () => void this.save(true) },
      { separator: true },
      this.toggle('Include results in .sav', () => this.includeResults, (v) => (this.includeResults = v)),
      { separator: true },
      { label: 'Load example model', action: () => void this.loadExample() },
    ];
  }

  private editMenu(): MenuItem[] {
    const none = () => this.selection.size === 0;
    return [
      { label: 'Undo', shortcut: 'Ctrl+Z', action: () => this.undo(), disabled: () => !this.model.canUndo },
      { label: 'Redo', shortcut: 'Ctrl+Y', action: () => this.redo(), disabled: () => !this.model.canRedo },
      { separator: true },
      { label: 'Select all', shortcut: 'Ctrl+A', action: () => this.selectAll() },
      { label: 'Clear selection', shortcut: 'Esc', action: () => this.select([], 'replace'), disabled: none },
      { label: 'Delete selected', shortcut: 'Del', action: () => void this.deleteSelected(), disabled: none },
      { separator: true },
      { label: 'Move…', action: () => D.moveDialog(this), disabled: none },
      { label: 'Replicate…', action: () => D.replicateDialog(this), disabled: none },
      { label: 'Divide frames…', action: () => this.cmd('divide'), disabled: () => !this.selected().frames.length },
    ];
  }

  private defineMenu(): MenuItem[] {
    return [
      { label: 'Materials…', action: () => D.defineMaterials(this) },
      { label: 'Frame sections…', action: () => D.defineSections(this) },
      { label: 'Support types…', action: () => D.defineSupports(this) },
      { separator: true },
      { label: 'Grid & work plane…', action: () => D.defineGrid(this) },
    ];
  }

  private drawMenu(): MenuItem[] {
    const tool = (t: ToolName, label: string, key: string): MenuItem => ({ label, shortcut: key, checked: () => this.tools.tool === t, action: () => this.tools.setTool(t) });
    return [
      tool('select', 'Select', 'S'),
      tool('joint', 'Draw joint', 'J'),
      tool('frame', 'Draw frame', 'L'),
      tool('area', 'Draw area', 'A'),
      tool('box', 'Box select', 'B'),
      { separator: true },
      { label: 'Add joint by coordinates…', action: () => D.addJointDialog(this) },
      { label: 'Add frame by joints…', action: () => D.addFrameDialog(this) },
      { separator: true },
      { label: 'Grid & work plane…', action: () => D.defineGrid(this) },
    ];
  }

  private assignMenu(): MenuItem[] {
    return [
      { heading: 'Joints' },
      { label: 'Support / restraints…', action: () => this.cmd('assignSupport') },
      { heading: 'Frames' },
      { label: 'Material…', action: () => this.cmd('assignMaterial') },
      { label: 'Section…', action: () => this.cmd('assignSection') },
      { label: 'Local axis angle β…', action: () => this.cmd('assignBeta') },
      { heading: 'Areas' },
      { label: 'Load distribution…', action: () => this.cmd('assignArea') },
    ];
  }

  private loadsMenu(): MenuItem[] {
    return [
      { label: 'Joint point load…', action: () => this.cmd('jointLoad') },
      { label: 'Frame point load…', action: () => this.cmd('framePoint') },
      { label: 'Frame uniform load…', action: () => this.cmd('frameUniform') },
      { label: 'Area uniform load…', action: () => this.cmd('areaLoad') },
      { separator: true },
      { label: 'Load cases…', action: () => D.loadCasesDialog(this) },
      { label: 'Load combinations…', action: () => D.loadCombosDialog(this) },
      { separator: true },
      this.toggle(
        'Include self weight',
        () => this.model.data.settings.selfWeight,
        (v) => this.model.commit('self weight', (d) => void (d.settings.selfWeight = v)),
      ),
      { separator: true },
      { label: 'Clear loads on selection…', action: () => void D.clearSelectedLoads(this), disabled: () => this.selection.size === 0 },
    ];
  }

  private analyzeMenu(): MenuItem[] {
    const noRes = () => !this.results;
    const view = (v: ResultView, label: string): MenuItem => ({ label, checked: () => this.viewer.resultOpts.view === v, disabled: noRes, action: () => this.setResultView(v) });
    return [
      { label: 'Run analysis', shortcut: 'F5', action: () => void this.analyze() },
      { heading: 'Show' },
      ...RESULT_VIEWS.map(([v, l]) => view(v, l)),
      { separator: true },
      { label: 'Result tables…', action: () => D.resultsTablesDialog(this), disabled: noRes },
      {
        label: 'Clear results',
        disabled: noRes,
        action: () => this.clearResults(),
      },
    ];
  }

  private displayMenu(): MenuItem[] {
    const v = this.viewer;
    return [
      { heading: 'View' },
      { label: 'Fit all', shortcut: 'F', action: () => v.fit() },
      { label: '3D (isometric)', shortcut: '0', action: () => v.viewPreset('iso') },
      { label: 'Top (X-Y)', shortcut: '1', action: () => v.viewPreset('top') },
      { label: 'Front (X-Z)', shortcut: '2', action: () => v.viewPreset('front') },
      { label: 'Side (Y-Z)', shortcut: '3', action: () => v.viewPreset('side') },
      this.toggle('Orthographic', () => v.useOrtho, (on) => v.setOrtho(on)),
      { heading: 'Show' },
      this.disp('Joint labels', 'jointLabels'),
      this.disp('Frame labels', 'frameLabels'),
      this.disp('Area labels', 'areaLabels'),
      this.disp('Loads', 'showLoads'),
      this.disp('Load values', 'loadValues'),
      this.disp('Supports', 'showSupports'),
      this.disp('Extruded sections', 'extruded'),
      { separator: true },
      this.toggle(
        'Dark theme',
        () => this.theme === 'dark',
        (on) => {
          this.theme = on ? 'dark' : 'light';
          localStorage.setItem('structapp.theme', this.theme);
          this.applyTheme();
        },
      ),
      this.toggle('Properties panel', () => !this.panel.classList.contains('collapsed'), (on) => this.togglePanel(on)),
    ];
  }

  private helpMenu(): MenuItem[] {
    return [
      { label: 'Quick guide', shortcut: 'F1', action: () => D.helpDialog() },
      { label: 'Load example model', action: () => void this.loadExample() },
      { separator: true },
      { label: 'About', action: () => void alertDialog('About StructApp 3D', 'Touch-friendly 3D frame analysis (linear static, 12-DOF space frame elements). Units are selectable at the bottom-right (metric and imperial); the model is stored in kN, m. Files are saved as comma-separated .sav tables that open in Excel.') },
    ];
  }

  private contextMenu(x: number, y: number): void {
    this.tools.finishChain(true);
    const hit = this.viewer.pick(x, y, 24);
    if (hit && !this.selection.has(hit)) this.select([hit], this.tools.multi ? 'add' : 'replace');
    const s = this.selected();
    const items: MenuItem[] = [];
    if (s.joints.length) items.push({ heading: `Joints (${s.joints.length})` }, { label: 'Support…', action: () => this.cmd('assignSupport') }, { label: 'Joint load…', action: () => this.cmd('jointLoad') });
    if (s.frames.length === 1 && this.results) {
      const fid = s.frames[0];
      items.push({ heading: `Frame ${fid} results` }, { label: 'Frame diagrams…', action: () => D.frameDiagramsDialog(this, fid) });
    }
    if (s.frames.length)
      items.push(
        { heading: `Frames (${s.frames.length})` },
        { label: 'Material…', action: () => this.cmd('assignMaterial') },
        { label: 'Section…', action: () => this.cmd('assignSection') },
        { label: 'Point load…', action: () => this.cmd('framePoint') },
        { label: 'Uniform load…', action: () => this.cmd('frameUniform') },
        { label: 'Divide…', action: () => this.cmd('divide') },
      );
    if (s.areas.length) items.push({ heading: `Areas (${s.areas.length})` }, { label: 'Area load…', action: () => this.cmd('areaLoad') }, { label: 'Distribution…', action: () => this.cmd('assignArea') });
    if (this.selection.size)
      items.push(
        { separator: true },
        { label: 'Properties', action: () => this.togglePanel(true) },
        { label: 'Move…', action: () => this.cmd('move') },
        { label: 'Replicate…', action: () => this.cmd('replicate') },
        { label: 'Clear loads…', action: () => void D.clearSelectedLoads(this) },
        { label: 'Delete', action: () => void this.deleteSelected() },
        { label: 'Clear selection', action: () => this.select([], 'replace') },
      );
    else
      items.push(
        { label: 'Fit all', action: () => this.viewer.fit() },
        { label: 'Add joint…', action: () => D.addJointDialog(this) },
        { label: 'Select all', action: () => this.selectAll() },
        { label: 'Run analysis', action: () => void this.analyze() },
      );
    showMenu(items, x, y);
  }

  // ================================================================ keyboard
  private installKeyboard(): void {
    window.addEventListener('keydown', (e) => {
      const t = e.target as HTMLElement;
      if (dialogOpen() || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName) || t.isContentEditable) return;
      const k = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      const run = (fn: () => void) => {
        e.preventDefault();
        fn();
      };
      if (ctrl) {
        if (k === 'z' && !e.shiftKey) run(() => this.undo());
        else if (k === 'y' || (k === 'z' && e.shiftKey)) run(() => this.redo());
        else if (k === 's') run(() => void this.save(e.shiftKey));
        else if (k === 'o') run(() => void this.open());
        else if (k === 'n') run(() => void this.newModel());
        else if (k === 'a') run(() => this.selectAll());
        return;
      }
      if (e.altKey) return;
      switch (k) {
        case 'delete':
        case 'backspace':
          return run(() => void this.deleteSelected());
        case 'escape':
          return run(() => {
            closeMenus();
            if (this.tools.chain.length) this.tools.cancel();
            else if (this.tools.tool !== 'select') this.tools.setTool('select');
            else this.select([], 'replace');
          });
        case 'enter':
          return run(() => this.tools.finishChain(true));
        case 'f':
          return run(() => this.viewer.fit());
        case 'p':
          return run(() => this.rotateWorkPlane());
        case 'pageup':
          return run(() => this.shiftWorkPlane(1));
        case 'pagedown':
          return run(() => this.shiftWorkPlane(-1));
        case 's':
          return run(() => this.tools.setTool('select'));
        case 'j':
          return run(() => this.tools.setTool('joint'));
        case 'l':
          return run(() => this.tools.setTool('frame'));
        case 'a':
          return run(() => this.tools.setTool('area'));
        case 'b':
          return run(() => this.tools.setTool('box'));
        case 'm':
          return run(() => {
            this.tools.multi = !this.tools.multi;
            this.onToolChanged();
          });
        case 'f5':
          return run(() => void this.analyze());
        case 'f1':
          return run(() => D.helpDialog());
        case '0':
          return run(() => this.viewer.viewPreset('iso'));
        case '1':
          return run(() => this.viewer.viewPreset('top'));
        case '2':
          return run(() => this.viewer.viewPreset('front'));
        case '3':
          return run(() => this.viewer.viewPreset('side'));
      }
    });
  }
}
