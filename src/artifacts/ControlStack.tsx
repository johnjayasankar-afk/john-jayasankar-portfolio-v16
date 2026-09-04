import { visual } from "@/scene/visual";
import { Frame } from "./Frame";
import { useBus } from "./useBus";

export const CONTROL_LAYERS = [
  { label: "Context", note: "MCP / domain APIs", short: "Context" },
  { label: "Typed actions", note: "Pydantic bounds", short: "Actions" },
  { label: "Deterministic services", note: "high-consequence logic", short: "Services" },
  { label: "HITL gates", note: "consequential steps", short: "HITL" },
  { label: "Eval / QA", note: "path to production", short: "Eval" },
];

export function ControlStack() {
  useBus();
  const hot = visual.stack;

  return (
    <Frame viewBox="0 0 800 360">
      <text className="m-title" x="28" y="26">
        Reusable control plane
      </text>
      <text className="m-k" x="28" y="46">
        Five enterprise systems  ·  same interfaces
      </text>
      <text className="m-num" x="772" y="40" textAnchor="end" fontSize="28">
        5
      </text>
      <text className="m-k" x="772" y="62" textAnchor="end">
        agent systems
      </text>

      <line className="m-line" x1="48" y1="78" x2="48" y2="300" opacity="0.28" />

      {CONTROL_LAYERS.map((layer, i) => {
        const w = 560 - i * 40;
        const x = (800 - w) / 2;
        const y = 78 + i * 44;
        const on = hot === i;
        return (
          <g
            key={layer.label}
            style={{ cursor: "pointer" }}
            onClick={() => {
              visual.stack = i;
              visual.story = "rest";
            }}
          >
            <circle className={on ? "m-fill" : "m-box"} cx="48" cy={y + 16} r="4" opacity={on ? 0.95 : 0.4} />
            {on && <rect className="m-fill" x={x} y={y} width={w} height="32" opacity="0.1" />}
            <rect className="m-box" x={x} y={y} width={w} height="32" />
            <text className="m-k" x={x + 16} y={y + 20} opacity={on ? 1 : 0.7}>
              {String(i + 1).padStart(2, "0")}  {layer.label}
            </text>
            <text className="m-k" x={x + w - 16} y={y + 20} textAnchor="end" opacity={on ? 0.9 : 0.55}>
              {layer.note}
            </text>
          </g>
        );
      })}
    </Frame>
  );
}
