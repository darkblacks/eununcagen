import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { auth } from "../firebase";
import { questions } from "../data/questions";
import type { Participant, RoomState } from "../types/game";
import type { RankingEntry } from "../types/ranking";
import {
  getRoom,
  goToRanking,
  initializeRoom,
  resetRoom,
  startRoomRound,
} from "../services/roomService";
import {
  clearAllAnswers,
  loadAllAnswers,
  loadAnswersByQuestion,
} from "../services/voteService";

type AnswerRow = {
  id: string;
  room_id: string;
  question_index: number;
  round_id: number;
  user_id: string;
  user_name: string;
  answer: boolean;
  created_at: number;
};

interface GameContextValue {
  roomState: RoomState;
  participants: Participant[];
  currentQuestionAnswers: AnswerRow[];
  allAnswers: AnswerRow[];
  ranking: RankingEntry[];
  totalEuJa: number;
  totalEuNunca: number;
  startGame: () => Promise<void>;
  nextQuestion: () => Promise<void>;
  resetGame: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);


export function GameProvider({ children }: { children: ReactNode }) {
  const [roomState, setRoomState] = useState<RoomState>({
  status: "waiting",
  currentQuestionIndex: 0,
  currentQuestionText: "",
  currentQuestionCategory: "",
  currentRoundId: 1,
  timeLeft: 10,
});

  const [currentQuestionAnswers, setCurrentQuestionAnswers] = useState<AnswerRow[]>([]);
  const [allAnswers, setAllAnswers] = useState<AnswerRow[]>([]);

  const participants = useMemo<Participant[]>(() => {
    const user = auth.currentUser;
    if (!user) return [];

    return [
      {
        uid: user.uid,
        name: user.email?.split("@")[0] ?? "Usuário",
        role: user.email === "admin@generation.com" ? "admin" : "student",
      },
    ];
  }, [auth.currentUser]);

  const ranking = useMemo<RankingEntry[]>(() => {
    const map = new Map<string, RankingEntry>();

    for (const row of allAnswers) {
      const existing = map.get(row.user_id) ?? {
        uid: row.user_id,
        name: row.user_name,
        totalEuJa: 0,
        totalEuNunca: 0,
      };

      if (row.answer === true) existing.totalEuJa += 1;
      if (row.answer === false) existing.totalEuNunca += 1;

      map.set(row.user_id, existing);
    }

    return Array.from(map.values()).sort(
      (a, b) => b.totalEuJa + b.totalEuNunca - (a.totalEuJa + a.totalEuNunca)
    );
  }, [allAnswers]);

  const totalEuJa = useMemo(
    () => allAnswers.filter((row) => row.answer === true).length,
    [allAnswers]
  );

  const totalEuNunca = useMemo(
    () => allAnswers.filter((row) => row.answer === false).length,
    [allAnswers]
  );

  async function refreshAll() {
    const room = await getRoom();

    setRoomState({
  status: room.status,
  currentQuestionIndex: room.current_question_index,
  currentQuestionText: room.current_question_text,
  currentQuestionCategory: room.current_question_category,
  currentRoundId: room.current_round_id,
  timeLeft: room.time_left,
});


    const [questionAnswers, everyAnswer] = await Promise.all([
      loadAnswersByQuestion(room.current_question_index),
      loadAllAnswers(),
    ]);

    setCurrentQuestionAnswers(questionAnswers);
    setAllAnswers(everyAnswer);
  }

  async function startGame() {
    await startRoomRound(0);
    await refreshAll();
  }

  async function nextQuestion() {
    const nextIndex = roomState.currentQuestionIndex + 1;

    if (nextIndex >= questions.length) {
      await goToRanking();
      await refreshAll();
      return;
    }

    await startRoomRound(nextIndex);
    await refreshAll();
  }

  async function resetGame() {
    await clearAllAnswers();
    await resetRoom();
    await refreshAll();
    alert("Jogo resetado com sucesso.");
  }

  useEffect(() => {
    initializeRoom().then(refreshAll).catch(console.error);

    const interval = setInterval(() => {
      refreshAll().catch(console.error);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <GameContext.Provider
      value={{
        roomState,
        participants,
        currentQuestionAnswers,
        allAnswers,
        ranking,
        totalEuJa,
        totalEuNunca,
        startGame,
        nextQuestion,
        resetGame,
        refreshAll,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGame deve ser usado dentro de GameProvider.");
  }

  return context;
}