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
      el.classList.toggle("grow", Boolean(t?.closest("a, button, input")));
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, []);

  return <div ref={ref} className="cursor" />;
}
