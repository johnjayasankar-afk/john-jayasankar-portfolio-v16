import { useEffect, useId, useRef, type RefObject } from "react";
import { isTypingTarget } from "@/util/scroll";

type HudEntry = {
  id: string;
  count: number;
  apply: (index: number) => void;
  el: HTMLElement | null;
};

const registry = new Map<string, HudEntry>();
let listening = false;
let paintFrame = 0;

function scoreElement(el: HTMLElement | null): number {
  if (!el?.isConnected) return -1;
  if (el.matches(":focus-within")) return 10_000;
  if (el.matches(":hover")) return 5_000;

  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || 1;
  const bandTop = vh * 0.12;
  const bandBottom = vh * 0.78;
  const visible = Math.max(0, Math.min(rect.bottom, bandBottom) - Math.max(rect.top, bandTop));
  if (visible < 12) return -1;

  const height = Math.max(1, Math.min(rect.height, bandBottom - bandTop));
  const ratio = Math.min(1, visible / height);
  const mid = (rect.top + rect.bottom) / 2;
  const probe = vh * 0.36;
  const proximity = 1 - Math.min(1, Math.abs(mid - probe) / vh);
  return ratio * 1000 + proximity * 120;
}

function paintHot() {
  paintFrame = 0;
  let best: HudEntry | null = null;
  let bestScore = -1;
  for (const entry of registry.values()) {
    const score = scoreElement(entry.el);
    if (score > bestScore) {
      best = entry;
      bestScore = score;
    }
  }
  for (const entry of registry.values()) {
    const on = bestScore >= 0 && entry === best;
    entry.el?.toggleAttribute("data-hud-hot", on);
  }
}

function schedulePaint() {
  if (!paintFrame) paintFrame = window.requestAnimationFrame(paintHot);
}

function bestEntry(): HudEntry | null {
  let best: HudEntry | null = null;
  let bestScore = -1;
  for (const entry of registry.values()) {
    const score = scoreElement(entry.el);
    if (score > bestScore) {
      best = entry;
      bestScore = score;
    }
  }
  return bestScore < 0 ? null : best;
}

function onHudKey(event: KeyboardEvent) {
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  if (isTypingTarget(event.target)) return;
  const best = bestEntry();
  if (!best) return;
  const n = Number(event.key);
  if (!Number.isInteger(n) || n < 1 || n > best.count) return;
  event.preventDefault();
  best.apply(n - 1);
  schedulePaint();
}

function ensureListener() {
  if (listening) return;
  listening = true;
  window.addEventListener("keydown", onHudKey);
  window.addEventListener("scroll", schedulePaint, { passive: true });
  window.addEventListener("resize", schedulePaint);
}

function maybeTeardown() {
  if (registry.size > 0 || !listening) return;
  listening = false;
  window.removeEventListener("keydown", onHudKey);
  window.removeEventListener("scroll", schedulePaint);
  window.removeEventListener("resize", schedulePaint);
  if (paintFrame) window.cancelAnimationFrame(paintFrame);
  paintFrame = 0;
}

/**
 * Digits 1-n drive HUD / layer controls when the user is not typing.
 * Only the most-visible (or hovered/focused) registered root receives keys - 
 * critical on Home where many stages stay mounted.
 */
export function useHudKeys(
  count: number,
  apply: (index: number) => void,
  rootRef: RefObject<HTMLElement | null>,
) {
  const id = useId();
  const applyRef = useRef(apply);
  applyRef.current = apply;

  useEffect(() => {
    ensureListener();
    const entry: HudEntry = {
      id,
      count,
      apply: (index) => applyRef.current(index),
      el: rootRef.current,
    };
    registry.set(id, entry);

    const syncEl = () => {
      const cur = registry.get(id);
      if (cur) cur.el = rootRef.current;
      schedulePaint();
    };
    syncEl();
    const raf = window.requestAnimationFrame(syncEl);

    const el = rootRef.current;
    const io =
      el &&
      new IntersectionObserver(syncEl, {
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
      });
    if (el && io) io.observe(el);

    el?.addEventListener("pointerenter", schedulePaint);
    el?.addEventListener("focusin", schedulePaint);
    el?.addEventListener("focusout", schedulePaint);

    return () => {
      window.cancelAnimationFrame(raf);
      registry.delete(id);
      io?.disconnect();
      el?.removeEventListener("pointerenter", schedulePaint);
      el?.removeEventListener("focusin", schedulePaint);
      el?.removeEventListener("focusout", schedulePaint);
      el?.removeAttribute("data-hud-hot");
      schedulePaint();
      maybeTeardown();
    };
  }, [id, count, rootRef]);
}
