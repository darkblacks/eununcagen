import { db } from "../supabase";
import { auth } from "../firebase";
import { DEFAULT_ROOM_ID } from "../utils/constants";

export async function markUserOnline() {
  const user = auth.currentUser;
  if (!user) return;

  const now = Date.now();

  const { error } = await db.from("users_online").upsert({
    uid: user.uid,
    room_id: DEFAULT_ROOM_ID,
    email: user.email ?? "",
    name: user.email?.split("@")[0] ?? "Usuário",
    is_online: true,
    last_seen: now,
    created_at: now,
  });

  if (error) throw error;
}

export async function heartbeatOnlineUser() {
  const user = auth.currentUser;
  if (!user) return;

  const { error } = await db
    .from("users_online")
    .update({
      is_online: true,
      last_seen: Date.now(),
    })
    .eq("uid", user.uid)
    .eq("room_id", DEFAULT_ROOM_ID);

  if (error) throw error;
}

export async function markUserOffline() {
  const user = auth.currentUser;
  if (!user) return;

  const { error } = await db
    .from("users_online")
    .update({
      is_online: false,
      last_seen: Date.now(),
    })
    .eq("uid", user.uid)
    .eq("room_id", DEFAULT_ROOM_ID);

  if (error) throw error;
}

export async function loadOnlineUsers() {
  const limitMs = Date.now() - 45000;

  const { data, error } = await db
    .from("users_online")
    .select("*")
    .eq("room_id", DEFAULT_ROOM_ID)
    .eq("is_online", true)
    .gte("last_seen", limitMs)
    .order("name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}