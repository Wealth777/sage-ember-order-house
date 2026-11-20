import type { OrderStatus, Role } from "./types";

/** Pending → Confirmed → Preparing → Ready → Completed. Cancelled is a side exit. */
export const STATUS_FLOW: OrderStatus[] = ["pending", "confirmed", "preparing", "ready", "completed"];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
};

/** Label for the button that moves an order to its next step. */
export const NEXT_ACTION_LABEL: Partial<Record<OrderStatus, string>> = {
  pending: "Accept order",
  confirmed: "Start preparing",
  preparing: "Mark ready",
  ready: "Complete order",
};

export function nextStatus(status: OrderStatus): OrderStatus | null {
  const i = STATUS_FLOW.indexOf(status);
  if (i === -1 || i === STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[i + 1] ?? null;
}

export function isActiveStatus(status: OrderStatus) {
  return status !== "completed" && status !== "cancelled";
}

/** Who may move an order from one status to another. */
export function canTransition(from: OrderStatus, to: OrderStatus, role: Role): boolean {
  if (from === to) return false;
  if (from === "completed" || from === "cancelled") return false;
  if (role === "customer") {
    // Customers can only cancel an order the kitchen hasn't accepted yet.
    return from === "pending" && to === "cancelled";
  }
  // Staff and admins can cancel any active order, or advance one step at a time.
  if (to === "cancelled") return true;
  return nextStatus(from) === to;
}
