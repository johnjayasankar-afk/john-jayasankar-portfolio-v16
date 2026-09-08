import { useState } from "react";
import { useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";

/**
 * Home thesis silhouette: narrow agent rail → HITL spine → dense SwapAgent ring.
 * 12 of 18 banks; metrics match content.
 */
const AGENTS = [
  { id: "I-Port", metric: "3.5h→8m", note: "Setup" },
  { id: "CoCo", metric: "4.5h→11m", note: "Incident" },
];
const BANKS = ["JPM", "GS", "MS", "Citi", "BNPP", "BARC", "DB", "UBS", "HSBC", "RBC", "SCB", "BofA"];

export function SystemsCore() {
  useBus();
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

  const cx = 520;
  const cy = 176;
  const r = 90;
  const labelR = 116;
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
      ly: cy + s * labelR + (s < -0.35 ? 12 : s > 0.35 ? -10 : 0),
      pair: (i + 6) % BANKS.length,
    };
  });

  return (
    <Frame
      viewBox="0 0 800 320"
      family="market"
      onMove={(x, y) => {
        const px = x * 800;
        const py = y * 320;
        let best = -1;
        let bestD = 22 * 22;
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
      <text className="m-title" x="28" y="18" fontSize={12}>
        Agents + markets · one control model
      </text>
      <text className="m-k" x="28" y="36" fontSize={11}>
        Production AI · shared HITL · multilateral compression
      </text>
      <text className="m-k" x="772" y="18" textAnchor="end" fontSize={11}>
        {marketOn ? "$6.5T eligible" : gateOn ? "HITL armed" : "live agents"}
      </text>

      {/* Agent rail — labels stay left of the gate corridor */}
      <g style={{ cursor: "pointer" }}>
        <line className="m-line" x1="40" y1="96" x2="40" y2="230" opacity="0.3" />
        {AGENTS.map((a, i) => {
          const y = 118 + i * 78;
          const hot = agentsOn || gateOn;
          return (
            <g key={a.id} onClick={() => setPhase(i === 0 ? 0 : 0.5)}>
              <circle className={hot ? "m-fill" : "m-box"} cx="40" cy={y} r="7" opacity={hot ? 0.9 : 0.4} />
              <text className="m-label" x="62" y={y - 10} fontSize={13}>
                {a.id}
              </text>
              <text className="m-k" x="62" y={y + 8} fontSize={11}>
                {a.note}
              </text>
              <text className="m-k" x="62" y={y + 24} fontSize={11} opacity={hot ? 0.9 : 0.45}>
                {a.metric}
              </text>
            </g>
          );
        })}
      </g>

      {/* HITL spine — flow stops at the box edge so it never cuts the letters */}
      <g style={{ cursor: "pointer" }} onClick={() => setPhase(0.5)}>
        <rect className="m-box" x="208" y="98" width="40" height="152" rx="2" opacity={gateOn ? 0.9 : 0.45} />
        <text className="m-label" x="228" y={cy} textAnchor="middle" transform={`rotate(-90 228 ${cy})`} fontSize={13}>
          HITL
        </text>
        <text className="m-k" x="228" y="272" textAnchor="middle" opacity={gateOn ? 0.95 : 0.45} fontSize={11}>
          {gateOn ? "armed" : "spine"}
        </text>
      </g>

      <line className="m-flow" x1="168" y1={cy} x2="202" y2={cy} opacity={gateOn || marketOn ? 0.85 : 0.3} />
      <line className="m-flow" x1="254" y1={cy} x2="410" y2={cy} opacity={marketOn ? 0.85 : 0.25} />

      {/* Market ring — titles clear of the ring */}
      <g style={{ cursor: "pointer" }} onClick={() => setPhase(1)}>
        <text className="m-label" x={cx} y="58" textAnchor="middle" fontSize={13}>
          SwapAgent · XCCY
        </text>
        <text className="m-k" x={cx} y="76" textAnchor="middle" opacity={marketOn ? 0.9 : 0.45} fontSize={11}>
          18 banks · 12 pairs
        </text>

        <circle className="m-line" cx={cx} cy={cy} r={r + 14} opacity={marketOn ? 0.35 : 0.1} />
        {nodes.map((n) => {
          const held = pair >= 0 && (n.i === pair || n.i === nodes[pair].pair);
          const lit = marketOn && held;
          const showLabel = (lit || hover === n.i) && n.ly > 90 && n.ly < 290;
          const partner = nodes[n.pair];
          return (
            <g key={n.name}>
              {lit && (
                <line
                  className="m-line"
                  x1={n.x}
                  y1={n.y}
                  x2={partner.x}
                  y2={partner.y}
                  opacity="0.65"
                  strokeWidth={1.5}
                />
              )}
              <line
                className="m-line"
                x1={n.x}
                y1={n.y}
                x2={cx}
                y2={cy}
                opacity={lit ? 0.8 : marketOn ? 0.12 : 0.05}
              />
              <circle className={lit ? "m-fill" : "m-box"} cx={n.x} cy={n.y} r={lit ? 5 : 3.5} opacity={lit ? 0.95 : 0.55} />
              {showLabel && (
                <text className="m-k" x={n.lx} y={n.ly} textAnchor="middle" opacity={lit ? 1 : 0.5} fontSize={9}>
                  {n.name}
                </text>
              )}
            </g>
          );
        })}
        <circle className={marketOn ? "m-fill" : "m-box"} cx={cx} cy={cy} r="18" opacity={marketOn ? 0.35 : 0.12} />
        <circle className="m-box" cx={cx} cy={cy} r="18" />
        <text className="m-label" x={cx} y={cy + 5} textAnchor="middle" fontSize={13}>
          LCH
        </text>
      </g>

      <text className="m-k" x="28" y="304" opacity="0.5" fontSize={11}>
        Same control spine across five Quantile systems
      </text>
      <text className="m-k" x="772" y="304" textAnchor="end" opacity={marketOn ? 0.9 : 0.45} fontSize={11}>
        {marketOn && pair >= 0
          ? `${nodes[pair].name} × ${nodes[nodes[pair].pair].name} · residual held`
          : "Multilateral offsets · risk envelope"}
      </text>
    </Frame>
  );
}
