import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { HomePage } from "@/pages/HomePage";
import { WorkPage } from "@/pages/WorkPage";
import { CasePage } from "@/pages/CasePage";
import { ApproachPage } from "@/pages/ApproachPage";
import { WritingPage } from "@/pages/WritingPage";
import { AboutPage } from "@/pages/AboutPage";
import { ProductLaunch } from "@/pages/ProductLaunch";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/work/:slug" element={<CasePage />} />
        <Route path="/approach" element={<ApproachPage />} />
        <Route path="/writing" element={<WritingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      <Route
        path="/agentfit"
        element={<ProductLaunch href="/apps/agentfit/" label="AgentFit" />}
      />
      <Route
        path="/opportunity-os"
        element={<ProductLaunch href="/apps/opportunity-os/" label="Opportunity OS" />}
      />
    </Routes>
  );
}
