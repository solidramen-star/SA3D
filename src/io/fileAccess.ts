/* File save/open helpers. Uses the File System Access API where available (Chrome/Edge on desktop),
   otherwise falls back to a download link and a file input (Safari on iPad, Chrome on Android). */

// Minimal typings for the File System Access API (not in lib.dom for all TS versions).
interface FsWritable {
  write(data: Blob | string): Promise<void>;
  close(): Promise<void>;
}
export interface FsFileHandle {
  name: string;
  getFile(): Promise<File>;
  createWritable(): Promise<FsWritable>;
}
type PickerOpts = {
  suggestedName?: string;
  types?: { description: string; accept: Record<string, string[]> }[];
  excludeAcceptAllOption?: boolean;
};
type W = Window & {
  showSaveFilePicker?: (o: PickerOpts) => Promise<FsFileHandle>;
  showOpenFilePicker?: (o: PickerOpts) => Promise<FsFileHandle[]>;
};

export type FileKind = 'sav' | 'csv';

const FILE_TYPES: Record<FileKind, PickerOpts['types']> = {
  sav: [{ description: 'StructApp 3D model', accept: { 'text/csv': ['.sav'] } }],
  csv: [{ description: 'CSV table (Excel)', accept: { 'text/csv': ['.csv'] } }],
};

export const hasFsAccess = () => typeof (window as W).showSaveFilePicker === 'function';

const isAbort = (e: unknown) => e instanceof DOMException && e.name === 'AbortError';

export interface SaveResult {
  name: string;
  handle: FsFileHandle | null;
}

function ensureExt(name: string, kind: FileKind = 'sav'): string {
  name = name.trim() || (kind === 'sav' ? 'model' : 'table');
  const ext = '.' + kind;
  return name.toLowerCase().endsWith(ext) ? name : name.replace(/\.[^.]*$/, '') + ext;
}

/** Save text. Re-uses `handle` when given (plain Save), otherwise asks for a location. Returns null if cancelled. */
export async function saveText(text: string, suggestedName: string, handle: FsFileHandle | null, kind: FileKind = 'sav'): Promise<SaveResult | null> {
  const w = window as W;
  if (w.showSaveFilePicker) {
    try {
      const h = handle ?? (await w.showSaveFilePicker({ suggestedName: ensureExt(suggestedName, kind), types: FILE_TYPES[kind] }));
      const ws = await h.createWritable();
      await ws.write(text);
      await ws.close();
      return { name: h.name, handle: h };
    } catch (e) {
      if (isAbort(e)) return null;
      console.warn('File System Access save failed, falling back to download', e);
    }
  }
  const name = ensureExt(suggestedName, kind);
  // BOM-less UTF-8 keeps Excel happy for ASCII content; names with accents still open fine in Excel 365.
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  return { name, handle: null };
}

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export async function openText(kind: FileKind = 'sav'): Promise<{ name: string; text: string; handle: FsFileHandle | null } | null> {
  const w = window as W;
  if (w.showOpenFilePicker) {
    try {
      const [h] = await w.showOpenFilePicker({ types: FILE_TYPES[kind] });
      const f = await h.getFile();
      return { name: f.name, text: await f.text(), handle: h };
    } catch (e) {
      if (isAbort(e)) return null;
      console.warn('File System Access open failed, falling back to input', e);
    }
  }
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    // iOS greys out unknown extensions when an accept filter is set, so leave it open there.
    if (!isIOS()) input.accept = '.sav,.csv,text/csv,text/plain';
    input.style.display = 'none';
    document.body.appendChild(input);
    let done = false;
    input.addEventListener('change', async () => {
      done = true;
      const f = input.files?.[0];
      input.remove();
      if (!f) return resolve(null);
      resolve({ name: f.name, text: await f.text(), handle: null });
    });
    input.addEventListener('cancel', () => {
      if (!done) resolve(null);
      input.remove();
    });
    input.click();
  });
}

const AUTOSAVE_KEY = 'structapp3d.autosave';

export function autosave(text: string, name: string): void {
  try {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({ text, name, time: Date.now() }));
  } catch {
    /* storage full or disabled */
  }
}

export function loadAutosave(): { text: string; name: string; time: number } | null {
  try {
    const s = localStorage.getItem(AUTOSAVE_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

export function clearAutosave(): void {
  try {
    localStorage.removeItem(AUTOSAVE_KEY);
  } catch {
    /* ignore */
  }
}
