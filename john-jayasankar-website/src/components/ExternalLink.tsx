import type { ReactNode } from "react";

/** External anchor. Prefer aria-label for icon-only links. */
export function ExternalLink({
  href,
  className,
  children,
  title = "Opens in a new tab",
  mark = false,
  "aria-label": ariaLabel,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  title?: string;
  /** Append a quiet ↗ for exit affordance (Résumé / LinkedIn / Substack). */
  mark?: boolean;
  "aria-label"?: string;
}) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      aria-label={ariaLabel}
    >
      {children}
      {mark ? (
        <span className="ext-mark" aria-hidden="true">
          {" "}
          ↗
        </span>
      ) : null}
    </a>
  );
}
