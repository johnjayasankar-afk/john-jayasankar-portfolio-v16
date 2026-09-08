import { storyBlend, useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";

const providers = [
 { name: "Uber", product: "UberX", price: "$31-38", kind: "Range", eta: "4 min", mode: 1 as const, rankPrice: 3450, rankEta: 4 },
  { name: "Lyft", product: "Lyft", price: "Est. $29", kind: "Est.", eta: "6 min", mode: 1 as const, rankPrice: 2900, rankEta: 6 },
  { name: "Empower", product: "Standard", price: "Est. $24", kind: "Est.", eta: "9 min", mode: 0 as const, rankPrice: 2400, rankEta: 9 },
  { name: "Curb", product: "Taxi", price: "$27", kind: "Upfront", eta: "3 min", mode: 0.5 as const, rankPrice: 2700, rankEta: 3 },
];

function orderFor(mode: "price" | "soonest" | "value") {
  if (mode === "price") return [2, 1, 3, 0];
  if (mode === "soonest") return [3, 0, 1, 2];
  return [2, 3, 1, 0];
}

/**
 * RideLens: illustrative ranking board.
 * Switching Price / Soonest / Value reorders the same four quotes so visitors
 * see how the decision surface changes - not live marketplace data in this diagram.
 */
export function RideLensPlane() {
  useBus();
  const t = storyBlend(visual.ride);
  const mode = t < 0.34 ? "price" : t < 0.72 ? "soonest" : "value";
  const order = orderFor(mode);
  const lead = providers[order[0]];
  const why =
    mode === "price"
      ? `Why #1 changed: lowest listed fare → ${lead.name}`
      : mode === "soonest"
        ? `Why #1 changed: soonest pickup → ${lead.name}`
        : `Why #1 changed: fare × wait tradeoff → ${lead.name}`;
  const numeral = mode === "price" ? "Est. $24" : mode === "soonest" ? "3 min" : lead.price;

  return (
    <Frame viewBox="0 0 800 320" family="consumer">
      <text className="m-title" x="28" y="22" fontSize={12}>
        RideLens · compare board
      </text>
      <text className="m-k" x="28" y="40" fontSize={11}>
        Illustrative ranking · same trip, three sort rules
      </text>
      <text className="m-num" x="760" y="28" textAnchor="end" fontSize={26}>
        {numeral}
      </text>
      <text className="m-k" x="760" y="48" textAnchor="end" fontSize={11}>
        {mode === "price" ? "cheapest listed" : mode === "soonest" ? "soonest curb" : "best value"}
      </text>

      <g
        style={{ cursor: "pointer" }}
        onClick={() => {
          visual.ride = 0;
          visual.story = "rest";
        }}
      >
        <circle className="m-fill" cx="48" cy="78" r="5" opacity="0.85" />
        <line className="m-line" x1="54" y1="78" x2="200" y2="78" opacity="0.5" />
        <circle className="m-fill" cx="206" cy="78" r="5" opacity="0.85" />
        <text className="m-label" x="60" y="66" fontSize={12}>
          JFK
        </text>
        <text className="m-label" x="218" y="66" fontSize={12}>
          Times Sq
        </text>
        <text className="m-k" x="320" y="82" fontSize={11}>
          12.1 mi · 41 min
        </text>
        <text className="m-k" x="760" y="82" textAnchor="end" opacity="0.55" fontSize={11}>
          Expired quotes never win
        </text>
      </g>

      <text className="m-k" x="28" y="108" fontSize={11} opacity="0.85">
        {why}
      </text>

      {/* Column headers */}
      <text className="m-k" x="44" y="128" fontSize={10} opacity="0.5">
        #
      </text>
      <text className="m-k" x="80" y="128" fontSize={10} opacity="0.5">
        Provider
      </text>
      <text className="m-k" x="280" y="128" fontSize={10} opacity="0.5">
        Quote kind
      </text>
      <text className="m-k" x="420" y="128" fontSize={10} opacity="0.5">
        Fare
      </text>
      <text className="m-k" x="560" y="128" fontSize={10} opacity="0.5">
        ETA
      </text>
      <text className="m-k" x="760" y="128" textAnchor="end" fontSize={10} opacity="0.5">
        Rank rule
      </text>

      {order.map((pi, i) => {
        const p = providers[pi];
        const y = 148 + i * 36;
        const hot = i === 0;
        return (
          <g
            key={p.name}
            style={{ cursor: "pointer" }}
            onClick={() => {
              visual.ride = p.mode;
              visual.story = "rest";
            }}
          >
            {hot && <rect className="m-fill" x="28" y={y - 14} width="3" height="28" opacity="0.65" />}
            <text className="m-k" x="44" y={y} fontSize={11}>
              {String(i + 1).padStart(2, "0")}
            </text>
            <text className="m-label" x="80" y={y} fontSize={13}>
              {p.name}
            </text>
            <text className="m-k" x="280" y={y} opacity="0.6" fontSize={11}>
              {p.kind}
            </text>
            <text className="m-num" x="420" y={y} fontSize={14} opacity={mode === "price" || hot ? 1 : 0.55}>
              {p.price}
            </text>
            <text className="m-k" x="560" y={y} fontSize={12} opacity={mode === "soonest" || hot ? 0.95 : 0.5}>
              {p.eta}
            </text>
            <text className="m-k" x="760" y={y} textAnchor="end" opacity={hot ? 0.95 : 0.4} fontSize={11}>
              {hot ? (mode === "price" ? "Price wins" : mode === "soonest" ? "Soonest wins" : "Value wins") : "—"}
            </text>
          </g>
        );
      })}

      <text className="m-k" x="28" y="308" opacity="0.5" fontSize={11}>
        Illustrative example · open RideLens for the live compare board
      </text>
    </Frame>
  );
}
