import { storyBlend, useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";

const trains = [
  { dep: "06:10", name: "NE Regional 95", dur: "4h 08m", price: 47, save: 81, yours: false, beats: true },
  { dep: "07:00", name: "Acela 2155", dur: "3h 50m", price: 133, save: 0, yours: true, beats: false },
  { dep: "09:20", name: "NE Regional 93", dur: "4h 02m", price: 61, save: 67, yours: false, beats: true },
  { dep: "13:00", name: "Acela 2167", dur: "3h 47m", price: 141, save: 0, yours: false, beats: false },
];

/**
 * RailDrop: illustrative BOS-NYP watch.
 * Phases teach when an alert should fire (listed fare beats what you paid).
 * Not a live Amtrak feed in this diagram.
 */
export function RailDropPlane() {
  useBus();
  const t = storyBlend(visual.rail);
  const phase = t < 0.34 ? "booked" : t < 0.72 ? "watching" : "alert";
  const caption =
    phase === "booked"
      ? "You paid $128 · baseline locked after purchase"
      : phase === "watching"
        ? "Watch every bookable rail option · ±1 day window"
        : "Alert rule: listed fare beats $128 → notify once";
  const numeral = phase === "booked" ? "$128" : phase === "watching" ? "$47" : "−$81";

  const barX = 300;
  const barMax = 220;
  const priceCol = barX + barMax + 16;
  const statusCol = 760;
  const priceW = (p: number) => Math.max(8, ((p - 40) / 110) * barMax);
  const paidX = barX + priceW(128);

  return (
    <Frame viewBox="0 0 800 320" family="consumer">
      <text className="m-title" x="28" y="22" fontSize={12}>
        RailDrop · Amtrak watch
      </text>
      <text className="m-k" x="28" y="40" fontSize={11}>
        {caption}
      </text>
      <text className="m-num" x="760" y="28" textAnchor="end" fontSize={26}>
        {numeral}
      </text>
      <text className="m-k" x="760" y="48" textAnchor="end" fontSize={11}>
        {phase === "booked" ? "what you paid" : phase === "watching" ? "cheapest listed" : "vs booked"}
      </text>

      <g
        style={{ cursor: "pointer" }}
        onClick={() => {
          visual.rail = 0;
          visual.story = "rest";
        }}
      >
        <text className="m-label" x="28" y="78" fontSize={13}>
          BOS
        </text>
        <line className="m-line" x1="70" y1="74" x2="140" y2="74" opacity="0.5" />
        <text className="m-label" x="152" y="78" fontSize={13}>
          NYP
        </text>
        <text className="m-k" x="220" y="78" opacity="0.55" fontSize={11}>
          Northeast Corridor · illustrative
        </text>
        <text className="m-k" x="760" y="78" textAnchor="end" opacity={phase === "watching" ? 0.95 : 0.45} fontSize={11}>
          Watch · ±1 day
        </text>
      </g>

      {/*
        Paid label + alert hint live entirely LEFT of the threshold line.
        Prices live in priceCol (≥536); status ("Triggers alert") at the far right.
        Nothing in the header band shares x-space with $47 / Triggers.
      */}
      <line className="m-line" x1={paidX} y1="128" x2={paidX} y2="276" opacity="0.55" />
      <text className="m-k" x={paidX - 8} y="112" textAnchor="end" opacity="0.75" fontSize={11}>
        Paid $128
      </text>
      {phase === "alert" ? (
        <text className="m-k" x={paidX - 8} y="126" textAnchor="end" fontSize={10} opacity="0.7">
          alert if left of line ←
        </text>
      ) : null}

      {trains.map((row, i) => {
        const y = 152 + i * 34;
        const hot =
          phase === "alert" ? row.beats && i === 0 : phase === "watching" ? row.beats : row.yours;
        const w = priceW(row.price);
        const beatsPaid = row.price < 128;
        return (
          <g
            key={row.name}
            opacity={phase === "booked" && !row.yours ? 0.4 : 1}
            style={{ cursor: "pointer" }}
            onClick={() => {
              visual.rail = row.beats ? 1 : row.yours ? 0 : 0.5;
              visual.story = "rest";
            }}
          >
            {hot && <rect className="m-fill" x="28" y={y - 12} width="3" height="28" opacity="0.65" />}
            <text className="m-label" x="40" y={y} fontSize={13}>
              {row.dep}
            </text>
            <text className="m-k" x="100" y={y} fontSize={11}>
              {row.name}
            </text>
            <rect className="m-box" x={barX} y={y - 6} width={barMax} height="10" opacity="0.2" />
            <rect className="m-fill" x={barX} y={y - 6} width={w} height="10" opacity={hot ? 0.8 : 0.4} />
            <text className="m-num" x={priceCol} y={y} fontSize={14} textAnchor="start">
              ${row.price}
            </text>
            <text className="m-k" x={statusCol} y={y} textAnchor="end" opacity={hot ? 0.95 : 0.45} fontSize={11}>
              {phase === "alert" && row.beats && i === 0
                ? "Triggers alert"
                : phase === "booked" && row.yours
                  ? "Yours"
                  : phase === "watching" && beatsPaid
                    ? "Beats paid"
                    : row.save > 0
                      ? `−$${row.save}`
                      : "—"}
            </text>
          </g>
        );
      })}

      <text className="m-k" x="28" y="308" opacity="0.5" fontSize={11}>
        {phase === "alert"
          ? "Illustrative alert · booking stays on Amtrak · never invent a fare"
          : "Illustrative scenario · open RailDrop for the live watch board"}
      </text>
    </Frame>
  );
}
