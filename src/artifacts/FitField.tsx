import { useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";

const samples = [
  { x: 0.1, y: 0.74 },
  { x: 0.16, y: 0.36 },
  { x: 0.22, y: 0.58 },
  { x: 0.3, y: 0.2 },
  { x: 0.34, y: 0.66 },
  { x: 0.42, y: 0.44 },
  { x: 0.48, y: 0.28 },
  { x: 0.54, y: 0.7 },
  { x: 0.6, y: 0.4 },
  { x: 0.66, y: 0.54 },
  { x: 0.72, y: 0.24 },
  { x: 0.78, y: 0.62 },
  { x: 0.84, y: 0.38 },
  { x: 0.9, y: 0.5 },
];

export function FitField() {
  useBus();
  const t = visual.fit / 100;
  const x = 100 + t * 572;
  const band = t < 0.42 ? "Copilot" : t < 0.72 ? "Supervised" : "Bounded";

  return (
    <Frame viewBox="0 0 800 320">
      <text className="m-title" x="28" y="24">
        Autonomy field
      </text>
      <text className="m-k" x="28" y="44">
        Recommendation  ·  {band}
      </text>
      <text className="m-num" x="772" y="38" textAnchor="end" fontSize="28">
        {Math.round(visual.fit)}
      </text>
      <text className="m-k" x="772" y="60" textAnchor="end">
        fit / 100
      </text>

      <text className="m-k" x="160" y="86" textAnchor="middle">
        Copilot
      </text>
      <text className="m-k" x="400" y="86" textAnchor="middle">
        Supervised
      </text>
      <text className="m-k" x="640" y="86" textAnchor="middle">
        Bounded
      </text>

      <g style={{ cursor: "pointer" }} onClick={() => { visual.fit = 28; visual.story = "rest"; }}>
        <rect className="m-fill" x="88" y="96" width="176" height="156" opacity={t < 0.42 ? 0.1 : 0.04} />
        <rect className="m-box" x="88" y="96" width="176" height="156" />
      </g>
      <g style={{ cursor: "pointer" }} onClick={() => { visual.fit = 58; visual.story = "rest"; }}>
        <rect className="m-fill" x="264" y="96" width="248" height="156" opacity={t >= 0.42 && t < 0.72 ? 0.14 : 0.06} />
        <rect className="m-box" x="264" y="96" width="248" height="156" />
      </g>
      <g style={{ cursor: "pointer" }} onClick={() => { visual.fit = 86; visual.story = "rest"; }}>
        <rect className="m-fill" x="512" y="96" width="200" height="156" opacity={t >= 0.72 ? 0.1 : 0.04} />
        <rect className="m-box" x="512" y="96" width="200" height="156" />
      </g>

      {samples.map((s, i) => (
        <circle
          key={i}
          className="m-fill"
          cx={88 + s.x * 624}
          cy={112 + s.y * 120}
          r="2.4"
          opacity="0.32"
        />
      ))}

      <line className="m-line" x1="88" y1="272" x2="712" y2="272" />
      <text className="m-k" x="88" y="294">
        Easier to undo
      </text>
      <text className="m-k" x="712" y="294" textAnchor="end">
        Harder to undo
      </text>

      <line className="m-line" x1={x} y1="96" x2={x} y2="252" opacity="0.7" />
      <circle className="m-fill" cx={x} cy="174" r="6" />
    </Frame>
  );
}
