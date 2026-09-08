import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className,
  /** When true, animate once as the block enters the viewport (scroll craft). */
  inView = false,
 /** Skip entrance motion - use for above-the-fold copy that must never paint invisible. */
  immediate = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  inView?: boolean;
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  if (immediate || reduce) {
    return <div className={className}>{children}</div>;
  }

  const visible = { opacity: 1, y: 0 };
  const hidden = { opacity: 0, y: 18 };
  const transition = { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as const };

  if (inView) {
    return (
      <motion.div
        className={className}
        initial={hidden}
        whileInView={visible}
        viewport={{ once: true, amount: 0.12, margin: "0px 0px -40px 0px" }}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div className={className} initial={hidden} animate={visible} transition={transition}>
      {children}
    </motion.div>
  );
}
