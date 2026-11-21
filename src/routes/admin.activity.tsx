import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ActivityTable } from "@/components/dashboard/ActivityTable";
import { DashHeader, LiveIndicator } from "@/components/dashboard/DashboardShell";
import { useDb } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

export const Route = createFileRoute("/admin/activity")({
  component: AdminActivity,
});

const ROLES: ("all" | Role)[] = ["all", "customer", "staff", "admin"];

function AdminActivity() {
  const db = useDb();
  const [role, setRole] = useState<"all" | Role>("all");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(40);
  const q = query.trim().toLowerCase();
  const logs = db.activity.filter(
    (l) =>
      (role === "all" || l.role === role) &&
      (!q || l.userName.toLowerCase().includes(q) || l.action.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)),
  );

  return (
    <>
      <DashHeader title="Activity log" description="Everything customers, staff and admins have done, newest first." actions={<LiveIndicator />} />
      <div className="rounded-2xl border bg-card shadow-soft">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1">
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-semibold capitalize transition-colors",
                  role === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {r === "all" ? "Everyone" : r}
              </button>
            ))}
          </div>
          <div className="relative sm:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search activity" className="pl-9" />
          </div>
        </div>
        <ActivityTable logs={logs.slice(0, limit)} />
        {logs.length > limit && (
          <div className="border-t p-3 text-center">
            <Button variant="ghost" onClick={() => setLimit((l) => l + 40)}>Show more ({logs.length - limit} left)</Button>
          </div>
        )}
      </div>
    </>
  );
}
