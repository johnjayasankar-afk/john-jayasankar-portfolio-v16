import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { paletteShortcutLabel } from "@/util/motion";

const KEY_PAGE = "jj:grammar-hint";

/** One-time keyboard grammar chip - dismissible, local only. */
export function GrammarChip() {
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);
  const [shortcut, setShortcut] = useState("⌘K");

  useEffect(() => {
    setShortcut(paletteShortcutLabel());
  }, []);

  useEffect(() => {
    // Home + cases use the diagram HUD. Work already prints ledger shortcuts
 // under the list - a fixed chip there covers the first row's metrics.
    const supported =
      pathname === "/approach" ||
      pathname === "/writing" ||
      pathname === "/about";
    if (!supported) {
      setShow(false);
      return;
    }
    try {
      if (localStorage.getItem(KEY_PAGE) === "1") return;
    } catch {
      return;
    }
    const timer = window.setTimeout(() => setShow(true), 1200);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  if (!show) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(KEY_PAGE, "1");
    } catch {
      /* private mode */
    }
    setShow(false);
  };

  const copy =
    pathname === "/approach" ? (
      <>
 <b>1-5</b> layers · <b>j / k</b> ladder · <b>{shortcut}</b>
      </>
    ) : pathname === "/writing" ? (
      <>
        <b>j / k</b> theses · <b>{shortcut}</b>
      </>
    ) : (
      <>
        <b>j / k</b> experience · <b>{shortcut}</b>
      </>
    );

  return (
    <aside className="grammar-chip" role="status" aria-live="polite">
      <p>{copy}</p>
      <button type="button" className="grammar-chip-dismiss" onClick={dismiss}>
        Got it
      </button>
    </aside>
  );
}
