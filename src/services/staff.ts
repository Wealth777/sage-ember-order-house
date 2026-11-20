import { readDb, writeDb } from "@/lib/store";
import type { User } from "@/lib/types";
import { withLog } from "./activity";

export function createStaff(admin: User, input: { name: string; email: string; phone: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  if (!input.name.trim()) throw new Error("Please enter a name.");
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Please enter a valid email.");
  if (input.password.length < 6) throw new Error("Password must be at least 6 characters.");
  if (readDb().users.some((u) => u.email.toLowerCase() === email)) throw new Error("An account with this email already exists.");
  const user: User = {
    id: `u-${Date.now().toString(36)}`,
    name: input.name.trim(),
    email,
    phone: input.phone.trim(),
    password: input.password,
    role: "staff",
    active: true,
    createdAt: new Date().toISOString(),
  };
  writeDb((d) => ({
    ...d,
    users: [...d.users, user],
    activity: withLog(d, admin, "Staff account created", `Added ${user.name} to the team`),
  }));
}

export function setStaffActive(admin: User, staffId: string, active: boolean) {
  const staff = readDb().users.find((u) => u.id === staffId);
  if (!staff) return;
  writeDb((d) => ({
    ...d,
    users: d.users.map((u) => (u.id === staffId ? { ...u, active } : u)),
    activity: withLog(d, admin, active ? "Staff account activated" : "Staff account deactivated", `${active ? "Reactivated" : "Deactivated"} ${staff.name}`),
  }));
}

export function removeStaff(admin: User, staffId: string) {
  const staff = readDb().users.find((u) => u.id === staffId);
  if (!staff || staff.role !== "staff") return;
  writeDb((d) => ({
    ...d,
    users: d.users.filter((u) => u.id !== staffId),
    activity: withLog(d, admin, "Staff account removed", `Removed ${staff.name} from the team`),
  }));
}
