import { useEffect, useState } from "react";
import { paletteShortcutLabel } from "@/util/motion";

/** Live palette shortcut label (⌘K vs Ctrl K). */
export function usePaletteShortcut() {
  const [shortcut, setShortcut] = useState("⌘K");
  useEffect(() => {
    setShortcut(paletteShortcutLabel());
  }, []);
  return shortcut;
}
