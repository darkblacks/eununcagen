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
      <header className="app-header">
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {appUser && (
            <span>
              {appUser.name} {appUser.role === "admin" ? "(admin)" : ""}
            </span>
          )}

          <button className="secondary-btn" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}