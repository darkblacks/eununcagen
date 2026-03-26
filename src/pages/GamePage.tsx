import Layout from "../components/Layout";
import AdminPanel from "./AdminPanel";
import QuestionCard from "../components/QuestionCard";
import VoteButtons from "../components/VoteButtons";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";

export default function GamePage() {
  const { appUser } = useAuth();
  const { roomState, votesCount, votedNames } = useGame();

  return (
    <Layout title="Rodada em andamento" subtitle="Vote antes do tempo acabar.">
      {appUser?.role === "admin" && <AdminPanel />}

      <QuestionCard
        category={roomState.currentQuestionCategory}
        question={roomState.currentQuestionText}
        timeLeft={roomState.timeLeft}
      />

      <VoteButtons />

      <div className="card">
        <h3>Quem já votou</h3>
        <p>Total de votos: {votesCount}</p>

        <div className="list-grid">
          {votedNames.length === 0 ? (
            <div className="list-item">
              <strong>Ninguém votou ainda</strong>
              <span>0</span>
            </div>
          ) : (
            votedNames.map((name, index) => (
              <div key={`${name}-${index}`} className="list-item">
                <strong>{name}</strong>
                <span>votou</span>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}