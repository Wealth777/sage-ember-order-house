import { useMemo } from "react";
import { useCartLines, useDb, useSessionUserId } from "@/lib/store";
import type { MenuItem } from "@/lib/types";

export function useCurrentUser() {
  const db = useDb();
  const id = useSessionUserId();
  return useMemo(() => (id ? (db.users.find((u) => u.id === id) ?? null) : null), [db.users, id]);
}

export function useCart() {
  const db = useDb();
  const lines = useCartLines();
  return useMemo(() => {
    const items = lines
      .map((l) => ({ ...l, item: db.menuItems.find((m) => m.id === l.itemId) }))
      .filter((l): l is { itemId: string; quantity: number; item: MenuItem } => Boolean(l.item));
    const count = items.reduce((s, l) => s + l.quantity, 0);
    const total = items.reduce((s, l) => s + l.quantity * l.item.price, 0);
    return { lines: items, count, total };
  }, [db.menuItems, lines]);
}
