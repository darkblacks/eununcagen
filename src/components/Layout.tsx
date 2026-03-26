import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/authService";

type LayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function Layout({ title, subtitle, children }: LayoutProps) {
  const { appUser } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error(error);
      alert("Não foi possível sair.");
    }
  }

  return (
    <div className="app-shell">
      <div className="app-container">
        <header className="page-header card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              alignItems: "start",
            }}
          >
            <div>
              <p className="eyebrow">Generation</p>
              <h1>{title}</h1>
              {subtitle && <p className="subtitle">{subtitle}</p>}
            </div>

            {appUser && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  alignItems: "flex-end",
                }}
              >
                <span style={{ fontSize: 14 }}>
                  {appUser.name} {appUser.role === "admin" ? "(admin)" : ""}
                </span>
                <button className="secondary-btn" onClick={handleLogout}>
                  Sair
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}