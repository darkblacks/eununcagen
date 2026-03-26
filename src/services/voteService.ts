import { auth } from "../firebase";
import { db } from "../supabase";
import { DEFAULT_ROOM_ID } from "../utils/constants";

export async function voteOnCurrentQuestion(
  vote: "eu-ja" | "eu-nunca",
  roundId: number
) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const voteId = `${DEFAULT_ROOM_ID}_${roundId}_${user.uid}`;

  const { error } = await db.from("votes").upsert({
    id: voteId,
    room_id: DEFAULT_ROOM_ID,
    round_id: roundId,
    user_id: user.uid,
    user_name: user.email ?? "usuario@gen.com",
    vote,
    created_at: Date.now(),
  });

  if (error) throw error;
}

export async function loadVotesByRound(roundId: number) {
  const { data, error } = await db
    .from("votes")
    .select("*")
    .eq("room_id", DEFAULT_ROOM_ID)
    .eq("round_id", roundId);

  if (error) throw error;
  return data ?? [];
}

export async function loadAllVotes() {
  const { data, error } = await db
    .from("votes")
    .select("*")
    .eq("room_id", DEFAULT_ROOM_ID);

  if (error) throw error;
  return data ?? [];
}

export async function clearAllVotes() {
  const { error } = await db
    .from("votes")
    .delete()
    .eq("room_id", DEFAULT_ROOM_ID);

  if (error) throw error;
}