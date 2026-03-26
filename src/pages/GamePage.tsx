import Layout from "../components/Layout";
import VoteButtons from "../components/VoteButtons";
import AdminPanel from "./AdminPanel";
import QuestionCard from "../components/QuestionCard";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";

export default function GamePage() {
  const { appUser } = useAuth();
  const { roomState, currentRoundVotes, votesCount } = useGame();

  return (
    <Layout title="Rodada em andamento" subtitle="Vote antes da próxima pergunta.">
      {appUser?.role === "admin" && <AdminPanel />}

      <QuestionCard
        category={roomState.currentQuestionCategory}
        question={roomState.currentQuestionText}
        timeLeft={roomState.timeLeft}
      />

      <VoteButtons />

      <div className="card">
        <h3>Votos da rodada</h3>
        <p>Total: {votesCount}</p>

        <div className="list-grid">
          {currentRoundVotes.map((vote) => (
            <div key={vote.id} className="list-item">
              <strong>{vote.user_name}</strong>
              <span>{vote.vote}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}