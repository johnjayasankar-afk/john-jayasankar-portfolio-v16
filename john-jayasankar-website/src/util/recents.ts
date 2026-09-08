/** Last destinations for the command palette — local, quiet, useful. */

export type RecentItem = { path: string; label: string; at: number };

const KEY = "jj:palette-recents";
const MAX = 6;

function read(): RecentItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((row) => row && typeof row.path === "string" && typeof row.label === "string");
  } catch {
    return [];
  }
}

function write(items: RecentItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX)));
  } catch {
    /* private mode / quota */
  }
}

/** Record a destination. Skips bare `/` noise and duplicates. */
export function pushRecent(path: string, label: string): void {
  if (typeof window === "undefined") return;
  const clean = path.replace(/\/$/, "") || "/";
  if (clean === "/" || clean === "") return;

  const base = clean.split("#")[0];
  const hashed = clean.includes("#");
  const existing = read();

  // Bare `/work/x` must not demote a richer `/work/x#beat` resume.
  if (!hashed) {
    const richer = existing.find((row) => row.path.startsWith(`${base}#`));
    if (richer) {
      const rest = existing.filter((row) => row.path.split("#")[0] !== base);
      write([{ ...richer, at: Date.now() }, ...rest]);
      return;
    }
  }

  const next: RecentItem = { path: clean, label, at: Date.now() };
  // One entry per page base — hashed path replaces bare or older beat.
  const rest = existing.filter((row) => row.path !== clean && row.path.split("#")[0] !== base);
  write([next, ...rest]);
}

export function listRecents(): RecentItem[] {
  if (typeof window === "undefined") return [];
  return read();
}
