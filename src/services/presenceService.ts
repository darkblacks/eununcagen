import { db } from "../supabase";
import { DEFAULT_ROOM_ID } from "../utils/constants";
import type { AppUser } from "../types/auth";
import type { Participant } from "../types/game";

const ONLINE_WINDOW_MS = 30000;
const HEARTBEAT_MS = 10000;

type PresenceRow = {
  id: string;
  room_id: string;
  user_id: string;
  user_name: string;
  user_role: "admin" | "student";
  last_seen: number;
  updated_at: number;
};

export async function upsertMyPresence(user: AppUser) {
  const now = Date.now();

  const payload: PresenceRow = {
    id: `${DEFAULT_ROOM_ID}_${user.uid}`,
    room_id: DEFAULT_ROOM_ID,
    user_id: user.uid,
    user_name: user.name,
    user_role: user.role,
    last_seen: now,
    updated_at: now,
  };

  const { error } = await db.from("room_presence").upsert(payload);

  if (error) throw error;
}

export async function loadOnlineParticipants(): Promise<Participant[]> {
  const minLastSeen = Date.now() - ONLINE_WINDOW_MS;

  const { data, error } = await db
    .from("room_presence")
    .select("*")
    .eq("room_id", DEFAULT_ROOM_ID)
    .gte("last_seen", minLastSeen)
    .order("user_name", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((item) => ({
    uid: item.user_id,
    name: item.user_name,
    role: item.user_role,
  }));
}

export function startPresenceHeartbeat(user: AppUser) {
  upsertMyPresence(user).catch(console.error);

  const intervalId = window.setInterval(() => {
    upsertMyPresence(user).catch(console.error);
  }, HEARTBEAT_MS);

  return () => {
    window.clearInterval(intervalId);
  };
}