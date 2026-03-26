import { voteOnCurrentQuestion } from "../services/voteService";

export default function VoteButtons() {
  async function handleVote(vote: "eu-ja" | "eu-nunca") {
    try {
      await voteOnCurrentQuestion(vote);
      alert("Voto enviado!");
    } catch (error) {
      console.error(error);
      alert("Erro ao votar.");
    }
  }

  return (
    <div className="vote-buttons">
      <button className="vote-button never" onClick={() => handleVote("eu-nunca")}>
        Eu Nunca
      </button>
      <button className="vote-button ever" onClick={() => handleVote("eu-ja")}>
        Eu Já
      </button>
    </div>
  );
}