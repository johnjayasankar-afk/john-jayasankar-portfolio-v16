import { useEffect } from "react";

export function ProductLaunch({ href, label }: { href: string; label: string }) {
  useEffect(() => {
    window.location.replace(href);
  }, [href]);

  return (
    <div className="sheet page">
      <section className="section">
        <div className="wrap-wide page-hero">
          <p className="sys">Independent product</p>
          <h1 className="display">{label}</h1>
          <p className="lede">
            Opening the live product.{" "}
            <a className="text-link" href={href}>
              Continue →
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
