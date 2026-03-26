import { FormEvent, useState } from "react";
import Layout from "../components/Layout";
import { loginWithEmail } from "../services/authService";
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
<Layout title="Eu Nunca" subtitle="Entre com a conta já criada para a
turma.">
<div className="card auth-card">
<form className="form-grid" onSubmit={handleSubmit}>
<label>
<span>Email</span>
<input
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
placeholder="seuemail@exemplo.com"
required
/>
</label>
<label>
<span>Senha</span>
<input
type="password"
value={password}
onChange={(e) => setPassword(e.target.value)}
placeholder="********"
required
/>
</label>
{error && <p className="error-text">{error}</p>}
<button className="primary-btn" type="submit" disabled={submitting}
>
{submitting ? "Entrando..." : "Entrar"}
</button>
</form>
</div>
</Layout>
);
}
