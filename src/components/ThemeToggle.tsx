import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle" onClick={toggleTheme} type="button">
      {theme === "dark" ? "☀️ Tema claro" : "🌙 Tema escuro"}
    </button>
  );
}