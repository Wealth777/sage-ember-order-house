import { cn } from "@/lib/utils";
import { shortDate } from "@/lib/format";
import type { ActivityLog, Role } from "@/lib/types";

const ROLE_STYLE: Record<Role, string> = {
  customer: "bg-status-confirmed/10 text-status-confirmed",
  staff: "bg-status-preparing/10 text-status-preparing",
  admin: "bg-primary-soft text-primary",
};

export function RolePill({ role }: { role: Role }) {
  return <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold capitalize", ROLE_STYLE[role])}>{role}</span>;
}

export function ActivityTable({ logs, compact = false }: { logs: ActivityLog[]; compact?: boolean }) {
  if (logs.length === 0) return <div className="py-10 text-center text-sm text-muted-foreground">No activity yet.</div>;
  if (compact) {
    return (
      <ul className="space-y-4">
        {logs.map((l) => (
          <li key={l.id} className="flex gap-3 text-sm">
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brass" />
            <div className="min-w-0">
              <p>
                <span className="font-semibold">{l.userName}</span> <span className="text-muted-foreground">· {l.description}</span>
              </p>
              <p className="text-xs text-muted-foreground">{shortDate(l.createdAt)}</p>
            </div>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <th className="px-5 py-3">User</th>
            <th className="px-3 py-3">Role</th>
            <th className="px-3 py-3">Action</th>
            <th className="px-3 py-3">Description</th>
            <th className="px-5 py-3 text-right">Date & time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l.id} className="border-b last:border-0">
              <td className="px-5 py-3 font-semibold">{l.userName}</td>
              <td className="px-3 py-3"><RolePill role={l.role} /></td>
              <td className="px-3 py-3 font-medium">{l.action}</td>
              <td className="px-3 py-3 text-muted-foreground">{l.description}</td>
              <td className="whitespace-nowrap px-5 py-3 text-right text-muted-foreground">{shortDate(l.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
