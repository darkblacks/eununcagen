import { useEffect, useState } from "react";
import {
  loadMyAnswerForQuestion,
  saveAnswer,
} from "../services/voteService";

interface VoteButtonsProps {
  questionIndex: number;
  roundId: number;
}

export default function VoteButtons({
  questionIndex,
  roundId,
}: VoteButtonsProps) {
  const [selectedVote, setSelectedVote] = useState<"eu-ja" | "eu-nunca" | null>(
    null
  );
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [checkingExistingVote, setCheckingExistingVote] = useState(true);

  const hasVoted = selectedVote !== null;

  useEffect(() => {
    let cancelled = false;

    setSelectedVote(null);
    setFeedback("");
    setSubmitting(false);
    setCheckingExistingVote(true);

    loadMyAnswerForQuestion(questionIndex)
      .then((row) => {
        if (cancelled) return;

        if (row) {
          setSelectedVote(row.answer ? "eu-ja" : "eu-nunca");
          setFeedback("Você já respondeu esta pergunta.");
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        if (!cancelled) {
          setCheckingExistingVote(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [questionIndex, roundId]);

  async function handleVote(vote: "eu-ja" | "eu-nunca") {
    if (hasVoted || submitting || checkingExistingVote) return;

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
          className={`vote-card vote-yes ${
            selectedVote === "eu-ja" ? "selected" : ""
          } ${hasVoted ? "disabled-vote" : ""}`}
          onClick={() => handleVote("eu-ja")}
          disabled={hasVoted || submitting || checkingExistingVote}
        >
          <div
            className={`vote-icon ${
              submitting && !hasVoted ? "spinning" : ""
            }`}
          >
            {submitting && !hasVoted ? "↻" : "✓"}
          </div>
          <span>{selectedVote === "eu-ja" ? "VOTO ENVIADO" : "EU JÁ"}</span>
        </button>

        <button
          type="button"
          className={`vote-card vote-never ${
            selectedVote === "eu-nunca" ? "selected" : ""
          } ${hasVoted ? "disabled-vote" : ""}`}
          onClick={() => handleVote("eu-nunca")}
          disabled={hasVoted || submitting || checkingExistingVote}
        >
          <div
            className={`vote-icon ${
              submitting && !hasVoted ? "spinning" : ""
            }`}
          >
            {submitting && !hasVoted ? "↻" : "✕"}
          </div>
          <span>
            {selectedVote === "eu-nunca" ? "VOTO ENVIADO" : "EU NUNCA"}
          </span>
        </button>
      </div>

      {checkingExistingVote && (
        <p className="vote-feedback">Verificando seu voto...</p>
      )}

      {feedback && !checkingExistingVote && (
        <p className="vote-feedback">{feedback}</p>
      )}
    </div>
  );
}