import { Link } from "@tanstack/react-router";
import { ChevronRight, Store, UtensilsCrossed } from "lucide-react";
import { formatMoney } from "@/lib/config";
import { shortDate } from "@/lib/format";
import type { Order } from "@/lib/types";
import { resolveImage } from "@/data/images";
import { StatusBadge } from "./StatusBadge";

export function OrderCard({ order }: { order: Order }) {
  const count = order.items.reduce((s, l) => s + l.quantity, 0);
  return (
    <Link
      to="/orders/$orderId"
      params={{ orderId: order.id }}
      className="group flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-soft transition-shadow hover:shadow-card"
    >
      <div className="flex -space-x-3">
        {order.items.slice(0, 3).map((l) => (
          <img key={l.itemId} src={resolveImage(l.image)} alt="" className="size-12 rounded-full border-2 border-card object-cover" />
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">{order.code}</span>
          <StatusBadge status={order.status} />
        </div>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">
          {order.items.map((l) => `${l.quantity}× ${l.name}`).join(", ")}
        </p>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span>{shortDate(order.createdAt)}</span>
          <span className="flex items-center gap-1">
            {order.type === "dine-in" ? <UtensilsCrossed className="size-3" /> : <Store className="size-3" />}
            {order.type === "dine-in" ? `Table ${order.tableNumber}` : "Pickup"}
          </span>
          <span>{count} item{count > 1 ? "s" : ""}</span>
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold">{formatMoney(order.total)}</div>
        <ChevronRight className="ml-auto mt-1 size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
