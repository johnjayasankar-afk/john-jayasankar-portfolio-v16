import { prefersReducedMotion } from "@/util/motion";

/** True when keyboard shortcuts should stay out of the way. */
export function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  return !!el?.closest("input, textarea, select, [contenteditable='true']");
}

/** True when focus is on a control that should keep its own keys (links, buttons, etc.). */
export function isInteractiveTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  return !!el?.closest("a, button, input, textarea, select, [contenteditable='true']");
}

function cssPx(name: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}

/** Fixed header + ticker + sticky scrub clearance for programmatic scrolls. */
export function chromeScrollOffset(extra = 12): number {
  return cssPx("--header", 56) + cssPx("--ticker", 40) + cssPx("--scrub", 0) + extra;
}

/** Bind a reading-progress bar (`scaleX`) to window scroll. */
export function bindProgress(bar: HTMLElement | null): () => void {
  if (!bar) return () => undefined;
  let frame = 0;
  const update = () => {
    frame = 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    bar.style.transform = `scaleX(${p})`;
  };
  const onScroll = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  update();
  return () => {
    window.removeEventListener("scroll", onScroll);
    if (frame) window.cancelAnimationFrame(frame);
  };
}

/** Smooth (or instant) scroll to an element id, respecting reduced motion. */
export function scrollToId(
  id: string,
  opts?: { offset?: number; behavior?: ScrollBehavior; focus?: boolean },
): void {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = opts?.offset ?? chromeScrollOffset();
  const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset);
  const reduce = prefersReducedMotion();
  const behavior: ScrollBehavior = opts?.behavior ?? (reduce ? "auto" : "smooth");
  const smooth = behavior === "smooth" && !reduce;
  // Keep section spies from wiping deep-link hashes while the scroll lands.
  skipHashScrollUntil = performance.now() + (smooth ? 1200 : 320);
  window.scrollTo({ top, left: 0, behavior: smooth ? "smooth" : "auto" });
  if (opts?.focus !== false) {
    if (el.tabIndex < 0) el.tabIndex = -1;
    window.requestAnimationFrame(() => el.focus({ preventScroll: true }));
  }
}

type HashReplacer = (id: string | null) => void;

let hashReplacer: HashReplacer | null = null;
let skipHashScrollUntil = 0;
/** When true, section spies keep UI orientation but do not rewrite the URL hash. */
let hashSpyPaused = false;
/** Last cleared / scroll-tracked locus while spies are paused (Esc). */
let softLocusId: string | null = null;
const softLocusListeners = new Set<() => void>();

function notifySoftLocus() {
  softLocusListeners.forEach((fn) => fn());
}

function setSoftLocus(id: string | null) {
  if (softLocusId === id) return;
  softLocusId = id;
  notifySoftLocus();
}

/** Soft locus while Esc has paused URL rewriting. */
export function getSoftLocus(): string | null {
  return softLocusId;
}

/** Public write for page spies that track orientation without a URL hash. */
export function markSoftLocus(id: string | null): void {
  setSoftLocus(id);
}

export function subscribeSoftLocus(listener: () => void): () => void {
  softLocusListeners.add(listener);
  return () => {
    softLocusListeners.delete(listener);
  };
}

/** Layout registers React Router navigate so hash stays in sync with useLocation. */
export function bindHashReplacer(fn: HashReplacer): () => void {
  hashReplacer = fn;
  return () => {
    if (hashReplacer === fn) hashReplacer = null;
  };
}

/** True briefly after replaceHash — Layout should not re-scroll (already scrolled). */
export function shouldSkipHashScroll(): boolean {
  return typeof performance !== "undefined" && performance.now() < skipHashScrollUntil;
}

/** True after Esc clears locus — spies wait until the next intentional jump. */
export function shouldSkipHashSpy(): boolean {
  return hashSpyPaused;
}

/** Replace the URL hash without the browser's default jump; sync React Router when bound. */
export function replaceHash(id: string | null): void {
  const next = id ? `#${id}` : "";
  if (window.location.hash === next) return;
  // Intentional deep-link / j/k resumes automatic locus tracking.
  if (id) {
    hashSpyPaused = false;
    setSoftLocus(null);
  }
  skipHashScrollUntil = performance.now() + 480;
  if (hashReplacer) {
    hashReplacer(id);
    return;
  }
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${next}`);
}

/** Esc: clear the URL locus and pause spies until the next deliberate jump.
 *  Second Esc (URL already clean) releases soft orientation chrome too. */
export function clearLocusHash(): void {
  const current = window.location.hash.replace(/^#/, "");
  if (current) {
    setSoftLocus(current);
    hashSpyPaused = true;
    skipHashScrollUntil = performance.now() + 480;
    if (hashReplacer) {
      hashReplacer(null);
      return;
    }
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    return;
  }
  setSoftLocus(null);
  hashSpyPaused = true;
}

/**
 * Keep URL hash honest while the user scrolls through section ids.
 * Skips updates briefly after replaceHash/scrollToId to avoid fighting.
 */
export function bindSectionSpy(
  ids: readonly string[],
  opts?: {
    clearHashAtTop?: boolean;
    /** Map a hash (e.g. layer-2) onto a spy id (layers) so digit loci hold. */
    alias?: (id: string) => string;
  },
): () => void {
  if (ids.length === 0) return () => undefined;
  let frame = 0;
  const clearHashAtTop = opts?.clearHashAtTop ?? false;
  const alias = opts?.alias ?? ((id: string) => id);
  // First paint often has scrollY≈0 while Layout is still scrolling to a deep hash.
  // Cover Layout's settle corrections (~420ms / ~980ms).
  const bootUntil = performance.now() + 1100;

  const spy = () => {
    frame = 0;
    if (shouldSkipHashScroll()) return;

    const probe = window.scrollY + chromeScrollOffset() + 8;
    let at = 0;
    ids.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= probe) at = i;
    });
    const probed = ids[at];

    if (shouldSkipHashSpy()) {
      if (clearHashAtTop && window.scrollY < 28) setSoftLocus(null);
      else if (probed) setSoftLocus(probed);
      return;
    }

    if (clearHashAtTop && window.scrollY < 28) {
      if (performance.now() < bootUntil) return;
      const hashId = window.location.hash.replace(/^#/, "");
      if (hashId) {
        const el = document.getElementById(hashId) ?? document.getElementById(alias(hashId));
        // Deep target still below the fold — Layout scroll has not landed yet.
        if (el && el.getBoundingClientRect().top > window.innerHeight * 0.4) return;
      }
      replaceHash(null);
      return;
    }
    // Hold the current locus while its section sits in the reading band
    // (stops mid-scroll neighbors from stealing deep links like #contact).
    const current = window.location.hash.replace(/^#/, "");
    const holdId = current ? alias(current) : "";
    // First paint: Layout may still be scrolling to a deep hash while scrollY≈0.
    // Don't let the probe rewrite #ladder → #layers (etc.) before that lands.
    if (performance.now() < bootUntil && current) {
      const deep = document.getElementById(holdId) ?? document.getElementById(current);
      if (deep) return;
    }
    if (holdId && ids.includes(holdId)) {
      const el = document.getElementById(holdId);
      if (el) {
        const top = el.getBoundingClientRect().top;
        if (top >= -48 && top <= window.innerHeight * 0.48) return;
        // Still approaching an intentional deep link (below the reading band).
        if (top > window.innerHeight * 0.48 && shouldSkipHashScroll()) return;
      }
    }
    if (probed) replaceHash(probed);
  };

  const onScroll = () => {
    if (!frame) frame = window.requestAnimationFrame(spy);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  spy();
  return () => {
    window.removeEventListener("scroll", onScroll);
    if (frame) window.cancelAnimationFrame(frame);
  };
}
