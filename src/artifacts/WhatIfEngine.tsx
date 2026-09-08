import { useState } from "react";
import { useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";

/**
 * Pre-trade what-if: stage a trade, compare incremental vs standalone IM.
 * “Up to −30%” is a potential improvement observed with clients - not a guarantee.
 */
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

  const caption = compare
    ? `Prefer ${chosen.id} (${chosen.method}) · lower incremental margin for same risk`
    : showSim
      ? "Same hypothetical trade · native clearing methods side by side"
      : showTrade
        ? "Trade staged · now ask what capital does before you execute"
        : "Portfolio margin known · the next trade’s capital impact is not";

  return (
    <Frame viewBox="0 0 800 320" family="market">
      <text className="m-title" x="28" y="20" fontSize={12}>
        OpenGamma · pre-trade what-if
      </text>
      <text className="m-k" x="28" y="38" fontSize={11}>
        {caption}
      </text>

      <text className="m-num" x="760" y="28" textAnchor="end" fontSize={28}>
        {compare ? "−30%" : "IM"}
      </text>
      <text className="m-k" x="760" y="48" textAnchor="end" fontSize={11}>
        {compare ? "up to · initial margin (observed)" : "before execution"}
      </text>
      <text className="m-k" x="760" y="64" textAnchor="end" fontSize={11} opacity="0.5">
        potential · not guaranteed
      </text>

      <text className="m-k" x="28" y="86" fontSize={11}>
        Base book
      </text>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <rect key={i} className="m-fill" x={28 + i * 14} y="96" width="10" height="10" opacity={0.45 + (i % 3) * 0.12} rx="1" />
      ))}
      <text className="m-k" x="200" y="86" fontSize={11}>
        Staged
      </text>
      <rect className="m-box m-dash" x="200" y="96" width="28" height="10" opacity={showTrade ? 0.95 : 0.25} />
      <text className="m-k" x="238" y="105" opacity={showTrade ? 0.85 : 0.35} fontSize={11}>
        {showTrade ? "+1 trade" : "n/a"}
      </text>

      <text className="m-k" x="360" y="86" fontSize={10} opacity="0.55">
        Inc = add to current book · Alone = trade in isolation
      </text>

      {VENUES.map((v, i) => {
        const x = 28 + i * 256;
        const selected = showSim && i === pick;
        const incH = showSim ? 110 * v.inc : 20;
        const standH = showSim ? 110 * v.stand : 16;
        return (
          <g
            key={v.id}
            opacity={showSim || !showTrade ? 1 : 0.4}
            style={{ cursor: showSim ? "pointer" : "default" }}
            onClick={() => showSim && setPick(i)}
          >
            <text className="m-label" x={x + 90} y="136" textAnchor="middle" fontSize={13}>
              {v.id}
            </text>
            <text className="m-k" x={x + 90} y="154" textAnchor="middle" opacity="0.55" fontSize={11}>
              {v.method}
            </text>

            <rect className="m-box" x={x + 30} y="164" width="40" height="110" opacity="0.25" />
            <rect className="m-fill" x={x + 30} y={274 - incH} width="40" height={incH} opacity={selected ? 0.95 : 0.55} />
            <text className="m-k m-ms" x={x + 50} y="292" textAnchor="middle" fontSize={9}>
              Inc
            </text>

            <rect className="m-box m-dash" x={x + 100} y="164" width="40" height="110" opacity="0.3" />
            <rect className="m-fill" x={x + 100} y={274 - standH} width="40" height={standH} opacity={0.28} />
            <text className="m-k m-ms" x={x + 120} y="292" textAnchor="middle" fontSize={9}>
              Alone
            </text>

            {compare && selected && (
              <text className="m-k" x={x + 168} y="136" textAnchor="start" opacity="0.95" fontSize={11}>
                Prefer
              </text>
            )}
          </g>
        );
      })}

      <text className="m-k" x="28" y="312" opacity="0.55" fontSize={11}>
        {compare
          ? "Illustrative compare · up to −30% IM observed with 20+ enterprise clients"
          : "Conceptual pre-trade surface · simulate to decide venue / broker / product"}
      </text>
    </Frame>
  );
}
