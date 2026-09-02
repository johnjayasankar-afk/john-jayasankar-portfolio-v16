import { storyBlend, useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";

const pairs = ["USDJPY", "EURUSD", "GBPUSD", "USDCNH"];
const tenors = ["1M", "3M", "6M", "1Y", "2Y"];
const gates = ["Eligibility", "Venue IM", "Four-source", "Live window"];

export function FxMatrix() {
  useBus();
  const t = storyBlend(visual.fx);
  const gated = t > 0.35;
  const proposed = t > 0.7;

  return (
    <Frame viewBox="0 0 800 320">
      <text className="m-title" x="28" y="26">
        FX book × tenor
      </text>
      <text className="m-k" x="28" y="46">
        {proposed ? "Proposal holds  ·  100% accepted" : gated ? "Margin inside the optimizer" : "Book submitted"}
      </text>
      <text className="m-num" x="772" y="40" textAnchor="end" fontSize="28">
        {proposed ? "100%" : "40+"}
      </text>
      <text className="m-k" x="772" y="62" textAnchor="end">
        {proposed ? "acceptance" : "live runs"}
      </text>

      {tenors.map((tenor, c) => (
        <text key={tenor} className="m-k" x={148 + c * 68} y="86" textAnchor="middle">
          {tenor}
        </text>
      ))}

      {pairs.map((pair, r) => (
        <g key={pair}>
          <text className="m-k" x="28" y={116 + r * 44}>
            {pair}
          </text>
          {tenors.map((_, c) => {
            const ineligible = (r + c) % 5 === 0;
            const accepted = !ineligible && proposed && (r + c) % 3 !== 1;
            const inGate = !ineligible && gated;
            return (
              <rect
                key={c}
                className={accepted ? "m-fill" : "m-box"}
                x={124 + c * 68}
                y={96 + r * 44}
                width="48"
                height="30"
                opacity={ineligible && gated ? 0.08 : accepted ? 0.22 : inGate ? 0.5 : 0.28}
              />
            );
          })}
        </g>
      ))}

      <text className="m-k" x="520" y="86">
        Production gates
      </text>
      <rect className="m-box" x="520" y="96" width="252" height="176" />
      {gates.map((gate, i) => {
        const y = 118 + i * 38;
        const on = t > i * 0.22;
        const phase = i < 2 ? 0 : i < 3 ? 0.5 : 1;
        return (
          <g key={gate} style={{ cursor: "pointer" }} onClick={() => { visual.fx = phase; visual.story = "rest"; }}>
            <text className="m-k" x="536" y={y}>
              {String(i + 1).padStart(2, "0")}  {gate}
            </text>
            <rect className="m-box" x="536" y={y + 6} width="220" height="6" />
            <rect className="m-fill" x="536" y={y + 6} width={on ? 220 * (0.4 + i * 0.16) : 22} height="6" opacity={on ? 0.85 : 0.2} />
          </g>
        );
      })}
    </Frame>
  );
}
