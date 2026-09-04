import { lazy } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProductLaunch } from "@/pages/ProductLaunch";
import { liveProducts } from "@/data/content";
import { cleanPath } from "@/lib/site";

const HomePage = lazy(() => import("@/pages/HomePage").then((m) => ({ default: m.HomePage })));
const WorkPage = lazy(() => import("@/pages/WorkPage").then((m) => ({ default: m.WorkPage })));
const CasePage = lazy(() => import("@/pages/CasePage").then((m) => ({ default: m.CasePage })));
const ApproachPage = lazy(() => import("@/pages/ApproachPage").then((m) => ({ default: m.ApproachPage })));
const WritingPage = lazy(() => import("@/pages/WritingPage").then((m) => ({ default: m.WritingPage })));
const AboutPage = lazy(() => import("@/pages/AboutPage").then((m) => ({ default: m.AboutPage })));

export default function App() {
  const { pathname, search, hash } = useLocation();
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return <Navigate to={`${cleanPath(pathname)}${search}${hash}`} replace />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/work/:slug" element={<CasePage />} />
        <Route path="/approach" element={<ApproachPage />} />
        <Route path="/writing" element={<WritingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="/ridelens" element={<ProductLaunch href={liveProducts.ridelens} label="RideLens" />} />
      <Route path="/raildrop" element={<ProductLaunch href={liveProducts.raildrop} label="RailDrop" />} />
      <Route path="/agentfit" element={<ProductLaunch href={liveProducts.ridelens} label="RideLens" />} />
      <Route path="/opportunity-os" element={<ProductLaunch href={liveProducts.raildrop} label="RailDrop" />} />
    </Routes>
  );
}
