import { db } from "../supabase";
import { DEFAULT_ROOM_ID } from "../utils/constants";
import { questions } from "../data/questions";

export async function initializeRoom() {
  const { data, error: readError } = await db
    .from("rooms")
    .select("id")
    .eq("id", DEFAULT_ROOM_ID)
    .maybeSingle();

  if (readError) throw readError;
  if (data) return;

  const question = questions[0];

  const { error } = await db.from("rooms").insert({
    id: DEFAULT_ROOM_ID,
    status: "waiting",
    current_question_index: 0,
    current_question_text: question?.text ?? "",
    current_question_category: question?.category ?? "",
    current_round_id: 1,
    time_left: 10,
  });

  if (error) throw error;
}

export async function getRoom() {
  const { data, error } = await db
    .from("rooms")
    .select("*")
    .eq("id", DEFAULT_ROOM_ID)
    .single();

  if (error) throw error;
  return data;
}

export async function startRoomRound(index: number) {
  const question = questions[index];
  if (!question) return;

  const { error } = await db
    .from("rooms")
    .update({
      status: "playing",
      current_question_index: index,
      current_question_text: question.text,
      current_question_category: question.category,
      current_round_id: index + 1,
      time_left: 10,
    })
    .eq("id", DEFAULT_ROOM_ID);

  if (error) throw error;
}

export async function goToRanking() {
  const { error } = await db
    .from("rooms")
    .update({
      status: "ranking",
    })
    .eq("id", DEFAULT_ROOM_ID);

  if (error) throw error;
}

export async function resetRoom() {
  const question = questions[0];

  const { error } = await db
    .from("rooms")
    .update({
      status: "waiting",
      current_question_index: 0,
      current_question_text: question?.text ?? "",
      current_question_category: question?.category ?? "",
      current_round_id: 1,
      time_left: 10,
    })
    .eq("id", DEFAULT_ROOM_ID);

  if (error) throw error;
}