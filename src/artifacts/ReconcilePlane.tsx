import { storyBlend, useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";

/**
 * Dual-source valuation before a live compression cycle.
 * Default teaches: one source is late failure; compare early, lock, then run.
 * $6T+ is cycle notional under validation - not revenue.
 */
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

  const caption = locked
    ? "Locked · discrepancies fixed while it is still cheap"
    : diffing
      ? "Diff · rows outside the band fail early, not in the live window"
      : split
        ? "Split · run an independent view beside internal marks"
        : "Before · a late mismatch can halt a multi-trillion cycle";

  return (
    <Frame viewBox="0 0 800 320" family="market">
      <text className="m-title" x="28" y="20" fontSize={12}>
        Dual-source valuation · before live
      </text>
      <text className="m-k" x="28" y="38" fontSize={11}>
        {caption}
      </text>

      <text className="m-num" x="620" y="26" textAnchor="end" fontSize={22}>
        48h
      </text>
      <text className="m-k" x="632" y="26" fontSize={14}>
        →
      </text>
      <text className="m-num" x="760" y="26" textAnchor="end" fontSize={22} opacity={locked ? 1 : 0.55}>
        −91%
      </text>
      <text className="m-k" x="760" y="46" textAnchor="end" fontSize={11}>
        {locked ? "resubmissions · measured" : "earlier detection → fewer resubmits"}
      </text>
      <text className="m-k" x="760" y="62" textAnchor="end" fontSize={11} opacity="0.55">
        $6T+ cycle notional · 24 banks
      </text>

      <line className="m-line" x1="48" y1="84" x2="520" y2="84" opacity="0.25" />
      {PHASES.map((p, i) => {
        const x = 48 + i * 120;
        const on = t >= p.at;
        return (
          <g key={p.id} style={{ cursor: "pointer" }} onClick={() => set(p.at || 0.01)}>
            <circle className={on ? "m-fill" : "m-box"} cx={x} cy="84" r="5" opacity={on ? 0.95 : 0.35} />
            <text className="m-k" x={x} y="102" textAnchor="middle" opacity={on ? 1 : 0.4} fontSize={11}>
              {p.id}
            </text>
          </g>
        );
      })}

      <g style={{ cursor: "pointer" }} onClick={() => set(0.35)}>
        <text className="m-label" x="28" y="124" fontSize={13}>
          Internal
        </text>
        {ROWS.map((row, i) => (
          <g key={`a-${row.id}`} opacity={split ? 1 : 0.4}>
            <text className="m-k" x="28" y={144 + i * 20} fontSize={11}>
              {row.id}
            </text>
            <text className="m-k" x="160" y={144 + i * 20} textAnchor="end" fontSize={11}>
              {row.a.toFixed(2)}
            </text>
          </g>
        ))}
      </g>

      <g style={{ cursor: "pointer" }} onClick={() => set(0.55)}>
        <text className="m-label" x="400" y="124" textAnchor="middle" fontSize={13}>
          ±{band} bp tolerance
        </text>
        <text className="m-k" x="400" y="140" textAnchor="middle" fontSize={10} opacity="0.55">
          basis points · outside = fix before live
        </text>
        <rect className="m-box" x="220" y="148" width="360" height="120" rx="2" opacity="0.35" />
        <rect className="m-box" x="310" y="148" width="180" height="120" opacity="0.7" />
        <line className="m-line" x1="400" y1="148" x2="400" y2="268" opacity="0.55" />

        {ROWS.map((row, i) => {
          const x = 400 + Math.max(-160, Math.min(160, (row.d / band) * 90));
          const show = diffing || locked;
          const out = Math.abs(row.d) > band;
          return (
            <g key={`d-${row.id}`} opacity={show ? 1 : 0.2}>
              <circle
                className={out && show ? "m-fill" : "m-box"}
                cx={x}
                cy={162 + i * 16}
                r={out && show ? 5 : 3.5}
                opacity={show ? 0.95 : 0.3}
              />
              {show && out && (
                <text
                  className="m-k"
                  x={x + (row.d > 0 ? 10 : -10)}
                  y={166 + i * 16}
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
          y="286"
          textAnchor="middle"
          fontSize={11}
          opacity={locked ? 0.95 : 0.5}
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation();
            set(1);
          }}
        >
          {locked ? "Locked for live" : "Band"}
        </text>
      </g>

      <g style={{ cursor: "pointer" }} onClick={() => set(0.35)}>
        <text className="m-label" x="760" y="124" textAnchor="end" fontSize={13}>
          Independent
        </text>
        {ROWS.map((row, i) => (
          <g key={`b-${row.id}`} opacity={split ? 1 : 0.4}>
            <text className="m-k" x="640" y={144 + i * 20} fontSize={11}>
              {row.id}
            </text>
            <text className="m-k" x="760" y={144 + i * 20} textAnchor="end" fontSize={11}>
              {row.b.toFixed(2)}
            </text>
          </g>
        ))}
      </g>

      <text className="m-k" x="28" y="312" opacity="0.55" fontSize={11}>
 Conceptual workflow · $6T+ is cycle notional under check - not revenue
      </text>
    </Frame>
  );
}
