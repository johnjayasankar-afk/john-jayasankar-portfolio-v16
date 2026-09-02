import { useState } from "react";
import { Frame } from "./Frame";

const layers = [
  { label: "Context", note: "MCP / domain APIs" },
  { label: "Typed actions", note: "Pydantic bounds" },
  { label: "Deterministic services", note: "high-consequence logic" },
  { label: "HITL gates", note: "consequential steps" },
  { label: "Eval / QA", note: "path to production" },
];

export function ControlStack() {
  const [hot, setHot] = useState(2);

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

      <line className="m-line" x1="48" y1="78" x2="48" y2="318" opacity="0.28" />

      {layers.map((layer, i) => {
        const w = 560 - i * 40;
        const x = (800 - w) / 2;
        const y = 82 + i * 48;
        const on = hot === i;
        return (
          <g key={layer.label} style={{ cursor: "pointer" }} onClick={() => setHot(i)}>
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

      <text className="m-k" x="400" y="344" textAnchor="middle">
        {String(hot + 1).padStart(2, "0")}  {layers[hot].label}  ·  {layers[hot].note}
      </text>
    </Frame>
  );
}
