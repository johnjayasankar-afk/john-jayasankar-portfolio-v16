import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

export function ProductLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  if (isExternalHref(href)) {
    return (
      <a
        className={className}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title="Opens in a new tab"
      >
        {children}
      </a>
    );
  }
  return (
    <Link className={className} to={href} reloadDocument>
      {children}
    </Link>
  );
}
