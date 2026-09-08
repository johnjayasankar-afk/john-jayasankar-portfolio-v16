import { storyBlend, useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";

/** ForexClear: dense book matrix → IM-in-solver ladder with four-source marks. */
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
  { id: "Eligibility", at: 0.15 },
  { id: "ForexClear IM", at: 0.4 },
  { id: "Four-source", at: 0.65 },
  { id: "Live window", at: 0.85 },
];

const SOURCES = ["Bank", "Vendor", "Internal", "Clearing"];

export function FxMatrix() {
  useBus();
  const t = storyBlend(visual.fx);
  const booked = t < 0.34;
  const gated = t >= 0.34 && t < 0.72;
  const accepted = t >= 0.72;
  const set = (v: number) => {
    visual.fx = v;
    visual.story = "rest";
  };

  return (
    <Frame viewBox="0 0 800 320" family="market">
      <text className="m-title" x="28" y="22" fontSize={12}>
        ForexClear · FX / NDF compression
      </text>
      <text className="m-k" x="28" y="40" fontSize={11}>
        {accepted
          ? "Accepted · IM held in solver · four-source cleared"
          : gated
            ? "Gates deciding the cut · margin API + independent marks"
            : "Forward / NDF book for a live run"}
      </text>
      <text className="m-num" x="760" y="32" textAnchor="end" fontSize={34}>
        {accepted ? "100%" : "40+"}
      </text>
      <text className="m-k" x="760" y="56" textAnchor="end" fontSize={11}>
        {accepted ? "acceptance" : "live runs"}
      </text>

      {/* Dense 3×3 book matrix — primary silhouette */}
      <g style={{ cursor: "pointer" }} onClick={() => set(0)}>
        <text className="m-label" x="28" y="76" fontSize={13}>
          Book
        </text>
        {CELLS.map((cell, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const x = 28 + col * 114;
          const y = 88 + row * 62;
          const pass = cell.ok && (accepted || gated);
          const reject = gated && !cell.ok;
          return (
            <g key={`${cell.pair}-${cell.tenor}`}>
              <rect className="m-box" x={x} y={y} width="104" height="52" rx="1" opacity={pass ? 0.7 : reject ? 0.25 : 0.4} />
              <text className="m-k" x={x + 10} y={y + 22} opacity={reject ? 0.35 : 0.95} fontSize={11}>
                {cell.pair}
              </text>
              <text className="m-k" x={x + 10} y={y + 40} opacity={reject ? 0.3 : 0.5} fontSize={11}>
                {cell.kind}
                {gated || accepted ? ` ${cell.tenor}` : ""}
              </text>
              <text className="m-k" x={x + 94} y={y + 22} textAnchor="end" opacity={pass ? 0.95 : reject ? 0.75 : 0.3} fontSize={11}>
                {pass ? "in" : reject ? cell.why : "hold"}
              </text>
            </g>
          );
        })}
      </g>

      <line className="m-flow" x1="360" y1="174" x2="400" y2="174" opacity={gated || accepted ? 0.9 : 0.3} />

      {/* Solver column */}
      <g style={{ cursor: "pointer" }} onClick={() => set(0.5)}>
        <text className="m-label" x="400" y="76" fontSize={13}>
          Optimizer
        </text>
        <text className="m-k" x="400" y="92" fontSize={11}>
          ForexClear IM in the solver
        </text>

        {/* Four-source constellation with quiet radial labels when gated */}
        {SOURCES.map((s, i) => {
          const ang = (i / 4) * Math.PI * 2 - Math.PI / 2;
          const sx = 700 + Math.cos(ang) * 28;
          const sy = 122 + Math.sin(ang) * 28;
          const lx = 700 + Math.cos(ang) * 48;
          const ly = 122 + Math.sin(ang) * 48;
          const on = t >= 0.65;
          return (
            <g key={s}>
              <line className="m-line" x1="700" y1="122" x2={sx} y2={sy} opacity={on ? 0.55 : 0.15} />
              <circle className={on ? "m-fill" : "m-box"} cx={sx} cy={sy} r="5" opacity={on ? 0.85 : 0.35} />
              {(gated || accepted) && (
                <text
                  className="m-k"
                  x={lx}
                  y={ly + 3}
                  textAnchor="middle"
                  opacity={on ? 0.72 : 0.28}
                  fontSize={9}
                >
                  {s}
                </text>
              )}
            </g>
          );
        })}
        <circle className={t >= 0.65 ? "m-fill" : "m-box"} cx="700" cy="122" r="6" opacity={t >= 0.65 ? 0.8 : 0.3} />

        {GATES.map((gate, i) => {
          const y = 168 + i * 26;
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
                <line className="m-line" x1="416" y1={y + 5} x2="416" y2={y + 21} opacity={on ? 0.5 : 0.15} />
              )}
              <text className="m-k" x="432" y={y + 4} opacity={on ? 1 : 0.45} fontSize={11}>
                {gate.id}
              </text>
              <text className="m-k" x="620" y={y + 4} opacity={on ? 0.9 : 0.3} fontSize={11}>
                {on ? "pass" : "n/a"}
              </text>
            </g>
          );
        })}
      </g>

      <g style={{ cursor: "pointer" }} onClick={() => set(1)}>
        <line className="m-line" x1="28" y1="286" x2="772" y2="286" opacity="0.2" />
        <text className="m-k" x="28" y="308" fontSize={11}>
          Outcome
        </text>
        <text className="m-k" x="120" y="308" opacity={accepted ? 0.95 : 0.45} fontSize={11}>
          {accepted ? "−94% live failures · 100% proposal acceptance" : booked ? "Awaiting gates" : "Gates deciding cut"}
        </text>
      </g>
    </Frame>
  );
}
