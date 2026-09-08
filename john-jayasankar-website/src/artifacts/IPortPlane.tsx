import { storyBlend, useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";

/**
 * I-Port silhouette: a collapsing time bar (3.5h → 8m) feeding a run packet.
 * Not a three-column flowchart — a before/after instrument.
 */
export function IPortPlane() {
  useBus();
  const t = storyBlend(visual.iport);
  const gated = t > 0.28;
  const done = t > 0.55;
  const set = (v: number) => {
    visual.iport = v;
    visual.story = "rest";
  };

  // Time bar geometry: tall expert stack collapses into a short ops bar
  const expertH = done ? 28 : 168;
  const opsH = done ? 168 : 28;
  const expertY = 88 + (168 - expertH);
  const opsY = 88 + (168 - opsH);

  // Horizontal spine sits in a clear band between context chips and below Bind label.
  const spineY = 176;

  return (
    <Frame viewBox="0 0 800 320" family="agent">
      <text className="m-title" x="28" y="22" fontSize={12}>
        I-Port · compression-run setup
      </text>
      <text className="m-k" x="28" y="40" fontSize={11}>
        {done
          ? "Ops cycle · typed actions · 0 AI config errors / 6 mo"
          : gated
            ? "HITL armed · reversible tools only"
            : "Senior engineering owns every setup · the queue is the bottleneck"}
      </text>
      <text className="m-num" x="760" y="36" textAnchor="end" fontSize={30}>
        {done ? "8m" : "3.5h"}
      </text>
      <text className="m-k" x="760" y="58" textAnchor="end" fontSize={11}>
        {done ? "ops cycle" : "expert setup"}
      </text>

      {/* BEFORE column — collapsing time */}
      <g style={{ cursor: "pointer" }} onClick={() => set(0)}>
        <text className="m-label" x="48" y="74" fontSize={13}>
          Before
        </text>
        <rect className="m-box" x="48" y="88" width="64" height="168" opacity="0.25" />
        <rect className="m-fill" x="48" y={expertY} width="64" height={expertH} opacity={done ? 0.2 : 0.55} />
        <text className="m-k" x="80" y="278" textAnchor="middle" fontSize={11}>
          Expert · 3.5h
        </text>
      </g>

      {/* Context chips — kept above/below the spine so labels never ride the flow */}
      <g style={{ cursor: "pointer" }} onClick={() => set(0)} opacity={gated || done ? 1 : 0.55}>
        {[
          { y: 96, label: "Run state" },
          { y: 124, label: "Client config" },
          { y: 214, label: "Authorized APIs" },
        ].map((row) => (
          <g key={row.label}>
            <circle className={gated || done ? "m-fill" : "m-box"} cx="148" cy={row.y + 10} r="3.5" opacity={gated || done ? 0.85 : 0.35} />
            <text className="m-k" x="160" y={row.y + 14} fontSize={11}>
              {row.label}
            </text>
          </g>
        ))}
      </g>

      {/* Flow stops at the gate edge — never drawn through HITL letters */}
      <line className="m-flow" x1="278" y1={spineY} x2="312" y2={spineY} opacity={gated ? 0.9 : 0.3} />

      {/* HITL gate — vertical slit */}
      <g style={{ cursor: "pointer" }} onClick={() => set(0.5)}>
        <rect className="m-box" x="318" y="108" width="44" height="136" rx="2" opacity={gated ? 0.9 : 0.45} />
        <text className="m-label" x="340" y={spineY} textAnchor="middle" transform={`rotate(-90 340 ${spineY})`} fontSize={13}>
          HITL
        </text>
        <text className="m-k" x="340" y="260" textAnchor="middle" opacity={gated ? 0.95 : 0.4} fontSize={11}>
          {gated ? "on" : "off"}
        </text>
      </g>

      <line className="m-flow" x1="368" y1={spineY} x2="404" y2={spineY} opacity={done ? 0.9 : 0.3} />

      {/* Typed action ticks → run packet. Bind sits on the spine; its label sits above. */}
      <g style={{ cursor: "pointer" }} onClick={() => set(1)}>
        {[
          { label: "Authorize", y: 118, labelDy: 4 },
          { label: "Bind", y: spineY, labelDy: -18 },
          { label: "Assemble", y: 228, labelDy: 4 },
        ].map((row, i, arr) => {
          const live = done && t > 0.2 + i * 0.18;
          const next = arr[i + 1];
          return (
            <g key={row.label} opacity={live ? 1 : 0.4}>
              <circle className={live ? "m-fill" : "m-box"} cx="420" cy={row.y} r="5" />
              {next && (
                <line
                  className="m-line"
                  x1="420"
                  y1={row.y + 6}
                  x2="420"
                  y2={next.y - 6}
                  opacity={live ? 0.5 : 0.2}
                />
              )}
              <text className="m-k" x="436" y={row.y + row.labelDy} fontSize={11}>
                {row.label}
              </text>
            </g>
          );
        })}
      </g>

      <line className="m-flow" x1="520" y1={spineY} x2="552" y2={spineY} opacity={done ? 0.9 : 0.25} />

      {/* AFTER — rising ops bar + run packet */}
      <g style={{ cursor: "pointer" }} onClick={() => set(1)}>
        <text className="m-label" x="568" y="74" fontSize={13}>
          After
        </text>
        <rect className="m-box" x="568" y="88" width="64" height="168" opacity="0.25" />
        <rect className="m-fill" x="568" y={opsY} width="64" height={opsH} opacity={done ? 0.55 : 0.2} />
        <text className="m-k" x="600" y="278" textAnchor="middle" fontSize={11}>
          Ops · 8m
        </text>

        <rect className="m-box" x="656" y="118" width="116" height="108" rx="2" opacity={done ? 0.85 : 0.4} />
        <text className="m-label" x="714" y="146" textAnchor="middle" fontSize={13}>
          Run packet
        </text>
        <rect className="m-box" x="674" y="162" width="80" height="6" opacity="0.35" />
        <rect className="m-fill" x="674" y="162" width={done ? 80 : 16} height="6" opacity="0.7" />
        <rect className="m-box" x="674" y="176" width="56" height="6" opacity="0.35" />
        <rect className="m-fill" x="674" y="176" width={done ? 56 : 10} height="6" opacity="0.5" />
        <text className="m-k" x="714" y="206" textAnchor="middle" opacity={done ? 0.95 : 0.4} fontSize={11}>
          {done ? "submit-ready" : "empty"}
        </text>
      </g>

      <text className="m-k" x="28" y="304" opacity="0.5" fontSize={11}>
        Bounded agent in the ops workflow · operator remains the gate · 3× volume, same headcount
      </text>
    </Frame>
  );
}
