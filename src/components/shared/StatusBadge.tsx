import { cn } from "@/lib/utils";
import { STATUS_LABEL } from "@/lib/order-workflow";
import type { OrderStatus } from "@/lib/types";

const STYLES: Record<OrderStatus, string> = {
  pending: "bg-status-pending/12 text-status-pending ring-status-pending/25",
  confirmed: "bg-status-confirmed/12 text-status-confirmed ring-status-confirmed/25",
  preparing: "bg-status-preparing/12 text-status-preparing ring-status-preparing/25",
  ready: "bg-status-ready/12 text-status-ready ring-status-ready/25",
  completed: "bg-status-completed/10 text-status-completed ring-status-completed/20",
  cancelled: "bg-status-cancelled/10 text-status-cancelled ring-status-cancelled/20",
};

export function StatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset whitespace-nowrap",
        STYLES[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {STATUS_LABEL[status]}
    </span>
  );
}
