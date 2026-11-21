import { useEffect, useRef } from "react";
import { toast } from "sonner";
import type { Order } from "@/lib/types";

/** Pops a toast when a new pending order arrives (e.g. placed in another tab). */
export function useNewOrderAlerts(orders: Order[]) {
  const seen = useRef<Set<string> | null>(null);
  useEffect(() => {
    const pending = orders.filter((o) => o.status === "pending");
    if (!seen.current) {
      seen.current = new Set(pending.map((o) => o.id));
      return;
    }
    for (const o of pending) {
      if (!seen.current.has(o.id)) {
        seen.current.add(o.id);
        toast.info(`New order ${o.code}`, { description: `${o.customerName} · ${o.items.length} item${o.items.length > 1 ? "s" : ""}` });
      }
    }
  }, [orders]);
}
