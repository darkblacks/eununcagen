import { auth } from "../firebase";
import { db } from "../supabase";
import { DEFAULT_ROOM_ID } from "../utils/constants";

export async function voteOnCurrentQuestion(vote: "eu-ja" | "eu-nunca") {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const voteId = `${DEFAULT_ROOM_ID}_${user.uid}`;

  const { error } = await db.from("votes").upsert({
    id: voteId,
    room_id: DEFAULT_ROOM_ID,
    user_id: user.uid,
    vote,
    created_at: Date.now(),
  });

  if (error) throw error;
}