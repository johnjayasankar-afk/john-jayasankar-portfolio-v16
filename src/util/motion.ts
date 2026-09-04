/** Prefer immediate state when the user asks the OS to cut motion. */
export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** ⌘K on Apple, Ctrl K elsewhere — matches the real palette shortcut. */
export function paletteShortcutLabel() {
  if (typeof navigator === "undefined") return "⌘K";
  const platform = navigator.platform || "";
  const ua = navigator.userAgent || "";
  const apple = /Mac|iPhone|iPad|iPod/i.test(platform) || /Mac OS/i.test(ua);
  return apple ? "⌘K" : "Ctrl K";
}
