export type GameStatus = "waiting" | "playing" | "ranking";

export interface Participant {
  uid: string;
  name: string;
  role: "admin" | "student";
  hasVoted?: boolean;
}

export type RoomState = {
  status: GameStatus;
  currentQuestionIndex: number;
  currentQuestionText: string;
  currentQuestionCategory: string;
  currentRoundId: number;
  timeLeft: number;
};