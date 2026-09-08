import { storyBlend, useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";
import { useCompactStage } from "@/util/compactStage";

/**
 * I-Port: before → gate → after.
 * Default state readable without interaction: expert time is the bottleneck.
 * Conceptual workflow - outcomes cited elsewhere on the case.
 */
export function IPortPlane() {
  useBus();
  const compact = useCompactStage();
  const t = storyBlend(visual.iport);
  const phase = t < 0.34 ? 0 : t < 0.72 ? 1 : 2;
  const before = phase === 0;
  const gate = phase === 1;
  const after = phase === 2;

  const set = (v: number) => {
    visual.iport = v;
    visual.story = "rest";
  };

  const caption = before
    ? "Bottleneck: senior engineering owns every setup"
    : gate
      ? "Operator gate on · agent may use typed actions only"
      : "Ops runs the cycle · expert hours freed";

  if (compact) {
    return <CompactIPort before={before} gate={gate} after={after} caption={caption} set={set} />;
  }

  const barH = 132;
  const barTop = 100;
  const expertFill = before ? barH : gate ? 80 : 24;
  const opsFill = before ? 24 : gate ? 60 : barH;
  const expertY = barTop + (barH - expertFill);
  const opsY = barTop + (barH - opsFill);
  const hitlCx = 324;
  const hitlCy = 172;
  // Rail between Context rows so it never strikes "config".
  const flowY = 158;

  return (
    <Frame viewBox="0 0 840 360" family="agent">
      <text className="m-title" x="24" y="28" fontSize={14}>
        I-Port · compression-run setup
      </text>
      <text className="m-k" x="24" y="48" fontSize={12}>
        {caption}
      </text>

      {/* Compact metric as one cluster - no wide gap before 8m */}
      <text className="m-num" x="816" y="32" textAnchor="end" fontSize={24}>
        <tspan>3.5h</tspan>
        <tspan dx="8" className="m-k" fontSize={18} fill="currentColor" opacity={0.78}>
          →
        </tspan>
        <tspan dx="8" opacity={after ? 1 : 0.55}>
          8m
        </tspan>
      </text>
      <text className="m-k" x="816" y="52" textAnchor="end" fontSize={11}>
        {after ? "ops cycle · measured" : "target ops cycle"}
      </text>

      <rect className="m-box" x="20" y="68" width="100" height="248" rx="2" opacity={before ? 0.22 : 0.08} />
      <rect className="m-box" x="136" y="68" width="280" height="248" rx="2" opacity={gate ? 0.2 : 0.07} />
      <rect className="m-box" x="432" y="68" width="388" height="248" rx="2" opacity={after ? 0.18 : 0.06} />

      <g style={{ cursor: "pointer" }} onClick={() => set(0)} opacity={before ? 1 : gate ? 0.75 : 0.5}>
        <text className="m-k" x="70" y="90" textAnchor="middle" fontSize={11} opacity={before ? 1 : 0.55}>
          01 · Before
        </text>
        <rect className="m-box" x="44" y={barTop} width="52" height={barH} opacity="0.28" />
        <rect className="m-fill" x="44" y={expertY} width="52" height={expertFill} opacity={before ? 0.7 : 0.3} />
        <text className="m-label" x="70" y="258" textAnchor="middle" fontSize={12}>
          Expert
        </text>
        <text className="m-k" x="70" y="276" textAnchor="middle" fontSize={12}>
          3.5h
        </text>
      </g>

      <g style={{ cursor: "pointer" }} onClick={() => set(0.5)} opacity={before ? 0.55 : 1}>
        <text className="m-k" x="276" y="90" textAnchor="middle" fontSize={11} opacity={gate ? 1 : 0.55}>
          02 · Gate
        </text>
        <text className="m-label" x="152" y="114" fontSize={13}>
          Context
        </text>
        {[
          { y: 136, label: "Run state" },
          { y: 178, label: "Client config" },
          { y: 200, label: "Authorized APIs" },
        ].map((row) => (
          <g key={row.label}>
            <circle className={!before ? "m-fill" : "m-box"} cx="160" cy={row.y} r="4" opacity={!before ? 0.95 : 0.4} />
            <text className="m-k" x="174" y={row.y + 4} fontSize={12}>
              {row.label}
            </text>
          </g>
        ))}

        <rect className="m-box" x="300" y="122" width="48" height="100" rx="2" opacity={gate || after ? 0.95 : 0.45} />
        <text
          className="m-label"
          textAnchor="middle"
          fontSize={14}
          transform={`translate(${hitlCx} ${hitlCy}) rotate(-90)`}
          dy="0.28em"
        >
          HITL
        </text>
        <text className="m-k" x="324" y="240" textAnchor="middle" fontSize={11}>
          {before ? "gate off" : "gate on"}
        </text>

        {/* Actions fully inside the gate panel - clear of the bottom border */}
        <text className="m-label" x="152" y="256" fontSize={13}>
          Actions
        </text>
        {[
          { label: "Authorize", x: 160 },
          { label: "Bind", x: 252 },
          { label: "Assemble", x: 318 },
        ].map((row, i) => {
          const live = after || (gate && i === 0);
          return (
            <g key={row.label}>
              <circle className={live ? "m-fill" : "m-box"} cx={row.x} cy="270" r="5" opacity={live ? 1 : 0.45} />
              <text className="m-k" x={row.x + 12} y="274" fontSize={12}>
                {row.label}
              </text>
            </g>
          );
        })}
      </g>

      <line className="m-flow" x1="252" y1={flowY} x2="294" y2={flowY} opacity={gate || after ? 0.9 : 0.3} />
      <line className="m-flow" x1="348" y1={flowY} x2="448" y2={flowY} opacity={after ? 0.9 : gate ? 0.55 : 0.25} />

      <g style={{ cursor: "pointer" }} onClick={() => set(1)} opacity={after ? 1 : gate ? 0.65 : 0.45}>
        <text className="m-k" x="626" y="90" textAnchor="middle" fontSize={11} opacity={after ? 1 : 0.55}>
          03 · After
        </text>
        <rect className="m-box" x="456" y={barTop} width="52" height={barH} opacity="0.28" />
        <rect className="m-fill" x="456" y={opsY} width="52" height={opsFill} opacity={after ? 0.7 : 0.25} />
        <text className="m-label" x="482" y="258" textAnchor="middle" fontSize={12}>
          Ops
        </text>
        <text className="m-k" x="482" y="276" textAnchor="middle" fontSize={12}>
          8m
        </text>

        <rect className="m-box" x="532" y="120" width="260" height="140" rx="2" opacity={after ? 0.95 : 0.4} />
        <text className="m-label" x="662" y="152" textAnchor="middle" fontSize={14}>
          Run packet
        </text>
        <rect className="m-box" x="568" y="174" width="188" height="8" opacity="0.35" />
        <rect className="m-fill" x="568" y="174" width={after ? 188 : gate ? 80 : 28} height="8" opacity="0.75" />
        <rect className="m-box" x="568" y="194" width="140" height="8" opacity="0.35" />
        <rect className="m-fill" x="568" y="194" width={after ? 140 : gate ? 48 : 16} height="8" opacity="0.55" />
        <text className="m-k" x="662" y="232" textAnchor="middle" fontSize={12} opacity={after ? 1 : 0.45}>
          {after ? "submit-ready" : gate ? "assembling" : "empty"}
        </text>
      </g>

      <text className="m-k" x="24" y="344" opacity="0.55" fontSize={12}>
        Conceptual workflow · 3× volume at constant headcount · 0 AI config errors / 6 mo
      </text>
    </Frame>
  );
}

function CompactIPort({
  before,
  gate,
  after,
  caption,
  set,
}: {
  before: boolean;
  gate: boolean;
  after: boolean;
  caption: string;
  set: (v: number) => void;
}) {
  return (
    <Frame viewBox="0 0 400 520" family="agent">
      <text className="m-title" x="20" y="24" fontSize={14}>
        I-Port · setup
      </text>
      <text className="m-num" x="20" y="52" fontSize={20}>
        3.5h
      </text>
      <text className="m-k" x="78" y="52" fontSize={14}>
        →
      </text>
      <text className="m-num" x="100" y="52" fontSize={20} opacity={after ? 1 : 0.6}>
        8m
      </text>
      <text className="m-k" x="20" y="74" fontSize={12}>
        {caption}
      </text>

      <g style={{ cursor: "pointer" }} onClick={() => set(0)}>
        <rect className="m-box" x="16" y="90" width="368" height="100" rx="2" opacity={before ? 0.28 : 0.1} />
        <text className="m-k" x="28" y="112" fontSize={11} opacity={before ? 1 : 0.55}>
          01 · Before · expert owns setup
        </text>
        <rect className="m-box" x="28" y="128" width={before ? 300 : 80} height="28" opacity="0.25" />
        <rect className="m-fill" x="28" y="128" width={before ? 300 : 80} height="28" opacity={before ? 0.7 : 0.35} />
        <text className="m-label" x="40" y="148" fontSize={14}>
          Expert · 3.5 hours
        </text>
        <text className="m-k" x="28" y="176" fontSize={12}>
          Throughput bottleneck - every run waits on seniors
        </text>
      </g>

      <g style={{ cursor: "pointer" }} onClick={() => set(0.5)}>
        <rect className="m-box" x="16" y="202" width="368" height="148" rx="2" opacity={gate ? 0.3 : 0.1} />
        <text className="m-k" x="28" y="224" fontSize={11} opacity={gate ? 1 : 0.55}>
          02 · Gate · HITL {before ? "off" : "on"}
        </text>
        <text className="m-label" x="28" y="250" fontSize={13}>
          Context → HITL → typed actions
        </text>
        <text className="m-k" x="28" y="274" fontSize={12}>
          Run state · Client config · Authorized APIs
        </text>
        <text className="m-k" x="28" y="298" fontSize={12} opacity={gate || after ? 0.95 : 0.5}>
          Authorize · Bind · Assemble
        </text>
        <text className="m-k" x="28" y="326" fontSize={12} opacity={gate ? 1 : 0.5}>
          {gate ? "Agent may act only through reversible tools" : "Approval sits before irreversible work"}
        </text>
      </g>

      <g style={{ cursor: "pointer" }} onClick={() => set(1)}>
        <rect className="m-box" x="16" y="362" width="368" height="140" rx="2" opacity={after ? 0.28 : 0.1} />
        <text className="m-k" x="28" y="384" fontSize={11} opacity={after ? 1 : 0.55}>
          03 · After · ops runs the cycle
        </text>
        <rect className="m-box" x="28" y="400" width={after ? 300 : 60} height="28" opacity="0.25" />
        <rect className="m-fill" x="28" y="400" width={after ? 300 : 60} height="28" opacity={after ? 0.7 : 0.3} />
        <text className="m-label" x="40" y="420" fontSize={14}>
          Ops · 8 minutes
        </text>
        <text className="m-k" x="28" y="450" fontSize={12}>
          Run packet: {after ? "submit-ready" : gate ? "assembling" : "empty"}
        </text>
        <text className="m-k" x="28" y="478" fontSize={12} opacity="0.55">
          Conceptual · 3× volume · 0 AI config errors / 6 mo
        </text>
      </g>
    </Frame>
  );
}
