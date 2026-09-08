import { useEffect, useRef } from "react";

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer:fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    if (!fine || reduce || !el) return;
    el.style.opacity = "1";

    const move = (e: PointerEvent) => {
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      el.classList.toggle(
        "grow",
        Boolean(
          t?.closest(
            "a, button, input, textarea, select, summary, [role='button'], [role='option'], .ledger-main, .copy-email, .case-metric, .hud-row button",
          ),
        ),
      );
    };
    const down = () => el.classList.add("press");
    const up = () => el.classList.remove("press");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, []);

  return <div ref={ref} className="cursor" aria-hidden="true" />;
}
