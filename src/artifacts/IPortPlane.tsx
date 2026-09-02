import { storyBlend, useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";

export function IPortPlane() {
  useBus();
  const t = storyBlend(visual.iport);
  const parallel = t > 0.55;
  const bounded = t > 0.28;
  const lanes = [
    { label: "Config bind", w: parallel ? 196 : 28 },
    { label: "Client slice", w: parallel ? 164 : 28 },
    { label: "Run assemble", w: parallel ? 184 : 28 },
  ];
  const set = (value: number) => {
    visual.iport = value;
    visual.story = "rest";
  };

  return (
    <Frame viewBox="0 0 800 320">
      <text className="m-title" x="28" y="26">
        Setup throughput
      </text>
      <text className="m-k" x="28" y="46">
        {parallel ? "Bounded agent  ·  operator on the gate" : bounded ? "Policy holds  ·  expert still in line" : "Senior engineer is the queue"}
      </text>
      <text className="m-num" x="772" y="40" textAnchor="end" fontSize="28">
        {parallel ? "8m" : "3.5h"}
      </text>
      <text className="m-k" x="772" y="62" textAnchor="end">
        {parallel ? "operations cycle" : "expert setup"}
      </text>

      <g style={{ cursor: "pointer" }} onClick={() => set(0)}>
        <text className="m-k" x="28" y="88">
          Expert path
        </text>
        <rect className="m-box" x="28" y="98" width="744" height="32" />
        <rect className="m-fill" x="28" y="98" width={parallel ? 88 : 744} height="32" opacity={parallel ? 0.1 : 0.14} />
        <text className="m-k" x="40" y="118">
          {parallel ? "Idle" : "Single-threaded queue"}
        </text>
        <text className="m-k" x="760" y="118" textAnchor="end">
          {parallel ? "released" : "3.5h"}
        </text>
      </g>

      <line className="m-line" x1="400" y1="130" x2="400" y2="156" />
      <g style={{ cursor: "pointer" }} onClick={() => set(0.5)}>
        <rect className="m-box" x="330" y="156" width="140" height="36" />
        <rect className="m-fill" x="330" y="156" width="140" height="36" opacity={bounded ? 0.12 : 0.03} />
        <text className="m-k" x="400" y="178" textAnchor="middle">
          Policy · operator
        </text>
      </g>

      <g style={{ cursor: "pointer" }} onClick={() => set(1)}>
        <text className="m-k" x="28" y="220">
          Typed actions
        </text>
        {lanes.map((lane, i) => {
          const y = 232 + i * 26;
          const live = parallel && t > 0.2 + i * 0.16;
          return (
            <g key={lane.label} opacity={live ? 1 : 0.45}>
              <rect className="m-box" x="28" y={y} width="744" height="20" />
              <rect className="m-fill" x="28" y={y} width={live ? lane.w : 28} height="20" opacity="0.16" />
              <text className="m-k" x="40" y={y + 14}>
                {lane.label}
              </text>
              <text className="m-k" x="760" y={y + 14} textAnchor="end">
                {live ? "live" : "blocked"}
              </text>
            </g>
          );
        })}
      </g>
    </Frame>
  );
}
