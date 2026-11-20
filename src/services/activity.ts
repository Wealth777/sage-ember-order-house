import type { ActivityLog, DbState, User } from "@/lib/types";

const MAX_LOGS = 400;

/** Returns a copy of the activity list with a new entry at the top. */
export function withLog(db: DbState, actor: Pick<User, "id" | "name" | "role">, action: string, description: string): ActivityLog[] {
  const entry: ActivityLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    userId: actor.id,
    userName: actor.name,
    role: actor.role,
    action,
    description,
    createdAt: new Date().toISOString(),
  };
  return [entry, ...db.activity].slice(0, MAX_LOGS);
}
