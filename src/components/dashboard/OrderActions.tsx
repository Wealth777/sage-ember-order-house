import { ArrowRight, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-app";
import { isActiveStatus, NEXT_ACTION_LABEL, nextStatus, STATUS_LABEL } from "@/lib/order-workflow";
import type { Order, OrderStatus } from "@/lib/types";
import { updateOrderStatus } from "@/services/orders";

export function useOrderUpdater() {
  const user = useCurrentUser();
  return (order: Order, to: OrderStatus) => {
    if (!user) return;
    try {
      updateOrderStatus(user, order.id, to);
      toast.success(`${order.code} is now ${STATUS_LABEL[to].toLowerCase()}`);
    } catch (e) {
      toast.error((e as Error).message);
    }
  };
}

export function OrderActions({ order, size = "default", showCancel = true }: { order: Order; size?: "sm" | "default"; showCancel?: boolean }) {
  const update = useOrderUpdater();
  const next = nextStatus(order.status);
  if (!isActiveStatus(order.status)) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {next && (
        <Button size={size} onClick={() => update(order, next)}>
          {NEXT_ACTION_LABEL[order.status]} <ArrowRight />
        </Button>
      )}
      {showCancel && (
        <Button
          size={size}
          variant="ghost"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => {
            if (confirm(`Cancel order ${order.code}?`)) update(order, "cancelled");
          }}
        >
          <X /> Cancel
        </Button>
      )}
    </div>
  );
}
