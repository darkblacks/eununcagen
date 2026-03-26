import type { ReactNode } from "react";
import { logout } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

interface LayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function Layout({ title, subtitle, children }: LayoutProps) {
  const { appUser } = useAuth();

  return (
    <div className="app-shell">
      <div className="app-container">
        <header className="page-header card">
          <div className="layout-topbar">
            <div className="layout-brand">
              <img src={logo} alt="Generation" className="layout-logo" />
            </div>

            <div className="layout-user-area">
              {appUser && (
                <span className="layout-user-name">
                  {appUser.name}
                  {appUser.role === "admin" ? " (admin)" : ""}
                </span>
              )}

              <button className="logout-btn" onClick={logout} type="button">
                Sair
              </button>
            </div>
          </div>

          {title && <h1>{title}</h1>}
          {subtitle && <p className="subtitle">{subtitle}</p>}
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}