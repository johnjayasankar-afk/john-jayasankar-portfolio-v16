import { useState } from "react";
import { useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";
import { useCompactStage } from "@/util/compactStage";

/**
 * Home thesis: production agents → HITL spine → multilateral market.
 * Metrics match content. Compact layout stacks the same story for narrow viewports.
 */
const AGENTS = [
  { id: "I-Port", metric: "3.5h→8m", note: "Expert setup" },
  { id: "CoCo", metric: "4.5h→11m", note: "Incident triage" },
] as const;

/** Eight banks keep the ring legible; labels only for the active pair + a few anchors. */
const BANKS = ["JPM", "GS", "MS", "CITI", "BNPP", "BARC", "DB", "UBS"] as const;

export function SystemsCore() {
  useBus();
  const compact = useCompactStage();
  const [hover, setHover] = useState(-1);
  const t = visual.core;
  const agentsOn = t < 0.34;
  const gateOn = t >= 0.34 && t < 0.72;
  const marketOn = t >= 0.72;
  const pair = marketOn ? (hover >= 0 ? hover : 0) : hover;
  const setPhase = (v: number) => {
    visual.core = v;
    visual.story = "rest";
  };

  if (compact) {
    return (
      <CompactCore
        agentsOn={agentsOn}
        gateOn={gateOn}
        marketOn={marketOn}
        setPhase={setPhase}
        pair={pair}
        setHover={setHover}
      />
    );
  }

  return (
    <WideCore
      agentsOn={agentsOn}
      gateOn={gateOn}
      marketOn={marketOn}
      setPhase={setPhase}
      pair={pair}
      hover={hover}
      setHover={setHover}
    />
  );
}

type PhaseProps = {
  agentsOn: boolean;
  gateOn: boolean;
  marketOn: boolean;
  setPhase: (v: number) => void;
  pair: number;
  setHover: (i: number) => void;
};

function WideCore({
  agentsOn,
  gateOn,
  marketOn,
  setPhase,
  pair,
  hover,
  setHover,
}: PhaseProps & { hover: number }) {
  // Ring fully inside Market panel (y=68..304). Hub y matches HITL/flow rail.
  const cx = 560;
  const cy = 192;
  const r = 48;
  const labelR = 72;
  const outerR = r + 10;
  const hitlCx = 260;
  const hitlCy = 192;
  // One shared horizontal rail: Agents → Gate → Market (LCH).
  const flowY = hitlCy;

  const nodes = BANKS.map((name, i) => {
    const a = (i / BANKS.length) * Math.PI * 2 - Math.PI / 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    return {
      name,
      i,
      x: cx + c * r,
      y: cy + s * r,
      lx: cx + c * labelR,
      ly: cy + s * labelR,
      pair: (i + BANKS.length / 2) % BANKS.length,
    };
  });

  const status = marketOn
    ? pair >= 0
      ? `${nodes[pair].name} × ${nodes[nodes[pair].pair].name}`
      : "$6.5T eligible"
    : gateOn
      ? "Approval required"
      : "Hours → minutes";

  return (
    <Frame
      viewBox="0 0 840 360"
      family="market"
      onMove={(x, y) => {
        const px = x * 840;
        const py = y * 360;
        let best = -1;
        let bestD = 28 * 28;
        for (const n of nodes) {
          const d = (n.x - px) ** 2 + (n.y - py) ** 2;
          if (d < bestD) {
            bestD = d;
            best = n.i;
          }
        }
        setHover(best);
      }}
    >
      <text className="m-title" x="24" y="28" fontSize={14}>
        Agents + markets · one control model
      </text>
      <text className="m-k" x="24" y="48" fontSize={12}>
        Production AI · shared human gate · multilateral compression
      </text>
      <text className="m-label" x="816" y="28" textAnchor="end" fontSize={13}>
        {status}
      </text>

      {/* Zone panels - teach the three beats without requiring interaction */}
      <rect
        className="m-box"
        x="20"
        y="68"
        width="168"
        height="236"
        rx="2"
        opacity={agentsOn ? 0.22 : 0.08}
      />
      <rect
        className="m-box"
        x="204"
        y="68"
        width="112"
        height="236"
        rx="2"
        opacity={gateOn ? 0.28 : 0.08}
      />
      <rect
        className="m-box"
        x="332"
        y="68"
        width="488"
        height="236"
        rx="2"
        opacity={marketOn ? 0.16 : 0.06}
      />

      <text className="m-k" x="104" y="90" textAnchor="middle" fontSize={11} opacity={agentsOn ? 1 : 0.55}>
        01 · Agents
      </text>
      <text className="m-k" x="260" y="90" textAnchor="middle" fontSize={11} opacity={gateOn ? 1 : 0.55}>
        02 · Gate
      </text>
      <text className="m-k" x={cx} y="90" textAnchor="middle" fontSize={11} opacity={marketOn ? 1 : 0.55}>
        03 · Market
      </text>

      <g style={{ cursor: "pointer" }}>
        {AGENTS.map((a, i) => {
          // I-Port high, CoCo low - mid flow rail (y=168) stays in the gap.
          const y = 118 + i * 108;
          const hot = agentsOn || gateOn;
          return (
            <g key={a.id} onClick={() => setPhase(i === 0 ? 0 : 0.5)}>
              <circle className={hot ? "m-fill" : "m-box"} cx="48" cy={y} r="8" opacity={hot ? 0.95 : 0.45} />
              <text className="m-label" x="68" y={y - 8} fontSize={15}>
                {a.id}
              </text>
              <text className="m-k" x="68" y={y + 12} fontSize={12}>
                {a.note}
              </text>
              <text className="m-label" x="68" y={y + 30} fontSize={13} opacity={hot ? 1 : 0.5}>
                {a.id === "I-Port" ? (
                  <>
                    <tspan>3.5h</tspan>
                    <tspan dx="4">→</tspan>
                    <tspan dx="4">8m</tspan>
                  </>
                ) : (
                  <>
                    <tspan>4.5h</tspan>
                    <tspan dx="4">→</tspan>
                    <tspan dx="4">11m</tspan>
                  </>
                )}
              </text>
            </g>
          );
        })}
      </g>

      <g style={{ cursor: "pointer" }} onClick={() => setPhase(0.5)}>
        <rect className="m-box" x="236" y="118" width="48" height="148" rx="2" opacity={gateOn ? 0.95 : 0.5} />
        <text
          className="m-label"
          textAnchor="middle"
          fontSize={15}
          transform={`translate(${hitlCx} ${hitlCy}) rotate(-90)`}
          dy="0.28em"
        >
          HITL
        </text>
        <text className="m-k" x="260" y="278" textAnchor="middle" fontSize={12} opacity={gateOn ? 1 : 0.5}>
          {gateOn ? "armed" : "required"}
        </text>
      </g>

      {/* Start past agent copy so the rail never crosses "triage". */}
      <line className="m-flow" x1="188" y1={flowY} x2="230" y2={flowY} opacity={gateOn || marketOn ? 0.9 : 0.35} />
      <line className="m-flow" x1="290" y1={flowY} x2="448" y2={flowY} opacity={marketOn ? 0.9 : 0.28} />

      <g style={{ cursor: "pointer" }} onClick={() => setPhase(1)}>
        <text className="m-label" x={cx} y="104" textAnchor="middle" fontSize={15}>
          SwapAgent · XCCY
        </text>
        <text className="m-k" x={cx} y="118" textAnchor="middle" fontSize={12} opacity={marketOn ? 0.95 : 0.5}>
          18 banks · 12 pairs · $6.5T eligible
        </text>

        <circle className="m-line" cx={cx} cy={cy} r={outerR} opacity={marketOn ? 0.4 : 0.12} />
        {nodes.map((n) => {
          const held = pair >= 0 && (n.i === pair || n.i === nodes[pair].pair);
          const lit = marketOn && held;
          const partner = nodes[n.pair];
              const showLabel = lit || (marketOn && (n.i % 2 === 0 || n.name === "CITI" || hover === n.i));
          return (
            <g key={n.name}>
              {lit && (
                <line
                  className="m-line"
                  x1={n.x}
                  y1={n.y}
                  x2={partner.x}
                  y2={partner.y}
                  opacity="0.7"
                  strokeWidth={2}
                />
              )}
              <line
                className="m-line"
                x1={n.x}
                y1={n.y}
                x2={cx}
                y2={cy}
                opacity={lit ? 0.85 : marketOn ? 0.14 : 0.06}
              />
              <circle className={lit ? "m-fill" : "m-box"} cx={n.x} cy={n.y} r={lit ? 6 : 4} opacity={lit ? 1 : 0.6} />
              {showLabel && (
                <text
                  className={lit ? "m-label" : "m-k"}
                  x={n.lx}
                  y={n.ly + 4}
                  textAnchor="middle"
                  fontSize={lit ? 12 : 10}
                  opacity={lit ? 1 : 0.65}
                >
                  {n.name}
                </text>
              )}
            </g>
          );
        })}
        <circle className={marketOn ? "m-fill" : "m-box"} cx={cx} cy={cy} r="20" opacity={marketOn ? 0.4 : 0.14} />
        <circle className="m-box" cx={cx} cy={cy} r="20" />
        <text className="m-label" x={cx} y={cy + 5} textAnchor="middle" fontSize={14}>
          LCH
        </text>
      </g>

      <text className="m-k" x="24" y="340" fontSize={12} opacity="0.55">
        Same control spine across Quantile systems - illustrative silhouette
      </text>
      <text className="m-k" x="816" y="340" textAnchor="end" fontSize={12} opacity={marketOn ? 0.95 : 0.5}>
        {marketOn && pair >= 0
          ? `${nodes[pair].name} × ${nodes[nodes[pair].pair].name} · residual held`
          : "Offsets inside a risk envelope"}
      </text>
    </Frame>
  );
}

function CompactCore({ agentsOn, gateOn, marketOn, setPhase, pair, setHover }: PhaseProps) {
  const banks = BANKS.slice(0, 6);
  const cx = 200;
  const cy = 368;
  const r = 52;
  const nodes = banks.map((name, i) => {
    const a = (i / banks.length) * Math.PI * 2 - Math.PI / 2;
    return {
      name,
      i,
      x: cx + Math.cos(a) * r,
      y: cy + Math.sin(a) * r,
      pair: (i + banks.length / 2) % banks.length,
    };
  });
  const active = pair >= 0 ? pair % banks.length : 0;

  return (
    <Frame
      viewBox="0 0 400 480"
      family="market"
      onMove={(x, y) => {
        const px = x * 400;
        const py = y * 480;
        let best = -1;
        let bestD = 26 * 26;
        for (const n of nodes) {
          const d = (n.x - px) ** 2 + (n.y - py) ** 2;
          if (d < bestD) {
            bestD = d;
            best = n.i;
          }
        }
        setHover(best);
      }}
    >
      <text className="m-title" x="20" y="26" fontSize={14}>
        Agents + markets
      </text>
      <text className="m-k" x="20" y="46" fontSize={12}>
        One control model · tap a phase
      </text>

      {/* 01 Agents */}
      <g style={{ cursor: "pointer" }} onClick={() => setPhase(0)}>
        <rect className="m-box" x="16" y="64" width="368" height="108" rx="2" opacity={agentsOn ? 0.28 : 0.1} />
        <text className="m-k" x="28" y="86" fontSize={11} opacity={agentsOn ? 1 : 0.55}>
          01 · Production agents
        </text>
        {AGENTS.map((a, i) => (
          <g key={a.id}>
            <text className="m-label" x={28 + i * 180} y="114" fontSize={15}>
              {a.id}
            </text>
            <text className="m-k" x={28 + i * 180} y="134" fontSize={12}>
              {a.note}
            </text>
            <text className="m-label" x={28 + i * 180} y="156" fontSize={14} opacity={agentsOn ? 1 : 0.55}>
              {a.metric}
            </text>
          </g>
        ))}
      </g>

      {/* 02 Gate */}
      <g style={{ cursor: "pointer" }} onClick={() => setPhase(0.5)}>
        <rect className="m-box" x="16" y="184" width="368" height="72" rx="2" opacity={gateOn ? 0.32 : 0.1} />
        <text className="m-k" x="28" y="208" fontSize={11} opacity={gateOn ? 1 : 0.55}>
          02 · Human-in-the-loop gate
        </text>
        <text className="m-label" x="28" y="236" fontSize={15}>
          HITL · {gateOn ? "armed - approval before action" : "approval before irreversible action"}
        </text>
      </g>

      {/* 03 Market */}
      <g style={{ cursor: "pointer" }} onClick={() => setPhase(1)}>
        <rect className="m-box" x="16" y="268" width="368" height="192" rx="2" opacity={marketOn ? 0.22 : 0.08} />
        <text className="m-k" x="28" y="292" fontSize={11} opacity={marketOn ? 1 : 0.55}>
          03 · SwapAgent · XCCY
        </text>
        <text className="m-label" x="28" y="316" fontSize={14}>
          Multilateral offsets · $6.5T eligible
        </text>
        <text className="m-k" x="28" y="336" fontSize={12} opacity={marketOn ? 0.9 : 0.5}>
          {marketOn
            ? `${nodes[active].name} × ${nodes[nodes[active].pair].name} · residual held`
            : "18 banks · 12 pairs - illustrative"}
        </text>

        <circle className="m-line" cx={cx} cy={cy} r={r + 10} opacity={marketOn ? 0.35 : 0.12} />
        {nodes.map((n) => {
          const held = marketOn && (n.i === active || n.i === nodes[active].pair);
          const partner = nodes[n.pair];
          return (
            <g key={n.name}>
              {held && (
                <line
                  className="m-line"
                  x1={n.x}
                  y1={n.y}
                  x2={partner.x}
                  y2={partner.y}
                  opacity="0.75"
                  strokeWidth={2}
                />
              )}
              <circle className={held ? "m-fill" : "m-box"} cx={n.x} cy={n.y} r={held ? 6 : 4} opacity={held ? 1 : 0.55} />
              {held && (
                <text className="m-label" x={n.x} y={n.y < cy ? n.y - 12 : n.y + 18} textAnchor="middle" fontSize={12}>
                  {n.name}
                </text>
              )}
            </g>
          );
        })}
        <circle className={marketOn ? "m-fill" : "m-box"} cx={cx} cy={cy} r="16" opacity={marketOn ? 0.4 : 0.14} />
        <circle className="m-box" cx={cx} cy={cy} r="16" />
        <text className="m-label" x={cx} y={cy + 4} textAnchor="middle" fontSize={12}>
          LCH
        </text>
      </g>
    </Frame>
  );
}
