import { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../components/Layout";
import AdminPanel from "./AdminPanel";
import QuestionCard from "../components/QuestionCard";
import VoteButtons from "../components/VoteButtons";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";
import { loadAnswersByQuestion } from "../services/voteService";

type AnswerRow = {
  id: string;
  user_id: string;
  user_name?: string;
  question_index: number;
  round_id: number;
  answer: boolean;
  created_at: number;
};

type SidebarPerson = {
  uid: string;
  name: string;
  hasVoted: boolean;
  isMe: boolean;
};

const POLL_STEPS = [5000, 15000, 30000];

export default function GamePage() {
  const { appUser } = useAuth();
  const { roomState, participants } = useGame();

  const [liveAnswers, setLiveAnswers] = useState<AnswerRow[]>([]);
  const [loadingVotes, setLoadingVotes] = useState(true);
  const [pollLabel, setPollLabel] = useState("5s");

  const pollStepIndexRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const lastSignatureRef = useRef("");

  const votedUserIds = useMemo(() => {
    return new Set(liveAnswers.map((item) => item.user_id));
  }, [liveAnswers]);

  const sidebarPeople = useMemo<SidebarPerson[]>(() => {
    const map = new Map<string, SidebarPerson>();

    for (const participant of participants) {
      map.set(participant.uid, {
        uid: participant.uid,
        name: participant.name,
        hasVoted: votedUserIds.has(participant.uid),
        isMe: participant.uid === appUser?.uid,
      });
    }

    for (const answer of liveAnswers) {
      const existing = map.get(answer.user_id);

      if (existing) {
        existing.hasVoted = true;
      } else {
        map.set(answer.user_id, {
          uid: answer.user_id,
          name: answer.user_name ?? "Usuário",
          hasVoted: true,
          isMe: answer.user_id === appUser?.uid,
        });
      }
    }

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" })
    );
  }, [participants, liveAnswers, votedUserIds, appUser?.uid]);

  function buildSignature(data: AnswerRow[]) {
    return JSON.stringify(
      [...data]
        .map((item) => ({
          id: item.id,
          user_id: item.user_id,
          answer: item.answer,
          round_id: item.round_id,
          question_index: item.question_index,
        }))
        .sort((a, b) => a.id.localeCompare(b.id))
    );
  }

  async function fetchAnswersWithBackoff() {
    try {
      const data = ((await loadAnswersByQuestion(
        roomState.currentQuestionIndex
      )) ?? []) as AnswerRow[];

      const nextSignature = buildSignature(data);
      const changed = nextSignature !== lastSignatureRef.current;

      if (changed) {
        setLiveAnswers(data);
        lastSignatureRef.current = nextSignature;
        pollStepIndexRef.current = 0;
        setPollLabel("5s");
      } else {
        const nextStep = Math.min(
          pollStepIndexRef.current + 1,
          POLL_STEPS.length - 1
        );
        pollStepIndexRef.current = nextStep;
        setPollLabel(`${POLL_STEPS[nextStep] / 1000}s`);
      }
    } catch (error) {
      console.error("Erro ao buscar respostas:", error);

      const nextStep = Math.min(
        pollStepIndexRef.current + 1,
        POLL_STEPS.length - 1
      );
      pollStepIndexRef.current = nextStep;
      setPollLabel(`${POLL_STEPS[nextStep] / 1000}s`);
    } finally {
      setLoadingVotes(false);

      const nextDelay = POLL_STEPS[pollStepIndexRef.current];
      timerRef.current = window.setTimeout(() => {
        fetchAnswersWithBackoff();
      }, nextDelay);
    }
  }

  useEffect(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    setLoadingVotes(true);
    pollStepIndexRef.current = 0;
    setPollLabel("5s");
    lastSignatureRef.current = "";

    fetchAnswersWithBackoff();

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [roomState.currentQuestionIndex, roomState.currentRoundId]);

  return (
    <Layout title="" subtitle="">
      {appUser?.role === "admin" && <AdminPanel />}

      <div className="game-layout">
        <section className="game-main">
          <QuestionCard
            category={roomState.currentQuestionCategory}
            question={roomState.currentQuestionText}
            timeLeft={roomState.timeLeft}
            currentIndex={roomState.currentQuestionIndex + 1}
            totalQuestions={30}
          />

          <VoteButtons
            questionIndex={roomState.currentQuestionIndex}
            roundId={roomState.currentRoundId}
          />
        </section>

        <aside className="game-sidebar card">
          <div className="sidebar-header">
            <h3>Participantes online</h3>
            <span>{sidebarPeople.length} visíveis</span>
          </div>

          <div className="sidebar-sync-line">
            <span className={`sync-dot ${loadingVotes ? "loading" : ""}`} />
            {loadingVotes
              ? "Sincronizando votos..."
              : `Atualização automática: ${pollLabel}`}
          </div>

          <div className="participant-list">
            {sidebarPeople.map((person) => (
              <div
                key={person.uid}
                className={`participant-item ${person.isMe ? "me" : ""} ${
                  person.hasVoted ? "participant-done" : "participant-pending"
                }`}
              >
                <div className="participant-user">
                  <div className="participant-name-line">
                    <strong>{person.name}</strong>
                    {person.isMe && <span className="me-badge">me</span>}
                  </div>
                </div>

                <div
                  className={`participant-status ${
                    person.hasVoted ? "success" : "waiting"
                  }`}
                >
                  {person.hasVoted ? "Já votou" : "Ainda não votou"}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </Layout>
  );
}