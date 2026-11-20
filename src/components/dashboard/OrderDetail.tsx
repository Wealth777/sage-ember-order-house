import { Phone, Store, StickyNote, User, UtensilsCrossed } from "lucide-react";
import { OrderProgress } from "@/components/shared/OrderProgress";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { resolveImage } from "@/data/images";
import { formatMoney } from "@/lib/config";
import { shortDate } from "@/lib/format";
import { STATUS_LABEL } from "@/lib/order-workflow";
import type { Order } from "@/lib/types";
import { OrderActions } from "./OrderActions";

/** Full order view used by staff and admin. */
export function OrderDetail({ order }: { order: Order }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold">{order.code}</h2>
          <StatusBadge status={order.status} />
        </div>
        <OrderActions order={order} />
      </div>

      <div className="rounded-2xl border bg-card p-5">
        <OrderProgress order={order} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2.5 rounded-2xl border bg-card p-5 text-sm">
          <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground">Customer</h3>
          <p className="flex items-center gap-2 font-semibold"><User className="size-4 text-muted-foreground" /> {order.customerName}</p>
          <p className="flex items-center gap-2"><Phone className="size-4 text-muted-foreground" /> {order.customerPhone || "—"}</p>
          <p className="flex items-center gap-2">
            {order.type === "dine-in" ? <UtensilsCrossed className="size-4 text-muted-foreground" /> : <Store className="size-4 text-muted-foreground" />}
            {order.type === "dine-in" ? `Dine-in · Table ${order.tableNumber}` : "Pickup at counter"}
          </p>
          {order.notes && (
            <p className="flex items-start gap-2 rounded-lg bg-status-pending/10 p-2.5 text-foreground">
              <StickyNote className="mt-0.5 size-4 shrink-0 text-status-pending" /> {order.notes}
            </p>
          )}
        </div>
        <div className="rounded-2xl border bg-card p-5 text-sm">
          <h3 className="mb-3 font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground">Timeline</h3>
          <ol className="space-y-3">
            {order.history.map((h, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                <div>
                  <div className="font-semibold">{STATUS_LABEL[h.status]}</div>
                  <div className="text-xs text-muted-foreground">
                    {shortDate(h.at)} · by {h.byName} ({h.byRole})
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="rounded-2xl border bg-card">
        <div className="divide-y">
          {order.items.map((l) => (
            <div key={l.itemId} className="flex items-center gap-4 p-4">
              <img src={resolveImage(l.image)} alt="" className="size-14 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="font-semibold">{l.name}</div>
                <div className="text-sm text-muted-foreground">{formatMoney(l.price)} each</div>
              </div>
              <div className="text-sm font-bold">×{l.quantity}</div>
              <div className="w-24 text-right font-semibold">{formatMoney(l.price * l.quantity)}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t bg-muted/50 px-4 py-3 font-bold">
          <span>Total · pay at counter</span>
          <span>{formatMoney(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
