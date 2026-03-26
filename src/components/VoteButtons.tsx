import { useGame } from "../context/GameContext";
import { voteOnCurrentQuestion } from "../services/voteService";

export default function VoteButtons() {
  const { roomState, votedUserIds, refreshRoundData } = useGame();

  async function handleVote(vote: "eu-ja" | "eu-nunca") {
    try {
      await voteOnCurrentQuestion(vote, roomState.currentRoundId);
      await refreshRoundData();
      alert("Voto registrado!");
    } catch (error) {
      console.error(error);
      alert("Não foi possível registrar seu voto.");
    }
  }

  return (
    <div className="vote-grid">
      <button className="vote-btn never-btn" onClick={() => handleVote("eu-nunca")}>
        Eu nunca
      </button>

      <button className="vote-btn already-btn" onClick={() => handleVote("eu-ja")}>
        Eu já
      </button>

      <div className="card" style={{ gridColumn: "1 / -1" }}>
        <strong>Votos na rodada:</strong> {votedUserIds.length}
      </div>
    </div>
  );
}