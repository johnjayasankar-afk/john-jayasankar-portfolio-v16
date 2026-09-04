import { storyBlend, useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";

/** Product names and quote kinds match RideLens rate-card sources. */
const providers = [
  {
    name: "Uber",
    product: "UberX",
    price: "$31–38",
    kind: "Range",
    eta: "4 min",
    mode: 1 as const,
    rankPrice: 3450,
    rankEta: 4,
  },
  {
    name: "Lyft",
    product: "Lyft",
    price: "Est. $29",
    kind: "Est.",
    eta: "6 min",
    mode: 1 as const,
    rankPrice: 2900,
    rankEta: 6,
  },
  {
    name: "Empower",
    product: "Standard",
    price: "Est. $24",
    kind: "Est.",
    eta: "9 min",
    mode: 0 as const,
    rankPrice: 2400,
    rankEta: 9,
  },
  {
    name: "Curb",
    product: "Taxi",
    price: "$27",
    kind: "Upfront",
    eta: "3 min",
    mode: 0.5 as const,
    rankPrice: 2700,
    rankEta: 3,
  },
];

function orderFor(mode: "price" | "soonest" | "value") {
  if (mode === "price") return [2, 1, 3, 0];
  if (mode === "soonest") return [3, 0, 1, 2];
  return [2, 3, 1, 0];
}

export function RideLensPlane() {
  useBus();
  const t = storyBlend(visual.ride);
  const mode = t < 0.34 ? "price" : t < 0.72 ? "soonest" : "value";
  const order = orderFor(mode);
  const lead = providers[order[0]];
  const caption =
    mode === "price"
      ? "Ranked by Price  ·  ranges stay ranges"
      : mode === "soonest"
        ? "Ranked by Soonest  ·  pickup first"
        : "Ranked by Value  ·  fare and wait";
  const numeral = mode === "price" ? "Est. $24" : mode === "soonest" ? "3 min" : lead.price;
  const numeralNote =
    mode === "price" ? "cheapest listed" : mode === "soonest" ? "soonest curb" : "best value";

  return (
    <Frame viewBox="0 0 800 320">
      <text className="m-title" x="28" y="24">
        RideLens
      </text>
      <text className="m-label" x="28" y="44">
        {caption}
      </text>
      <text className="m-num" x="772" y="38" textAnchor="end" fontSize="26">
        {numeral}
      </text>
      <text className="m-k" x="772" y="58" textAnchor="end">
        {numeralNote}
      </text>

      <g
        style={{ cursor: "pointer" }}
        onClick={() => {
          visual.ride = 0;
          visual.story = "rest";
        }}
      >
        <rect className="m-box" x="28" y="74" width="744" height="40" />
        <rect className="m-fill" x="28" y="74" width="744" height="40" opacity="0.05" />
        <text className="m-k" x="44" y="98">
          From
        </text>
        <text className="m-label" x="88" y="98">
          JFK
        </text>
        <text className="m-k" x="140" y="98">
          →
        </text>
        <text className="m-k" x="168" y="98">
          To
        </text>
        <text className="m-label" x="200" y="98">
          Times Sq
        </text>
        <text className="m-k" x="340" y="98">
          12.1 mi · 41 min
        </text>
        <text className="m-k" x="510" y="98">
          OSRM
        </text>
        <text className="m-k" x="590" y="98">
          ~55s tick
        </text>
        <text className="m-k" x="732" y="98">
          Tonight
        </text>
      </g>

      {order.map((pi, i) => {
        const p = providers[pi];
        const x = 28 + i * 190;
        const hot = i === 0;
        const delta =
          mode === "soonest"
            ? p.rankEta - lead.rankEta
            : Math.round((p.rankPrice - lead.rankPrice) / 100);
        const deltaLabel =
          hot
            ? "Best"
            : mode === "soonest"
              ? `+${delta} min`
              : delta === 0
                ? "similar"
                : `+$${delta}`;
        return (
          <g
            key={p.name}
            style={{ cursor: "pointer" }}
            onClick={() => {
              visual.ride = p.mode;
              visual.story = "rest";
            }}
          >
            <rect className="m-box" x={x} y="130" width="178" height="158" />
            <rect className="m-fill" x={x} y="130" width="178" height="158" opacity={hot ? 0.12 : 0.03} />
            {hot ? <rect className="m-fill" x={x} y="130" width="4" height="158" opacity="0.45" /> : null}
            <text className="m-k" x={x + 16} y="152">
              {hot ? "01 · best" : `0${i + 1}`}
            </text>
            <text className="m-k" x={x + 162} y="152" textAnchor="end" opacity="0.72">
              {p.kind}
            </text>
            <text className="m-label" x={x + 16} y="180" style={{ fontSize: "15px" }}>
              {p.name}
            </text>
            <text className="m-k" x={x + 16} y="200">
              {p.product}
            </text>
            <text className="m-num" x={x + 16} y="236" fontSize="22">
              {p.price}
            </text>
            <text className="m-k" x={x + 16} y="258">
              {p.eta} pickup
            </text>
            <text className="m-k" x={x + 16} y="276">
              {deltaLabel}
            </text>
          </g>
        );
      })}
    </Frame>
  );
}
