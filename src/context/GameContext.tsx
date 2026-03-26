import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { auth } from "../firebase";
import { questions } from "../data/questions";
import type { Participant, RoomState } from "../types/game";
import type { RankingEntry } from "../types/ranking";
import { getRoom, initializeRoom, resetRoom, setRoomRanking, startRoomRound } from "../services/roomService";
import { loadVotesByRound } from "../services/voteService";

interface GameContextValue {
  roomState: RoomState;
  participants: Participant[];
  rankingJa: RankingEntry[];
  rankingNunca: RankingEntry[];
  votedUserIds: string[];
  votedNames: string[];
  votesCount: number;
  startGame: () => Promise<void>;
  nextQuestion: () => Promise<void>;
  resetGame: () => Promise<void>;
  finishRoundNow: () => Promise<void>;
  refreshRoundData: () => Promise<void>;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

const baseParticipants: Participant[] = [
  { uid: "admin", name: "Admin", role: "admin" },
];

export function GameProvider({ children }: { children: ReactNode }) {
  const [roomState, setRoomState] = useState<RoomState>({
    status: "waiting",
    currentQuestionIndex: 0,
    currentQuestionText: questions[0]?.text ?? "",
    currentQuestionCategory: questions[0]?.category ?? "",
    timeLeft: 10,
    currentRoundId: 1,
  });

  const [votedUserIds, setVotedUserIds] = useState<string[]>([]);
  const [votedNames, setVotedNames] = useState<string[]>([]);

  const participants = useMemo<Participant[]>(() => {
    const currentUser = auth.currentUser;
    const dynamicUser =
      currentUser
        ? [{
            uid: currentUser.uid,
            name: currentUser.email?.split("@")[0] ?? "Usuário",
            role: currentUser.email === "admin@generation.com" ? "admin" as const : "student" as const,
          }]
        : [];

    const map = new Map<string, Participant>();
    [...baseParticipants, ...dynamicUser].forEach((p) => map.set(p.uid, p));
    return Array.from(map.values());
  }, [auth.currentUser]);

  const rankingJa = useMemo<RankingEntry[]>(() => [], []);
  const rankingNunca = useMemo<RankingEntry[]>(() => [], []);

  async function refreshRoom() {
    try {
      const room = await getRoom();

      setRoomState({
        status: room.status,
        currentQuestionIndex: room.current_question_index,
        currentQuestionText: room.current_question_text,
        currentQuestionCategory: room.current_question_category,
        timeLeft: room.time_left,
        currentRoundId: room.current_round_id,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function refreshRoundData() {
    try {
      const votes = await loadVotesByRound(roomState.currentRoundId);
      setVotedUserIds(votes.map((vote) => vote.user_id));
      setVotedNames(votes.map((vote) => vote.user_name || vote.user_id));
    } catch (error) {
      console.error(error);
    }
  }

  async function startGame() {
    await startRoomRound(0);
    await refreshRoom();
    await refreshRoundData();
  }

  async function nextQuestion() {
    const nextIndex = roomState.currentQuestionIndex + 1;

    if (nextIndex >= questions.length) {
      await setRoomRanking();
      await refreshRoom();
      await refreshRoundData();
      return;
    }

    await startRoomRound(nextIndex);
    await refreshRoom();
    await refreshRoundData();
  }

  async function finishRoundNow() {
    await nextQuestion();
  }

  async function handleResetGame() {
    await resetRoom();
    setVotedUserIds([]);
    setVotedNames([]);
    await refreshRoom();
  }

  useEffect(() => {
    initializeRoom().then(refreshRoom).catch(console.error);
  }, []);

  useEffect(() => {
    refreshRoundData().catch(console.error);

    const interval = setInterval(() => {
      refreshRoom().catch(console.error);
      refreshRoundData().catch(console.error);
    }, 2000);

    return () => clearInterval(interval);
  }, [roomState.currentRoundId]);

  return (
    <GameContext.Provider
      value={{
        roomState,
        participants,
        rankingJa,
        rankingNunca,
        votedUserIds,
        votedNames,
        votesCount: votedUserIds.length,
        startGame,
        nextQuestion,
        resetGame: handleResetGame,
        finishRoundNow,
        refreshRoundData,
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