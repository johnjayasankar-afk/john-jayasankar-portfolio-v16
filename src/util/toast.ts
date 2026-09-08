/** Lightweight site toast - Layout listens; Case/Writing/palette/Simple can fire. */

type ToastListener = (message: string) => void;

const listeners = new Set<ToastListener>();
let clearTimer = 0;

export function subscribeToast(listener: ToastListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Show a brief polite toast. Empty string clears. */
export function flashToast(message: string, ms = 1600): void {
  for (const listener of listeners) listener(message);
  if (typeof window === "undefined") return;
  window.clearTimeout(clearTimer);
  if (!message) return;
  clearTimer = window.setTimeout(() => {
    for (const listener of listeners) listener("");
  }, ms);
}

/** Shared clipboard grammar: `Copied · {locus}` / fail. */
export function flashCopied(label: string, ok = true): void {
  flashToast(ok ? `Copied · ${label}` : "Could not copy link");
}
