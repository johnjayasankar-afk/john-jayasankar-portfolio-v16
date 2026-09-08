/** Quiet loading plate while a route chunk settles. */
export function RouteFallback({ label = "Loading" }: { label?: string }) {
  return (
    <div className="page-fallback" aria-busy="true">
      <div className="wrap-wide page-fallback-inner">
        <p className="sys page-fallback-mark" aria-hidden="true">
          JJ
        </p>
        <p className="sys page-fallback-label" role="status" aria-live="polite">
          {label}
        </p>
        <div className="page-fallback-bar" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}
