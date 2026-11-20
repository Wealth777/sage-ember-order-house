import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: "primary" | "brass" | "pending" | "preparing" | "ready";
}) {
  const tones = {
    primary: "bg-primary-soft text-primary",
    brass: "bg-brass/15 text-brass-foreground",
    pending: "bg-status-pending/12 text-status-pending",
    preparing: "bg-status-preparing/12 text-status-preparing",
    ready: "bg-status-ready/12 text-status-ready",
  };
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-semibold text-muted-foreground">{label}</span>
        <span className={cn("grid size-9 place-items-center rounded-xl", tones[tone])}>
          <Icon className="size-4" />
        </span>
      </div>
      <div className="mt-3 font-display text-3xl font-semibold tracking-tight">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}
