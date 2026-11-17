import { Outlet } from "react-router-dom";

import Topbar from "./Topbar";

export default function Layout() {
  return (
    <div className="min-h-screen">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Topbar />
      <main id="main" className="shell py-8 lg:py-10">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="shell">
          <p>
            CutoverProof Phase 1. All analysis is local and model-scoped. Safe means
            no modeled attack path remains, not that the real AWS account is proven
            secure.
          </p>
        </div>
      </footer>
    </div>
  );
}
