import { storyBlend, useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";

/**
 * FX / NDF compression with margin gates inside the optimizer.
 * Default: the book is ready, but gates decide what may go live.
 * Conceptual - acceptance and failure rates are production outcomes on the case.
 */
const CELLS = [
  { pair: "USDJPY", tenor: "3M", kind: "Fwd", ok: true, why: "in" },
  { pair: "EURUSD", tenor: "6M", kind: "Fwd", ok: true, why: "in" },
  { pair: "GBPUSD", tenor: "1Y", kind: "Fwd", ok: false, why: "tenor" },
  { pair: "USDCNH", tenor: "1M", kind: "NDF", ok: true, why: "in" },
  { pair: "AUDUSD", tenor: "2Y", kind: "Fwd", ok: true, why: "in" },
  { pair: "USDTRY", tenor: "3M", kind: "NDF", ok: false, why: "IM" },
  { pair: "EURGBP", tenor: "9M", kind: "Fwd", ok: true, why: "in" },
  { pair: "USDCHF", tenor: "1M", kind: "Fwd", ok: true, why: "in" },
  { pair: "NZDUSD", tenor: "3M", kind: "Fwd", ok: false, why: "elig" },
];

const GATES = [
  { id: "Eligibility", plain: "Can this trade enter?", at: 0.15 },
  { id: "ForexClear IM", plain: "Margin still holds?", at: 0.4 },
  { id: "Four-source", plain: "Inputs agree?", at: 0.65 },
  { id: "Live window", plain: "Safe to run live?", at: 0.85 },
];

/**
 * Hub owns the top-right pocket only (x≥650, y≤190).
 * Gate ladder owns x 400–600 below the headers - never shares that pocket.
 */
const HUB = { cx: 730, cy: 142 } as const;
const SOURCES = [
  { id: "Bank", x: HUB.cx, y: 116, lx: HUB.cx, ly: 104, anchor: "middle" as const },
  { id: "Vendor", x: 762, y: HUB.cy, lx: 776, ly: HUB.cy + 4, anchor: "start" as const },
  { id: "Internal", x: HUB.cx, y: 168, lx: HUB.cx, ly: 184, anchor: "middle" as const },
  { id: "Clearing", x: 698, y: HUB.cy, lx: 684, ly: HUB.cy + 4, anchor: "end" as const },
];

export function FxMatrix() {
  useBus();
  const t = storyBlend(visual.fx);
  const gated = t >= 0.34 && t < 0.72;
  const accepted = t >= 0.72;
  const set = (v: number) => {
    visual.fx = v;
    visual.story = "rest";
  };

  const caption = accepted
    ? "Accepted · margin held in the solver · four sources cleared"
    : gated
      ? "Gates cut bad proposals before the live window"
      : "Book ready · good math still fails if margin or data disagree";

  const hubOn = t >= 0.65;

  return (
    <Frame viewBox="0 0 800 320" family="market">
      <text className="m-title" x="28" y="20" fontSize={12}>
        ForexClear · FX forwards & NDFs
      </text>
      <text className="m-k" x="28" y="38" fontSize={11}>
        {caption}
      </text>

      <text className="m-num" x="620" y="26" textAnchor="end" fontSize={22}>
        40+
      </text>
      <text className="m-k" x="632" y="26" fontSize={14}>
        →
      </text>
      <text className="m-num" x="760" y="26" textAnchor="end" fontSize={22} opacity={accepted ? 1 : 0.55}>
        100%
      </text>
      <text className="m-k" x="760" y="46" textAnchor="end" fontSize={11}>
        {accepted ? "proposal acceptance · measured" : "live runs → acceptance target"}
      </text>
      <text className="m-k" x="760" y="62" textAnchor="end" fontSize={11} opacity={accepted ? 0.95 : 0.5}>
        {accepted ? "−94% live failures" : "NDF = non-deliverable forward"}
      </text>

      <g style={{ cursor: "pointer" }} onClick={() => set(0)}>
        <text className="m-label" x="28" y="86" fontSize={13}>
          Book
        </text>
        <text className="m-k" x="70" y="86" fontSize={10} opacity="0.5">
          Fwd / NDF cells
        </text>
        {CELLS.map((cell, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const x = 28 + col * 114;
          const y = 96 + row * 54;
          const pass = cell.ok && (accepted || gated);
          const reject = gated && !cell.ok;
          return (
            <g key={`${cell.pair}-${cell.tenor}`}>
              <rect className="m-box" x={x} y={y} width="104" height="46" rx="1" opacity={pass ? 0.7 : reject ? 0.25 : 0.4} />
              <text className="m-k" x={x + 10} y={y + 17} opacity={reject ? 0.35 : 0.95} fontSize={11}>
                {cell.pair}
              </text>
              <text className="m-k" x={x + 10} y={y + 32} opacity={reject ? 0.3 : 0.5} fontSize={11}>
                {cell.kind}
                {gated || accepted ? ` ${cell.tenor}` : ""}
              </text>
              <text className="m-k" x={x + 94} y={y + 17} textAnchor="end" opacity={pass ? 0.95 : reject ? 0.75 : 0.3} fontSize={11}>
                {pass ? "in" : reject ? cell.why : "hold"}
              </text>
            </g>
          );
        })}
      </g>

      <line className="m-flow" x1="360" y1="170" x2="400" y2="170" opacity={gated || accepted ? 0.9 : 0.3} />

      <g style={{ cursor: "pointer" }} onClick={() => set(0.5)}>
        <text className="m-label" x="400" y="86" fontSize={13}>
          Optimizer gates
        </text>
        <text className="m-k" x="400" y="102" fontSize={11}>
          ForexClear IM inside the solver
        </text>
        <text className="m-k" x="400" y="116" fontSize={10} opacity="0.55">
          not a cleanup step
        </text>

        {/* Hub title below the top-right metric stack (NDF line ends ~y=62). */}
        <text className="m-k" x={HUB.cx} y="86" textAnchor="middle" fontSize={10} opacity={hubOn ? 0.85 : 0.45}>
          Four sources
        </text>
        {SOURCES.map((s) => (
          <g key={s.id}>
            <line className="m-line" x1={HUB.cx} y1={HUB.cy} x2={s.x} y2={s.y} opacity={hubOn ? 0.55 : 0.2} />
            <circle className={hubOn ? "m-fill" : "m-box"} cx={s.x} cy={s.y} r="4" opacity={hubOn ? 0.9 : 0.4} />
            <text className="m-k" x={s.lx} y={s.ly} textAnchor={s.anchor} opacity={hubOn ? 0.85 : 0.4} fontSize={9}>
              {s.id}
            </text>
          </g>
        ))}
        <circle className={hubOn ? "m-fill" : "m-box"} cx={HUB.cx} cy={HUB.cy} r="5" opacity={hubOn ? 0.85 : 0.35} />

        {/*
          Gate ladder: one line per gate (id + status). Plain sits under id with a
          fixed 14px baseline gap. Column ends at x=600 so Clearing (≈684) never meets n/a.
        */}
        {GATES.map((gate, i) => {
          const y = 148 + i * 36;
          const on = t >= gate.at;
          const phase = i < 1 ? 0 : i < 3 ? 0.5 : 1;
          return (
            <g
              key={gate.id}
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                set(phase);
              }}
            >
              <circle className={on ? "m-fill" : "m-box"} cx="416" cy={y} r="5" opacity={on ? 0.95 : 0.35} />
              {i < GATES.length - 1 && (
                <line className="m-line" x1="416" y1={y + 5} x2="416" y2={y + 31} opacity={on ? 0.5 : 0.15} />
              )}
              <text className="m-k" x="432" y={y + 4} opacity={on ? 1 : 0.45} fontSize={11}>
                {gate.id}
              </text>
              <text className="m-k" x="592" y={y + 4} textAnchor="end" opacity={on ? 0.9 : 0.3} fontSize={11}>
                {on ? "pass" : "n/a"}
              </text>
              <text className="m-k" x="432" y={y + 18} opacity={on ? 0.6 : 0.25} fontSize={9}>
                {gate.plain}
              </text>
            </g>
          );
        })}
      </g>

      <text className="m-k" x="28" y="312" opacity="0.55" fontSize={11}>
        Conceptual workflow · gates decide the cut before live · outcomes measured in production
      </text>
    </Frame>
  );
}
