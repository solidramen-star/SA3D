import type { App } from './app';
import { btn, checkField, h, listTable, numField, selectField, toast } from './dom';
import { restraintText, springText } from './dialogs';
import { frameDiagramsDialog } from './diagrams';
import { DOF_NAMES, formatReleases, hasSprings, LOAD_DIR_LABEL, type AreaDistribution, type Restraint } from '../model/types';
import { SHAPE_LABEL, sectionProps } from '../model/sections';
import { fmt, fmtU, uLabel, withU } from '../model/units';
import { polygonArea } from '../solver/loads';

const kv = (rows: [string, string | Node][]) =>
  h('dl', { class: 'kv' }, ...rows.flatMap(([k, v]) => [h('dt', null, k), h('dd', null, v)]));

const section = (title: string, ...children: (Node | null)[]) => h('section', { class: 'insp-sec' }, h('h3', null, title), ...children);

export function renderInspector(app: App, host: HTMLElement): void {
  const s = app.selected();
  const n = s.joints.length + s.frames.length + s.areas.length;
  host.replaceChildren();
  if (n === 0) host.append(...summary(app));
  else if (n === 1 && s.joints.length) host.append(...jointPanel(app, s.joints[0]));
  else if (n === 1 && s.frames.length) host.append(...framePanel(app, s.frames[0]));
  else if (n === 1 && s.areas.length) host.append(...areaPanel(app, s.areas[0]));
  else host.append(...multiPanel(app, s));
}

function summary(app: App): Node[] {
  const d = app.model.data;
  const out: Node[] = [
    section(
      'Model',
      kv([
        ['Joints', String(d.joints.length)],
        ['Frames', String(d.frames.length)],
        ['Areas', String(d.areas.length)],
        ['Supported joints', String(d.joints.filter((j) => j.r.some(Boolean)).length)],
        ['Spring joints', String(d.joints.filter(hasSprings).length)],
        ['Loads', String(d.jointLoads.length + d.jointDisplacements.length + d.framePointLoads.length + d.frameUniformLoads.length + d.areaLoads.length)],
        ['Self weight', d.settings.selfWeight ? 'Included' : 'Off'],
      ]),
    ),
  ];
  const r = app.results;
  if (r) {
    out.push(
      section(
        `Analysis results — ${app.resultName}`,
        kv([
          ['Equations', String(r.stats.equations)],
          ['Max displacement', withU(r.stats.maxDisp, 'L', 4)],
          ['ΣLoad (X,Y,Z)', r.stats.sumLoad.map((v) => fmtU(v, 'F', 4)).join(', ') + ' ' + uLabel('F')],
          ['ΣReaction (X,Y,Z)', r.stats.sumReaction.map((v) => fmtU(v, 'F', 4)).join(', ') + ' ' + uLabel('F')],
        ]),
        btn('Show result tables…', () => app.cmd('resultsTables')),
      ),
    );
    if (r.warnings.length) out.push(section('Warnings', h('ul', { class: 'warn-list' }, ...r.warnings.map((w) => h('li', null, w)))));
  }
  out.push(h('p', { class: 'muted small' }, 'Tap a joint, frame or area to see and edit its properties.'));
  return out;
}

function applyRow(fields: { get(): number }[], label: string, apply: (v: number[]) => string | null | void) {
  return btn(
    label,
    () => {
      const v = fields.map((f) => f.get());
      if (v.some((x) => !Number.isFinite(x))) return toast('Fix the highlighted fields', 'error');
      const err = apply(v);
      if (err) toast(err, 'error');
    },
    'small primary',
  );
}

function jointPanel(app: App, id: number): Node[] {
  const m = app.model;
  const j = m.joint(id)!;
  const x = numField('X', j.x, { q: 'L' });
  const y = numField('Y', j.y, { q: 'L' });
  const z = numField('Z', j.z, { q: 'L' });
  const checks = DOF_NAMES.map((nm, i) => checkField(nm, j.r[i]));
  for (const c of checks)
    c.input.addEventListener('change', () =>
      m.commit('restraint', () => {
        m.joint(id)!.r = checks.map((k) => k.get()) as Restraint;
      }),
    );
  const presets = h(
    'div',
    { class: 'chips' },
    ...m.data.supportTypes.map((st) =>
      btn(st.name, () =>
        m.commit('support', () => {
          m.joint(id)!.r = [...st.r] as Restraint;
        }),
      ),
    ),
  );
  const loads = m.data.jointLoads.filter((l) => l.joint === id);
  const disps = m.data.jointDisplacements.filter((l) => l.joint === id);
  const out: Node[] = [
    h('h2', { class: 'insp-title' }, `Joint ${id}`),
    section(
      'Coordinates',
      h('div', { class: 'grid3' }, x.row, y.row, z.row),
      applyRow([x, y, z], 'Apply', (v) => m.moveJoints(new Set([id]), v[0] - j.x, v[1] - j.y, v[2] - j.z)),
    ),
    section('Support (' + restraintText(j.r) + ')', presets, h('div', { class: 'chk-row wrap' }, ...checks.map((c) => c.row))),
    section(
      'Springs',
      h('p', { class: 'muted small' }, springText(j.k) + (j.k ? ` (${uLabel('FL')}, ${uLabel('MR')})` : '')),
      h(
        'div',
        { class: 'row-btns' },
        btn('Edit springs…', () => app.cmd('assignSpring')),
        j.k
          ? btn(
              'Remove',
              () =>
                m.commit('clear springs', () => {
                  delete m.joint(id)!.k;
                }),
              'small danger',
            )
          : null,
      ),
    ),
    section(
      'Joint loads',
      loads.length
        ? listTable(
            ['Case', ...['FX', 'FY', 'FZ'].map((t) => `${t} (${uLabel('F')})`), ...['MX', 'MY', 'MZ'].map((t) => `${t} (${uLabel('M')})`)],
            loads.map((l) => [l.case, ...l.f.map((v, k) => fmtU(v, k < 3 ? 'F' : 'M', 4))]),
            true,
          )
        : h('p', { class: 'muted small' }, 'None'),
      h(
        'div',
        { class: 'row-btns' },
        btn('Add load…', () => app.cmd('jointLoad')),
        loads.length
          ? btn(
              'Delete loads',
              () =>
                m.commit('delete joint loads', (d) => {
                  d.jointLoads = d.jointLoads.filter((l) => l.joint !== id);
                }),
              'small danger',
            )
          : null,
      ),
    ),
  ];
  if (disps.length)
    out.push(
      section(
        'Prescribed displacements',
        listTable(
          ['Case', ...['UX', 'UY', 'UZ'].map((t) => `${t} (${uLabel('L')})`), 'RX', 'RY', 'RZ'],
          disps.map((l) => [l.case, ...l.d.map((v, k) => (k < 3 ? fmtU(v, 'L', 4) : fmt(v, 4)))]),
          true,
        ),
        h(
          'div',
          { class: 'row-btns' },
          btn('Edit…', () => app.cmd('jointDisp')),
          btn(
            'Delete',
            () =>
              m.commit('delete joint displacements', (d) => {
                d.jointDisplacements = d.jointDisplacements.filter((l) => l.joint !== id);
              }),
            'small danger',
          ),
        ),
      ),
    );
  const conn = m.data.frames.filter((f) => f.i === id || f.j === id).map((f) => f.id);
  out.push(kv([['Connected frames', conn.length ? conn.join(', ') : 'None']]));
  const r = app.results;
  if (r && r.disp[id]) {
    const dv = r.disp[id];
    out.push(
      section(
        `Displacement — ${app.resultName}`,
        listTable(['UX', 'UY', 'UZ'].map((t) => `${t} (${uLabel('L')})`), [dv.slice(0, 3).map((v) => fmtU(v, 'L', 4))], true),
        listTable(['RX (rad)', 'RY (rad)', 'RZ (rad)'], [dv.slice(3).map((v) => fmt(v, 4))], true),
      ),
    );
    const rv = r.reactions[id];
    if (rv)
      out.push(
        section(
          'Support reaction',
          listTable(['FX', 'FY', 'FZ'].map((t) => `${t} (${uLabel('F')})`), [rv.slice(0, 3).map((v) => fmtU(v, 'F', 4))], true),
          listTable(['MX', 'MY', 'MZ'].map((t) => `${t} (${uLabel('M')})`), [rv.slice(3).map((v) => fmtU(v, 'M', 4))], true),
        ),
      );
  }
  return out;
}

function framePanel(app: App, id: number): Node[] {
  const m = app.model;
  const d = m.data;
  const f = m.frame(id)!;
  const mat = selectField('Material', d.materials.map((x) => [x.name, x.name]), f.material);
  const sec = selectField('Section', d.sections.map((x) => [x.name, `${x.name} (${SHAPE_LABEL[x.shape]})`]), f.section);
  const beta = numField('Angle β', f.beta, { unit: '°' });
  mat.input.addEventListener('change', () => m.commit('assign material', () => void (m.frame(id)!.material = mat.get())));
  sec.input.addEventListener('change', () => m.commit('assign section', () => void (m.frame(id)!.section = sec.get())));
  const secObj = d.sections.find((s) => s.name === f.section);
  const p = secObj ? sectionProps(secObj) : null;
  const pl = d.framePointLoads.filter((l) => l.frame === id);
  const ul = d.frameUniformLoads.filter((l) => l.frame === id);
  const out: Node[] = [
    h('h2', { class: 'insp-title' }, `Frame ${id}`),
    kv([
      ['Joints I → J', `${f.i} → ${f.j}`],
      ['Length', withU(m.frameLength(f), 'L', 4)],
    ]),
    section(
      'Properties',
      mat.row,
      sec.row,
      p ? h('p', { class: 'muted small' }, `A = ${withU(p.A, 'A', 4)}, I33 = ${withU(p.I33, 'L4', 4)}, I22 = ${withU(p.I22, 'L4', 4)}, J = ${withU(p.J, 'L4', 4)}, As2 = ${withU(p.As2, 'A', 4)}, As3 = ${withU(p.As3, 'A', 4)}`) : null,
      secObj?.catalog
        ? h('p', { class: 'muted small' }, `Catalog: ${secObj.catalog}${secObj.props ? ' (published properties)' : ''}${secObj.mass ? `, ${fmt(secObj.mass, 4)} kg/m` : ''}`)
        : null,
      beta.row,
      applyRow([beta], 'Apply β', (v) => void m.commit('beta', () => void (m.frame(id)!.beta = v[0]))),
    ),
    section(
      'End releases',
      kv([
        ['End I (Joint ' + f.i + ')', formatReleases(f.relI)],
        ['End J (Joint ' + f.j + ')', formatReleases(f.relJ)],
      ]),
      h(
        'div',
        { class: 'row-btns' },
        btn('Edit releases…', () => app.cmd('assignReleases')),
        f.relI || f.relJ
          ? btn('Set continuous', () => {
              m.commit('clear releases', () => {
                delete m.frame(id)!.relI;
                delete m.frame(id)!.relJ;
              });
            })
          : null,
      ),
    ),
    section(
      'Frame loads',
      pl.length || ul.length
        ? listTable(
            ['Case', 'Type', 'Direction', 'Value', 'Position'],
            [
              ...pl.map((l) => [l.case, 'Point', LOAD_DIR_LABEL[l.dir], withU(l.P, 'F', 4), 'rd = ' + fmt(l.rd, 3)]),
              ...ul.map((l) => [l.case, 'Uniform', LOAD_DIR_LABEL[l.dir], withU(l.w, 'FL', 4), 'full length']),
            ],
            true,
          )
        : h('p', { class: 'muted small' }, 'None'),
      h(
        'div',
        { class: 'row-btns' },
        btn('Point load…', () => app.cmd('framePoint')),
        btn('Uniform load…', () => app.cmd('frameUniform')),
        pl.length || ul.length
          ? btn(
              'Delete loads',
              () =>
                m.commit('delete frame loads', (dd) => {
                  dd.framePointLoads = dd.framePointLoads.filter((l) => l.frame !== id);
                  dd.frameUniformLoads = dd.frameUniformLoads.filter((l) => l.frame !== id);
                }),
              'small danger',
            )
          : null,
      ),
    ),
  ];
  const fr = app.results?.frames.find((x) => x.id === id);
  if (fr) {
    const n = fr.x.length - 1;
    const comps = ['P', 'V2', 'V3', 'T', 'M2', 'M3'] as const;
    const qty = (i: number) => (i < 3 ? 'F' : 'M') as 'F' | 'M';
    const rows = comps.map((c, i) => {
      const arr = fr[c];
      const q = qty(i);
      return [`${c} (${uLabel(q)})`, fmtU(arr[0], q, 4), fmtU(arr[n], q, 4), fmtU(Math.max(...arr), q, 4), fmtU(Math.min(...arr), q, 4)];
    });
    let maxD = 0;
    for (const v of fr.disp) maxD = Math.max(maxD, Math.hypot(...v));
    out.push(
      section(
        `Internal forces — ${app.resultName}`,
        listTable(['', 'End I', 'End J', 'Max', 'Min'], rows, true),
        h('p', { class: 'muted small' }, `Max displacement along member: ${withU(maxD, 'L', 4)}`),
        btn('Diagrams…', () => frameDiagramsDialog(app, id)),
      ),
    );
    const details = h(
      'details',
      null,
      h('summary', null, 'Station values'),
      listTable(
        [`x (${uLabel('L')})`, ...comps.map((c, i) => `${c} (${uLabel(qty(i))})`)],
        fr.x.map((x, k) => [fmtU(x, 'L', 4), ...comps.map((c, i) => fmtU(fr[c][k], qty(i), 4))]),
        true,
      ),
    );
    out.push(details);
  }
  return out;
}

function areaPanel(app: App, id: number): Node[] {
  const m = app.model;
  const a = m.area(id)!;
  const jm = m.jointMap();
  const pts = a.joints.map((j) => jm.get(j)!).filter(Boolean);
  const size = polygonArea(pts.map((p): [number, number, number] => [p.x, p.y, p.z]));
  const dist = selectField<AreaDistribution>(
    'Load distribution',
    [
      ['two-way', 'Two-way'],
      ['one-way', 'One-way'],
    ],
    a.distribution,
  );
  dist.input.addEventListener('change', () => m.commit('distribution', () => void (m.area(id)!.distribution = dist.get())));
  const loads = m.data.areaLoads.filter((l) => l.area === id);
  return [
    h('h2', { class: 'insp-title' }, `Area ${id}`),
    kv([
      ['Joints', a.joints.join(', ')],
      ['Area', withU(size, 'A', 4)],
    ]),
    section('Properties', dist.row, h('p', { class: 'muted small' }, 'Areas carry no stiffness; loads are transferred to the edge frames.')),
    section(
      'Area loads',
      loads.length ? listTable(['Case', `q (${uLabel('FA')}, down)`], loads.map((l) => [l.case, fmtU(l.q, 'FA', 4)]), true) : h('p', { class: 'muted small' }, 'None'),
      h(
        'div',
        { class: 'row-btns' },
        btn('Add load…', () => app.cmd('areaLoad')),
        loads.length
          ? btn(
              'Delete loads',
              () =>
                m.commit('delete area loads', (d) => {
                  d.areaLoads = d.areaLoads.filter((l) => l.area !== id);
                }),
              'small danger',
            )
          : null,
      ),
    ),
  ];
}

function multiPanel(app: App, s: { joints: number[]; frames: number[]; areas: number[] }): Node[] {
  const out: Node[] = [
    h('h2', { class: 'insp-title' }, 'Selection'),
    kv([
      ['Joints', s.joints.length ? s.joints.join(', ') : '–'],
      ['Frames', s.frames.length ? s.frames.join(', ') : '–'],
      ['Areas', s.areas.length ? s.areas.join(', ') : '–'],
    ]),
  ];
  const btns: Node[] = [];
  if (s.joints.length) btns.push(btn('Supports…', () => app.cmd('assignSupport')), btn('Springs…', () => app.cmd('assignSpring')), btn('Joint load…', () => app.cmd('jointLoad')));
  if (s.frames.length)
    btns.push(
      btn('Material…', () => app.cmd('assignMaterial')),
      btn('Section…', () => app.cmd('assignSection')),
      btn('End releases…', () => app.cmd('assignReleases')),
      btn('Point load…', () => app.cmd('framePoint')),
      btn('Uniform load…', () => app.cmd('frameUniform')),
    );
  if (s.areas.length) btns.push(btn('Area load…', () => app.cmd('areaLoad')));
  btns.push(btn('Move…', () => app.cmd('move')), btn('Replicate…', () => app.cmd('replicate')), btn('Delete', () => app.cmd('delete'), 'small danger'));
  out.push(section('Quick actions', h('div', { class: 'chips' }, ...btns)));
  return out;
}
