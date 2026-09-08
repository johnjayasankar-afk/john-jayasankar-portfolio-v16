import { useId, type PointerEvent, type ReactNode } from "react";

/** Shared SVG chrome for product machines - panels, arrows, soft fills. */
export function Frame({
  children,
  viewBox = "0 0 800 360",
  onMove,
  family = "agent",
}: {
  children: ReactNode;
  viewBox?: string;
  onMove?: (x: number, y: number) => void;
  family?: "agent" | "market" | "consumer";
}) {
  const uid = useId().replace(/:/g, "");
  const arrow = `m-arrow-${uid}`;
  const arrowSm = `m-arrow-sm-${uid}`;
  const parts = viewBox.trim().split(/[\s,]+/).map(Number);
  const vbW = parts[2] || 800;
  const vbH = parts[3] || 360;
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!onMove) return;
    const r = e.currentTarget.getBoundingClientRect();
    onMove((e.clientX - r.left) / Math.max(r.width, 1), (e.clientY - r.top) / Math.max(r.height, 1));
  };
  return (
    <div
      className="machine"
      data-family={family}
      aria-hidden="true"
      onPointerMove={move}
      onPointerLeave={() => onMove?.(0.5, 0.5)}
      style={{ aspectRatio: `${vbW} / ${vbH}`, flexGrow: 0, flexShrink: 0 }}
    >
      <svg viewBox={viewBox} preserveAspectRatio="xMidYMid meet" fontSize={12} overflow="visible">
        <defs>
          <marker id={arrow} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 1.5 L9 5 L0 8.5 Z" className="m-arrowhead" />
          </marker>
          <marker id={arrowSm} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 2 L8 5 L0 8 Z" className="m-arrowhead" />
          </marker>
        </defs>
        <style>{`
          .machine .m-flow{marker-end:url(#${arrow})}
          .machine .m-flow-sm{marker-end:url(#${arrowSm})}
        `}</style>
        {children}
      </svg>
    </div>
  );
}
