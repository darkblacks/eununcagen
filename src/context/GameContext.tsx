import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { questions } from "../data/questions";
import type { Participant, RoomState } from "../types/game";
import type { RankingEntry } from "../types/ranking";

interface GameContextValue {
  roomState: RoomState;
  participants: Participant[];
  rankingJa: RankingEntry[];
  rankingNunca: RankingEntry[];
  startGame: () => void;
  goToWaiting: () => void;
  resetGame: () => void;
  finishRoundNow: () => void;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

const mockParticipants: Participant[] = [
  { uid: "1", name: "Admin", role: "admin" },
  { uid: "2", name: "Ana", role: "student" },
  { uid: "3", name: "Bruno", role: "student" },
  { uid: "4", name: "Carol", role: "student" },
];

export function GameProvider({ children }: { children: ReactNode }) {
  const [roomState, setRoomState] = useState<RoomState>({
    status: "waiting",
    currentQuestionIndex: 0,
    currentQuestionText: questions[0]?.text ?? "",
    currentQuestionCategory: questions[0]?.category ?? "",
    timeLeft: 10,
  });

  const rankingJa = useMemo<RankingEntry[]>(
    () => [
      { uid: "2", name: "Ana", total: 5 },
      { uid: "3", name: "Bruno", total: 4 },
    ],
    []
  );

  const rankingNunca = useMemo<RankingEntry[]>(
    () => [
      { uid: "4", name: "Carol", total: 6 },
      { uid: "2", name: "Ana", total: 3 },
    ],
    []
  );

  function startGame() {
    setRoomState({
      status: "playing",
      currentQuestionIndex: 0,
      currentQuestionText: questions[0]?.text ?? "",
      currentQuestionCategory: questions[0]?.category ?? "",
      timeLeft: 10,
    });
  }

  function goToWaiting() {
    setRoomState((prev) => ({
      ...prev,
      status: "waiting",
      timeLeft: 10,
    }));
  }

  function resetGame() {
    setRoomState({
      status: "waiting",
      currentQuestionIndex: 0,
      currentQuestionText: questions[0]?.text ?? "",
      currentQuestionCategory: questions[0]?.category ?? "",
      timeLeft: 10,
    });
  }

  function finishRoundNow() {
    setRoomState((prev) => ({
      ...prev,
      status: "ranking",
      timeLeft: 0,
    }));
  }

  return (
    <GameContext.Provider
      value={{
        roomState,
        participants: mockParticipants,
        rankingJa,
        rankingNunca,
        startGame,
        goToWaiting,
        resetGame,
        finishRoundNow,
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