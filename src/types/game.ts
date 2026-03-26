export type GameStatus = "waiting" | "playing" | "ranking";

export type Participant = {
  uid: string;
  name: string;
  role: "admin" | "student";
};

export type RoomState = {
  status: GameStatus;
  currentQuestionIndex: number;
  currentQuestionText: string;
  currentQuestionCategory: string;
  currentRoundId: number;
};