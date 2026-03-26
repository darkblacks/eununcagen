import Layout from "../components/Layout";
import AdminPanel from "./AdminPanel";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";

export default function WaitingPage() {
  const { appUser } = useAuth();
  const { participants } = useGame();

  return (
    <Layout title="" subtitle="">
      {appUser?.role === "admin" && <AdminPanel />}

      <div className="waiting-highlight card">
        <div className="waiting-icon">⏳</div>
        <div className="waiting-copy">
          <h2>Partida ainda não iniciada</h2>
          <p>
            Assim que o admin iniciar, a pergunta aparecerá para todos.
          </p>
        </div>
      </div>

      <div className="card">
        <h3>Participantes</h3>
        <div className="list-grid">
          {participants.map((participant) => (
            <div key={participant.uid} className="list-item">
              <strong>{participant.name}</strong>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}