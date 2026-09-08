import type { PointerEvent, ReactNode } from "react";

export function Frame({
  children,
  viewBox = "0 0 800 360",
  onMove,
}: {
  children: ReactNode;
  viewBox?: string;
  onMove?: (x: number, y: number) => void;
}) {
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!onMove) return;
    const r = e.currentTarget.getBoundingClientRect();
    onMove((e.clientX - r.left) / Math.max(r.width, 1), (e.clientY - r.top) / Math.max(r.height, 1));
  };
  return (
    <div className="machine" aria-hidden="true" onPointerMove={move} onPointerLeave={() => onMove?.(0.5, 0.5)}>
      <svg viewBox={viewBox} preserveAspectRatio="xMidYMin meet">
        {children}
      </svg>
    </div>
  );
}
