import { storyBlend, useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";

/** Dual-source valuation: two ledgers flanking a geometric tolerance band. */
const PHASES = [
  { id: "Submit", at: 0 },
  { id: "Split", at: 0.35 },
  { id: "Diff", at: 0.55 },
  { id: "Lock", at: 0.85 },
];

const ROWS = [
  { id: "A", a: 100.0, b: 100.0, d: 0 },
  { id: "B", a: 98.4, b: 99.12, d: 22 },
  { id: "C", a: 101.2, b: 101.2, d: 0 },
  { id: "D", a: 94.1, b: 92.4, d: -26 },
  { id: "E", a: 100.0, b: 100.05, d: 2 },
  { id: "F", a: 97.5, b: 97.4, d: -3 },
];

export function ReconcilePlane() {
  useBus();
  const t = storyBlend(visual.reconcile);
  const split = t > 0.28;
  const diffing = t > 0.5;
  const locked = t > 0.82;
  const set = (v: number) => {
    visual.reconcile = v;
    visual.story = "rest";
  };
  const band = 15;

  return (
    <Frame viewBox="0 0 800 320" family="market">
      <text className="m-title" x="28" y="22" fontSize={12}>
        Dual-source valuation · before live
      </text>
      <text className="m-k" x="28" y="40" fontSize={11}>
        {locked
          ? "Locked · $6T+ cycle across 24 banks may run"
          : diffing
            ? "Tolerance band · fail early, not in the live window"
            : split
              ? "Independent view running in parallel"
              : "Single-source · discrepancies wait for live"}
      </text>
      <text className="m-num" x="760" y="32" textAnchor="end" fontSize={34}>
        {locked ? "-91%" : "48h"}
      </text>
      <text className="m-k" x="760" y="58" textAnchor="end" fontSize={11}>
        {locked ? "resubmissions" : "earlier detection"}
      </text>

      {/* Phase ticks — labels below the line so they clear the top-right metric */}
      <line className="m-line" x1="48" y1="72" x2="752" y2="72" opacity="0.25" />
      {PHASES.map((p, i) => {
        const x = 48 + i * 200;
        const on = t >= p.at;
        return (
          <g key={p.id} style={{ cursor: "pointer" }} onClick={() => set(p.at || 0.01)}>
            <circle className={on ? "m-fill" : "m-box"} cx={x} cy="72" r="5" opacity={on ? 0.95 : 0.35} />
            <text className="m-k" x={x} y="90" textAnchor="middle" opacity={on ? 1 : 0.4} fontSize={11}>
              {p.id}
            </text>
          </g>
        );
      })}

      {/* Internal ledger */}
      <g style={{ cursor: "pointer" }} onClick={() => set(0.35)}>
        <text className="m-label" x="28" y="112" fontSize={13}>
          Internal
        </text>
        {ROWS.map((row, i) => (
          <g key={`a-${row.id}`} opacity={split ? 1 : 0.4}>
            <text className="m-k" x="28" y={132 + i * 20} fontSize={11}>
              {row.id}
            </text>
            <text className="m-k" x="160" y={132 + i * 20} textAnchor="end" fontSize={11}>
              {row.a.toFixed(2)}
            </text>
          </g>
        ))}
      </g>

      {/* Tolerance band — hero geometry */}
      <g style={{ cursor: "pointer" }} onClick={() => set(0.55)}>
        <text className="m-label" x="400" y="112" textAnchor="middle" fontSize={13}>
          ±{band} bp band
        </text>
        <rect className="m-box" x="220" y="124" width="360" height="140" rx="2" opacity="0.35" />
        <rect className="m-box" x="310" y="124" width="180" height="140" opacity="0.7" />
        <line className="m-line" x1="400" y1="124" x2="400" y2="264" opacity="0.55" />
        <text className="m-k" x="228" y="118" opacity="0.4" fontSize={11}>
          −{band}
        </text>
        <text className="m-k" x="572" y="118" textAnchor="end" opacity="0.4" fontSize={11}>
          +{band}
        </text>

        {ROWS.map((row, i) => {
          const x = 400 + Math.max(-160, Math.min(160, (row.d / band) * 90));
          const show = diffing || locked;
          const out = Math.abs(row.d) > band;
          return (
            <g key={`d-${row.id}`} opacity={show ? 1 : 0.2}>
              <circle
                className={out && show ? "m-fill" : "m-box"}
                cx={x}
                cy={144 + i * 18}
                r={out && show ? 5 : 3.5}
                opacity={show ? 0.95 : 0.3}
              />
              {show && out && (
                <text
                  className="m-k"
                  x={x + (row.d > 0 ? 10 : -10)}
                  y={148 + i * 18}
                  textAnchor={row.d > 0 ? "start" : "end"}
                  opacity="0.8"
                  fontSize={11}
                >
                  {row.d > 0 ? "+" : ""}
                  {row.d}
                </text>
              )}
            </g>
          );
        })}

        <text
          className="m-k"
          x="400"
          y="279"
          textAnchor="middle"
          fontSize={11}
          opacity={locked ? 0.95 : 0.5}
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation();
            set(1);
          }}
        >
          {locked ? "Locked" : "Band"}
        </text>
      </g>

      {/* Independent ledger */}
      <g style={{ cursor: "pointer" }} onClick={() => set(0.35)}>
        <text className="m-label" x="760" y="112" textAnchor="end" fontSize={13}>
          Independent
        </text>
        {ROWS.map((row, i) => (
          <g key={`b-${row.id}`} opacity={split ? 1 : 0.4}>
            <text className="m-k" x="640" y={132 + i * 20} fontSize={11}>
              {row.id}
            </text>
            <text className="m-k" x="760" y={132 + i * 20} textAnchor="end" fontSize={11}>
              {row.b.toFixed(2)}
            </text>
          </g>
        ))}
      </g>

      <text className="m-k" x="28" y="312" opacity={locked ? 0.95 : 0.45} fontSize={11}>
        {locked ? "Live window cleared" : "Live window blocked until lock"}
      </text>
    </Frame>
  );
}
