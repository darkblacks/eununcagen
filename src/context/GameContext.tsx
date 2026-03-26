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
  clearAllVotes,
  loadAllVotes,
  loadVotesByRound,
} from "../services/voteService";

type VoteRow = {
  id: string;
  room_id: string;
  round_id: number;
  user_id: string;
  user_name: string;
  vote: "eu-ja" | "eu-nunca";
  created_at: number;
};

interface GameContextValue {
  roomState: RoomState;
  participants: Participant[];
  ranking: RankingEntry[];
  currentRoundVotes: VoteRow[];
  votesCount: number;
  totalEuJa: number;
  totalEuNunca: number;
  startGame: () => Promise<void>;
  nextQuestion: () => Promise<void>;
  finishRoundNow: () => Promise<void>;
  resetGame: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [roomState, setRoomState] = useState<RoomState>({
    status: "waiting",
    currentQuestionIndex: 0,
    currentQuestionText: questions[0]?.text ?? "",
    currentQuestionCategory: questions[0]?.category ?? "",
    timeLeft: 10,
    currentRoundId: 1,
  });

  const [currentRoundVotes, setCurrentRoundVotes] = useState<VoteRow[]>([]);
  const [allVotes, setAllVotes] = useState<VoteRow[]>([]);

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

    for (const vote of allVotes) {
      const existing = map.get(vote.user_id) ?? {
        uid: vote.user_id,
        name: vote.user_name,
        totalEuJa: 0,
        totalEuNunca: 0,
      };

      if (vote.vote === "eu-ja") existing.totalEuJa += 1;
      if (vote.vote === "eu-nunca") existing.totalEuNunca += 1;

      map.set(vote.user_id, existing);
    }

    return Array.from(map.values()).sort(
      (a, b) =>
        b.totalEuJa + b.totalEuNunca - (a.totalEuJa + a.totalEuNunca)
    );
  }, [allVotes]);

  const totalEuJa = useMemo(
    () => allVotes.filter((vote) => vote.vote === "eu-ja").length,
    [allVotes]
  );

  const totalEuNunca = useMemo(
    () => allVotes.filter((vote) => vote.vote === "eu-nunca").length,
    [allVotes]
  );

  async function refreshRoom() {
    const room = await getRoom();

    setRoomState({
      status: room.status,
      currentQuestionIndex: room.current_question_index,
      currentQuestionText: room.current_question_text,
      currentQuestionCategory: room.current_question_category,
      timeLeft: room.time_left,
      currentRoundId: room.current_round_id,
    });
  }

  async function refreshVotes(roomRoundId?: number) {
    const roundId = roomRoundId ?? roomState.currentRoundId;
    const [roundVotes, votes] = await Promise.all([
      loadVotesByRound(roundId),
      loadAllVotes(),
    ]);

    setCurrentRoundVotes(roundVotes);
    setAllVotes(votes);
  }

  async function refreshAll() {
    const room = await getRoom();

    setRoomState({
      status: room.status,
      currentQuestionIndex: room.current_question_index,
      currentQuestionText: room.current_question_text,
      currentQuestionCategory: room.current_question_category,
      timeLeft: room.time_left,
      currentRoundId: room.current_round_id,
    });

    await refreshVotes(room.current_round_id);
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

  async function finishRoundNow() {
    await nextQuestion();
  }

  async function resetGame() {
    await clearAllVotes();
    await resetRoom();
    await refreshAll();
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
        ranking,
        currentRoundVotes,
        votesCount: currentRoundVotes.length,
        totalEuJa,
        totalEuNunca,
        startGame,
        nextQuestion,
        finishRoundNow,
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