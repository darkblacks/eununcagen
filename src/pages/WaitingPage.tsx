import Layout from "../components/Layout";
import AdminPanel from "./AdminPanel";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";
import { useMemo } from "react";

export default function WaitingPage() {
  const { appUser } = useAuth();
  const { participants } = useGame();

  const sortedParticipants = useMemo(() => {
    return [...participants].sort((a, b) =>
      a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" })
    );
  }, [participants]);

  return (
    <Layout title="" subtitle="">
      {appUser?.role === "admin" && <AdminPanel />}

      <div className="waiting-highlight card">
        <div className="waiting-icon">⏳</div>
        <div className="waiting-copy">
          <h2>Partida ainda não iniciada</h2>
          <p>Assim que o admin iniciar, a pergunta aparecerá para todos.</p>
        </div>
      </div>

      <div className="card">
        <div className="online-header">
          <h3>Participantes online</h3>
          <span>{sortedParticipants.length} online</span>
        </div>

        <div className="list-grid online-grid">
          {sortedParticipants.map((participant) => {
            const isMe = participant.uid === appUser?.uid;

            return (
              <div
                key={participant.uid}
                className={`list-item online-person ${isMe ? "me" : ""}`}
              >
                <div className="online-person-main">
                  <strong>{participant.name}</strong>
                  {isMe && <span className="me-badge">me</span>}
                </div>

                <div className="online-person-sub">
                  <span className="online-dot" />
                  <span>online</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}