import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CONTROL_LAYERS } from "@/artifacts/ControlStack";
import { useBus } from "@/artifacts/useBus";
import { ProductVisual } from "@/artifacts/ProductVisual";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/Layout";
import { ContinueReading } from "@/components/ContinueReading";
import { CopyLocus } from "@/components/CopyLocus";
import { principles } from "@/data/content";
import { visual } from "@/scene/visual";
import { absoluteUrl, siteOrigin } from "@/lib/site";
import { copyText } from "@/util/clipboard";
import { useHudKeys } from "@/util/hudKeys";
import { locusLabel } from "@/util/locus";
import { prefersReducedMotion } from "@/util/motion";
import { prefetchRoute } from "@/util/prefetch";
import { flashCopied } from "@/util/toast";
import {
  bindSectionSpy,
  isInteractiveTarget,
  isTypingTarget,
  replaceHash,
} from "@/util/scroll";
import { useOrientId } from "@/util/useOrientId";
import { usePaletteShortcut } from "@/util/usePaletteShortcut";

const ladder = [
  { n: "01", t: "Conventional", d: "Rules and scripts. No agent required.", stack: 0 },
  { n: "02", t: "Copilot", d: "Recommend actions. Human decides.", stack: 0 },
  { n: "03", t: "Assistive", d: "Retrieve and draft. Human executes.", stack: 1 },
  { n: "04", t: "Supervised", d: "Act with approval. Human remains the gate.", stack: 2 },
  { n: "05", t: "Bounded", d: "Act inside policy. Evals decide the next inch.", stack: 3 },
  { n: "06", t: "Autonomous", d: "Act within a proven envelope. Evidence first.", stack: 4 },
];

function setStack(index: number, opts?: { hash?: boolean }) {
  visual.stack = index;
  visual.story = "rest";
  if (opts?.hash !== false) replaceHash(`layer-${index + 1}`);
}

function syncHashToStack(hash: string) {
  const id = hash.replace(/^#/, "");
  const layer = /^layer-(\d+)$/.exec(id);
  if (layer) {
    const index = Number(layer[1]) - 1;
    if (index >= 0 && index < CONTROL_LAYERS.length) {
      setStack(index, { hash: false });
      return;
    }
  }
}

export function ApproachPage() {
  const { pathname, hash } = useLocation();
  const activeId = useOrientId(hash);
  const shortcut = usePaletteShortcut();
  const layersTarget = activeId === "layers" || /^layer-\d+$/.test(activeId);
  const ladderTarget = activeId === "ladder";
  const toastLabel =
    locusLabel(pathname, activeId ? `#${activeId}` : "") ??
    (activeId === "ladder"
      ? "Autonomy ladder"
      : activeId === "layers" || /^layer-\d+$/.test(activeId)
        ? "Control layers"
        : "Build");

  useEffect(() => {
    syncHashToStack(hash);
  }, [hash]);

  useEffect(
    () =>
      bindSectionSpy(["layers", "ladder"], {
        alias: (id) => (/^layer-\d+$/.test(id) ? "layers" : id),
      }),
    [],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;
      if (isInteractiveTarget(event.target)) return;
      if (event.key !== "y") return;
      event.preventDefault();
      const id = activeId || "layers";
      const path = `/approach#${id}`;
      const url = absoluteUrl(path, siteOrigin()) || `${window.location.origin}${path}`;
      void copyText(url).then((ok) => {
        flashCopied(toastLabel, ok);
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, toastLabel]);

  return (
    <>
      <section className="chamber approach-hero">
        <div className="wrap-wide">
          <Reveal className="page-hero">
            <p className="sys">Build</p>
            <h1 className="display">Model capability is only one layer.</h1>
            <p className="lede">
              Consequential workflows need context, bounded tools, deterministic services, human
              control, and evidence that the system deserves more scope. That is the product.
            </p>
            <ContinueReading className="continue-read-page" />
          </Reveal>
          <div className={`arch${layersTarget ? " is-target" : ""}`} id="layers" tabIndex={-1}>
            <div className="arch-visual">
              <ProductVisual kind="architecture" />
            </div>
            <LayerKeys />
          </div>
        </div>
      </section>
      <section className="sheet section">
        <div className="wrap-wide">
          <div className="principle-list approach-principles">
            {principles.map((p, i) => (
              <Reveal key={p.num} inView delay={Math.min(0.18, i * 0.05)} className="principle-reveal">
                <article>
                  <p className="sys">{p.num}</p>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <div
            className={`control-band${ladderTarget ? " is-target" : ""}`}
            id="ladder"
            tabIndex={-1}
          >
            <div>
              <p className="sys">Autonomy ladder</p>
              <h2 className="display">Scope expands when the evidence says it should.</h2>
              <p className="lede">
                I standardized this pattern across five enterprise systems: reusable MCP servers,
                domain APIs, Pydantic-typed actions, deterministic services, human approval, and
                evaluation baselines.
              </p>
              <p className="follow-link">
                <Link
                  to="/work/platform"
                  className="text-link"
                  onMouseEnter={() => prefetchRoute("/work/platform")}
                  onFocus={() => prefetchRoute("/work/platform")}
                >
                  Platform case →
                </Link>
              </p>
            </div>
            <AutonomyLadder />
          </div>
          <p className="case-nav-hint sys">
            {`1–5 layers · j / k when ladder in view · y link · ${shortcut} jump`}
          </p>
          <div className="page-locus-tools">
            <CopyLocus
              path={activeId ? `/approach#${activeId}` : "/approach"}
              label={activeId ? "Copy locus" : "Copy page"}
              toastLabel={toastLabel}
            />
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}

function LayerKeys() {
  useBus();
  const rootRef = useRef<HTMLDivElement>(null);
  useHudKeys(CONTROL_LAYERS.length, setStack, rootRef);
  const hot = visual.stack;
  const layer = CONTROL_LAYERS[hot] ?? CONTROL_LAYERS[0];
  return (
    <div className="layer-keys-wrap" ref={rootRef}>
      <p className="layer-keys-locus sys" aria-live="polite">
        {String(hot + 1).padStart(2, "0")}
        <i>/</i>
        {CONTROL_LAYERS.length.toString().padStart(2, "0")}
        <span> · {layer.label}</span>
      </p>
      <ul className="layer-keys">
        {CONTROL_LAYERS.map((layerItem, index) => (
          <li key={layerItem.label} id={`layer-${index + 1}`}>
            <button
              type="button"
              className={hot === index ? "on" : ""}
              aria-pressed={hot === index}
              onClick={() => setStack(index)}
              onFocus={() => setStack(index)}
            >
              <b>
                <span className="layer-keys-num" aria-hidden="true">
                  {index + 1}
                </span>
                {layerItem.label}
              </b>
              <span>{layerItem.note}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="layer-keys-hint sys">
        1–{CONTROL_LAYERS.length} layers · {layer.note}
      </p>
    </div>
  );
}

function ladderInPlay(target: HTMLElement | null): boolean {
  if (target?.closest(".ladder, #ladder")) return true;
  const band = document.getElementById("ladder");
  if (!band) return false;
  const rect = band.getBoundingClientRect();
  const vh = window.innerHeight || 1;
  const visible = Math.max(0, Math.min(rect.bottom, vh * 0.85) - Math.max(rect.top, vh * 0.12));
  return visible > Math.min(120, rect.height * 0.28);
}

function AutonomyLadder() {
  useBus();
  const listRef = useRef<HTMLUListElement>(null);
  const hot = visual.stack;
  const [rungIndex, setRungIndex] = useState(() =>
    Math.max(
      0,
      ladder.findIndex((rung) => rung.stack === visual.stack),
    ),
  );
  const rungRef = useRef(rungIndex);
  rungRef.current = rungIndex;

  useEffect(() => {
    if (ladder[rungIndex]?.stack !== hot) {
      const match = ladder.findIndex((rung) => rung.stack === hot);
      if (match >= 0) setRungIndex(match);
    }
  }, [hot, rungIndex]);

  const focusOnce = useRef(false);
  useEffect(() => {
    if (!focusOnce.current) {
      focusOnce.current = true;
      return;
    }
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>("button");
    const btn = buttons?.[rungIndex];
    if (!btn) return;
    btn.focus({ preventScroll: true });
    btn.scrollIntoView({
      block: "nearest",
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [rungIndex]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("a, input, textarea, select, [contenteditable='true']")) return;
      if (target?.closest("button") && !target.closest(".ladder")) return;
      if (event.key !== "j" && event.key !== "k") return;
      if (!ladderInPlay(target)) return;
      event.preventDefault();
      const at = rungRef.current;
      const next =
        event.key === "j" ? Math.min(ladder.length - 1, at + 1) : Math.max(0, at - 1);
      setRungIndex(next);
      setStack(ladder[next].stack, { hash: false });
      replaceHash("ladder");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const selectRung = (index: number) => {
    setRungIndex(index);
    setStack(ladder[index].stack, { hash: false });
    replaceHash("ladder");
  };

  return (
    <div className="ladder-wrap">
      <p className="ladder-locus sys" aria-live="polite">
        {ladder[rungIndex]?.n ?? "01"}
        <i>/</i>
        {ladder.length.toString().padStart(2, "0")}
        <span> · {ladder[rungIndex]?.t ?? "Copilot"}</span>
      </p>
      <ul className="ladder" ref={listRef}>
        {ladder.map((rung, index) => {
          const on = index === rungIndex;
          return (
            <li key={rung.n} data-on={on ? "true" : undefined}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => selectRung(index)}
                onFocus={() => selectRung(index)}
              >
                <small>{rung.n}</small>
                {rung.t}
                <span>{rung.d}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
