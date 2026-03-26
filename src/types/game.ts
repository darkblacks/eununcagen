export type GameStatus = "waiting" | "playing" | "finished";

export type Participant = {
  id: string;
  name: string;
  score: number;
  hasVoted?: boolean;
};

export type RoomState = {
  code: string;
  currentQuestionIndex: number;
  status: GameStatus;
  participants: Participant[];
};