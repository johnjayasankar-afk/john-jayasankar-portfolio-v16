import { storyBlend, useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";

/** Exact Northeast Corridor sample board from RailDrop’s live landing page. */
const trains = [
  {
    dep: "06:10",
    name: "NE Regional 95",
    dur: "4h 08m",
    price: 47,
    save: 81,
    yours: false,
    beats: true,
  },
  {
    dep: "07:00",
    name: "Acela 2155",
    dur: "3h 50m",
    price: 133,
    save: 0,
    yours: true,
    beats: false,
  },
  {
    dep: "09:20",
    name: "NE Regional 93",
    dur: "4h 02m",
    price: 61,
    save: 67,
    yours: false,
    beats: true,
  },
  {
    dep: "13:00",
    name: "Acela 2167",
    dur: "3h 47m",
    price: 141,
    save: 0,
    yours: false,
    beats: false,
  },
];

export function RailDropPlane() {
  useBus();
  const t = storyBlend(visual.rail);
  const phase = t < 0.34 ? "booked" : t < 0.72 ? "watching" : "alert";
  const caption =
    phase === "booked"
      ? "You paid $128  ·  cheapest listed $47"
      : phase === "watching"
        ? "Same stations  ·  every rail option  ·  ±1 day"
        : "Regional 95 dropped $14  ·  look at switching";
  const numeral = phase === "booked" ? "$128" : phase === "watching" ? "$47" : "−$81";
  const numeralNote =
    phase === "booked" ? "what you paid" : phase === "watching" ? "cheapest listed" : "vs booked";

  return (
    <Frame viewBox="0 0 800 320">
      <text className="m-title" x="28" y="24">
        RailDrop
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
          visual.rail = 0;
          visual.story = "rest";
        }}
      >
        <rect className="m-box" x="28" y="74" width="360" height="48" />
        <rect className="m-fill" x="28" y="74" width="360" height="48" opacity={phase === "booked" ? 0.1 : 0.04} />
        <text className="m-k" x="44" y="94">
          BOS
        </text>
        <text className="m-label" x="84" y="94">
          Boston, MA
        </text>
        <text className="m-k" x="200" y="94">
          →
        </text>
        <text className="m-k" x="228" y="94">
          NYP
        </text>
        <text className="m-label" x="268" y="94">
          New York, NY
        </text>
        <text className="m-k" x="44" y="112">
          Northeast corridor · sample board
        </text>
      </g>

      <g
        style={{ cursor: "pointer" }}
        onClick={() => {
          visual.rail = 0.5;
          visual.story = "rest";
        }}
      >
        <rect className="m-box" x="404" y="74" width="368" height="48" />
        <rect className="m-fill" x="404" y="74" width="368" height="48" opacity={phase === "watching" ? 0.1 : 0.04} />
        <text className="m-k" x="420" y="94">
          Watch window
        </text>
        <text className="m-label" x="420" y="112">
          ±1 day · rail only · honest board
        </text>
      </g>

      <text className="m-k" x="28" y="148">
        Depart
      </text>
      <text className="m-k" x="108" y="148">
        Train
      </text>
      <text className="m-k" x="380" y="148">
        Duration
      </text>
      <text className="m-k" x="520" y="148">
        Price
      </text>
      <text className="m-k" x="640" y="148">
        vs paid
      </text>

      {trains.map((row, i) => {
        const y = 172 + i * 34;
        const hot =
          phase === "alert"
            ? row.beats && i === 0
            : phase === "watching"
              ? row.beats
              : row.yours;
        const tag =
          phase === "booked" && row.yours
            ? "Your train"
            : phase === "alert" && row.beats && i === 0
              ? "Beats yours"
              : row.save > 0
                ? `save $${row.save}`
                : "listed";
        return (
          <g
            key={row.name}
            opacity={phase === "booked" && !row.yours ? 0.42 : 1}
            style={{ cursor: "pointer" }}
            onClick={() => {
              visual.rail = row.beats ? 1 : row.yours ? 0 : 0.5;
              visual.story = "rest";
            }}
          >
            <rect className="m-fill" x="28" y={y - 14} width="744" height="30" opacity={hot ? 0.1 : 0} />
            {hot ? <rect className="m-fill" x="28" y={y - 14} width="4" height="30" opacity="0.45" /> : null}
            <text className="m-label" x="28" y={y}>
              {row.dep}
            </text>
            <text className="m-label" x="108" y={y}>
              {row.name}
            </text>
            <text className="m-k" x="380" y={y}>
              {row.dur}
            </text>
            <text className="m-num" x="520" y={y} fontSize="15">
              ${row.price}
            </text>
            <text className="m-k" x="640" y={y}>
              {tag}
            </text>
          </g>
        );
      })}
    </Frame>
  );
}
