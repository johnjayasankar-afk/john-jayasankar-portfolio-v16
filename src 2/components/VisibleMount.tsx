import { useEffect, useRef, useState, type ReactNode } from "react";

export function VisibleMount({
  children,
  eager = false,
  rootMargin = "280px 0px",
}: {
  children: ReactNode;
  eager?: boolean;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(eager);

  useEffect(() => {
    if (show) return;
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShow(true);
      },
      { rootMargin },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [show, rootMargin]);

  return (
    <div ref={ref} className="fill-stage">
      {show ? children : null}
    </div>
  );
}
