import { useEffect, useRef, useState } from "react";
import { ProductLink } from "@/components/ProductLink";

const PREVIEW_STILLS: Record<string, string> = {
  ridelens: "/previews/ridelens.jpg",
  raildrop: "/previews/raildrop.jpg",
};

/**
 * In-page preview of a live web product.
 * Distinguishes a working embed from a mock: labeled, optional, never required to read the case.
 * Callers should only pass URLs known not to send X-Frame-Options: DENY.
 * Static stills act as poster + fallback when embeds fail in locked-down browsers.
 */
export function ProductPreview({
  href,
  label,
  slug,
}: {
  href: string;
  label: string;
  slug?: string;
}) {
  const [status, setStatus] = useState<"loading" | "ready" | "blocked">("loading");
  const frameRef = useRef<HTMLIFrameElement>(null);
  const still = slug ? PREVIEW_STILLS[slug] : undefined;

  useEffect(() => {
    setStatus("loading");
    const timer = window.setTimeout(() => {
 // X-Frame blocks often leave a blank frame without firing error - offer fallback.
      setStatus((s) => (s === "loading" ? "ready" : s));
    }, 3200);
    return () => window.clearTimeout(timer);
  }, [href]);

  return (
    <figure className="product-preview">
      <figcaption className="sys">
        Live product preview · working app, not a mock
        <span aria-hidden="true"> · </span>
        scroll inside the frame to explore
      </figcaption>
      <div className={`product-preview-frame${status === "blocked" ? " is-blocked" : ""}`}>
        {status === "blocked" ? (
          <div className="product-preview-fallback">
            {still ? (
              <img
                className="product-preview-still"
                src={still}
                alt=""
                width={1280}
                height={800}
                decoding="async"
              />
            ) : null}
            <div className="product-preview-fallback-copy">
              <p>
                {still
                  ? "Embed blocked in this browser. The still shows the live UI; open the product to use it."
                  : "This product could not be embedded here."}
              </p>
              <ProductLink className="btn btn-ink" href={href}>
                {label} ↗
              </ProductLink>
            </div>
          </div>
        ) : (
          <>
            {still && status === "loading" ? (
              <img
                className="product-preview-still is-poster"
                src={still}
                alt=""
                width={1280}
                height={800}
                decoding="async"
              />
            ) : null}
            <iframe
              ref={frameRef}
              title={`${label} live preview`}
              src={href}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              onLoad={() => setStatus("ready")}
              onError={() => setStatus("blocked")}
            />
          </>
        )}
        {status === "loading" ? (
          <p className="product-preview-loading sys" aria-live="polite">
            Loading live preview…
          </p>
        ) : null}
      </div>
      <p className="product-preview-note">
 If the frame stays blank, open the product in a new tab - some browsers block embeds.
      </p>
    </figure>
  );
}

/** Web apps that allow framing today. Daylight is macOS + frame-ancestors none. */
export function canEmbedProduct(slug: string): boolean {
  return slug === "ridelens" || slug === "raildrop";
}
