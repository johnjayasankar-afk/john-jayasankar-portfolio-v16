import { storyBlend, useBus } from "./useBus";
import { visual } from "@/scene/visual";
import { Frame } from "./Frame";

/**
 * CoCo silhouette: dual evidence rails converge into a Y-fork
 * (resolve in ops vs escalate to eng). Incomplete packets light the eng path.
 */
export function CocoTrace() {
  useBus();
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

  return (
    <Frame viewBox="0 0 800 320" family="agent">
      <text className="m-title" x="28" y="22" fontSize={12}>
        QT CoCo · incident agent
      </text>
      <text className="m-k" x="28" y="40" fontSize={11}>
        {resolved
          ? "Packet complete · resolve in ops · eng stays on product"
          : diagnosing
            ? "Evidence converging · config drift hypothesis"
            : "Incident opens · default path still pages engineering"}
      </text>
      <text className="m-num" x="760" y="28" textAnchor="end" fontSize={28}>
        {resolved ? "11m" : "4.5h"}
      </text>
      <text className="m-k" x="760" y="48" textAnchor="end" fontSize={11}>
        {resolved ? "−78% escalations" : "expert triage"}
      </text>

      {/* Incident node */}
      <g style={{ cursor: "pointer" }} onClick={() => set(0)}>
        <circle className={gathering ? "m-fill" : "m-box"} cx="64" cy="150" r="28" opacity={gathering ? 0.35 : 0.15} />
        <circle className="m-box" cx="64" cy="150" r="28" />
        <text className="m-label" x="64" y="144" textAnchor="middle" fontSize={13}>
          T+0
        </text>
        <text className="m-k" x="64" y="162" textAnchor="middle" fontSize={11}>
          Incident
        </text>
      </g>

      {/* Dual MCP rails */}
      <line className="m-flow" x1="90" y1="140" x2="132" y2="112" opacity="0.7" />
      <line className="m-flow" x1="90" y1="160" x2="132" y2="188" opacity="0.7" />

      <g style={{ cursor: "pointer" }} onClick={() => set(0.5)}>
        {/* MCP run rail — outline only */}
        <rect className="m-box" x="132" y="62" width="200" height="92" rx="2" opacity="0.55" />
        <text className="m-label" x="146" y="82" fontSize={13}>
          MCP · run
        </text>
        {runRows.map((row, i) => {
          const lit = diagnosing || resolved || (gathering && i < 2);
          const gap = gathering && i === 2;
          const y = 100 + i * 16;
          return (
            <g key={row}>
              <circle className={lit && !gap ? "m-fill" : "m-box"} cx="156" cy={y} r="3" opacity={lit ? 0.9 : 0.3} />
              <text className="m-k" x="168" y={y + 4} opacity={gap ? 0.45 : lit ? 0.9 : 0.35} fontSize={11}>
                {row}
                {gap ? " · gap" : ""}
              </text>
            </g>
          );
        })}

        {/* MCP ops rail */}
        <rect className="m-box" x="132" y="168" width="200" height="92" rx="2" opacity="0.55" />
        <text className="m-label" x="146" y="188" fontSize={13}>
          MCP · ops
        </text>
        {opsRows.map((row, i) => {
          const lit = diagnosing || resolved || (gathering && i < 1);
          const key = resolved && i === 2;
          const y = 206 + i * 16;
          return (
            <g key={row}>
              <circle className={key || lit ? "m-fill" : "m-box"} cx="156" cy={y} r="3" opacity={key ? 1 : lit ? 0.8 : 0.3} />
              <text className="m-k" x="168" y={y + 4} opacity={key ? 1 : lit ? 0.9 : 0.35} fontSize={11}>
                {row}
                {key ? " · key" : ""}
              </text>
            </g>
          );
        })}
      </g>

      {/* Converge into diagnose diamond */}
      <line className="m-flow" x1="332" y1="108" x2="372" y2="150" opacity={diagnosing || resolved ? 0.85 : 0.25} />
      <line className="m-flow" x1="332" y1="214" x2="372" y2="150" opacity={diagnosing || resolved ? 0.85 : 0.25} />

      <g style={{ cursor: "pointer" }} onClick={() => set(0.5)}>
        <polygon className="m-box" points="420,100 468,150 420,200 372,150" fill="none" />
        <text className="m-label" x="420" y="144" textAnchor="middle" fontSize={13}>
          Diagnose
        </text>
        <text className="m-k" x="420" y="166" textAnchor="middle" opacity={resolved ? 0.9 : 0.45} fontSize={11}>
          {resolved ? "drift" : diagnosing ? "…" : "idle"}
        </text>
      </g>

      {/* Y-fork */}
      <path className="m-line" d="M468 150 L508 114" opacity={resolved ? 0.85 : 0.25} />
      <path className="m-line" d="M468 150 L508 196" opacity={gathering ? 0.85 : resolved ? 0.2 : 0.35} />
      <polygon className="m-arrowhead" points="504,110 516,114 504,118" opacity={resolved ? 0.8 : 0.25} />
      <polygon className="m-arrowhead" points="504,192 516,196 504,200" opacity={gathering ? 0.8 : 0.25} />

      <g style={{ cursor: "pointer" }} onClick={() => set(1)}>
        <rect className="m-box" x="516" y="80" width="220" height="52" rx="2" />
        <text className="m-label" x="626" y="102" textAnchor="middle" fontSize={13}>
          Resolve in ops
        </text>
        <text className="m-k" x="626" y="120" textAnchor="middle" opacity={resolved ? 0.85 : 0.4} fontSize={11}>
          no eng page
        </text>

        <rect className="m-box" x="516" y="172" width="220" height="52" rx="2" opacity={resolved ? 0.35 : 1} />
        <text className="m-label" x="626" y="194" textAnchor="middle" opacity={gathering ? 1 : 0.45} fontSize={13}>
          Escalate
        </text>
        <text className="m-k" x="626" y="212" textAnchor="middle" opacity={gathering ? 0.85 : 0.35} fontSize={11}>
          eng page · incomplete
        </text>
      </g>

      <text className="m-k" x="28" y="300" fontSize={11}>
        Returned
      </text>
      <text className="m-num" x="108" y="300" fontSize={18}>
        {resolved ? "750+" : "hold"}
      </text>
      <text className="m-k" x="178" y="300" fontSize={11}>
        senior eng hours / year
      </text>
      <text className="m-k" x="760" y="300" textAnchor="end" opacity="0.5" fontSize={11}>
        Escalate only when evidence is incomplete
      </text>
    </Frame>
  );
}
