import { useState } from "react";
import type { FormEvent } from "react";
import { loginWithEmail } from "../services/authService";
import ThemeToggle from "../components/ThemeToggle";
import generationLogo from "../assets/generation-logo.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await loginWithEmail(email, password);
    } catch (err) {
      console.error(err);
      setError("Não foi possível entrar. Verifique email e senha.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <section className="login-brand-panel card">
  <div className="brand-panel-center">
    <div className="logo-box">
      <img src={generationLogo} alt="Generation Brasil" />
    </div>

    <div className="brand-copy">
      <h1>Eu Nunca</h1>
      <p>
        Uma brincadeira leve para a turma interagir, votar em tempo real
        e acompanhar o ranking final de forma simples.
      </p>

      <div className="brand-tags">
        <span className="brand-tag">Tempo real</span>
        <span className="brand-tag">Ranking final</span>
        <span className="brand-tag">Tema claro/escuro</span>
      </div>
    </div>
  </div>

  <div className="form-footer-note">
    Projeto interno da turma • acesso com contas previamente cadastradas
  </div>
</section>

        <section className="login-form-panel card">
          <div className="login-form-top">
            <div>
              <p className="mini-label">Acesso</p>
              <h2>Entrar no sistema</h2>
              <p>Use o email e a senha já criados para sua turma.</p>
            </div>

            <ThemeToggle />
          </div>

          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              <span>Email</span>
              <input
                type="email"
                placeholder="seuemail@generation.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label>
              <span>Senha</span>
              <input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="primary-btn" disabled={submitting}>
              {submitting ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="form-footer-note">
            Não há criação de conta nesta tela. Apenas usuários já cadastrados
            podem acessar.
          </p>
          <p className="form-footer-note">
            © 2026 Generation Brasil. Victor Ferreira,Lais Sousa e Gabriel.
          </p>
        </section>
      </div>
    </div>
  );
}