import { db } from "../supabase";

export async function loadVotes() {
  const { data, error } = await db.from("votes").select("*");

  if (error) throw error;
  return data ?? [];
}