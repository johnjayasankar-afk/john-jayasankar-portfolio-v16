import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { prefetchRoute } from "@/util/prefetch";
import { prefersReducedMotion } from "@/util/motion";

const CASE_FOR_LABEL: Record<string, string> = {
  RideLens: "ridelens",
  RailDrop: "raildrop",
};

/** Quiet hold before leaving the site — cancel or keep the case. */
export function ProductLaunch({ href, label }: { href: string; label: string }) {
  const caseSlug = CASE_FOR_LABEL[label];
  const [cancelled, setCancelled] = useState(false);
  const [tick, setTick] = useState(0);
  const timer = useRef(0);
  const reduce = prefersReducedMotion();
  const holdMs = reduce ? 0 : 520;

  useEffect(() => {
    if (cancelled) return;
    if (holdMs === 0) {
      window.location.replace(href);
      return;
    }
    const started = performance.now();
    const frame = () => {
      const elapsed = performance.now() - started;
      setTick(Math.min(1, elapsed / holdMs));
      if (elapsed >= holdMs) {
        window.location.replace(href);
        return;
      }
      timer.current = window.requestAnimationFrame(frame);
    };
    timer.current = window.requestAnimationFrame(frame);
    return () => window.cancelAnimationFrame(timer.current);
  }, [href, cancelled, holdMs]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setCancelled(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const phase = cancelled ? "Held" : tick >= 1 ? "Opening" : "Arming";

  return (
    <div className="launch-shell">
      <Seo />
      <p className="sys">Independent product</p>
      <h1 className="display">{label}</h1>
      <p className="lede">
        {cancelled
          ? "Redirect cancelled. Stay with the case, or open the live product when ready."
          : "Opening the live product."}
      </p>
      <p className="sys launch-status" aria-live="polite">
        {phase}
        {!cancelled ? (
          <>
            <i aria-hidden="true"> · </i>
            {String(Math.min(3, Math.max(1, Math.ceil(tick * 3)))).padStart(2, "0")}
          </>
        ) : null}
      </p>
      <div className="launch-bar" aria-hidden="true">
        <span style={{ transform: `scaleX(${cancelled ? 0 : tick})` }} />
      </div>
      <p className="follow-link">
        <a className="text-link" href={href}>
          {cancelled ? "Open product →" : "Continue →"}
        </a>
        {caseSlug ? (
          <>
            <span className="follow-sep" aria-hidden="true">
              ·
            </span>
            <Link
              className="text-link"
              to={`/work/${caseSlug}`}
              onClick={() => setCancelled(true)}
              onMouseEnter={() => prefetchRoute(`/work/${caseSlug}`)}
              onFocus={() => prefetchRoute(`/work/${caseSlug}`)}
            >
              Case study →
            </Link>
          </>
        ) : null}
        {!cancelled ? (
          <>
            <span className="follow-sep" aria-hidden="true">
              ·
            </span>
            <button type="button" className="text-link launch-cancel" onClick={() => setCancelled(true)}>
              Esc cancel
            </button>
          </>
        ) : null}
      </p>
    </div>
  );
}
