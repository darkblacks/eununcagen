import { voteOnCurrentQuestion } from "../services/voteService";
export default function VoteButtons() {
async function handleVote(vote: "eu-ja" | "eu-nunca") {
try {
await voteOnCurrentQuestion(vote);
} catch (error) {
console.error(error);
alert("Não foi possível registrar seu voto.");
}
}
return (
<div className="vote-grid">
<button className="vote-btn never-btn" onClick={() => handleVote("eununca")}>
Eu nunca
</button>
<button className="vote-btn already-btn" onClick={() => handleVote("euja")}>
Eu já
</button>
</div>
);
}
