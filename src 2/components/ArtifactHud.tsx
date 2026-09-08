import { useEffect, useRef, useState } from "react";
import { visual, type ArtifactKind } from "@/scene/visual";
import { useBus } from "@/artifacts/useBus";

export function ArtifactHud({ kind }: { kind: ArtifactKind }) {
  if (kind === "cross-currency") return <CompressHud />;
  if (kind === "margin-simulator") return <CapitalHud />;
  if (kind === "iport") return <PhaseHud field="iport" steps={["Sequential", "Bounded", "Parallel"]} note="Expert setup becomes parallel capacity." />;
  if (kind === "coco") return <PhaseHud field="coco" steps={["Incident", "Trace", "Cause"]} note="Evidence layers narrow to a path." />;
  if (kind === "valuation") return <PhaseHud field="reconcile" steps={["Split", "Diff", "Verified"]} note="Two sources. Tolerance. Lock." />;
  if (kind === "fx-compression") return <PhaseHud field="fx" steps={["Book", "Gate", "Proposal"]} note="Margin sits inside the optimizer." />;
  if (kind === "agentfit") return <FitHud />;
  if (kind === "opportunity") return <PhaseHud field="os" steps={["Today", "Pipeline", "Story"]} note="One local workspace. Next action, board, and evidence." />;
  if (kind === "systems-core") return <PhaseHud field="core" steps={["Context", "Gate", "Market"]} note="Authorize context. Bound the action. Settlement holds." />;
  return null;
}

function PhaseHud({
  field,
  steps,
  note,
}: {
  field: "iport" | "coco" | "reconcile" | "fx" | "os" | "core";
  steps: [string, string, string];
  note: string;
}) {
  useBus();
  const [, tick] = useState(0);
  const t = visual[field];
  const set = (value: number) => {
    visual[field] = value;
    visual.story = "rest";
    tick((n) => n + 1);
  };
  return (
    <div className="artifact-hud">
      <p className="sys">{t < 0.34 ? steps[0] : t < 0.72 ? steps[1] : steps[2]}</p>
      <div className="hud-row">
        <button type="button" className={t < 0.34 ? "on" : ""} onClick={() => set(0)}>
          {steps[0]}
        </button>
        <button type="button" className={t >= 0.34 && t < 0.72 ? "on" : ""} onClick={() => set(0.5)}>
          {steps[1]}
        </button>
        <button type="button" className={t >= 0.72 ? "on" : ""} onClick={() => set(1)}>
          {steps[2]}
        </button>
      </div>
      <p className="hud-note">{note}</p>
    </div>
  );
}

function FitHud() {
  useBus();
  const [, tick] = useState(0);
  const t = visual.fit;
  const set = (value: number) => {
    visual.fit = value;
    visual.story = "rest";
    tick((n) => n + 1);
  };
  return (
    <div className="artifact-hud">
      <p className="sys">{t < 42 ? "Copilot" : t < 72 ? "Supervised" : "Bounded"}</p>
      <div className="hud-row">
        <button className={t < 42 ? "on" : ""} onClick={() => set(28)}>
          Copilot
        </button>
        <button className={t >= 42 && t < 72 ? "on" : ""} onClick={() => set(58)}>
          Supervised
        </button>
        <button className={t >= 72 ? "on" : ""} onClick={() => set(86)}>
          Bounded
        </button>
      </div>
      <p className="hud-note">Autonomy is a product decision. The marker moves with control, not with model size.</p>
    </div>
  );
}

function CompressHud() {
  useBus();
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
    <div className="artifact-hud">
      <p className="sys">{phase}</p>
      <div className="hud-row">
        <button className={t < 0.12 ? "on" : ""} onClick={() => set(0)}>
          Gross
        </button>
        <button className={running || (t > 0.12 && t < 0.96) ? "on" : ""} onClick={run}>
          Run
        </button>
        <button className={!running && t >= 0.96 ? "on" : ""} onClick={() => set(1)}>
          Compressed
        </button>
        <button
          className={visual.hoverEnvelope ? "on" : ""}
          onMouseEnter={() => {
            visual.hoverEnvelope = true;
            tick((n) => n + 1);
          }}
          onMouseLeave={() => {
            visual.hoverEnvelope = false;
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
      <p className="hud-note">Notional falls. Risk stays inside the envelope.</p>
    </div>
  );
}

function CapitalHud() {
  useBus();
  const mode = visual.capitalMode;
  const apply = (next: typeof visual.capitalMode) => {
    visual.capitalMode = next;
    visual.story = "rest";
  };
  const simulated = mode === "simulate" || mode === "compare";
  const pending = mode === "proposed";

  return (
    <div className="artifact-hud">
      <p className="sys">
        {mode === "baseline"
          ? "Base portfolio"
          : mode === "proposed"
            ? "Incremental trade"
            : mode === "simulate"
              ? "Venue scenarios"
              : "Incremental vs standalone"}
      </p>
      <div className="hud-row">
        <button className={mode === "baseline" ? "on" : ""} onClick={() => apply("baseline")}>
          Base
        </button>
        <button className={mode === "proposed" ? "on" : ""} onClick={() => apply("proposed")}>
          + Trade
        </button>
        <button className={mode === "simulate" ? "on" : ""} onClick={() => apply("simulate")}>
          Simulate
        </button>
        <button className={mode === "compare" ? "on" : ""} onClick={() => apply("compare")}>
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
      <p className="hud-note">
        {mode === "baseline"
          ? "Current margin. The next trade is still unknown."
          : mode === "proposed"
            ? "Hypothetical sits outside the book until you simulate."
            : mode === "simulate"
              ? "Same trade, three venues, before execution."
              : "Offsets in the book make incremental cheaper than standalone."}
      </p>
    </div>
  );
}
