import { storyBlend, useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";

const rows = [
  { layer: "Run state", marks: [0.12, 0.28, 0.41, 0.58, 0.71, 0.86] },
  { layer: "Telemetry", marks: [0.18, 0.33, 0.47, 0.62, 0.79] },
  { layer: "Config", marks: [0.22, 0.38, 0.54, 0.69, 0.84] },
  { layer: "Knowledge", marks: [0.31, 0.49, 0.66, 0.81] },
];

const FAIL = 0.58;
const LEFT = 148;
const SPAN = 612;

export function CocoTrace() {
  useBus();
  const t = storyBlend(visual.coco);
  const traced = t > 0.28;
  const caused = t > 0.72;
  const set = (value: number) => {
    visual.coco = value;
    visual.story = "rest";
  };

  return (
    <Frame viewBox="0 0 800 320">
      <text className="m-title" x="28" y="26">
        Incident forensics
      </text>
      <text className="m-k" x="28" y="46">
        {caused ? "Root cause isolated" : traced ? "Evidence path only" : "Four sources  ·  unscoped noise"}
      </text>
      <text className="m-num" x="772" y="40" textAnchor="end" fontSize="28">
        {caused ? "11m" : "4.5h"}
      </text>
      <text className="m-k" x="772" y="58" textAnchor="end">
        {caused ? "investigation" : "expert triage"}
      </text>

      <line className="m-line" x1={LEFT} y1="80" x2={LEFT + SPAN} y2="80" />
      {[0, 0.25, 0.5, 0.75, 1].map((u) => (
        <line key={u} className="m-line" x1={LEFT + u * SPAN} y1="76" x2={LEFT + u * SPAN} y2="84" opacity="0.5" />
      ))}
      <text className="m-k" x={LEFT} y="68">
        T+0
      </text>

      <g style={{ cursor: "pointer" }} onClick={() => set(1)}>
        <line className="m-line" x1={LEFT + FAIL * SPAN} y1="80" x2={LEFT + FAIL * SPAN} y2="236" opacity="0.85" />
        <text className="m-k" x={LEFT + FAIL * SPAN} y="254" textAnchor="middle">
          Fail
        </text>
      </g>

      {rows.map((row, i) => {
        const y = 110 + i * 36;
        return (
          <g key={row.layer} style={{ cursor: "pointer" }} onClick={() => set(traced ? 0 : 0.5)}>
            <text className="m-k" x="28" y={y + 4}>
              {row.layer}
            </text>
            <line className="m-line" x1={LEFT} y1={y} x2={LEFT + SPAN} y2={y} opacity="0.22" />
            {row.marks.map((u) => {
              const x = LEFT + u * SPAN;
              const near = Math.abs(u - FAIL) < 0.06;
              const show = !traced || near;
              return (
                <rect
                  key={u}
                  className={near && traced ? "m-fill" : "m-box"}
                  x={x - 4}
                  y={y - 6}
                  width={near ? 10 : 8}
                  height={near ? 12 : 10}
                  opacity={show ? (near ? 0.95 : 0.4) : 0.08}
                />
              );
            })}
          </g>
        );
      })}

      {caused && (
        <text className="m-k" x={LEFT + FAIL * SPAN + 12} y="98">
          Config drift
        </text>
      )}
    </Frame>
  );
}
