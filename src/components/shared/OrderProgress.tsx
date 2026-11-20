import { Check, ChefHat, ClipboardCheck, PackageCheck, Timer, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS_FLOW, STATUS_LABEL } from "@/lib/order-workflow";
import type { Order } from "@/lib/types";
import { clockTime } from "@/lib/format";

const ICONS = [Timer, ClipboardCheck, ChefHat, PackageCheck, Check];

export function OrderProgress({ order }: { order: Order }) {
  if (order.status === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-status-cancelled/10 p-4 text-status-cancelled">
        <X className="size-5" />
        <span className="font-semibold">This order was cancelled.</span>
      </div>
    );
  }
  const current = STATUS_FLOW.indexOf(order.status);
  return (
    <ol className="grid grid-cols-5 gap-1">
      {STATUS_FLOW.map((s, i) => {
        const Icon = ICONS[i]!;
        const done = i <= current;
        const at = order.history.find((h) => h.status === s)?.at;
        return (
          <li key={s} className="relative flex flex-col items-center text-center">
            {i > 0 && (
              <span
                className={cn(
                  "absolute right-1/2 top-5 h-0.5 w-full -translate-y-1/2",
                  i <= current ? "bg-primary" : "bg-border",
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 grid size-10 place-items-center rounded-full border-2 transition-colors",
                done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground",
                i === current && s !== "completed" && "ring-4 ring-primary/15",
              )}
            >
              <Icon className="size-4" />
            </span>
            <span className={cn("mt-2 text-xs font-semibold sm:text-sm", done ? "text-foreground" : "text-muted-foreground")}>
              {STATUS_LABEL[s]}
            </span>
            <span className="text-[0.7rem] text-muted-foreground">{at ? clockTime(at) : "\u00a0"}</span>
          </li>
        );
      })}
    </ol>
  );
}
