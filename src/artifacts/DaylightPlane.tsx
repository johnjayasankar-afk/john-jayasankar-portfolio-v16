import { useId } from "react";
import { storyBlend, useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";

/** Warmth targets along a Balanced-style day (approx. display kelvin). */
const anchors = [
  { h: 6, k: 3400, label: "06" },
  { h: 9, k: 5200, label: "09" },
  { h: 12, k: 6500, label: "12" },
  { h: 15, k: 5800, label: "15" },
  { h: 18, k: 4200, label: "18" },
  { h: 21, k: 3200, label: "21" },
  { h: 24, k: 3000, label: "24" },
];

const layers = [
  { name: "Manual pause", note: "Restore shortcut", active: false },
  { name: "App rule", note: "Colour Work", active: true },
  { name: "Schedule", note: "Balanced · mired", active: false },
];

const certainty = [
  { name: "Asked", note: "Write sent", ok: true },
  { name: "Accepted", note: "API success", ok: true },
  { name: "Confirmed", note: "Readback miss", ok: false },
];

/** Safe drawing frame inside 800×320. */
const L = 28;
const R = 772;
const PANEL_X = 586;
const PANEL_W = 186;
const PANEL_Y = 70;
const PANEL_H = 176;
/** Right edge of chart drawing - leave a clear gap before the side panel. */
const CHART_R = PANEL_X - 36;
/**
 * Last hour sits well inset. Label is end-anchored so the glyph's right edge
 * stays left of CHART_END, with a wide gap before PANEL_X (586).
 */
const CHART_END = CHART_R - 40;

function kelvinAt(hour: number) {
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (hour >= a.h && hour <= b.h) {
      const t = (hour - a.h) / (b.h - a.h);
      return Math.round(a.k + (b.k - a.k) * t);
    }
  }
  return anchors[anchors.length - 1].k;
}

function xForHour(h: number) {
  return 48 + ((h - 6) / 18) * (CHART_END - 48);
}

function yForK(k: number) {
  return 198 - ((k - 2800) / 4000) * 96;
}

/** Daylight: schedule curve → explainable precedence → asked/accepted/confirmed. */
export function DaylightPlane() {
  useBus();
  const clipId = `dl-chart-${useId().replace(/:/g, "")}`;
  const t = storyBlend(visual.day);
  const phase = t < 0.34 ? "schedule" : t < 0.72 ? "explain" : "confirm";
  const hour = phase === "schedule" ? 7 + t * 40 : phase === "explain" ? 14.5 : 21;
  const k = kelvinAt(hour);
  const caption =
    phase === "schedule"
 ? "Schedule · warmth and brightness follow the clock - offline"
      : phase === "explain"
        ? "Explain · app rules sit above the schedule on a printed ladder"
        : "Confirm · API success is not display evidence";
  const numeral = phase === "confirm" ? "2 / 3" : `${k} K`;
  const numeralLabel = phase === "schedule" ? "target kelvin" : phase === "explain" ? "active layer" : "certainty levels";

  const path = anchors
    .map((a, i) => `${i === 0 ? "M" : "L"}${xForHour(a.h).toFixed(1)} ${yForK(a.k).toFixed(1)}`)
    .join(" ");
  const cursorX = Math.min(CHART_END, Math.max(56, xForHour(Math.min(24, Math.max(6, hour)))));
  const cursorY = yForK(k);
  const nowLabelRight = cursorX + 40 < CHART_END;
  const foot =
    phase === "confirm"
      ? "Illustrative · Asked · Accepted · Confirmed are three different facts"
      : phase === "explain"
        ? "Conceptual · Dim-on-battery does not drop schedule warmth"
        : "Conceptual schedule · no network, location, or analytics";

  const px = PANEL_X + 14;
  const innerW = PANEL_W - 28;

  return (
    <Frame viewBox="0 0 800 320" family="consumer">
      <defs>
        <clipPath id={clipId}>
          <rect x="40" y="56" width={CHART_R - 40} height="150" />
        </clipPath>
      </defs>

      <text className="m-title" x={L} y="22" fontSize={12}>
        Daylight · display schedule
      </text>
      <text className="m-k" x={L} y="40" fontSize={11}>
        {caption}
      </text>
      <text className="m-num" x={R} y="32" textAnchor="end" fontSize={28}>
        {numeral}
      </text>
      <text className="m-k" x={R} y="54" textAnchor="end" fontSize={11}>
        {numeralLabel}
      </text>

      {/* Axis + hour labels sit outside the clip so end labels never get cropped */}
      <g
        style={{ cursor: "pointer" }}
        onClick={() => {
          visual.day = 0;
          visual.story = "rest";
        }}
      >
        <text className="m-k" x="48" y="70" fontSize={11}>
          Warmth curve · offline
        </text>
        <line className="m-line" x1="48" y1="198" x2={CHART_END} y2="198" opacity="0.35" />
        {anchors.map((a) => {
          const x = xForHour(a.h);
          const isLast = a.h === 24;
          return (
            <g key={a.label}>
              <line className="m-line" x1={x} y1="198" x2={x} y2="204" opacity="0.45" />
              <text
                className="m-k"
                x={x}
                y="220"
                textAnchor={isLast ? "end" : "middle"}
                fontSize={10}
                opacity="0.55"
              >
                {a.label}
              </text>
            </g>
          );
        })}
      </g>

      {/* Curve only - clipped so it never enters the panel */}
      <g
        clipPath={`url(#${clipId})`}
        style={{ cursor: "pointer" }}
        onClick={() => {
          visual.day = 0;
          visual.story = "rest";
        }}
      >
        <path className="m-line" d={path} fill="none" opacity="0.85" strokeWidth="1.6" />
        {anchors.map((a) => {
          const isCursor = Math.abs(xForHour(a.h) - cursorX) < 0.5 && Math.abs(yForK(a.k) - cursorY) < 0.5;
          if (isCursor) return null;
          return (
            <circle key={`d-${a.label}`} className="m-box" cx={xForHour(a.h)} cy={yForK(a.k)} r="3" opacity="0.55" />
          );
        })}
        <circle className="m-fill" cx={cursorX} cy={cursorY} r="5" opacity="0.9" />
        <line className="m-line" x1={cursorX} y1={cursorY} x2={cursorX} y2="198" opacity="0.35" />
        <text
          className="m-label"
          x={nowLabelRight ? cursorX + 10 : cursorX - 10}
          y={cursorY - 10}
          textAnchor={nowLabelRight ? "start" : "end"}
          fontSize={12}
        >
          Now
        </text>
      </g>

 {/* Opaque panel plate + stroke - chart cannot show through */}
      <rect className="m-fill" x={PANEL_X} y={PANEL_Y} width={PANEL_W} height={PANEL_H} opacity="0.1" />
      <rect className="m-box" x={PANEL_X} y={PANEL_Y} width={PANEL_W} height={PANEL_H} />

      {phase === "schedule" && (
        <g
          style={{ cursor: "pointer" }}
          onClick={() => {
            visual.day = 0.2;
            visual.story = "rest";
          }}
        >
          <text className="m-label" x={px} y={PANEL_Y + 24} fontSize={13}>
            Menu bar
          </text>
          <text className="m-k" x={px} y={PANEL_Y + 44} fontSize={11}>
            Where it lives
          </text>
          <rect className="m-box" x={px} y={PANEL_Y + 58} width={innerW} height="28" opacity="0.35" />
          <rect
            className="m-fill"
            x={px}
            y={PANEL_Y + 58}
            width={Math.max(12, Math.min(innerW, 14 + ((6500 - k) / 3500) * (innerW - 14)))}
            height="28"
            opacity="0.75"
          />
          <text className="m-k" x={px} y={PANEL_Y + 110} fontSize={11}>
            Warmth fill
          </text>
          <text className="m-k" x={px} y={PANEL_Y + 136} fontSize={11} opacity="0.85">
            Pause · per display
          </text>
        </g>
      )}

      {phase === "explain" && (
        <g>
          <text className="m-label" x={px} y={PANEL_Y + 22} fontSize={13}>
            Precedence
          </text>
          {layers.map((layer, i) => {
            const y = PANEL_Y + 48 + i * 38;
            return (
              <g
                key={layer.name}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  visual.day = 0.5;
                  visual.story = "rest";
                }}
              >
                {layer.active && <rect className="m-fill" x={PANEL_X + 6} y={y - 12} width="3" height="28" opacity="0.75" />}
                <text className="m-label" x={px} y={y} fontSize={12} opacity={layer.active ? 1 : 0.45}>
                  {layer.name}
                </text>
                <text className="m-k" x={px} y={y + 15} fontSize={11} opacity={layer.active ? 0.85 : 0.4}>
                  {layer.active ? `On · ${layer.note}` : layer.note}
                </text>
              </g>
            );
          })}
        </g>
      )}

      {phase === "confirm" && (
        <g>
          <text className="m-label" x={px} y={PANEL_Y + 22} fontSize={13}>
            Certainty
          </text>
          {certainty.map((row, i) => {
            const y = PANEL_Y + 52 + i * 36;
            const hot = i < 2;
            return (
              <g
                key={row.name}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  visual.day = 1;
                  visual.story = "rest";
                }}
              >
                <circle className="m-fill" cx={px + 6} cy={y - 4} r="4.5" opacity={hot ? 0.85 : 0.25} />
                <text className="m-label" x={px + 20} y={y} fontSize={12} opacity={hot ? 1 : 0.5}>
                  {row.name}
                </text>
                <text className="m-k" x={px + 20} y={y + 15} fontSize={11} opacity={hot ? 0.8 : 0.4}>
                  {row.note}
                </text>
              </g>
            );
          })}
        </g>
      )}

      <text className="m-k" x="28" y="312" opacity="0.55" fontSize={11}>
        {foot}
      </text>
    </Frame>
  );
}
