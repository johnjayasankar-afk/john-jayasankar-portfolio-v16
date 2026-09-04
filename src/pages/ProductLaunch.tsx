import { useEffect } from "react";
import { Seo } from "@/components/Seo";

export function ProductLaunch({ href, label }: { href: string; label: string }) {
  useEffect(() => {
    window.location.replace(href);
  }, [href]);

  return (
    <div className="launch-shell">
      <Seo />
      <p className="sys">Independent product</p>
      <h1 className="display">{label}</h1>
      <p className="lede">
        Opening the live product.{" "}
        <a className="text-link" href={href}>
          Continue →
        </a>
      </p>
    </div>
  );
}
