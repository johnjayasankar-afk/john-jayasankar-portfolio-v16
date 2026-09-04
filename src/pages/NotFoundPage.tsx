import { Link } from "react-router-dom";
import { SiteFooter } from "@/components/Layout";
import { ProductLink } from "@/components/ProductLink";
import { liveProducts } from "@/data/content";

export function NotFoundPage() {
  return (
    <div className="sheet page">
      <section className="section">
        <div className="wrap-wide page-hero">
          <p className="sys">404</p>
          <h1 className="display">This page is not in the system.</h1>
          <p className="lede">
            The URL does not match a case, essay, or live product. The work is still here — just
            not at this address.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-ink" to="/">
              Home
            </Link>
            <Link className="btn btn-line" to="/work">
              Selected systems
            </Link>
            <ProductLink className="btn btn-line" href={liveProducts.ridelens}>
              RideLens ↗
            </ProductLink>
            <ProductLink className="btn btn-line" href={liveProducts.raildrop}>
              RailDrop ↗
            </ProductLink>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
