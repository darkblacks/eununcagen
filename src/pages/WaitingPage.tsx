import Layout from "../components/Layout";
import AdminPanel from "./AdminPanel";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";

export default function WaitingPage() {
  const { appUser } = useAuth();
  const { participants = [] } = useGame();

  return (
    <Layout title="Esperando iniciar" subtitle="Aguarde o líder começar a rodada.">
      {appUser?.role === "admin" && <AdminPanel />}

      <div className="card waiting-box">
        <h2>Esperando iniciar</h2>
        <p>Assim que o admin iniciar, a pergunta aparecerá para todos por 10 segundos.</p>
      </div>

      <div className="card">
        <h3>Participantes</h3>
        <div className="list-grid">
          {participants.map((participant) => (
            <div key={participant.uid} className="list-item">
              <strong>{participant.name}</strong>
              <span>{participant.role === "admin" ? "Admin" : "Aluno"}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}