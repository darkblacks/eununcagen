import Layout from "../components/Layout";
import VoteButtons from "../components/VoteButtons";
import AdminPanel from "./AdminPanel";
import QuestionCard from "../components/QuestionCard";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";

export default function GamePage() {
  const { appUser } = useAuth();
  const { currentQuestionAnswers, roomState } = useGame();

  return (
    <Layout title="Rodada em andamento" subtitle="Responda a pergunta atual.">
      {appUser?.role === "admin" && <AdminPanel />}

      <QuestionCard
        category={roomState.currentQuestionCategory}
        question={roomState.currentQuestionText}
        timeLeft={10}
      />

      <VoteButtons />

      <div className="card">
        <h3>Quem já respondeu nesta pergunta</h3>
        <p>Total: {currentQuestionAnswers.length}</p>

        <div className="list-grid">
          {currentQuestionAnswers.length === 0 ? (
            <div className="list-item">
              <strong>Ninguém respondeu ainda</strong>
              <span>0</span>
            </div>
          ) : (
            currentQuestionAnswers.map((row) => (
              <div key={row.id} className="list-item">
                <strong>{row.user_name}</strong>
                <span>{row.answer ? "Eu Já" : "Eu Nunca"}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}