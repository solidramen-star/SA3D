import type { App } from './app';
import {
  alertDialog,
  checkField,
  confirmDialog,
  h,
  numField,
  openDialog,
  selectField,
  textField,
  toast,
  type Field,
} from './dom';
import { SHAPE_DIMS, SHAPE_LABEL, channelOutline, dimQty, sectionProps, validateSection } from '../model/sections';
import {
  DOF_NAMES,
  LOAD_CASE_TYPES,
  LOAD_DIRS,
  LOAD_DIR_LABEL,
  RELEASE_DOFS,
  type AreaDistribution,
  type LoadCase,
  type LoadCaseType,
  type LoadCombo,
  type LoadDir,
  type Material,
  type MemberReleases,
  type Restraint,
  type Section,
  type SectionShape,
  type SupportType,
  type WorkPlane,
} from '../model/types';
import { fmt, fmtU, uLabel, units, withU, type Qty } from '../model/units';

const sameR = (a: Restraint, b: Restraint) => a.every((v, i) => v === b[i]);
export const restraintText = (r: Restraint) => (r.some(Boolean) ? DOF_NAMES.filter((_, i) => r[i]).join(' ') : 'Free');

function nameValid(name: string, existing: string[], label: string): string | null {
  if (!name) return `${label} name is required`;
  if (/[,;"\r\n]/.test(name)) return `${label} name cannot contain commas, semicolons or quotes`;
  if (existing.includes(name)) return `${label} "${name}" already exists`;
  return null;
}

function listTable(headers: string[], rows: Node[][]): HTMLElement {
  return h(
    'div',
    { class: 'table-wrap' },
    h(
      'table',
      { class: 'grid-table' },
      h('thead', null, h('tr', null, ...headers.map((t) => h('th', null, t)))),
      h('tbody', null, ...rows.map((r) => h('tr', null, ...r.map((c) => h('td', null, c))))),
    ),
  );
}

const fail = (msg: string): false => {
  toast(msg, 'error');
  return false;
};

const btn = (label: string, onclick: () => void, kind = 'small') => h('button', { class: 'btn ' + kind, type: 'button', onclick }, label);

// ======================================================================= DEFINE
export function defineMaterials(app: App): void {
  const m = app.model;
  const body = h('div');
  const render = () => {
    body.replaceChildren(
      listTable(
        ['Name', `E (${uLabel('FA')})`, 'ν', `γ (${uLabel('FV')})`, 'Used by', ''],
        m.data.materials.map((mat) => {
          const used = m.data.frames.filter((f) => f.material === mat.name).length;
          return [
            document.createTextNode(mat.name),
            document.createTextNode(fmtU(mat.E, 'FA', 5)),
            document.createTextNode(String(mat.nu)),
            document.createTextNode(fmtU(mat.gamma, 'FV', 5)),
            document.createTextNode(used ? `${used} frame(s)` : '–'),
            h('span', { class: 'row-btns' }, btn('Edit', () => edit(mat)), btn('Delete', () => del(mat), 'small danger')),
          ];
        }),
      ),
      h('div', { class: 'dlg-actions' }, btn('+ Add material', () => edit(null), 'primary')),
    );
  };
  const del = async (mat: Material) => {
    const used = m.data.frames.filter((f) => f.material === mat.name).length;
    if (used) return void alertDialog('Cannot delete', `Material "${mat.name}" is assigned to ${used} frame(s). Assign another material to them first.`);
    if (!(await confirmDialog('Delete material', `Delete material "${mat.name}"?`, 'Delete', true))) return;
    m.commit('delete material', (d) => {
      d.materials = d.materials.filter((x) => x.name !== mat.name);
    });
    render();
  };
  const edit = (mat: Material | null) => {
    const name = textField('Name', mat?.name ?? `MAT${m.data.materials.length + 1}`);
    const E = numField('Elastic modulus E', mat?.E ?? 2e8, { q: 'FA', positive: true });
    const nu = numField("Poisson's ratio ν", mat?.nu ?? 0.3, { min: 0, max: 0.4999 });
    const gamma = numField('Unit weight γ', mat?.gamma ?? 78.5, { q: 'FV', min: 0 });
    const presets = h(
      'div',
      { class: 'chips' },
      h('span', { class: 'muted' }, 'Presets: '),
      btn('Steel', () => (E.set(2e8), nu.set(0.3), gamma.set(76.98))),
      btn('Concrete C30', () => (E.set(2.5743e7), nu.set(0.2), gamma.set(23.56))),
      btn('Aluminium', () => (E.set(7e7), nu.set(0.33), gamma.set(26.6))),
      btn('Timber', () => (E.set(1.1e7), nu.set(0.3), gamma.set(5))),
    );
    openDialog({
      title: mat ? `Edit material ${mat.name}` : 'Add material',
      body: h('div', { class: 'form' }, name.row, E.row, nu.row, gamma.row, presets),
      buttons: [
        { label: 'Cancel' },
        {
          label: 'OK',
          kind: 'primary',
          action: () => {
            const n = name.get();
            const err = nameValid(n, m.data.materials.filter((x) => x !== mat).map((x) => x.name), 'Material');
            const vals = [E.get(), nu.get(), gamma.get()];
            if (err) return fail(err);
            if (vals.some((v) => !Number.isFinite(v))) return fail('Fix the highlighted fields');
            m.commit(mat ? 'edit material' : 'add material', (d) => {
              const rec: Material = { name: n, E: vals[0], nu: vals[1], gamma: vals[2] };
              if (mat) {
                const old = mat.name;
                const idx = d.materials.findIndex((x) => x.name === old);
                d.materials[idx] = rec;
                if (old !== n) for (const f of d.frames) if (f.material === old) f.material = n;
              } else d.materials.push(rec);
            });
            render();
          },
        },
      ],
    });
  };
  render();
  openDialog({ title: 'Define materials', body, wide: true, buttons: [{ label: 'Close', kind: 'primary' }] });
}

/** Simple SVG cross-section sketch with local axes 2 (up) and 3 (left). */
function sectionSketch(s: Section): SVGSVGElement {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '-60 -60 120 120');
  svg.setAttribute('class', 'sketch');
  const p = sectionProps(s);
  const dims = s.dims;
  const size = Math.max(p.depth, p.width, 1e-9);
  const k = 80 / size;
  const add = (tag: string, attrs: Record<string, string | number>) => {
    const e = document.createElementNS(NS, tag);
    for (const [a, v] of Object.entries(attrs)) e.setAttribute(a, String(v));
    svg.append(e);
    return e;
  };
  const shape = { class: 'sk-shape', 'fill-rule': 'evenodd' };
  const rect = (w: number, hgt: number, cx = 0, cy = 0) => `M${cx - w / 2},${cy - hgt / 2}h${w}v${hgt}h${-w}z`;
  switch (s.shape) {
    case 'rect':
      add('path', { ...shape, d: rect(dims[1] * k, dims[0] * k) });
      break;
    case 'circle':
      add('circle', { ...shape, r: (dims[0] / 2) * k });
      break;
    case 'pipe': {
      const R = (dims[0] / 2) * k;
      const r = Math.max(R - dims[1] * k, 0);
      add('path', { ...shape, d: `M${-R},0a${R},${R} 0 1,0 ${2 * R},0a${R},${R} 0 1,0 ${-2 * R},0zM${-r},0a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0z` });
      break;
    }
    case 'I': {
      const [d, bf, tf, tw] = dims.map((v) => v * k);
      add('path', { ...shape, d: rect(bf, tf, 0, -d / 2 + tf / 2) + rect(bf, tf, 0, d / 2 - tf / 2) + rect(tw, d - 2 * tf) });
      break;
    }
    case 'box': {
      const [d, b, tf, tw] = dims.map((v) => v * k);
      add('path', { ...shape, d: rect(b, d) + rect(Math.max(b - 2 * tw, 0), Math.max(d - 2 * tf, 0)) });
      break;
    }
    case 'unp':
    case 'C': {
      const pts = channelOutline(s)!;
      add('path', { ...shape, d: 'M' + pts.map(([x, y]) => `${x * k},${-y * k}`).join('L') + 'z' });
      break;
    }
    case 'general':
      add('text', { x: 0, y: 4, 'text-anchor': 'middle', class: 'sk-text' }, ).textContent = 'General';
      break;
  }
  add('line', { x1: 0, y1: 0, x2: 0, y2: -52, class: 'sk-axis' });
  add('line', { x1: 0, y1: 0, x2: -52, y2: 0, class: 'sk-axis' });
  add('text', { x: 4, y: -48, class: 'sk-text' }).textContent = '2';
  add('text', { x: -54, y: -4, class: 'sk-text' }).textContent = '3';
  return svg;
}

export function defineSections(app: App): void {
  const m = app.model;
  const body = h('div');
  const render = () => {
    body.replaceChildren(
      listTable(
        ['Name', 'Shape', `Dimensions (${uLabel('L')})`, `A (${uLabel('A')})`, `I33 (${uLabel('L4')})`, 'Used by', ''],
        m.data.sections.map((s) => {
          const p = sectionProps(s);
          const used = m.data.frames.filter((f) => f.section === s.name).length;
          return [
            document.createTextNode(s.name),
            document.createTextNode(SHAPE_LABEL[s.shape]),
            document.createTextNode(s.dims.map((v, k) => fmtU(v, dimQty(s.shape, k), 4)).join(' × ')),
            document.createTextNode(fmtU(p.A, 'A', 4)),
            document.createTextNode(fmtU(p.I33, 'L4', 4)),
            document.createTextNode(used ? `${used} frame(s)` : '–'),
            h('span', { class: 'row-btns' }, btn('Edit', () => edit(s)), btn('Delete', () => del(s), 'small danger')),
          ];
        }),
      ),
      h('div', { class: 'dlg-actions' }, btn('+ Add section', () => edit(null), 'primary')),
    );
  };
  const del = async (s: Section) => {
    const used = m.data.frames.filter((f) => f.section === s.name).length;
    if (used) return void alertDialog('Cannot delete', `Section "${s.name}" is assigned to ${used} frame(s). Assign another section to them first.`);
    if (!(await confirmDialog('Delete section', `Delete section "${s.name}"?`, 'Delete', true))) return;
    m.commit('delete section', (d) => {
      d.sections = d.sections.filter((x) => x.name !== s.name);
    });
    render();
  };
  const edit = (sec: Section | null) => {
    const name = textField('Name', sec?.name ?? `SEC${m.data.sections.length + 1}`);
    const shapes = Object.keys(SHAPE_LABEL) as SectionShape[];
    const shape = selectField<SectionShape>('Shape', shapes.map((s) => [s, SHAPE_LABEL[s]]), sec?.shape ?? 'rect');
    const dimsBox = h('div', { class: 'form' });
    const propsBox = h('div', { class: 'props' });
    const sketchBox = h('div', { class: 'sketch-box' });
    let dimFields: Field<number>[] = [];
    const defaults: Record<SectionShape, number[]> = {
      rect: [0.5, 0.3],
      circle: [0.4],
      pipe: [0.1683, 0.0071],
      I: [0.3, 0.15, 0.009, 0.0065],
      box: [0.2, 0.2, 0.008, 0.008],
      unp: [0.2, 0.075, 0.0115, 0.0085],
      C: [0.15, 0.065, 0.02, 0.0023],
      general: [0.01, 1e-4, 1e-5, 1e-6],
    };
    const current = (): Section => ({ name: name.get(), shape: shape.get(), dims: dimFields.map((f) => f.get()) });
    const update = () => {
      const s = current();
      const err = s.dims.some((v) => !Number.isFinite(v)) ? 'Enter all dimensions' : validateSection(s);
      sketchBox.replaceChildren(err ? h('div', { class: 'field-err' }, err) : sectionSketch(s));
      if (err) return void propsBox.replaceChildren();
      const p = sectionProps(s);
      propsBox.replaceChildren(
        listTable(
          [`A (${uLabel('A')})`, `I33 (${uLabel('L4')})`, `I22 (${uLabel('L4')})`, `J (${uLabel('L4')})`],
          [[fmtU(p.A, 'A'), fmtU(p.I33, 'L4'), fmtU(p.I22, 'L4'), fmtU(p.J, 'L4')].map((v) => document.createTextNode(v))],
        ),
      );
    };
    const buildDims = (useExisting: boolean) => {
      const sh = shape.get();
      const vals = useExisting && sec && sec.shape === sh ? sec.dims : defaults[sh];
      dimFields = SHAPE_DIMS[sh].map((label, i) => numField(label, vals[i], { q: dimQty(sh, i), positive: true }));
      dimsBox.replaceChildren(...dimFields.map((f) => f.row));
      for (const f of dimFields) f.input.addEventListener('input', update);
      update();
    };
    shape.input.addEventListener('change', () => buildDims(false));
    buildDims(true);
    openDialog({
      title: sec ? `Edit section ${sec.name}` : 'Add frame section',
      wide: true,
      body: h(
        'div',
        { class: 'two-col' },
        h('div', { class: 'form' }, name.row, shape.row, dimsBox),
        h('div', null, sketchBox, propsBox, h('p', { class: 'muted small' }, 'Local axis 2 is the section depth direction (up for horizontal members); local 3 is the width direction.')),
      ),
      buttons: [
        { label: 'Cancel' },
        {
          label: 'OK',
          kind: 'primary',
          action: () => {
            const s = current();
            const err =
              nameValid(s.name, m.data.sections.filter((x) => x !== sec).map((x) => x.name), 'Section') ??
              (s.dims.some((v) => !Number.isFinite(v)) ? 'Enter all dimensions' : validateSection(s));
            if (err) return fail(err);
            m.commit(sec ? 'edit section' : 'add section', (d) => {
              if (sec) {
                const old = sec.name;
                d.sections[d.sections.findIndex((x) => x.name === old)] = s;
                if (old !== s.name) for (const f of d.frames) if (f.section === old) f.section = s.name;
              } else d.sections.push(s);
            });
            render();
          },
        },
      ],
    });
  };
  render();
  openDialog({ title: 'Define frame sections', body, wide: true, buttons: [{ label: 'Close', kind: 'primary' }] });
}

function restraintChecks(r: Restraint) {
  const checks = DOF_NAMES.map((n, i) => checkField(n, r[i]));
  const el = h(
    'div',
    { class: 'restraints' },
    h('div', { class: 'muted small' }, 'Translations'),
    h('div', { class: 'chk-row' }, ...checks.slice(0, 3).map((c) => c.row)),
    h('div', { class: 'muted small' }, 'Rotations'),
    h('div', { class: 'chk-row' }, ...checks.slice(3).map((c) => c.row)),
  );
  return {
    el,
    checks,
    get: () => checks.map((c) => c.get()) as Restraint,
    set: (v: Restraint) => checks.forEach((c, i) => c.set(v[i])),
  };
}

function releaseChecks(rel?: MemberReleases, label?: string) {
  const r: MemberReleases = rel ? [...rel] : [false, false, false, false, false, false];
  const checks = RELEASE_DOFS.map((name, i) => checkField(name, r[i]));
  const el = h(
    'div',
    { class: 'releases-group' },
    label ? h('div', { class: 'muted small' }, label) : null,
    h('div', { class: 'chk-row' }, ...checks.map((c) => c.row)),
  );
  return {
    el,
    checks,
    get: (): MemberReleases | undefined => {
      const vals = checks.map((c) => c.get()) as MemberReleases;
      return vals.some(Boolean) ? vals : undefined;
    },
    set: (v?: MemberReleases) => {
      const vals = v ?? [false, false, false, false, false, false];
      checks.forEach((c, i) => c.set(vals[i]));
    },
  };
}

export function defineSupports(app: App): void {
  const m = app.model;
  const body = h('div');
  const render = () => {
    body.replaceChildren(
      listTable(
        ['Name', 'Restrained DOF', ''],
        m.data.supportTypes.map((s) => [
          document.createTextNode(s.name),
          document.createTextNode(restraintText(s.r)),
          h('span', { class: 'row-btns' }, btn('Edit', () => edit(s)), btn('Delete', () => del(s), 'small danger')),
        ]),
      ),
      h('div', { class: 'dlg-actions' }, btn('+ Add support type', () => edit(null), 'primary')),
      h('p', { class: 'muted small' }, 'Support types are presets. Assign them to joints with Assign → Joint supports.'),
    );
  };
  const del = (s: SupportType) => {
    m.commit('delete support type', (d) => {
      d.supportTypes = d.supportTypes.filter((x) => x.name !== s.name);
    });
    render();
  };
  const edit = (s: SupportType | null) => {
    const name = textField('Name', s?.name ?? `Support${m.data.supportTypes.length + 1}`);
    const rc = restraintChecks(s?.r ?? [true, true, true, false, false, false]);
    openDialog({
      title: s ? `Edit support ${s.name}` : 'Add support type',
      body: h('div', { class: 'form' }, name.row, rc.el),
      buttons: [
        { label: 'Cancel' },
        {
          label: 'OK',
          kind: 'primary',
          action: () => {
            const n = name.get();
            const err = nameValid(n, m.data.supportTypes.filter((x) => x !== s).map((x) => x.name), 'Support');
            if (err) return fail(err);
            m.commit('edit support type', (d) => {
              const rec = { name: n, r: rc.get() };
              if (s) d.supportTypes[d.supportTypes.findIndex((x) => x.name === s.name)] = rec;
              else d.supportTypes.push(rec);
            });
            render();
          },
        },
      ],
    });
  };
  render();
  openDialog({ title: 'Define support types', body, buttons: [{ label: 'Close', kind: 'primary' }] });
}

export function defineGrid(app: App): void {
  const st = app.model.data.settings;
  const spacing = numField('Grid spacing', st.gridSpacing, { q: 'L', positive: true });
  const lines = numField('Grid lines each side', st.gridLines, { min: 1, max: 200 });
  const plane = selectField<WorkPlane>('Work plane', [['XY', 'XY (plan, horizontal)'], ['XZ', 'XZ (elevation)'], ['YZ', 'YZ (elevation)']], st.workPlane);
  const elev = numField('Plane offset (Z for XY, Y for XZ, X for YZ)', st.elevation, { q: 'L' });
  openDialog({
    title: 'Grid & work plane',
    body: h('div', { class: 'form' }, spacing.row, lines.row, plane.row, elev.row, h('p', { class: 'muted small' }, 'New joints snap to this grid on the work plane. Tap an existing joint to snap to it instead.')),
    buttons: [
      { label: 'Cancel' },
      {
        label: 'OK',
        kind: 'primary',
        action: () => {
          const v = [spacing.get(), lines.get(), elev.get()];
          if (v.some((x) => !Number.isFinite(x))) return fail('Fix the highlighted fields');
          app.model.commit('grid', (d) => {
            d.settings.gridSpacing = v[0];
            d.settings.gridLines = Math.round(v[1]);
            d.settings.workPlane = plane.get();
            d.settings.elevation = v[2];
          });
        },
      },
    ],
  });
}

// ======================================================================= ASSIGN
function need(app: App, kind: 'joints' | 'frames' | 'areas'): number[] | null {
  const ids = app.selected()[kind];
  if (!ids.length) {
    toast(`Select one or more ${kind} first`, 'warn');
    return null;
  }
  return ids;
}

export function assignFrameProps(app: App, what: 'material' | 'section' | 'beta'): void {
  const ids = need(app, 'frames');
  if (!ids) return;
  const d = app.model.data;
  const frames = d.frames.filter((f) => ids.includes(f.id));
  const common = <T,>(get: (f: (typeof frames)[0]) => T) => (frames.every((f) => get(f) === get(frames[0])) ? get(frames[0]) : null);
  let field: Field<string> | Field<number>;
  if (what === 'material') {
    if (!d.materials.length) return void toast('Define a material first', 'warn');
    field = selectField('Material', d.materials.map((x) => [x.name, x.name]), common((f) => f.material) ?? d.materials[0].name);
  } else if (what === 'section') {
    if (!d.sections.length) return void toast('Define a section first', 'warn');
    field = selectField('Section', d.sections.map((x) => [x.name, `${x.name} (${SHAPE_LABEL[x.shape]})`]), common((f) => f.section) ?? d.sections[0].name);
  } else {
    field = numField('Local axis angle β', common((f) => f.beta), { unit: '°', mixed: true });
  }
  openDialog({
    title: `Assign ${what === 'beta' ? 'local axis angle' : what} to ${ids.length} frame(s)`,
    body: h('div', { class: 'form' }, field.row, what === 'beta' ? h('p', { class: 'muted small' }, 'β rotates the section (local axes 2 and 3) about the member axis 1.') : null),
    buttons: [
      { label: 'Cancel' },
      {
        label: 'Assign',
        kind: 'primary',
        action: () => {
          const v = field.get();
          if (typeof v === 'number' && !Number.isFinite(v)) return fail('Enter an angle');
          app.model.commit('assign ' + what, (dd) => {
            for (const f of dd.frames) if (ids.includes(f.id)) (f as unknown as Record<string, unknown>)[what] = v;
          });
          toast(`Assigned to ${ids.length} frame(s)`, 'ok');
        },
      },
    ],
  });
}

export function assignFrameReleases(app: App): void {
  const ids = need(app, 'frames');
  if (!ids) return;
  const d = app.model.data;
  const first = d.frames.find((f) => f.id === ids[0])!;
  const rcI = releaseChecks(first.relI, 'End I releases (Joint I)');
  const rcJ = releaseChecks(first.relJ, 'End J releases (Joint J)');

  const setPresets = (relI?: MemberReleases, relJ?: MemberReleases) => {
    rcI.set(relI);
    rcJ.set(relJ);
  };

  const presets = h(
    'div',
    { class: 'chips' },
    btn('Rigid - Rigid (Continuous)', () => setPresets(undefined, undefined)),
    btn('Pin - Pin (Truss)', () => setPresets([false, false, false, false, true, true], [false, false, false, false, true, true])),
    btn('Pin - Rigid (Hinge at I)', () => setPresets([false, false, false, false, true, true], undefined)),
    btn('Rigid - Pin (Hinge at J)', () => setPresets(undefined, [false, false, false, false, true, true])),
  );

  openDialog({
    title: `Assign end releases to ${ids.length} frame(s)`,
    body: h(
      'div',
      { class: 'form' },
      h('div', { class: 'muted small' }, 'Presets'),
      presets,
      rcI.el,
      rcJ.el,
      h('p', { class: 'muted small' }, 'Checked DOFs are released (zero moment / shear / axial / torsion).'),
    ),
    buttons: [
      { label: 'Cancel' },
      {
        label: 'Assign',
        kind: 'primary',
        action: () => {
          const relI = rcI.get();
          const relJ = rcJ.get();
          app.model.commit('assign releases', (dd) => {
            for (const f of dd.frames) {
              if (ids.includes(f.id)) {
                if (relI) f.relI = [...relI];
                else delete f.relI;
                if (relJ) f.relJ = [...relJ];
                else delete f.relJ;
              }
            }
          });
          toast(`Assigned releases to ${ids.length} frame(s)`, 'ok');
        },
      },
    ],
  });
}

export function assignSupports(app: App): void {
  const ids = need(app, 'joints');
  if (!ids) return;
  const d = app.model.data;
  const first = d.joints.find((j) => j.id === ids[0])!;
  const rc = restraintChecks(first.r);
  const presets = h(
    'div',
    { class: 'chips' },
    ...d.supportTypes.map((s) => {
      const b = btn(s.name, () => rc.set(s.r));
      return b;
    }),
  );
  openDialog({
    title: `Assign supports to ${ids.length} joint(s)`,
    body: h('div', { class: 'form' }, h('div', { class: 'muted small' }, 'Support type'), presets, rc.el),
    buttons: [
      { label: 'Cancel' },
      {
        label: 'Assign',
        kind: 'primary',
        action: () => {
          const r = rc.get();
          app.model.commit('assign supports', (dd) => {
            for (const j of dd.joints) if (ids.includes(j.id)) j.r = [...r] as Restraint;
          });
          const t = d.supportTypes.find((s) => sameR(s.r, r));
          toast(`${t ? t.name : restraintText(r)} assigned to ${ids.length} joint(s)`, 'ok');
        },
      },
    ],
  });
}

export function assignAreaDistribution(app: App): void {
  const ids = need(app, 'areas');
  if (!ids) return;
  const f = selectField<AreaDistribution>(
    'Load distribution',
    [
      ['two-way', 'Two-way (to all edges, tributary)'],
      ['one-way', 'One-way (to the two longer edges)'],
    ],
    app.model.area(ids[0])?.distribution ?? 'two-way',
  );
  openDialog({
    title: `Area load distribution (${ids.length} area(s))`,
    body: h('div', { class: 'form' }, f.row, h('p', { class: 'muted small' }, 'Areas have no stiffness; their loads are transferred to the frames along their edges (or to the corner joints when an edge has no frame).')),
    buttons: [
      { label: 'Cancel' },
      {
        label: 'Assign',
        kind: 'primary',
        action: () => {
          app.model.commit('assign distribution', (d) => {
            for (const a of d.areas) if (ids.includes(a.id)) a.distribution = f.get();
          });
        },
      },
    ],
  });
}

// ======================================================================= LOADS
type Mode = 'add' | 'replace' | 'delete';
const modeField = () =>
  selectField<Mode>('Option', [['add', 'Add to existing loads'], ['replace', 'Replace loads of this case'], ['delete', 'Delete loads of this case']], 'add');

function caseField(app: App) {
  const cases = app.model.data.loadCases;
  const def = cases.some((c) => c.name === app.lastLoadCase) ? app.lastLoadCase : cases[0].name;
  return selectField<string>('Load case', cases.map((c) => [c.name, ` ()`]), def);
}

function dirField(def: LoadDir = 'GRAV') {
  return selectField<LoadDir>('Direction', LOAD_DIRS.map((d) => [d, LOAD_DIR_LABEL[d]]), def);
}

export function jointLoadDialog(app: App): void {
  const ids = need(app, 'joints');
  if (!ids) return;
  const names = ['Force FX', 'Force FY', 'Force FZ', 'Moment MX', 'Moment MY', 'Moment MZ'];
  const fields = names.map((n, i) => numField(n, 0, { q: i < 3 ? 'F' : 'M' }));
  const lc = caseField(app);
  const mode = modeField();
  openDialog({
    title: `Joint loads on ${ids.length} joint(s)`,
    body: h(
      'div',
      { class: 'form' },
      h('p', { class: 'muted small' }, 'Global axes. Use a negative FZ for downward loads.'),
      lc.row,
      h('div', { class: 'grid2' }, ...fields.map((f) => f.row)),
      mode.row,
    ),
    buttons: [
      { label: 'Cancel' },
      {
        label: 'Apply',
        kind: 'primary',
        action: () => {
          const v = fields.map((f) => f.get());
          const md = mode.get();
          const cs = (app.lastLoadCase = lc.get());
          if (md !== 'delete' && v.some((x) => !Number.isFinite(x))) return fail('Fix the highlighted fields');
          app.model.commit('joint loads', (d) => {
            if (md !== 'add') d.jointLoads = d.jointLoads.filter((l) => l.case !== cs || !ids.includes(l.joint));
            if (md === 'delete' || v.every((x) => x === 0)) return;
            for (const id of ids) {
              const ex = md === 'add' ? d.jointLoads.find((l) => l.joint === id && l.case === cs) : undefined;
              if (ex) ex.f = ex.f.map((x, i) => x + v[i]) as typeof ex.f;
              else d.jointLoads.push({ case: cs, joint: id, f: [...v] as [number, number, number, number, number, number] });
            }
          });
          toast(md === 'delete' ? 'Joint loads deleted' : `Load applied to ${ids.length} joint(s)`, 'ok');
        },
      },
    ],
  });
}

export function framePointLoadDialog(app: App): void {
  const ids = need(app, 'frames');
  if (!ids) return;
  const dir = dirField();
  const P = numField('Load P', 10, { q: 'F' });
  const rd = numField('Relative distance from end I', 0.5, { min: 0, max: 1 });
  const lc = caseField(app);
  const mode = modeField();
  openDialog({
    title: `Frame point load on ${ids.length} frame(s)`,
    body: h(
      'div',
      { class: 'form' },
      lc.row,
      dir.row,
      P.row,
      rd.row,
      mode.row,
      h('p', { class: 'muted small' }, 'Gravity loads act downward (−Z) for positive values. Relative distance 0 = end I, 1 = end J.'),
    ),
    buttons: [
      { label: 'Cancel' },
      {
        label: 'Apply',
        kind: 'primary',
        action: () => {
          const p = P.get();
          const r = rd.get();
          const md = mode.get();
          const cs = (app.lastLoadCase = lc.get());
          if (md !== 'delete' && (!Number.isFinite(p) || !Number.isFinite(r))) return fail('Fix the highlighted fields');
          app.model.commit('frame point loads', (d) => {
            if (md !== 'add') d.framePointLoads = d.framePointLoads.filter((l) => l.case !== cs || !ids.includes(l.frame));
            if (md === 'delete' || p === 0) return;
            for (const id of ids) d.framePointLoads.push({ case: cs, frame: id, dir: dir.get(), P: p, rd: r });
          });
          toast(md === 'delete' ? 'Point loads deleted' : `Point load applied to ${ids.length} frame(s)`, 'ok');
        },
      },
    ],
  });
}

export function frameUniformLoadDialog(app: App): void {
  const ids = need(app, 'frames');
  if (!ids) return;
  const dir = dirField();
  const w = numField('Uniform load w', 5, { q: 'FL' });
  const lc = caseField(app);
  const mode = modeField();
  openDialog({
    title: `Frame uniform load on ${ids.length} frame(s)`,
    body: h('div', { class: 'form' }, lc.row, dir.row, w.row, mode.row, h('p', { class: 'muted small' }, 'Load per unit length along the full member. Gravity loads act downward for positive values.')),
    buttons: [
      { label: 'Cancel' },
      {
        label: 'Apply',
        kind: 'primary',
        action: () => {
          const v = w.get();
          const md = mode.get();
          const cs = (app.lastLoadCase = lc.get());
          if (md !== 'delete' && !Number.isFinite(v)) return fail('Enter a load value');
          app.model.commit('frame uniform loads', (d) => {
            if (md !== 'add') d.frameUniformLoads = d.frameUniformLoads.filter((l) => l.case !== cs || !ids.includes(l.frame));
            if (md === 'delete' || v === 0) return;
            for (const id of ids) d.frameUniformLoads.push({ case: cs, frame: id, dir: dir.get(), w: v });
          });
          toast(md === 'delete' ? 'Uniform loads deleted' : `Uniform load applied to ${ids.length} frame(s)`, 'ok');
        },
      },
    ],
  });
}

export function areaLoadDialog(app: App): void {
  const ids = need(app, 'areas');
  if (!ids) return;
  const q = numField('Uniform pressure q (gravity)', 5, { q: 'FA' });
  const lc = caseField(app);
  const mode = modeField();
  openDialog({
    title: `Area load on ${ids.length} area(s)`,
    body: h('div', { class: 'form' }, lc.row, q.row, mode.row, h('p', { class: 'muted small' }, 'Positive values act downward. The load is distributed to the surrounding frames.')),
    buttons: [
      { label: 'Cancel' },
      {
        label: 'Apply',
        kind: 'primary',
        action: () => {
          const v = q.get();
          const md = mode.get();
          const cs = (app.lastLoadCase = lc.get());
          if (md !== 'delete' && !Number.isFinite(v)) return fail('Enter a load value');
          app.model.commit('area loads', (d) => {
            if (md !== 'add') d.areaLoads = d.areaLoads.filter((l) => l.case !== cs || !ids.includes(l.area));
            if (md === 'delete' || v === 0) return;
            for (const id of ids) {
              const ex = md === 'add' ? d.areaLoads.find((l) => l.area === id && l.case === cs) : undefined;
              if (ex) ex.q += v;
              else d.areaLoads.push({ case: cs, area: id, q: v });
            }
          });
          toast(md === 'delete' ? 'Area loads deleted' : `Area load applied to ${ids.length} area(s)`, 'ok');
        },
      },
    ],
  });
}

export async function clearSelectedLoads(app: App): Promise<void> {
  const s = app.selected();
  const n = s.joints.length + s.frames.length + s.areas.length;
  if (!n) return void toast('Select objects first', 'warn');
  if (!(await confirmDialog('Clear loads', `Delete all loads (all load cases) on the ${n} selected object(s)?`, 'Delete loads', true))) return;
  app.model.commit('clear loads', (d) => {
    d.jointLoads = d.jointLoads.filter((l) => !s.joints.includes(l.joint));
    d.framePointLoads = d.framePointLoads.filter((l) => !s.frames.includes(l.frame));
    d.frameUniformLoads = d.frameUniformLoads.filter((l) => !s.frames.includes(l.frame));
    d.areaLoads = d.areaLoads.filter((l) => !s.areas.includes(l.area));
  });
}

// ======================================================================= EDIT
export function addJointDialog(app: App): void {
  const x = numField('X', 0, { q: 'L' });
  const y = numField('Y', 0, { q: 'L' });
  const z = numField('Z', 0, { q: 'L' });
  openDialog({
    title: 'Add joint by coordinates',
    body: h('div', { class: 'form' }, h('div', { class: 'grid3' }, x.row, y.row, z.row)),
    buttons: [
      { label: 'Close' },
      {
        label: 'Add',
        kind: 'primary',
        action: () => {
          const v = [x.get(), y.get(), z.get()];
          if (v.some((n) => !Number.isFinite(n))) return fail('Fix the highlighted fields');
          const before = app.model.data.joints.length;
          const id = app.model.addJoint(v[0], v[1], v[2]);
          toast(app.model.data.joints.length > before ? `Joint ${id} added` : `Joint ${id} already exists there`, 'ok');
          return false;
        },
      },
    ],
  });
}

export function addFrameDialog(app: App): void {
  const i = numField('Joint I', null, { min: 1 });
  const j = numField('Joint J', null, { min: 1 });
  openDialog({
    title: 'Add frame between joints',
    body: h('div', { class: 'form' }, h('div', { class: 'grid2' }, i.row, j.row)),
    buttons: [
      { label: 'Close' },
      {
        label: 'Add',
        kind: 'primary',
        action: () => {
          const a = i.get();
          const b = j.get();
          if (!app.model.joint(a) || !app.model.joint(b)) return fail('Both joints must exist');
          const id = app.model.addFrame(a, b);
          if (id === null) return fail('Joints I and J must be different');
          toast(`Frame ${id} (${a}–${b})`, 'ok');
          return false;
        },
      },
    ],
  });
}

function vecFields(label: string) {
  return [numField(label + 'X', 0, { q: 'L' }), numField(label + 'Y', 0, { q: 'L' }), numField(label + 'Z', 0, { q: 'L' })];
}

export function moveDialog(app: App): void {
  const s = app.selected();
  const js = app.model.jointsOf(s.joints, s.frames, s.areas);
  if (!js.size) return void toast('Select objects to move', 'warn');
  const f = vecFields('Δ');
  openDialog({
    title: `Move ${js.size} joint(s)`,
    body: h('div', { class: 'form' }, h('div', { class: 'grid3' }, ...f.map((x) => x.row))),
    buttons: [
      { label: 'Cancel' },
      {
        label: 'Move',
        kind: 'primary',
        action: () => {
          const v = f.map((x) => x.get());
          if (v.some((n) => !Number.isFinite(n))) return fail('Fix the highlighted fields');
          const err = app.model.moveJoints(js, v[0], v[1], v[2]);
          if (err) return fail(err);
        },
      },
    ],
  });
}

export function replicateDialog(app: App): void {
  const s = app.selected();
  if (!s.joints.length && !s.frames.length && !s.areas.length) return void toast('Select objects to replicate', 'warn');
  const f = vecFields('Δ');
  const n = numField('Number of copies', 1, { min: 1, max: 100 });
  openDialog({
    title: 'Replicate (linear copy)',
    body: h('div', { class: 'form' }, h('div', { class: 'grid3' }, ...f.map((x) => x.row)), n.row, h('p', { class: 'muted small' }, 'Copies selected objects with their properties, supports and loads.')),
    buttons: [
      { label: 'Cancel' },
      {
        label: 'Replicate',
        kind: 'primary',
        action: () => {
          const v = f.map((x) => x.get());
          const k = Math.round(n.get());
          if (v.some((x) => !Number.isFinite(x)) || !(k >= 1)) return fail('Fix the highlighted fields');
          if (v.every((x) => x === 0)) return fail('Enter a non-zero offset');
          const c = app.model.replicate(s.joints, s.frames, s.areas, v[0], v[1], v[2], k);
          toast(`Created ${c.joints.length} joint(s), ${c.frames.length} frame(s), ${c.areas.length} area(s)`, 'ok');
        },
      },
    ],
  });
}

export function divideDialog(app: App): void {
  const ids = need(app, 'frames');
  if (!ids) return;
  const n = numField('Divide each frame into', 2, { min: 2, max: 100 });
  openDialog({
    title: `Divide ${ids.length} frame(s)`,
    body: h('div', { class: 'form' }, n.row),
    buttons: [
      { label: 'Cancel' },
      {
        label: 'Divide',
        kind: 'primary',
        action: () => {
          const k = Math.round(n.get());
          if (!(k >= 2)) return fail('Enter 2 or more');
          app.model.commit('divide frames', () => {
            for (const id of ids) app.model.divideFrame(id, k);
          });
          app.select([], 'replace');
        },
      },
    ],
  });
}

// ======================================================================= RESULTS / HELP
export function resultsTablesDialog(app: App): void {
  const r = app.results;
  if (!r) return void toast('Run the analysis first', 'warn');
  const tabs: [string, () => HTMLElement][] = [
    [
      'Joint displacements',
      () =>
        listTable(
          ['Joint', ...['UX', 'UY', 'UZ'].map((t) => `${t} (${uLabel('L')})`), 'RX (rad)', 'RY (rad)', 'RZ (rad)'],
          app.model.data.joints.map((j) =>
            [String(j.id), ...(r.disp[j.id] ?? []).map((v, k) => (k < 3 ? fmtU(v, 'L', 4) : fmt(v, 4)))].map((t) => document.createTextNode(t)),
          ),
        ),
    ],
    [
      'Support reactions',
      () =>
        listTable(
          ['Joint', ...['FX', 'FY', 'FZ'].map((t) => `${t} (${uLabel('F')})`), ...['MX', 'MY', 'MZ'].map((t) => `${t} (${uLabel('M')})`)],
          Object.entries(r.reactions).map(([id, v]) => [id, ...v.map((x, k) => fmtU(x, k < 3 ? 'F' : 'M', 4))].map((t) => document.createTextNode(t))),
        ),
    ],
    [
      'Frame end forces',
      () =>
        listTable(
          ['Frame', 'End', ...['P', 'V2', 'V3'].map((t) => `${t} (${uLabel('F')})`), ...['T', 'M2', 'M3'].map((t) => `${t} (${uLabel('M')})`)],
          r.frames.flatMap((f) => {
            const n = f.x.length - 1;
            const at = (k: number) => [f.P[k], f.V2[k], f.V3[k], f.T[k], f.M2[k], f.M3[k]].map((v, c) => fmtU(v, c < 3 ? 'F' : 'M', 4));
            return [
              [String(f.id), 'I', ...at(0)].map((t) => document.createTextNode(t)),
              ['', 'J', ...at(n)].map((t) => document.createTextNode(t)),
            ];
          }),
        ),
    ],
  ];
  const content = h('div', { class: 'tab-content' });
  const bar = h('div', { class: 'tabs' });
  const show = (i: number) => {
    content.replaceChildren(tabs[i][1]());
    [...bar.children].forEach((c, k) => c.classList.toggle('active', k === i));
  };
  tabs.forEach(([t], i) => bar.append(h('button', { class: 'tab', type: 'button', onclick: () => show(i) }, t)));
  show(0);
  const s = r.stats;
  const summary = h(
    'p',
    { class: 'muted small' },
    `Applied load ΣF = (${s.sumLoad.map((v) => fmtU(v, 'F', 4)).join(', ')}) ${uLabel('F')} · Reactions ΣR = (${s.sumReaction.map((v) => fmtU(v, 'F', 4)).join(', ')}) ${uLabel('F')} · Max displacement ${withU(s.maxDisp, 'L', 4)}`,
  );
  openDialog({ title: `Analysis results — ${app.resultName}`, wide: true, body: h('div', null, summary, bar, content), buttons: [{ label: 'Close', kind: 'primary' }] });
}

export function helpDialog(): void {
  const rows: [string, string, string][] = [
    ['Select', 'Tap object', 'Click object'],
    ['Add to selection', 'Multi tool, then tap', 'Shift/Ctrl + click'],
    ['Box select', 'Box tool, drag (→ window, ← crossing)', 'Box tool or Ctrl + drag'],
    ['Rotate view', 'One-finger drag', 'Left drag'],
    ['Pan', 'Two-finger drag', 'Right/middle drag or Shift + drag'],
    ['Zoom', 'Pinch', 'Mouse wheel / trackpad pinch'],
    ['Context menu', 'Long-press', 'Right-click'],
    ['Finish frame/area', 'Done button', 'Enter or Done'],
    ['Cancel / clear selection', '—', 'Esc'],
    ['Delete', 'Delete button', 'Delete key'],
    ['Undo / Redo', 'Undo / Redo buttons', 'Ctrl+Z / Ctrl+Y'],
    ['Fit view', 'Fit button', 'F'],
    ['Rotate work plane (XY → XZ → YZ)', 'Plane button (passes through a single selected joint)', 'P'],
    ['Shift work plane ± grid spacing', 'Up / Down plane buttons', 'PgUp / PgDn'],
  ];
  const body = h(
    'div',
    null,
    listTable(['Action', 'Touch (iPad/Android)', 'Mouse & keyboard'], rows.map((r) => r.map((t) => document.createTextNode(t)))),
    h(
      'ol',
      { class: 'small' },
      h('li', null, 'Define → Materials, Sections and Support types.'),
      h('li', null, 'Draw joints, frames and areas on the grid. Use the plane buttons in the toolbar (or Define → Grid & work plane) to change the plane and its offset.'),
      h('li', null, 'Select objects and use Assign to set materials, sections and supports.'),
      h('li', null, 'Apply loads from the Loads menu.'),
      h('li', null, 'Analyze → Run analysis, then pick a result view and adjust the scale.'),
      h('li', null, 'File → Save writes a comma-separated .sav file that opens in Excel.'),
    ),
    h(
      'p',
      { class: 'muted small' },
      `Current units: ${(['F', 'L', 'FL', 'FA', 'M'] as Qty[]).map((q) => uLabel(q)).join(', ')} (${units().label}) — change them with the units selector at the bottom-right. Z is vertical (up).`,
    ),
  );
  openDialog({ title: 'Help', wide: true, body, buttons: [{ label: 'Close', kind: 'primary' }] });
}

// ======================================================================= LOAD CASES / COMBINATIONS
const caseLoadCount = (d: App['model']['data'], name: string) =>
  d.jointLoads.filter((l) => l.case === name).length +
  d.framePointLoads.filter((l) => l.case === name).length +
  d.frameUniformLoads.filter((l) => l.case === name).length +
  d.areaLoads.filter((l) => l.case === name).length;

export const comboText = (c: LoadCombo) => (c.factors.length ? c.factors.map((f, i) => `${i ? (f.factor < 0 ? '− ' : '+ ') : f.factor < 0 ? '−' : ''}${fmt(Math.abs(f.factor), 3)} ${f.case}`).join(' ') : '(empty)');

export function loadCasesDialog(app: App): void {
  const m = app.model;
  const body = h('div');
  const render = () => {
    body.replaceChildren(
      listTable(
        ['Name', 'Type', 'Loads', ''],
        m.data.loadCases.map((lc, i) => [
          document.createTextNode(lc.name),
          document.createTextNode(lc.type + (i === m.data.loadCases.findIndex((x) => x.type === 'Dead') && m.data.settings.selfWeight ? ' + self weight' : '')),
          document.createTextNode(String(caseLoadCount(m.data, lc.name))),
          h('span', { class: 'row-btns' }, btn('Edit', () => edit(lc)), btn('Delete', () => void del(lc), 'small danger')),
        ]),
      ),
      h('div', { class: 'dlg-actions' }, btn('+ Add load case', () => edit(null), 'primary')),
      h('p', { class: 'muted small' }, 'Each load case is analysed separately. Self weight (if enabled) is added to the first Dead case. Combine cases with Loads → Load combinations.'),
    );
  };
  const del = async (lc: LoadCase) => {
    if (m.data.loadCases.length <= 1) return void toast('At least one load case is required', 'warn');
    const n = caseLoadCount(m.data, lc.name);
    if (n && !(await confirmDialog('Delete load case', `Load case "${lc.name}" has ${n} load(s). Delete the case and its loads?`, 'Delete', true))) return;
    m.commit('delete load case', (d) => {
      const keep = (l: { case: string }) => l.case !== lc.name;
      d.loadCases = d.loadCases.filter((x) => x.name !== lc.name);
      d.jointLoads = d.jointLoads.filter(keep);
      d.framePointLoads = d.framePointLoads.filter(keep);
      d.frameUniformLoads = d.frameUniformLoads.filter(keep);
      d.areaLoads = d.areaLoads.filter(keep);
      for (const c of d.loadCombos) c.factors = c.factors.filter((f) => f.case !== lc.name);
    });
    render();
  };
  const edit = (lc: LoadCase | null) => {
    const name = textField('Name', lc?.name ?? `CASE${m.data.loadCases.length + 1}`);
    const type = selectField<LoadCaseType>('Type', LOAD_CASE_TYPES.map((t) => [t, t]), lc?.type ?? 'Other');
    openDialog({
      title: lc ? `Edit load case ${lc.name}` : 'Add load case',
      body: h('div', { class: 'form' }, name.row, type.row),
      buttons: [
        { label: 'Cancel' },
        {
          label: 'OK',
          kind: 'primary',
          action: () => {
            const n = name.get();
            const taken = [...m.data.loadCases.filter((x) => x !== lc).map((x) => x.name), ...m.data.loadCombos.map((x) => x.name)];
            const err = nameValid(n, taken, 'Load case');
            if (err) return fail(err);
            m.commit(lc ? 'edit load case' : 'add load case', (d) => {
              if (!lc) return void d.loadCases.push({ name: n, type: type.get() });
              const rec = d.loadCases.find((x) => x.name === lc.name)!;
              rec.type = type.get();
              if (n === lc.name) return;
              rec.name = n;
              for (const arr of [d.jointLoads, d.framePointLoads, d.frameUniformLoads, d.areaLoads]) for (const l of arr) if (l.case === lc.name) l.case = n;
              for (const c of d.loadCombos) for (const f of c.factors) if (f.case === lc.name) f.case = n;
            });
            if (lc && app.lastLoadCase === lc.name) app.lastLoadCase = n;
            render();
          },
        },
      ],
    });
  };
  render();
  openDialog({ title: 'Load cases', body, buttons: [{ label: 'Close', kind: 'primary' }] });
}

export function loadCombosDialog(app: App): void {
  const m = app.model;
  const body = h('div');
  const render = () => {
    body.replaceChildren(
      m.data.loadCombos.length
        ? listTable(
            ['Name', 'Combination', ''],
            m.data.loadCombos.map((c) => [
              document.createTextNode(c.name),
              document.createTextNode(comboText(c)),
              h('span', { class: 'row-btns' }, btn('Edit', () => edit(c)), btn('Delete', () => del(c), 'small danger')),
            ]),
          )
        : h('p', { class: 'muted' }, 'No load combinations. Results are shown per load case.'),
      h('div', { class: 'dlg-actions' }, btn('+ Add combination', () => edit(null), 'primary')),
      h('p', { class: 'muted small' }, 'Combination results are the factored sum of the load case results (linear superposition).'),
    );
  };
  const del = (c: LoadCombo) => {
    m.commit('delete load combination', (d) => {
      d.loadCombos = d.loadCombos.filter((x) => x.name !== c.name);
    });
    render();
  };
  const edit = (c: LoadCombo | null) => {
    const name = textField('Name', c?.name ?? `COMBO${m.data.loadCombos.length + 1}`);
    const facs = m.data.loadCases.map((lc) => ({
      lc,
      f: numField(`× ${lc.name}`, c ? (c.factors.find((x) => x.case === lc.name)?.factor ?? 0) : 0, { placeholder: '0' }),
    }));
    openDialog({
      title: c ? `Edit combination ${c.name}` : 'Add load combination',
      body: h(
        'div',
        { class: 'form' },
        name.row,
        h('p', { class: 'muted small' }, 'Scale factor for each load case (0 = not included).'),
        h('div', { class: 'grid2' }, ...facs.map((x) => x.f.row)),
      ),
      buttons: [
        { label: 'Cancel' },
        {
          label: 'OK',
          kind: 'primary',
          action: () => {
            const n = name.get();
            const taken = [...m.data.loadCombos.filter((x) => x !== c).map((x) => x.name), ...m.data.loadCases.map((x) => x.name)];
            const err = nameValid(n, taken, 'Combination');
            if (err) return fail(err);
            const factors = facs.map((x) => ({ case: x.lc.name, factor: x.f.input.value.trim() === '' ? 0 : x.f.get() }));
            if (factors.some((x) => !Number.isFinite(x.factor))) return fail('Fix the highlighted fields');
            const used = factors.filter((x) => x.factor !== 0);
            if (!used.length) return fail('Enter at least one non-zero factor');
            m.commit(c ? 'edit load combination' : 'add load combination', (d) => {
              const rec = { name: n, factors: used };
              if (c) d.loadCombos[d.loadCombos.findIndex((x) => x.name === c.name)] = rec;
              else d.loadCombos.push(rec);
            });
            render();
          },
        },
      ],
    });
  };
  render();
  openDialog({ title: 'Load combinations', body, buttons: [{ label: 'Close', kind: 'primary' }] });
}

export { closeFrameDiagrams, frameDiagramsDialog, refreshFrameDiagrams } from './diagrams';