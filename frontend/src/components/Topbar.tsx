import { AlertTriangle, Check, ChevronDown, Clock3 } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import { useApi } from "../hooks/useApi";
import type { HealthResponse } from "../types/api";
import { NAV_ITEMS } from "./Sidebar";

export default function Topbar() {
  const { data: health, loading, error } = useApi<HealthResponse>("/health");
  const location = useLocation();
  const menuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (menuRef.current) {
      menuRef.current.open = false;
    }
  }, [location.pathname]);

  const healthState = loading ? "loading" : error ? "error" : "ok";
  const healthLabel = loading
    ? "Checking API"
    : error
      ? "API offline"
      : "API online";
  const healthShort = loading ? "Checking" : error ? "Offline" : "Online";
  const HealthIcon = loading ? Clock3 : error ? AlertTriangle : Check;

  return (
    <header className="site-header">
      <div className="shell flex h-16 items-center justify-between gap-6">
        <div className="flex min-w-0 items-center gap-8">
          <Link to="/" className="brand" aria-label="CutoverProof home">
            <span className="brand-mark" aria-hidden="true">
              CP
            </span>
            <span className="brand-word">CutoverProof</span>
          </Link>

          <nav className="site-nav flex items-center gap-1" aria-label="Primary">
            {NAV_ITEMS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link-active" : ""}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="tag tag--info hidden md:inline-flex">Local simulation</span>
          <span
            className="health-line topbar-health"
            data-state={healthState}
            title={error ?? health?.service}
            aria-label={healthLabel}
          >
            <HealthIcon className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sm:hidden">{healthShort}</span>
            <span className="hidden sm:inline">{healthLabel}</span>
          </span>

          <details className="mobile-menu" ref={menuRef}>
            <summary className="key">
              Menu
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </summary>
            <nav className="mobile-menu-panel" aria-label="Primary mobile">
              {NAV_ITEMS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "nav-link-active" : ""}`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <p className="mt-1 border-t border-rule px-2 pt-2 text-xs leading-5 text-muted">
                Local simulation only. No AWS calls.
              </p>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
