import { format, startOfDay, subDays } from "date-fns";
import type { DbState } from "./types";

export function revenueByDay(db: DbState, days = 7) {
  const today = startOfDay(new Date());
  return Array.from({ length: days }, (_, i) => {
    const day = subDays(today, days - 1 - i);
    const next = day.getTime() + 86_400_000;
    const orders = db.orders.filter((o) => {
      const t = Date.parse(o.createdAt);
      return t >= day.getTime() && t < next && o.status !== "cancelled";
    });
    return { day: format(day, "EEE"), revenue: orders.reduce((s, o) => s + o.total, 0), orders: orders.length };
  });
}

export function topItems(db: DbState, limit = 5) {
  const totals = new Map<string, { name: string; qty: number; revenue: number }>();
  for (const o of db.orders) {
    if (o.status === "cancelled") continue;
    for (const l of o.items) {
      const t = totals.get(l.itemId) ?? { name: l.name, qty: 0, revenue: 0 };
      t.qty += l.quantity;
      t.revenue += l.quantity * l.price;
      totals.set(l.itemId, t);
    }
  }
  return [...totals.values()].sort((a, b) => b.qty - a.qty).slice(0, limit);
}

export function totals(db: DbState) {
  const valid = db.orders.filter((o) => o.status !== "cancelled");
  return {
    revenue: valid.reduce((s, o) => s + o.total, 0),
    orders: db.orders.length,
    customers: db.users.filter((u) => u.role === "customer").length,
    staff: db.users.filter((u) => u.role === "staff").length,
    activeStaff: db.users.filter((u) => u.role === "staff" && u.active).length,
    avgOrder: valid.length ? Math.round(valid.reduce((s, o) => s + o.total, 0) / valid.length) : 0,
  };
}
