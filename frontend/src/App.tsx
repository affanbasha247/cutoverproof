import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import ConfigurationPage from "./pages/ConfigurationPage";
import OverviewPage from "./pages/OverviewPage";
import PlannerPage from "./pages/PlannerPage";
import ReportsPage from "./pages/ReportsPage";
import SimulationPage from "./pages/SimulationPage";
import VerificationPage from "./pages/VerificationPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/configuration" element={<ConfigurationPage />} />
        <Route path="/simulation" element={<SimulationPage />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
