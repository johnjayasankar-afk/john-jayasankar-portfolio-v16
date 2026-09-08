import { storyBlend, useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";

const trains = [
  { dep: "06:10", name: "NE Regional 95", dur: "4h 08m", price: 47, save: 81, yours: false, beats: true },
  { dep: "07:00", name: "Acela 2155", dur: "3h 50m", price: 133, save: 0, yours: true, beats: false },
  { dep: "09:20", name: "NE Regional 93", dur: "4h 02m", price: 61, save: 67, yours: false, beats: true },
  { dep: "13:00", name: "Acela 2167", dur: "3h 47m", price: 141, save: 0, yours: false, beats: false },
];

/** RailDrop: BOS–NYP board with paid baseline as a fixed vertical rail. */
export function RailDropPlane() {
  useBus();
  const t = storyBlend(visual.rail);
  const phase = t < 0.34 ? "booked" : t < 0.72 ? "watching" : "alert";
  const caption =
    phase === "booked"
      ? "You paid $128 · cheapest listed $47"
      : phase === "watching"
        ? "±1 day · every Amtrak rail option"
        : "Regional 95 dropped · confirm on Amtrak";
  const numeral = phase === "booked" ? "$128" : phase === "watching" ? "$47" : "-$81";

  // Price scale: $40–$150 mapped to bar width
  const barX = 320;
  const barMax = 260;
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
      <text className="m-num" x="760" y="32" textAnchor="end" fontSize={28}>
        {numeral}
      </text>
      <text className="m-k" x="760" y="56" textAnchor="end" fontSize={11}>
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
          Northeast Corridor
        </text>
        <text className="m-k" x="760" y="78" textAnchor="end" opacity={phase === "watching" ? 0.95 : 0.45} fontSize={11}>
          Watch · ±1 day
        </text>
      </g>

      {/* Paid baseline rail */}
      <line className="m-line" x1={paidX} y1="118" x2={paidX} y2="280" opacity="0.55" />
      <text className="m-k" x={paidX} y="108" textAnchor="middle" opacity="0.7" fontSize={11}>
        Paid $128
      </text>

      {trains.map((row, i) => {
        const y = 128 + i * 38;
        const hot =
          phase === "alert" ? row.beats && i === 0 : phase === "watching" ? row.beats : row.yours;
        const w = priceW(row.price);
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
            {hot && <rect className="m-fill" x="28" y={y - 12} width="3" height="32" opacity="0.65" />}
            <text className="m-label" x="40" y={y} fontSize={13}>
              {row.dep}
            </text>
            <text className="m-k" x="100" y={y} fontSize={11}>
              {row.name}
            </text>
            <rect className="m-box" x={barX} y={y - 6} width={barMax} height="10" opacity="0.2" />
            <rect className="m-fill" x={barX} y={y - 6} width={w} height="10" opacity={hot ? 0.8 : 0.4} />
            <text className="m-num" x={barX + barMax + 12} y={y} fontSize={14} textAnchor="start">
              ${row.price}
            </text>
            <text className="m-k" x="760" y={y} textAnchor="end" opacity={hot ? 0.95 : 0.45} fontSize={11}>
              {phase === "booked" && row.yours
                ? "Yours"
                : phase === "alert" && row.beats && i === 0
                  ? "Beats"
                  : row.save > 0
                    ? `−$${row.save}`
                    : "·"}
            </text>
          </g>
        );
      })}

      <text className="m-k" x="400" y="300" textAnchor="middle" opacity={phase === "alert" ? 0.9 : 0.45} fontSize={11}>
        {phase === "alert"
          ? "Alert · confirm on Amtrak · RailDrop never invents a fare"
          : phase === "watching"
            ? "Watching listed fares across the window"
            : "Baseline locked after purchase"}
      </text>
    </Frame>
  );
}
