import { storyBlend, useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";
import { useCompactStage } from "@/util/compactStage";

/**
 * CoCo: dual evidence rails → diagnose → resolve in ops or escalate.
 * Default state readable: incident opens and still pages engineering.
 * Conceptual workflow  -  outcomes on the case.
 */
export function CocoTrace() {
  useBus();
  const compact = useCompactStage();
  const t = storyBlend(visual.coco);
  const gathering = t < 0.34;
  const diagnosing = t >= 0.34 && t < 0.72;
  const resolved = t >= 0.72;
  const set = (v: number) => {
    visual.coco = v;
    visual.story = "rest";
  };

  const runRows = ["Cycle state", "Last accept", "Latency spike"];
  const opsRows = ["Client ticket", "Window · books", "Prior: config drift"];

  const caption = resolved
    ? "Packet complete · resolve in ops · eng stays on product"
    : diagnosing
      ? "Evidence converging · config drift hypothesis"
      : "Incident opens · default path still pages engineering";

  if (compact) {
    return (
      <CompactCoco
        gathering={gathering}
        diagnosing={diagnosing}
        resolved={resolved}
        caption={caption}
        set={set}
        runRows={runRows}
        opsRows={opsRows}
      />
    );
  }

  return (
    <Frame viewBox="0 0 840 360" family="agent">
      <text className="m-title" x="24" y="28" fontSize={14}>
        QT CoCo · incident agent
      </text>
      <text className="m-k" x="24" y="48" fontSize={12}>
        {caption}
      </text>

      <text className="m-num" x="816" y="32" textAnchor="end" fontSize={24}>
        <tspan>4.5h</tspan>
        <tspan dx="8" className="m-k" fontSize={18} fill="currentColor" opacity={0.78}>
          →
        </tspan>
        <tspan dx="8" opacity={resolved ? 1 : 0.55}>
          11m
        </tspan>
      </text>
      <text className="m-k" x="816" y="52" textAnchor="end" fontSize={11}>
        {resolved ? "−78% escalations" : "expert triage → ops cycle"}
      </text>

      <rect className="m-box" x="20" y="68" width="100" height="240" rx="2" opacity={gathering ? 0.24 : 0.08} />
      <rect className="m-box" x="136" y="68" width="248" height="240" rx="2" opacity={diagnosing || gathering ? 0.16 : 0.07} />
      <rect className="m-box" x="400" y="68" width="100" height="240" rx="2" opacity={diagnosing ? 0.22 : 0.08} />
      <rect className="m-box" x="516" y="68" width="304" height="240" rx="2" opacity={resolved ? 0.18 : gathering ? 0.14 : 0.07} />

      <g style={{ cursor: "pointer" }} onClick={() => set(0)}>
        <text className="m-k" x="70" y="90" textAnchor="middle" fontSize={11} opacity={gathering ? 1 : 0.55}>
          01 · Incident
        </text>
        <circle className={gathering ? "m-fill" : "m-box"} cx="70" cy="176" r="32" opacity={gathering ? 0.4 : 0.15} />
        <circle className="m-box" cx="70" cy="176" r="32" />
        <text className="m-label" x="70" y="170" textAnchor="middle" fontSize={14}>
          T+0
        </text>
        <text className="m-k" x="70" y="190" textAnchor="middle" fontSize={12}>
          Open
        </text>
      </g>

      <line className="m-flow" x1="108" y1="160" x2="140" y2="120" opacity="0.75" />
      <line className="m-flow" x1="108" y1="192" x2="140" y2="232" opacity="0.75" />

      <g style={{ cursor: "pointer" }} onClick={() => set(0.5)}>
        <text className="m-k" x="260" y="90" textAnchor="middle" fontSize={11} opacity={diagnosing || gathering ? 1 : 0.55}>
          02 · Evidence
        </text>
        <rect className="m-box" x="148" y="104" width="212" height="88" rx="2" opacity="0.55" />
        <text className="m-label" x="162" y="126" fontSize={13}>
          MCP · run
        </text>
        {runRows.map((row, i) => {
          const lit = diagnosing || resolved || (gathering && i < 2);
          const gap = gathering && i === 2;
          const y = 146 + i * 14;
          return (
            <g key={row}>
              <circle className={lit && !gap ? "m-fill" : "m-box"} cx="170" cy={y} r="3.5" opacity={lit ? 0.95 : 0.35} />
              <text className="m-k" x="184" y={y + 4} opacity={gap ? 0.45 : lit ? 0.95 : 0.4} fontSize={12}>
                {row}
                {gap ? " · gap" : ""}
              </text>
            </g>
          );
        })}

        <rect className="m-box" x="148" y="204" width="212" height="96" rx="2" opacity="0.55" />
        <text className="m-label" x="162" y="226" fontSize={13}>
          MCP · ops
        </text>
        {opsRows.map((row, i) => {
          const lit = diagnosing || resolved || (gathering && i < 1);
          const key = resolved && i === 2;
          const y = 244 + i * 14;
          return (
            <g key={row}>
              <circle className={key || lit ? "m-fill" : "m-box"} cx="170" cy={y} r="3.5" opacity={key ? 1 : lit ? 0.85 : 0.35} />
              <text className="m-k" x="184" y={y + 4} opacity={key ? 1 : lit ? 0.95 : 0.4} fontSize={12}>
                {row}
                {key ? " · key" : ""}
              </text>
            </g>
          );
        })}
      </g>

      {/* Left rails: mirror right geometry exactly (tip±36, diagonals y=128/240).
          Split the inner vertical at the junctions so diagonals read as clean, unkinked paths. */}
      <line className="m-line" x1="364" y1="112" x2="364" y2="268" opacity="0.28" />
      <line className="m-line" x1="372" y1="112" x2="372" y2="126" opacity="0.45" />
      <line className="m-line" x1="372" y1="242" x2="372" y2="268" opacity="0.45" />
      <line className="m-flow" x1="372" y1="128" x2="408" y2="176" opacity={diagnosing || resolved ? 0.9 : 0.3} />
      <line className="m-flow" x1="372" y1="240" x2="408" y2="176" opacity={diagnosing || resolved ? 0.9 : 0.3} />

      <g style={{ cursor: "pointer" }} onClick={() => set(0.5)}>
        <text className="m-k" x="450" y="90" textAnchor="middle" fontSize={11} opacity={diagnosing ? 1 : 0.55}>
          03 · Diagnose
        </text>
        <polygon className="m-box" points="450,120 492,176 450,232 408,176" fill="none" />
        <text className="m-label" x="450" y="172" textAnchor="middle" fontSize={13}>
          Diagnose
        </text>
        <text className="m-k" x="450" y="194" textAnchor="middle" opacity={resolved ? 0.95 : 0.5} fontSize={12}>
          {resolved ? "drift" : diagnosing ? "…" : "idle"}
        </text>
      </g>

      <line className="m-flow" x1="492" y1="176" x2="528" y2="128" opacity={resolved ? 0.9 : 0.28} />
      <line className="m-flow" x1="492" y1="176" x2="528" y2="240" opacity={gathering ? 0.9 : resolved ? 0.22 : 0.4} />
      <line className="m-line" x1="528" y1="112" x2="528" y2="126" opacity="0.28" />
      <line className="m-line" x1="528" y1="242" x2="528" y2="268" opacity="0.28" />
      <line className="m-line" x1="536" y1="112" x2="536" y2="268" opacity="0.45" />

      <g style={{ cursor: "pointer" }} onClick={() => set(1)}>
        <text className="m-k" x="668" y="90" textAnchor="middle" fontSize={11} opacity={resolved || gathering ? 1 : 0.55}>
          04 · Outcome
        </text>
        <rect className="m-box" x="536" y="112" width="264" height="64" rx="2" opacity={resolved ? 1 : 0.45} />
        <text className="m-label" x="668" y="140" textAnchor="middle" fontSize={14}>
          Resolve in ops
        </text>
        <text className="m-k" x="668" y="154" textAnchor="middle" opacity={resolved ? 0.95 : 0.45} fontSize={12}>
          no eng page
        </text>

        <rect className="m-box" x="536" y="204" width="264" height="64" rx="2" opacity={resolved ? 0.35 : 1} />
        <text className="m-label" x="668" y="232" textAnchor="middle" opacity={gathering ? 1 : 0.5} fontSize={14}>
          Escalate
        </text>
        <text className="m-k" x="668" y="246" textAnchor="middle" opacity={gathering ? 0.95 : 0.4} fontSize={12}>
          eng page · incomplete packet
        </text>
      </g>

      <text className="m-k" x="24" y="336" fontSize={12} opacity={resolved ? 1 : 0.55}>
        Returned 750+ senior eng hours / year
      </text>
      <text className="m-k" x="816" y="336" textAnchor="end" opacity="0.5" fontSize={12}>
        Conceptual · escalate only when evidence is incomplete
      </text>
    </Frame>
  );
}

function CompactCoco({
  gathering,
  diagnosing,
  resolved,
  caption,
  set,
  runRows,
  opsRows,
}: {
  gathering: boolean;
  diagnosing: boolean;
  resolved: boolean;
  caption: string;
  set: (v: number) => void;
  runRows: string[];
  opsRows: string[];
}) {
  return (
    <Frame viewBox="0 0 400 520" family="agent">
      <text className="m-title" x="20" y="26" fontSize={14}>
        QT CoCo · incident
      </text>
      <text className="m-k" x="20" y="46" fontSize={12}>
        {caption}
      </text>
      <text className="m-num" x="280" y="28" textAnchor="end" fontSize={18}>
        4.5h
      </text>
      <text className="m-k" x="296" y="28" fontSize={14}>
        →
      </text>
      <text className="m-num" x="380" y="28" textAnchor="end" fontSize={18} opacity={resolved ? 1 : 0.55}>
        11m
      </text>

      <g style={{ cursor: "pointer" }} onClick={() => set(0)}>
        <rect className="m-box" x="16" y="64" width="368" height="72" rx="2" opacity={gathering ? 0.28 : 0.1} />
        <text className="m-k" x="28" y="86" fontSize={11} opacity={gathering ? 1 : 0.55}>
          01 · Incident opens
        </text>
        <text className="m-label" x="28" y="114" fontSize={15}>
          T+0 · default still pages engineering
        </text>
      </g>

      <g style={{ cursor: "pointer" }} onClick={() => set(0.5)}>
        <rect className="m-box" x="16" y="148" width="368" height="168" rx="2" opacity={diagnosing || gathering ? 0.22 : 0.1} />
        <text className="m-k" x="28" y="170" fontSize={11} opacity={diagnosing ? 1 : 0.55}>
          02 · Dual evidence rails
        </text>
        <text className="m-label" x="28" y="196" fontSize={13}>
          MCP · run
        </text>
        <text className="m-k" x="28" y="216" fontSize={12}>
          {runRows.join(" · ")}
        </text>
        <text className="m-label" x="28" y="248" fontSize={13}>
          MCP · ops
        </text>
        <text className="m-k" x="28" y="268" fontSize={12}>
          {opsRows.join(" · ")}
        </text>
        <text className="m-k" x="28" y="296" fontSize={12} opacity={diagnosing || resolved ? 1 : 0.5}>
          Diagnose: {resolved ? "config drift" : diagnosing ? "converging…" : "idle"}
        </text>
      </g>

      <g style={{ cursor: "pointer" }} onClick={() => set(1)}>
        <rect className="m-box" x="16" y="328" width="368" height="168" rx="2" opacity={resolved ? 0.26 : 0.1} />
        <text className="m-k" x="28" y="350" fontSize={11} opacity={resolved || gathering ? 1 : 0.55}>
          03 · Outcome
        </text>
        <rect className="m-box" x="28" y="368" width="344" height="48" rx="2" opacity={resolved ? 0.95 : 0.4} />
        <text className="m-label" x="200" y="390" textAnchor="middle" fontSize={14}>
          Resolve in ops · no eng page
        </text>
        <text className="m-k" x="200" y="408" textAnchor="middle" fontSize={11} opacity={resolved ? 1 : 0.5}>
          {resolved ? "750+ senior eng hours / year returned" : "preferred when packet is complete"}
        </text>
        <rect className="m-box" x="28" y="428" width="344" height="48" rx="2" opacity={resolved ? 0.3 : gathering ? 0.95 : 0.45} />
        <text className="m-label" x="200" y="450" textAnchor="middle" fontSize={14} opacity={gathering ? 1 : 0.55}>
          Escalate · eng page
        </text>
        <text className="m-k" x="200" y="468" textAnchor="middle" fontSize={11} opacity={gathering ? 0.95 : 0.45}>
          only when evidence is incomplete
        </text>
      </g>
    </Frame>
  );
}
