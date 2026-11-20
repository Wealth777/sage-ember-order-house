import { readDb, writeDb, writeSession } from "@/lib/store";
import type { User } from "@/lib/types";
import { withLog } from "./activity";

const uid = () => `u-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export function login(email: string, password: string): User {
  const db = readDb();
  const user = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user || user.password !== password) throw new Error("That email and password don't match.");
  if (!user.active) throw new Error("This account has been deactivated. Please contact a manager.");
  writeDb((d) => ({ ...d, activity: withLog(d, user, "Logged in", `${user.name} signed in`) }));
  writeSession(user.id);
  return user;
}

export function register(input: { name: string; email: string; phone: string; password: string }): User {
  const db = readDb();
  const email = input.email.trim().toLowerCase();
  if (db.users.some((u) => u.email.toLowerCase() === email)) throw new Error("An account with this email already exists.");
  const user: User = {
    id: uid(),
    name: input.name.trim(),
    email,
    phone: input.phone.trim(),
    password: input.password,
    role: "customer",
    active: true,
    createdAt: new Date().toISOString(),
  };
  writeDb((d) => ({
    ...d,
    users: [...d.users, user],
    activity: withLog(d, user, "Registered", `${user.name} created a customer account`),
  }));
  writeSession(user.id);
  return user;
}

export function logout(user: User | null) {
  if (user) writeDb((d) => ({ ...d, activity: withLog(d, user, "Logged out", `${user.name} signed out`) }));
  writeSession(null);
}

export function updateProfile(user: User, patch: { name: string; phone: string }) {
  writeDb((d) => ({
    ...d,
    users: d.users.map((u) => (u.id === user.id ? { ...u, name: patch.name.trim(), phone: patch.phone.trim() } : u)),
    activity: withLog(d, user, "Profile updated", `${user.name} updated their profile`),
  }));
}
