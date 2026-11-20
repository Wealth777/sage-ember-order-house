import { readDb, writeDb } from "@/lib/store";
import { canTransition, STATUS_LABEL } from "@/lib/order-workflow";
import { RESTAURANT } from "@/lib/config";
import type { CartLine, Order, OrderLine, OrderStatus, OrderType, User } from "@/lib/types";
import { withLog } from "./activity";

export function placeOrder(
  customer: User,
  cart: CartLine[],
  details: { type: OrderType; tableNumber: string; notes: string; phone: string },
): Order {
  const db = readDb();
  const lines: OrderLine[] = [];
  for (const c of cart) {
    const item = db.menuItems.find((m) => m.id === c.itemId);
    if (!item || !item.available) continue;
    lines.push({ itemId: item.id, name: item.name, price: item.price, quantity: c.quantity, image: item.image });
  }
  if (lines.length === 0) throw new Error("Your cart is empty or the items are no longer available.");
  if (details.type === "dine-in" && !details.tableNumber.trim()) throw new Error("Please enter your table number.");

  const now = new Date().toISOString();
  const code = `${RESTAURANT.shortCode}-${db.nextOrderNumber}`;
  const order: Order = {
    id: `o-${db.nextOrderNumber}`,
    code,
    customerId: customer.id,
    customerName: customer.name,
    customerPhone: details.phone || customer.phone,
    items: lines,
    total: lines.reduce((s, l) => s + l.price * l.quantity, 0),
    status: "pending",
    type: details.type,
    tableNumber: details.type === "dine-in" ? details.tableNumber.trim() : "",
    notes: details.notes.trim(),
    createdAt: now,
    updatedAt: now,
    staffId: null,
    staffName: null,
    history: [{ status: "pending", at: now, byName: customer.name, byRole: "customer" }],
  };
  writeDb((d) => ({
    ...d,
    orders: [order, ...d.orders],
    nextOrderNumber: d.nextOrderNumber + 1,
    activity: withLog(d, customer, "Order placed", `Placed order ${code} (${lines.length} item${lines.length > 1 ? "s" : ""})`),
  }));
  return order;
}

export function updateOrderStatus(actor: User, orderId: string, to: OrderStatus) {
  const order = readDb().orders.find((o) => o.id === orderId);
  if (!order) throw new Error("Order not found.");
  if (actor.role === "customer" && order.customerId !== actor.id) throw new Error("You can only change your own orders.");
  if (!canTransition(order.status, to, actor.role)) {
    throw new Error(`An order that is ${STATUS_LABEL[order.status].toLowerCase()} can't be moved to ${STATUS_LABEL[to].toLowerCase()}.`);
  }
  const now = new Date().toISOString();
  const accepting = order.status === "pending" && to === "confirmed";
  const action =
    to === "cancelled" ? "Order cancelled" : accepting ? "Order accepted" : "Status updated";
  const description =
    to === "cancelled" ? `Cancelled order ${order.code}` : accepting ? `Accepted order ${order.code}` : `Moved ${order.code} to ${STATUS_LABEL[to]}`;

  writeDb((d) => ({
    ...d,
    orders: d.orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            status: to,
            updatedAt: now,
            ...(accepting && actor.role !== "customer" ? { staffId: actor.id, staffName: actor.name } : {}),
            history: [...o.history, { status: to, at: now, byName: actor.name, byRole: actor.role }],
          }
        : o,
    ),
    activity: withLog(d, actor, action, description),
  }));
}
