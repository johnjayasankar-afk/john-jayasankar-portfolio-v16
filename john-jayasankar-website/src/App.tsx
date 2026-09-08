import { lazy, Suspense, useLayoutEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RouteFallback } from "@/components/RouteFallback";
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
const SimplePage = lazy(() => import("@/pages/SimplePage").then((m) => ({ default: m.SimplePage })));

const SITE_FONTS = [
  "/fonts/schibsted-grotesk-latin-400.woff2",
  "/fonts/schibsted-grotesk-latin-500.woff2",
  "/fonts/ibm-plex-mono-latin-400.woff2",
  "/fonts/ibm-plex-mono-latin-500.woff2",
] as const;

function ensureSiteFontPreloads() {
  for (const href of SITE_FONTS) {
    if (document.querySelector(`link[rel="preload"][as="font"][href="${href}"]`)) continue;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "font";
    link.type = "font/woff2";
    link.href = href;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  }
}

export default function App() {
  const { pathname, search, hash } = useLocation();
  const path = cleanPath(pathname);

  useLayoutEffect(() => {
    const simple = path === "/simple";
    document.documentElement.classList.toggle("simple-mode", simple);
    const theme = document.querySelector('meta[name="theme-color"]');
    theme?.setAttribute("content", simple ? "#ffffff" : "#09080c");
    if (!simple) ensureSiteFontPreloads();
  }, [path]);

  if (pathname.length > 1 && pathname.endsWith("/")) {
    return <Navigate to={`${path}${search}${hash}`} replace />;
  }

  return (
    <Routes>
      <Route
        path="/simple"
        element={
          <ErrorBoundary key={path}>
            <Suspense fallback={<RouteFallback label="Loading simple page" />}>
              <SimplePage />
            </Suspense>
          </ErrorBoundary>
        }
      />
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
