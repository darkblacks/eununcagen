export type Role = "admin" | "student";

export type AppUser = {
  uid: string;
  name: string;
  email: string;
  role: Role;
  roomCode?: string;
};