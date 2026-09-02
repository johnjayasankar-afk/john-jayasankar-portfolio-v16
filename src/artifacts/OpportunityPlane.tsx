import { storyBlend, useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";

const actions = [
  { title: "Follow up", note: "contact · 48h stale" },
  { title: "Prep loop", note: "interview · Thu" },
  { title: "Score role", note: "fit · 74" },
];

const cols = [
  { name: "Sourced", cards: 3 },
  { name: "Applied", cards: 2 },
  { name: "Interview", cards: 1 },
  { name: "Offer", cards: 0 },
];

const star = [
  { k: "S", label: "Situation" },
  { k: "T", label: "Task" },
  { k: "A", label: "Action" },
  { k: "R", label: "Result" },
];

export function OpportunityPlane() {
  useBus();
  const t = storyBlend(visual.os);
  const today = t < 0.34;
  const pipeline = t >= 0.34 && t < 0.72;
  const story = t >= 0.72;

  const numeral = today ? "3" : pipeline ? "10" : "STAR";
  const numeralNote = today ? "next actions" : pipeline ? "in motion" : "evidence ready";
  const caption = today
    ? "Next action visible  ·  local only"
    : pipeline
      ? "Board is the source of truth"
      : "Stories attach to the interview";

  return (
    <Frame viewBox="0 0 800 320">
      <text className="m-title" x="28" y="26">
        Opportunity system
      </text>
      <text className="m-k" x="28" y="46">
        {caption}
      </text>
      <text className="m-num" x="772" y="40" textAnchor="end" fontSize="28">
        {numeral}
      </text>
      <text className="m-k" x="772" y="62" textAnchor="end">
        {numeralNote}
      </text>

      <g opacity={today ? 1 : 0.38} style={{ cursor: "pointer" }} onClick={() => { visual.os = 0; visual.story = "rest"; }}>
        <text className="m-k" x="28" y="88">
          Today
        </text>
        {actions.map((row, i) => {
          const y = 98 + i * 36;
          return (
            <g key={row.title}>
              <rect className="m-box" x="28" y={y} width="176" height="30" />
              <rect className="m-fill" x="28" y={y} width="6" height="30" opacity={today ? 0.22 : 0.08} />
              <text className="m-k" x="44" y={y + 12}>
                {row.title}
              </text>
              <text className="m-k" x="44" y={y + 24} opacity="0.7">
                {row.note}
              </text>
            </g>
          );
        })}
      </g>

      <g opacity={pipeline ? 1 : 0.38} style={{ cursor: "pointer" }} onClick={() => { visual.os = 0.5; visual.story = "rest"; }}>
        {cols.map((col, i) => {
          const x = 228 + i * 96;
          return (
            <g key={col.name}>
              <text className="m-k" x={x} y="88">
                {col.name}
              </text>
              <rect className="m-box" x={x} y="98" width="88" height="118" />
              {Array.from({ length: col.cards }, (_, j) => {
                const cy = 198 - j * 28 - 22;
                return (
                  <rect
                    key={`${col.name}-${j}`}
                    className="m-fill"
                    x={x + 8}
                    y={cy}
                    width="72"
                    height="22"
                    opacity={pipeline ? 0.16 : 0.07}
                  />
                );
              })}
              <text className="m-k" x={x + 44} y="206" textAnchor="middle" opacity="0.55">
                {col.cards}
              </text>
            </g>
          );
        })}
      </g>

      <g opacity={today || pipeline ? 1 : 0.38} style={{ cursor: "pointer" }} onClick={() => { visual.os = 0.5; visual.story = "rest"; }}>
        <text className="m-k" x="636" y="88">
          Fit
        </text>
        <rect className="m-box" x="636" y="98" width="136" height="118" />
        <text className="m-num" x="704" y="164" textAnchor="middle" fontSize="28">
          74
        </text>
        <text className="m-k" x="704" y="186" textAnchor="middle">
          / 100  ·  local
        </text>
        <rect className="m-fill" x="652" y="198" width="104" height="2" opacity="0.12" />
        <rect className="m-fill" x="652" y="198" width="74" height="2" opacity="0.45" />
      </g>

      <g opacity={story ? 1 : 0.42} style={{ cursor: "pointer" }} onClick={() => { visual.os = 1; visual.story = "rest"; }}>
        {star.map((cell, i) => {
          const x = 28 + i * 193;
          return (
            <g key={cell.k} opacity={story ? 1 : 0.7}>
              <rect className="m-box" x={x} y="236" width="185" height="56" />
              <rect className="m-fill" x={x} y="236" width="185" height="56" opacity={story ? 0.08 : 0.02} />
              <text className="m-num" x={x + 14} y="270" fontSize="18">
                {cell.k}
              </text>
              <text className="m-k" x={x + 42} y="268">
                {cell.label}
              </text>
            </g>
          );
        })}
      </g>
    </Frame>
  );
}
