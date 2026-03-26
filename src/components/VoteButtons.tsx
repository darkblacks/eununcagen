import { useEffect, useState } from "react";
import { saveAnswer } from "../services/voteService";

interface VoteButtonsProps {
  questionIndex: number;
  roundId: number;
}

export default function VoteButtons({
  questionIndex,
  roundId,
}: VoteButtonsProps) {
  const [selectedVote, setSelectedVote] = useState<"eu-ja" | "eu-nunca" | null>(null);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const hasVoted = selectedVote !== null;

  useEffect(() => {
    setSelectedVote(null);
    setFeedback("");
    setSubmitting(false);
  }, [questionIndex, roundId]);

  async function handleVote(vote: "eu-ja" | "eu-nunca") {
    if (hasVoted || submitting) return;

    try {
      setSubmitting(true);
      const answer = vote === "eu-ja";

      await saveAnswer(questionIndex, roundId, answer);

      setSelectedVote(vote);
      setFeedback("Voto concluído com sucesso.");
    } catch (error) {
      console.error(error);
      setFeedback("Não foi possível registrar seu voto.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="vote-section">
      <div className="vote-grid-modern">
        <button
          type="button"
          className={`vote-card vote-yes ${selectedVote === "eu-ja" ? "selected" : ""} ${hasVoted ? "disabled-vote" : ""}`}
          onClick={() => handleVote("eu-ja")}
          disabled={hasVoted || submitting}
        >
          <div className={`vote-icon ${submitting && !hasVoted ? "spinning" : ""}`}>
            {submitting && !hasVoted ? "↻" : "✓"}
          </div>
          <span>{selectedVote === "eu-ja" ? "VOTO ENVIADO" : "EU JÁ"}</span>
        </button>

        <button
          type="button"
          className={`vote-card vote-never ${selectedVote === "eu-nunca" ? "selected" : ""} ${hasVoted ? "disabled-vote" : ""}`}
          onClick={() => handleVote("eu-nunca")}
          disabled={hasVoted || submitting}
        >
          <div className={`vote-icon ${submitting && !hasVoted ? "spinning" : ""}`}>
            {submitting && !hasVoted ? "↻" : "✕"}
          </div>
          <span>{selectedVote === "eu-nunca" ? "VOTO ENVIADO" : "EU NUNCA"}</span>
        </button>
      </div>

      {feedback && <p className="vote-feedback">{feedback}</p>}
    </div>
  );
}