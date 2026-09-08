import { visual } from "@/scene/visual";
import { Frame } from "./Frame";
import { useBus } from "./useBus";

export const CONTROL_LAYERS = [
  { label: "Domain context", note: "MCP + APIs", short: "Context", plug: "Run state · entitlements" },
  { label: "Typed actions", note: "Pydantic bounds", short: "Actions", plug: "Authorize · bind · assemble" },
  { label: "Deterministic services", note: "outside the model", short: "Services", plug: "Valuation · IM · matching" },
  { label: "HITL gates", note: "consequential steps", short: "HITL", plug: "Operator approve / reject" },
  { label: "Eval / QA", note: "prototype → production", short: "Eval", plug: "Quality bar · rollout" },
];

const SYSTEMS = [
  { id: "I-Port", layer: 1, note: "setup" },
  { id: "CoCo", layer: 0, note: "incident" },
  { id: "XCCY", layer: 2, note: "compress" },
  { id: "Validate", layer: 2, note: "dual-val" },
  { id: "FX", layer: 3, note: "ForexClear" },
];

/** Vertical control spine with systems orbiting — one live plug traced. */
export function ControlStack() {
  useBus();
  const hot = visual.stack;
  const active = SYSTEMS.find((s) => s.layer === hot) ?? SYSTEMS[0];
  const spineX = 380;
  const layerY = (i: number) => 68 + i * 44;

  return (
    <Frame viewBox="0 0 800 320" family="agent">
      <text className="m-title" x="28" y="20" fontSize={12}>
        AI platform & controls
      </text>
      <text className="m-k" x="28" y="36" fontSize={11}>
        One plug path · five systems · scope expands when evals say so
      </text>
      <text className="m-num" x="760" y="28" textAnchor="end" fontSize={28}>
        5
      </text>
      <text className="m-k" x="760" y="48" textAnchor="end" fontSize={11}>
        shared control model
      </text>

      {/* Systems orbit left */}
      {SYSTEMS.map((sys, i) => {
        const y = 78 + i * 40;
        const on = hot === sys.layer;
        return (
          <g
            key={sys.id}
            style={{ cursor: "pointer" }}
            onClick={() => {
              visual.stack = sys.layer;
              visual.story = "rest";
            }}
          >
            <text className="m-label" x="28" y={y - 2} opacity={on ? 1 : 0.55} fontSize={13}>
              {sys.id}
            </text>
            <text className="m-k" x="28" y={y + 14} opacity={on ? 0.65 : 0.28} fontSize={11}>
              {sys.note}
            </text>
            <circle className={on ? "m-fill" : "m-box"} cx="148" cy={y + 4} r={on ? 6 : 4.5} opacity={on ? 0.9 : 0.4} />
            {on && (
              <line className="m-flow" x1="156" y1={y + 4} x2={spineX - 12} y2={layerY(hot) + 10} opacity="0.9" />
            )}
          </g>
        );
      })}

      {/* Central spine */}
      <line className="m-line" x1={spineX} y1="64" x2={spineX} y2="280" opacity="0.35" />
      {CONTROL_LAYERS.map((layer, i) => {
        const y = layerY(i);
        const on = hot === i;
        const passed = i <= hot;
        return (
          <g
            key={layer.label}
            style={{ cursor: "pointer" }}
            onClick={() => {
              visual.stack = i;
              visual.story = "rest";
            }}
          >
            <circle
              className={on ? "m-fill" : passed ? "m-fill" : "m-box"}
              cx={spineX}
              cy={y + 10}
              r={on ? 7 : 4.5}
              opacity={on ? 0.95 : passed ? 0.5 : 0.3}
            />
            {on && (
              <line
                className="m-line"
                x1={spineX + 14}
                y1={y + 10}
                x2={spineX + 24}
                y2={y + 10}
                opacity="0.55"
              />
            )}
            <text className="m-k" x={spineX + 28} y={y + 4} opacity={on ? 1 : 0.5} fontSize={11}>
              {String(i + 1).padStart(2, "0")}  {layer.label}
            </text>
            <text className="m-k" x={spineX + 28} y={y + 20} opacity={on ? 0.85 : 0.3} fontSize={11}>
              {on ? `${active.id}: ${layer.plug}` : layer.note}
            </text>
            <text className="m-k" x="760" y={y + 14} textAnchor="end" opacity={on ? 0.55 : 0.28} fontSize={11}>
              {layer.short}
            </text>
          </g>
        );
      })}

      <text className="m-k" x="28" y="300" opacity="0.45" fontSize={11}>
        {active.id} plugs at layer {hot + 1} · {CONTROL_LAYERS[hot].short}
      </text>
      <text className="m-k" x="760" y="300" textAnchor="end" opacity="0.45" fontSize={11}>
        Same interfaces · shared spine
      </text>
    </Frame>
  );
}
