import { Store, UtensilsCrossed } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatMoney } from "@/lib/config";
import { shortDate } from "@/lib/format";
import type { Order } from "@/lib/types";

export function OrdersTable({
  orders,
  onSelect,
  showStaff = false,
}: {
  orders: Order[];
  onSelect: (order: Order) => void;
  showStaff?: boolean;
}) {
  if (orders.length === 0) {
    return <div className="px-5 py-12 text-center text-sm text-muted-foreground">No orders match this view.</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-sm">
        <thead>
          <tr className="border-b text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <th className="px-5 py-3">Order</th>
            <th className="px-3 py-3">Customer</th>
            <th className="px-3 py-3">Items</th>
            <th className="px-3 py-3">Type</th>
            {showStaff && <th className="px-3 py-3">Handled by</th>}
            <th className="px-3 py-3">Total</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-5 py-3 text-right">Placed</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr
              key={o.id}
              onClick={() => onSelect(o)}
              className="cursor-pointer border-b last:border-0 transition-colors hover:bg-muted/60"
            >
              <td className="px-5 py-3 font-bold">{o.code}</td>
              <td className="px-3 py-3">{o.customerName}</td>
              <td className="max-w-[220px] truncate px-3 py-3 text-muted-foreground">
                {o.items.map((l) => `${l.quantity}× ${l.name}`).join(", ")}
              </td>
              <td className="px-3 py-3">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  {o.type === "dine-in" ? <UtensilsCrossed className="size-3.5" /> : <Store className="size-3.5" />}
                  {o.type === "dine-in" ? `Table ${o.tableNumber}` : "Pickup"}
                </span>
              </td>
              {showStaff && <td className="px-3 py-3 text-muted-foreground">{o.staffName ?? "—"}</td>}
              <td className="px-3 py-3 font-semibold">{formatMoney(o.total)}</td>
              <td className="px-3 py-3"><StatusBadge status={o.status} /></td>
              <td className="whitespace-nowrap px-5 py-3 text-right text-muted-foreground">{shortDate(o.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
