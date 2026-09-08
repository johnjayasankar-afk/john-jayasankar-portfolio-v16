import { storyBlend, useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";

const rows = [
  { id: "T-041", a: "100.00", b: "100.00", d: 0 },
  { id: "T-042", a: "98.40", b: "99.12", d: 22 },
  { id: "T-043", a: "101.20", b: "101.20", d: 0 },
  { id: "T-044", a: "94.10", b: "92.40", d: -26 },
  { id: "T-045", a: "100.00", b: "100.00", d: 0 },
  { id: "T-046", a: "97.60", b: "98.05", d: 14 },
];

export function ReconcilePlane() {
  useBus();
  const t = storyBlend(visual.reconcile);
  const locked = t > 0.85;
  const diffing = t > 0.4;

  return (
    <Frame viewBox="0 0 800 320">
      <text className="m-title" x="28" y="26">
        Dual-source valuation
      </text>
      <text className="m-k" x="28" y="46">
        {locked ? "Verified lock  ·  cycle can run" : diffing ? "Diff inside tolerance" : "Independent views  ·  live window not yet"}
      </text>
      <text className="m-num" x="772" y="40" textAnchor="end" fontSize="28">
        {locked ? "−91%" : "48h"}
      </text>
      <text className="m-k" x="772" y="62" textAnchor="end">
        {locked ? "resubmissions" : "earlier detection"}
      </text>

      <text className="m-k" x="40" y="82">
        Source A
      </text>
      <text className="m-k" x="400" y="82" textAnchor="middle">
        Tolerance
      </text>
      <text className="m-k" x="760" y="82" textAnchor="end">
        Source B
      </text>

      <rect className="m-box" x="28" y="92" width="228" height="204" style={{ cursor: "pointer" }} onClick={() => { visual.reconcile = 0; visual.story = "rest"; }} />
      <rect className="m-box m-dash" x="292" y="92" width="216" height="204" opacity="0.6" style={{ cursor: "pointer" }} onClick={() => { visual.reconcile = 0.5; visual.story = "rest"; }} />
      <rect className="m-box" x="544" y="92" width="228" height="204" style={{ cursor: "pointer" }} onClick={() => { visual.reconcile = 0; visual.story = "rest"; }} />

      {rows.map((row, i) => {
        const y = 118 + i * 24;
        const mismatch = row.d !== 0;
        const split = mismatch ? row.d * (1 - t) * 0.55 : 0;
        return (
          <g key={row.id}>
            <text className="m-k" x="44" y={y}>
              {row.id}
            </text>
            <text className="m-k" x="236" y={y} textAnchor="end">
              {row.a}
            </text>
            <circle className="m-fill" cx="256" cy={y - 4} r="3" />
            <line className="m-line" x1="256" y1={y - 4} x2={544 + split} y2={y - 4} opacity={mismatch ? 0.5 : 0.16} />
            <text className="m-k" x="400" y={y - 14} textAnchor="middle" opacity={mismatch && diffing ? 0.95 : 0.4}>
              {mismatch ? `${row.d > 0 ? "+" : ""}${row.d} bp` : "—"}
            </text>
            <circle className="m-fill" cx={544 + split} cy={y - 4} r="3" opacity={mismatch && !locked ? 1 : 0.5} />
            <text className="m-k" x="752" y={y} textAnchor="end">
              {row.b}
            </text>
          </g>
        );
      })}

      <g style={{ cursor: "pointer" }} onClick={() => { visual.reconcile = 1; visual.story = "rest"; }}>
        <rect className={locked ? "m-fill" : "m-box"} x="348" y="272" width="104" height="18" opacity={locked ? 0.16 : 1} />
        <rect className="m-box" x="348" y="272" width="104" height="18" />
        <text className="m-k" x="400" y="284" textAnchor="middle">
          {locked ? "Lock" : "Band"}
        </text>
      </g>
    </Frame>
  );
}
