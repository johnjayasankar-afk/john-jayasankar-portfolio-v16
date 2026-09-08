import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { visual, type ArtifactKind } from "@/scene/visual";
import { CONTROL_LAYERS } from "@/artifacts/ControlStack";
import { useBus } from "@/artifacts/useBus";
import { prefersReducedMotion } from "@/util/motion";
import { useHudKeys } from "@/util/hudKeys";

export function ArtifactHud({ kind }: { kind: ArtifactKind }) {
  if (kind === "cross-currency") return <CompressHud />;
  if (kind === "margin-simulator") return <CapitalHud />;
  if (kind === "iport")
    return (
      <PhaseHud
        field="iport"
        steps={["Context", "HITL", "Actions"]}
        notes={[
          "Assemble the operating context before the model acts.",
          "Human gate on consequential steps.",
          "Typed actions only — no freeform tool sprawl.",
        ]}
      />
    );
  if (kind === "coco")
    return (
      <PhaseHud
        field="coco"
        steps={["Incident", "Evidence", "Diagnose"]}
        notes={[
          "Start from the live incident, not a chat prompt.",
          "MCP evidence first. Escalate only if needed.",
          "Sharpen the diagnosis before paging an expert.",
        ]}
      />
    );
  if (kind === "valuation")
    return (
      <PhaseHud
        field="reconcile"
        steps={["Split", "Diff", "Lock"]}
        notes={[
          "Split dual sources before the window opens.",
          "Surface the material diffs, not noise.",
          "Lock the view before the live cycle.",
        ]}
      />
    );
  if (kind === "fx-compression")
    return (
      <PhaseHud
        field="fx"
        steps={["Book", "Gates", "Accept"]}
        notes={[
          "Load the book the optimizer will actually touch.",
          "ForexClear IM + four-source checks in the optimizer.",
          "Accept only when gates and margin agree.",
        ]}
      />
    );
  if (kind === "ridelens")
    return (
      <PhaseHud
        field="ride"
        steps={["Price", "Soonest", "Value"]}
        notes={[
          "Live quotes, not screenshots of four apps.",
          "Soonest still has to be a real pickup.",
          "Ranges stay ranges. Expired quotes never win.",
        ]}
      />
    );
  if (kind === "raildrop")
    return (
      <PhaseHud
        field="rail"
        steps={["Booked", "Watching", "Alert"]}
        notes={[
          "Anchor on the fare you already paid.",
          "Watch every bookable option across the window.",
          "Alert only when a listed fare beats what you paid.",
        ]}
      />
    );
  if (kind === "systems-core")
    return (
      <PhaseHud
        field="core"
        steps={["Agents", "Gate", "Market"]}
        notes={[
          "Production agents on the left rail.",
          "Control gates in the middle.",
          "SwapAgent compression on the market side.",
        ]}
      />
    );
  if (kind === "platform" || kind === "architecture") return <StackHud />;
  return null;
}

/** Digits 1–n cycle HUD phases when not typing — see `@/util/hudKeys`. */
function HudShell({
  status,
  children,
  hint = "1–3 phases",
  rootRef,
  echoStatus = true,
  note,
}: {
  status: string;
  children: ReactNode;
  hint?: string;
  rootRef: RefObject<HTMLDivElement | null>;
  /** When false, status stays screen-reader only (phase tabs already name the state). */
  echoStatus?: boolean;
  note?: string;
}) {
  return (
    <div className="artifact-hud" ref={rootRef}>
      {children}
      <div className={`hud-foot${echoStatus ? "" : " hud-foot-keys"}`}>
        {echoStatus ? (
          <p className="hud-status" role="status" aria-live="polite">
            {status}
          </p>
        ) : (
          <span className="sr-only" role="status" aria-live="polite">
            {status}
          </span>
        )}
        <p className="hud-keys" aria-hidden="true">
          {hint}
        </p>
      </div>
      {note ? <p className="hud-note">{note}</p> : null}
    </div>
  );
}

function StackHud() {
  useBus();
  const rootRef = useRef<HTMLDivElement>(null);
  const [, tick] = useState(0);
  const hot = visual.stack;
  const set = (index: number) => {
    visual.stack = index;
    visual.story = "rest";
    tick((n) => n + 1);
  };
  useHudKeys(CONTROL_LAYERS.length, set, rootRef);
  const label = CONTROL_LAYERS[hot]?.label ?? "Context";

  return (
    <HudShell rootRef={rootRef} status={label} hint="1–5 layers" note="Five systems. Same control interfaces.">
      <div className="hud-row">
        {CONTROL_LAYERS.map((layer, index) => (
          <button
            type="button"
            key={layer.short}
            className={hot === index ? "on" : ""}
            aria-pressed={hot === index}
            onClick={() => set(index)}
          >
            {layer.short}
          </button>
        ))}
      </div>
    </HudShell>
  );
}

function PhaseHud({
  field,
  steps,
  notes,
  note,
}: {
  field: "iport" | "coco" | "reconcile" | "fx" | "ride" | "rail" | "core";
  steps: [string, string, string];
  notes?: [string, string, string];
  note?: string;
}) {
  useBus();
  const rootRef = useRef<HTMLDivElement>(null);
  const [, tick] = useState(0);
  const t = visual[field];
  const values = [0, 0.5, 1] as const;
  const set = (value: number) => {
    visual[field] = value;
    visual.story = "rest";
    tick((n) => n + 1);
  };
  useHudKeys(3, (i) => set(values[i]), rootRef);
  const phase = t < 0.34 ? 0 : t < 0.72 ? 1 : 2;
  const status = steps[phase];
  const activeNote = notes?.[phase] ?? note;

  return (
    <HudShell rootRef={rootRef} status={status} echoStatus={false} hint={`${status} · 1–3`} note={activeNote}>
      <div className="hud-row">
        <button type="button" className={phase === 0 ? "on" : ""} aria-pressed={phase === 0} onClick={() => set(0)}>
          {steps[0]}
        </button>
        <button
          type="button"
          className={phase === 1 ? "on" : ""}
          aria-pressed={phase === 1}
          onClick={() => set(0.5)}
        >
          {steps[1]}
        </button>
        <button type="button" className={phase === 2 ? "on" : ""} aria-pressed={phase === 2} onClick={() => set(1)}>
          {steps[2]}
        </button>
      </div>
    </HudShell>
  );
}

function CompressHud() {
  useBus();
  const rootRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const [, tick] = useState(0);
  const [running, setRunning] = useState(false);

  const clearRun = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    setRunning(false);
  };

  useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    },
    [],
  );

  const set = (target: number) => {
    clearRun();
    visual.compressTarget = target;
    visual.story = "rest";
    tick((n) => n + 1);
  };

  const run = () => {
    clearRun();
    if (prefersReducedMotion()) {
      visual.compressTarget = 1;
      visual.compress = 1;
      tick((n) => n + 1);
      return;
    }
    setRunning(true);
    const steps = [0.22, 0.42, 0.64, 0.84, 1];
    steps.forEach((value, i) => {
      timers.current.push(
        window.setTimeout(() => {
          visual.compressTarget = value;
          tick((n) => n + 1);
          if (i === steps.length - 1) setRunning(false);
        }, i * 640),
      );
    });
  };

  useHudKeys(
    4,
    (i) => {
      if (i === 0) set(0);
      else if (i === 1) run();
      else if (i === 2) set(1);
      else {
        visual.envelopeLocked = !visual.envelopeLocked;
        visual.hoverEnvelope = visual.envelopeLocked;
        tick((n) => n + 1);
      }
    },
    rootRef,
  );

  const t = visual.compressTarget;
  const phase =
    t < 0.12
      ? "Gross network"
      : t < 0.34
        ? "Identify offsets"
        : t < 0.54
          ? "Constraints"
          : t < 0.76
            ? "Proposal"
            : t < 0.94
              ? "Terminate / residual / replace"
              : "Compressed";

  const notional = Math.max(0.18, 1 - t * 0.78);
  const risk = 0.92 - t * 0.04;

  return (
    <HudShell
      rootRef={rootRef}
      status={phase}
      hint="1 gross · 2 run · 3 done · 4 envelope"
      note="Bilateral notional falls. SwapAgent settlement keeps the book executable."
    >
      <div className="hud-row">
        <button type="button" className={t < 0.12 ? "on" : ""} aria-pressed={t < 0.12} onClick={() => set(0)}>
          Gross
        </button>
        <button
          type="button"
          className={running || (t > 0.12 && t < 0.96) ? "on" : ""}
          aria-pressed={running || (t > 0.12 && t < 0.96)}
          onClick={run}
        >
          Run
        </button>
        <button
          type="button"
          className={!running && t >= 0.96 ? "on" : ""}
          aria-pressed={!running && t >= 0.96}
          onClick={() => set(1)}
        >
          Compressed
        </button>
        <button
          type="button"
          className={visual.hoverEnvelope ? "on" : ""}
          aria-pressed={visual.hoverEnvelope}
          onClick={() => {
            visual.envelopeLocked = !visual.envelopeLocked;
            visual.hoverEnvelope = visual.envelopeLocked;
            tick((n) => n + 1);
          }}
          onMouseEnter={() => {
            visual.hoverEnvelope = true;
            tick((n) => n + 1);
          }}
          onMouseLeave={() => {
            if (!visual.envelopeLocked) visual.hoverEnvelope = false;
            tick((n) => n + 1);
          }}
        >
          Risk envelope
        </button>
      </div>
      <div className="im-bars" aria-hidden="true">
        <div>
          <span>Gross notional</span>
          <b style={{ width: `${notional * 100}%` }} />
        </div>
        <div>
          <span>Risk profile</span>
          <b className="hold" style={{ width: `${risk * 100}%` }} />
        </div>
      </div>
    </HudShell>
  );
}

function CapitalHud() {
  useBus();
  const rootRef = useRef<HTMLDivElement>(null);
  const mode = visual.capitalMode;
  const modes = ["baseline", "proposed", "simulate", "compare"] as const;
  const apply = (next: typeof visual.capitalMode) => {
    visual.capitalMode = next;
    visual.story = "rest";
  };
  useHudKeys(4, (i) => apply(modes[i]), rootRef);
  const simulated = mode === "simulate" || mode === "compare";
  const pending = mode === "proposed";
  const status =
    mode === "baseline"
      ? "Base portfolio"
      : mode === "proposed"
        ? "Incremental trade"
        : mode === "simulate"
          ? "Venue scenarios"
          : "Incremental vs standalone";

  return (
    <HudShell
      rootRef={rootRef}
      status={status}
      hint="1–4 capital modes"
      note={
        mode === "baseline"
          ? "Current margin. The next trade is still unknown."
          : mode === "proposed"
            ? "Hypothetical sits outside the book until you simulate."
            : mode === "simulate"
              ? "Same trade across CME SPAN, ICE IRM, and OTC before you execute."
              : "Offsets in the book make incremental cheaper than standalone."
      }
    >
      <div className="hud-row">
        <button
          type="button"
          className={mode === "baseline" ? "on" : ""}
          aria-pressed={mode === "baseline"}
          onClick={() => apply("baseline")}
        >
          Base
        </button>
        <button
          type="button"
          className={mode === "proposed" ? "on" : ""}
          aria-pressed={mode === "proposed"}
          onClick={() => apply("proposed")}
        >
          + Trade
        </button>
        <button
          type="button"
          className={mode === "simulate" ? "on" : ""}
          aria-pressed={mode === "simulate"}
          onClick={() => apply("simulate")}
        >
          Simulate
        </button>
        <button
          type="button"
          className={mode === "compare" ? "on" : ""}
          aria-pressed={mode === "compare"}
          onClick={() => apply("compare")}
        >
          Compare
        </button>
      </div>
      <div className="im-bars" aria-hidden="true">
        <div>
          <span>Incremental</span>
          <b style={{ width: pending ? "20%" : simulated ? "28%" : "0%" }} />
        </div>
        <div>
          <span>Standalone</span>
          <b className="hold" style={{ width: pending ? "20%" : simulated ? "74%" : "0%" }} />
        </div>
      </div>
    </HudShell>
  );
}
