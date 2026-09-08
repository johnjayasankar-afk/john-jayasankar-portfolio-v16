import { useState } from "react";
import { useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";

/** What-if: one staged trade, three methodology columns, prefer ≤ −30%. */
const VENUES = [
  { id: "CME", method: "SPAN", inc: 0.3, stand: 0.78, prefer: true },
  { id: "ICE", method: "IRM", inc: 0.46, stand: 0.8, prefer: false },
  { id: "OTC", method: "SIMM", inc: 0.58, stand: 0.84, prefer: false },
];

export function WhatIfEngine() {
  useBus();
  const mode = visual.capitalMode;
  const showTrade = mode !== "baseline";
  const showSim = mode === "simulate" || mode === "compare";
  const compare = mode === "compare";
  const [pick, setPick] = useState(0);
  const chosen = VENUES[pick];

  return (
    <Frame viewBox="0 0 800 320" family="market">
      <text className="m-title" x="28" y="22" fontSize={12}>
        OpenGamma · pre-trade what-if
      </text>
      <text className="m-k" x="28" y="40" fontSize={11}>
        {compare
          ? `Prefer ${chosen.id} (${chosen.method}) · up to −30% initial margin`
          : showSim
            ? "Same hypothetical · native SPAN / IRM / SIMM"
            : showTrade
              ? "Trade staged · broker · venue · product"
              : "Portfolio IM known · next trade unknown"}
      </text>
      <text className="m-num" x="760" y="32" textAnchor="end" fontSize={30}>
        {compare ? "−30%" : "IM"}
      </text>
      <text className="m-k" x="760" y="56" textAnchor="end" fontSize={11}>
        {compare ? "up to · initial margin" : "before execution"}
      </text>

      {/* Book + staged as ticks */}
      <text className="m-k" x="28" y="80" fontSize={11}>
        Base book
      </text>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <rect key={i} className="m-fill" x={28 + i * 14} y="90" width="10" height="10" opacity={0.45 + (i % 3) * 0.12} rx="1" />
      ))}
      <text className="m-k" x="200" y="80" fontSize={11}>
        Staged
      </text>
      <rect className="m-box m-dash" x="200" y="90" width="28" height="10" opacity={showTrade ? 0.95 : 0.25} />
      <text className="m-k" x="238" y="99" opacity={showTrade ? 0.85 : 0.35} fontSize={11}>
        {showTrade ? "+1" : "n/a"}
      </text>

      {/* Three methodology pillars */}
      {VENUES.map((v, i) => {
        const x = 28 + i * 256;
        const selected = showSim && i === pick;
        const incH = showSim ? 120 * v.inc : 20;
        const standH = showSim ? 120 * v.stand : 16;
        return (
          <g
            key={v.id}
            opacity={showSim || !showTrade ? 1 : 0.4}
            style={{ cursor: showSim ? "pointer" : "default" }}
            onClick={() => showSim && setPick(i)}
          >
            <text className="m-label" x={x + 90} y="128" textAnchor="middle" fontSize={13}>
              {v.id}
            </text>
            <text className="m-k" x={x + 90} y="148" textAnchor="middle" opacity="0.55" fontSize={11}>
              {v.method}
            </text>

            {/* Incremental solid */}
            <rect className="m-box" x={x + 30} y="158" width="40" height="120" opacity="0.25" />
            <rect className="m-fill" x={x + 30} y={278 - incH} width="40" height={incH} opacity={selected ? 0.95 : 0.55} />
            <text className="m-k m-ms" x={x + 50} y="286" textAnchor="middle" fontSize={9}>
              Inc
            </text>

            {/* Standalone dashed */}
            <rect className="m-box m-dash" x={x + 100} y="158" width="40" height="120" opacity="0.3" />
            <rect className="m-fill" x={x + 100} y={278 - standH} width="40" height={standH} opacity={0.28} />
            <text className="m-k m-ms" x={x + 120} y="286" textAnchor="middle" fontSize={9}>
              Alone
            </text>

            {compare && selected && (
              <text className="m-k" x={x + 168} y="128" textAnchor="start" opacity="0.95" fontSize={11}>
                Prefer
              </text>
            )}
          </g>
        );
      })}

      <text className="m-k" x="28" y="308" opacity={compare ? 0.9 : 0.4} fontSize={11}>
        {compare ? "20+ enterprise clients" : "Simulate to decide"}
      </text>
    </Frame>
  );
}
