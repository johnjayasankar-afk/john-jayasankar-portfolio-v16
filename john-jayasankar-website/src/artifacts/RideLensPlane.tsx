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

/** RideLens: route spine + ranked strip — quote kinds stay honest. */
export function RideLensPlane() {
  useBus();
  const t = storyBlend(visual.ride);
  const mode = t < 0.34 ? "price" : t < 0.72 ? "soonest" : "value";
  const order = orderFor(mode);
  const lead = providers[order[0]];
  const caption =
    mode === "price" ? "Ranked by Price · ranges stay ranges" : mode === "soonest" ? "Ranked by Soonest · pickup first" : "Ranked by Value · fare and wait";
  const numeral = mode === "price" ? "Est. $24" : mode === "soonest" ? "3 min" : lead.price;

  return (
    <Frame viewBox="0 0 800 320" family="consumer">
      <text className="m-title" x="28" y="22" fontSize={12}>
        RideLens · compare board
      </text>
      <text className="m-k" x="28" y="40" fontSize={11}>
        {caption}
      </text>
      <text className="m-num" x="760" y="32" textAnchor="end" fontSize={28}>
        {numeral}
      </text>
      <text className="m-k" x="760" y="56" textAnchor="end" fontSize={11}>
        {mode === "price" ? "cheapest listed" : mode === "soonest" ? "soonest curb" : "best value"}
      </text>

      {/* Route spine */}
      <g
        style={{ cursor: "pointer" }}
        onClick={() => {
          visual.ride = 0;
          visual.story = "rest";
        }}
      >
        <circle className="m-fill" cx="48" cy="92" r="6" opacity="0.85" />
        <line className="m-line" x1="54" y1="92" x2="220" y2="92" opacity="0.55" />
        <circle className="m-fill" cx="226" cy="92" r="6" opacity="0.85" />
        <text className="m-label" x="62" y="78" fontSize={13}>
          JFK
        </text>
        <text className="m-label" x="238" y="78" fontSize={13}>
          Times Sq
        </text>
        <text className="m-k" x="360" y="96" fontSize={11}>
          12.1 mi · 41 min
        </text>
        <text className="m-k" x="520" y="96" fontSize={11}>
          {mode === "price" ? "Price" : mode === "soonest" ? "Soonest" : "Value"}
        </text>
        <text className="m-k" x="760" y="96" textAnchor="end" opacity="0.5" fontSize={11}>
          Expired never wins
        </text>
      </g>

      {/* Ranked horizontal strip */}
      {order.map((pi, i) => {
        const p = providers[pi];
        const y = 124 + i * 46;
        const hot = i === 0;
        const bar =
          mode === "soonest"
            ? Math.max(40, 280 - p.rankEta * 22)
            : Math.max(40, 320 - p.rankPrice / 12);
        return (
          <g
            key={p.name}
            style={{ cursor: "pointer" }}
            onClick={() => {
              visual.ride = p.mode;
              visual.story = "rest";
            }}
          >
            {hot && <rect className="m-fill" x="28" y={y - 6} width="4" height="40" opacity="0.6" />}
            <text className="m-k" x="44" y={y + 10} fontSize={11}>
              {hot ? "01" : `0${i + 1}`}
            </text>
            <text className="m-label" x="80" y={y + 10} fontSize={13}>
              {p.name}
            </text>
            <text className="m-k" x="180" y={y + 10} opacity="0.55" fontSize={11}>
              {p.product} · {p.kind}
            </text>
            <rect className="m-box" x="360" y={y + 2} width="300" height="8" opacity="0.2" />
            <rect className="m-fill" x="360" y={y + 2} width={bar} height="8" opacity={hot ? 0.75 : 0.4} />
            <text className="m-num" x="680" y={y + 12} fontSize={15} textAnchor="end">
              {mode === "soonest" ? p.eta : p.price}
            </text>
            <text className="m-k" x="760" y={y + 12} textAnchor="end" opacity={hot ? 0.95 : 0.45} fontSize={11}>
              {hot ? "Best →" : mode === "soonest" ? p.kind : "·"}
            </text>
          </g>
        );
      })}
    </Frame>
  );
}
