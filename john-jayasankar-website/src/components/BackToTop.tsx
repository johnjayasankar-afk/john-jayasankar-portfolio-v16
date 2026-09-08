import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/util/motion";
import { replaceHash } from "@/util/scroll";

/** Quiet control after deep scroll — returns to the top of the page. */
export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      const threshold = Math.min(640, Math.round(window.innerHeight * 0.7));
      const next = window.scrollY > threshold;
      setShow((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(() => {
        frame = 0;
        read();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll, { passive: true });
    // Sample once — some environments skip scroll events on programmatic scrollTo.
    const poll = window.setInterval(read, 250);
    read();
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
      window.clearInterval(poll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <button
      type="button"
      className={`back-top${show ? " is-on" : ""}`}
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
      aria-hidden={show ? undefined : true}
      onClick={() => {
        replaceHash(null);
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: prefersReducedMotion() ? "auto" : "smooth",
        });
      }}
    >
      Top
    </button>
  );
}
