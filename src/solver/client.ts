import type { ModelData } from '../model/types';
import { analyzeAll, type ResultSet } from './analyze';

let worker: Worker | null = null;
let seq = 0;
const pending = new Map<number, { resolve: (r: ResultSet) => void; reject: (e: Error) => void }>();

function getWorker(): Worker | null {
  if (worker) return worker;
  try {
    worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (e) => {
      const p = pending.get(e.data.id);
      if (!p) return;
      pending.delete(e.data.id);
      if (e.data.ok) p.resolve(e.data.results);
      else p.reject(new Error(e.data.error));
    };
    worker.onerror = (e) => {
      for (const p of pending.values()) p.reject(new Error(e.message || 'Analysis worker failed'));
      pending.clear();
      worker?.terminate();
      worker = null;
    };
  } catch {
    worker = null;
  }
  return worker;
}

/** Run the analysis off the main thread (falls back to the main thread if workers are unavailable). */
export function runAnalysis(data: ModelData): Promise<ResultSet> {
  const w = getWorker();
  if (!w) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          resolve(analyzeAll(data));
        } catch (e) {
          reject(e instanceof Error ? e : new Error(String(e)));
        }
      }, 0);
    });
  }
  const id = ++seq;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    w.postMessage({ id, data: JSON.parse(JSON.stringify(data)) });
  });
}
