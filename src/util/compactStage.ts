import { useEffect, useState } from "react";

/** True when case / hero diagrams should use the stacked teaching layout. */
export function useCompactStage(query = "(max-width: 980px)") {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [query]);
  return compact;
}
