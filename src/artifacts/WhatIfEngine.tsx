import { useState } from "react";
import { useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";

const venues = [
  { id: "CME", method: "SPAN", inc: 0.28, stand: 0.74 },
  { id: "ICE", method: "IRM", inc: 0.42, stand: 0.78 },
  { id: "OTC", method: "SIMM", inc: 0.56, stand: 0.82 },
];

export function WhatIfEngine() {
  useBus();
  const mode = visual.capitalMode;
  const showTrade = mode !== "baseline";
  const showSim = mode === "simulate" || mode === "compare";
  const compare = mode === "compare";
  const [pick, setPick] = useState(0);

  return (
    <Frame viewBox="0 0 800 320">
      <text className="m-title" x="28" y="26">
        Pre-trade capital
      </text>
      <text className="m-k" x="28" y="46">
        {compare
          ? "Incremental cheaper than standalone"
          : showSim
            ? "Same trade  ·  three venues"
            : showTrade
              ? "Hypothetical sits outside the book"
              : "Current IM known  ·  next trade untested"}
      </text>
      <text className="m-num" x="772" y="40" textAnchor="end" fontSize="28">
        {compare ? "−30%" : "IM"}
      </text>
      <text className="m-k" x="772" y="62" textAnchor="end">
        {compare ? "initial margin" : "before execution"}
      </text>

      <text className="m-k" x="28" y="84">
        Base book
      </text>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect key={i} className="m-fill" x={28 + i * 20} y="94" width="14" height="14" opacity="0.82" />
      ))}
      <text className="m-k" x="220" y="84">
        Incremental
      </text>
      <rect className="m-box m-dash" x="220" y="94" width="22" height="14" opacity={showTrade ? 0.95 : 0.22} />

      <text className="m-k" x="28" y="136">
        Venue
      </text>
      <text className="m-k" x="148" y="136">
        Incremental
      </text>
      <text className="m-k" x="420" y="136">
        Standalone
      </text>

      {venues.map((v, i) => {
        const y = 152 + i * 42;
        const chosen = showSim && i === pick;
        return (
          <g
            key={v.id}
            opacity={showSim || !showTrade ? 1 : 0.38}
            style={{ cursor: showSim ? "pointer" : "default" }}
            onClick={() => showSim && setPick(i)}
          >
            {chosen && <rect className="m-fill" x="20" y={y - 12} width="760" height="38" opacity="0.06" />}
            <text className="m-k" x="28" y={y + 6}>
              {v.id}
            </text>
            <text className="m-k" x="28" y={y + 20} opacity="0.55">
              {v.method}
            </text>
            <rect className="m-box" x="148" y={y} width="220" height="8" opacity="0.25" />
            <rect className="m-fill" x="148" y={y} width={showSim ? 220 * v.inc : 40} height="8" />
            <rect className="m-box m-dash" x="420" y={y} width="220" height="8" opacity="0.28" />
            <rect className="m-fill" x="420" y={y} width={showSim ? 220 * v.stand : 32} height="8" opacity={showSim ? 0.4 : 0.14} />
            {compare && i === pick && (
              <text className="m-k" x="668" y={y + 8}>
                Prefer
              </text>
            )}
          </g>
        );
      })}

      <text className="m-k" x="28" y="292">
        Capacity
      </text>
      <rect className="m-box" x="148" y="284" width="340" height="8" />
      <rect className="m-fill" x="148" y="284" width={compare ? 156 : 232} height="8" />
      <line className="m-line" x1="488" y1="276" x2="488" y2="300" />
      <text className="m-k" x="500" y="292">
        Limit
      </text>
    </Frame>
  );
}
