import { auth } from "../firebase";
import { db } from "../supabase";
import { DEFAULT_ROOM_ID } from "../utils/constants";

export async function saveAnswer(questionIndex: number, roundId: number, answer: boolean) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const answerId = `${DEFAULT_ROOM_ID}_${questionIndex}_${user.uid}`;

  const { error } = await db.from("answers").upsert({
    id: answerId,
    room_id: DEFAULT_ROOM_ID,
    question_index: questionIndex,
    round_id: roundId,
    user_id: user.uid,
    user_name: user.email ?? "usuario@gen.com",
    answer,
    created_at: Date.now(),
  });

  if (error) throw error;
}

export async function loadAnswersByQuestion(questionIndex: number) {
  const { data, error } = await db
    .from("answers")
    .select("*")
    .eq("room_id", DEFAULT_ROOM_ID)
    .eq("question_index", questionIndex);

  if (error) throw error;
  return data ?? [];
}

export async function loadAllAnswers() {
  const { data, error } = await db
    .from("answers")
    .select("*")
    .eq("room_id", DEFAULT_ROOM_ID);

  if (error) throw error;
  return data ?? [];
}

export async function clearAllAnswers() {
  const { error } = await db
    .from("answers")
    .delete()
    .eq("room_id", DEFAULT_ROOM_ID);

  if (error) throw error;
}