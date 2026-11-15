import { editU, fromU, uLabel, type Qty } from '../model/units';

type Child = Node | string | null | undefined | false;

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, unknown> | null = null,
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v === undefined || v === null || v === false) continue;
      if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v as EventListener);
      else if (k === 'class') el.className = String(v);
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k in el && typeof v !== 'string') (el as unknown as Record<string, unknown>)[k] = v;
      else el.setAttribute(k, v === true ? '' : String(v));
    }
  }
  for (const c of children) if (c !== null && c !== undefined && c !== false) el.append(c);
  return el;
}

/** Parse a number typed on any keyboard: accepts "," as decimal separator and exponents. */
export function parseNum(s: string): number {
  const t = s.trim().replace(/\s/g, '').replace(',', '.');
  if (t === '') return NaN;
  return Number(t);
}

export interface Field<T> {
  row: HTMLElement;
  input: HTMLInputElement | HTMLSelectElement;
  get(): T;
  set(v: T): void;
}

export function numField(
  label: string,
  value: number | null,
  opts: { unit?: string; q?: Qty; min?: number; max?: number; positive?: boolean; placeholder?: string; mixed?: boolean } = {},
): Field<number> {
  // With `q` the field shows and accepts the current display units, while get()/set() use SI values.
  const q = opts.q;
  const show = (v: number) => String(q ? editU(v, q) : v);
  const input = h('input', {
    type: 'text',
    inputmode: 'decimal',
    autocomplete: 'off',
    spellcheck: 'false',
    value: value === null || !Number.isFinite(value) ? '' : show(value),
    placeholder: opts.mixed ? '(mixed)' : (opts.placeholder ?? ''),
  });
  const err = h('div', { class: 'field-err' });
  const row = h('label', { class: 'field' }, h('span', { class: 'field-label' }, label), h('span', { class: 'field-input' }, input, opts.unit || q ? h('span', { class: 'unit' }, q ? uLabel(q) : opts.unit!) : null), err);
  const validate = () => {
    const v = parseNum(input.value);
    let msg = '';
    if (input.value.trim() === '' && opts.mixed) msg = '';
    else if (!Number.isFinite(v)) msg = 'Enter a number';
    else if (opts.positive && v <= 0) msg = 'Must be > 0';
    else if (opts.min !== undefined && v < opts.min) msg = `Must be ≥ ${opts.min}`;
    else if (opts.max !== undefined && v > opts.max) msg = `Must be ≤ ${opts.max}`;
    err.textContent = msg;
    row.classList.toggle('invalid', !!msg);
    return !msg;
  };
  input.addEventListener('input', validate);
  input.addEventListener('focus', () => input.select());
  return {
    row,
    input,
    get: () => {
      if (!validate()) return NaN;
      const v = parseNum(input.value);
      return q && Number.isFinite(v) ? fromU(v, q) : v;
    },
    set: (v) => {
      input.value = show(v);
      validate();
    },
  };
}

export function textField(label: string, value: string): Field<string> {
  const input = h('input', { type: 'text', value, autocomplete: 'off', spellcheck: 'false' });
  const row = h('label', { class: 'field' }, h('span', { class: 'field-label' }, label), h('span', { class: 'field-input' }, input));
  return { row, input, get: () => input.value.trim(), set: (v) => (input.value = v) };
}

export function selectField<T extends string>(label: string, options: [T, string][], value: T): Field<T> {
  const input = h('select', null, ...options.map(([v, l]) => h('option', { value: v, selected: v === value }, l)));
  const row = h('label', { class: 'field' }, h('span', { class: 'field-label' }, label), h('span', { class: 'field-input' }, input));
  return { row, input, get: () => input.value as T, set: (v) => (input.value = v) };
}

export function checkField(label: string, checked: boolean): Field<boolean> {
  const input = h('input', { type: 'checkbox', checked });
  const row = h('label', { class: 'check' }, input, h('span', null, label));
  return { row, input, get: () => input.checked, set: (v) => (input.checked = v) };
}

export interface DialogButton {
  label: string;
  kind?: 'primary' | 'danger' | 'plain';
  /** Return false to keep the dialog open. */
  action?: () => boolean | void | Promise<boolean | void>;
}

let openCount = 0;
export const dialogOpen = () => openCount > 0;

export function openDialog(opts: { title: string; body: Node; buttons: DialogButton[]; wide?: boolean; onClose?: () => void }) {
  const backdrop = h('div', { class: 'dlg-backdrop' });
  const close = () => {
    if (!backdrop.isConnected) return;
    backdrop.remove();
    openCount--;
    document.removeEventListener('keydown', onKey, true);
    opts.onClose?.();
  };
  const run = async (b: DialogButton) => {
    const r = b.action ? await b.action() : undefined;
    if (r !== false) close();
  };
  const btns = opts.buttons.map((b) => h('button', { class: 'btn ' + (b.kind ?? 'plain'), type: 'button', onclick: () => run(b) }, b.label));
  const dlg = h(
    'div',
    { class: 'dlg' + (opts.wide ? ' wide' : ''), role: 'dialog', 'aria-modal': 'true', 'aria-label': opts.title },
    h('div', { class: 'dlg-head' }, h('h2', null, opts.title), h('button', { class: 'icon-btn', 'aria-label': 'Close', onclick: close }, '✕')),
    h('div', { class: 'dlg-body' }, opts.body),
    h('div', { class: 'dlg-foot' }, ...btns),
  );
  backdrop.append(dlg);
  backdrop.addEventListener('pointerdown', (e) => {
    if (e.target === backdrop) close();
  });
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      close();
    } else if (e.key === 'Enter' && !(e.target instanceof HTMLTextAreaElement) && !(e.target instanceof HTMLButtonElement)) {
      const primary = opts.buttons.find((b) => b.kind === 'primary');
      if (primary) {
        e.preventDefault();
        e.stopPropagation();
        run(primary);
      }
    }
  };
  document.addEventListener('keydown', onKey, true);
  document.body.append(backdrop);
  openCount++;
  // Focus the first field on devices with a keyboard; avoid popping the on-screen keyboard on touch.
  if (matchMedia('(pointer: fine)').matches) {
    const first = dlg.querySelector<HTMLElement>('.dlg-body input, .dlg-body select');
    first?.focus();
  }
  return { close, el: dlg };
}

export function confirmDialog(title: string, message: string, okLabel = 'OK', danger = false): Promise<boolean> {
  return new Promise((resolve) => {
    let result = false;
    openDialog({
      title,
      body: h('p', { class: 'msg' }, message),
      buttons: [
        { label: 'Cancel' },
        { label: okLabel, kind: danger ? 'danger' : 'primary', action: () => void (result = true) },
      ],
      onClose: () => resolve(result),
    });
  });
}

export function alertDialog(title: string, message: string | Node): Promise<void> {
  return new Promise((resolve) => {
    openDialog({
      title,
      body: typeof message === 'string' ? h('p', { class: 'msg' }, message) : message,
      buttons: [{ label: 'OK', kind: 'primary' }],
      onClose: () => resolve(),
    });
  });
}

let toastHost: HTMLElement | null = null;
export function toast(msg: string, kind: 'info' | 'ok' | 'error' | 'warn' = 'info', ms = 3200): void {
  if (!toastHost) {
    toastHost = h('div', { class: 'toasts', 'aria-live': 'polite' });
    document.body.append(toastHost);
  }
  const t = h('div', { class: 'toast ' + kind }, msg);
  toastHost.append(t);
  setTimeout(() => {
    t.classList.add('out');
    setTimeout(() => t.remove(), 300);
  }, ms);
}

export interface MenuItem {
  label?: string;
  action?: () => void;
  shortcut?: string;
  checked?: () => boolean;
  disabled?: () => boolean;
  separator?: boolean;
  heading?: string;
}

let activeMenu: { el: HTMLElement; close: () => void } | null = null;

export function closeMenus(): void {
  activeMenu?.close();
}

/** Show a popup menu anchored at a client point (below `anchor` if given). */
export function showMenu(items: MenuItem[], x: number, y: number, anchor?: HTMLElement): void {
  closeMenus();
  const el = h('div', { class: 'popup-menu', role: 'menu' });
  for (const it of items) {
    if (it.separator) {
      el.append(h('div', { class: 'sep' }));
      continue;
    }
    if (it.heading) {
      el.append(h('div', { class: 'menu-heading' }, it.heading));
      continue;
    }
    const disabled = it.disabled?.() ?? false;
    const checked = it.checked?.();
    const b = h(
      'button',
      {
        class: 'menu-item',
        role: 'menuitem',
        type: 'button',
        disabled,
        onclick: () => {
          closeMenus();
          it.action?.();
        },
      },
      h('span', { class: 'mi-check' }, checked === undefined ? '' : checked ? '✓' : ''),
      h('span', { class: 'mi-label' }, it.label ?? ''),
      h('span', { class: 'mi-short' }, it.shortcut ?? ''),
    );
    el.append(b);
  }
  // a touch-hold that opened this menu must not also pop the browser's own menu over it
  el.addEventListener('contextmenu', (e) => e.preventDefault());
  document.body.append(el);
  const r = el.getBoundingClientRect();
  let left = x;
  let top = y;
  if (anchor) {
    const a = anchor.getBoundingClientRect();
    left = a.left;
    top = a.bottom + 2;
  }
  left = Math.max(4, Math.min(left, window.innerWidth - r.width - 4));
  if (top + r.height > window.innerHeight - 4) top = Math.max(4, (anchor ? anchor.getBoundingClientRect().top : y) - r.height - 2);
  el.style.left = left + 'px';
  el.style.top = Math.max(4, top) + 'px';
  el.style.maxHeight = window.innerHeight - 8 + 'px';
  const onDown = (e: PointerEvent) => {
    if (!el.contains(e.target as Node) && e.target !== anchor) close();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close();
  };
  const close = () => {
    el.remove();
    document.removeEventListener('pointerdown', onDown, true);
    document.removeEventListener('keydown', onKey, true);
    anchor?.classList.remove('open');
    if (activeMenu?.el === el) activeMenu = null;
  };
  setTimeout(() => {
    document.addEventListener('pointerdown', onDown, true);
    document.addEventListener('keydown', onKey, true);
  }, 0);
  anchor?.classList.add('open');
  activeMenu = { el, close };
}

export const isMenuOpenFor = (anchor: HTMLElement) => anchor.classList.contains('open');
