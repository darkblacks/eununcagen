import { useGame } from "../context/GameContext";
import { saveAnswer } from "../services/voteService";

export default function VoteButtons() {
  const { roomState, refreshAll } = useGame();

  async function handleAnswer(answer: boolean) {
    try {
      await saveAnswer(
        roomState.currentQuestionIndex,
        roomState.currentRoundId,
        answer
      );
      await refreshAll();
    } catch (error) {
      console.error(error);
      alert("Erro ao responder.");
    }
  }

  return (
    <div className="vote-buttons">
      <button className="vote-button never" onClick={() => handleAnswer(false)}>
        Eu Nunca
      </button>

      <button className="vote-button ever" onClick={() => handleAnswer(true)}>
        Eu Já
      </button>
    </div>
  );
}