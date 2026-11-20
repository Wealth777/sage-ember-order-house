import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ORDER_STATUSES, type Order, type OrderStatus } from "@/lib/types";
import { STATUS_LABEL } from "@/lib/order-workflow";

export type StatusFilter = "all" | "active" | OrderStatus;

export function filterOrders(orders: Order[], status: StatusFilter, query: string) {
  const q = query.trim().toLowerCase();
  return orders.filter((o) => {
    if (status === "active" && (o.status === "completed" || o.status === "cancelled")) return false;
    if (status !== "all" && status !== "active" && o.status !== status) return false;
    if (!q) return true;
    return o.code.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q);
  });
}

export function OrderFilters({
  orders,
  status,
  onStatus,
  query,
  onQuery,
}: {
  orders: Order[];
  status: StatusFilter;
  onStatus: (s: StatusFilter) => void;
  query: string;
  onQuery: (q: string) => void;
}) {
  const options: { id: StatusFilter; label: string; count: number }[] = [
    { id: "all", label: "All", count: orders.length },
    { id: "active", label: "Active", count: filterOrders(orders, "active", "").length },
    ...ORDER_STATUSES.map((s) => ({ id: s, label: STATUS_LABEL[s], count: orders.filter((o) => o.status === s).length })),
  ];
  return (
    <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="-mx-1 flex gap-1 overflow-x-auto px-1 [scrollbar-width:none]">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onStatus(o.id)}
            className={cn(
              "shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
              status === o.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {o.label} <span className="ml-1 opacity-70">{o.count}</span>
          </button>
        ))}
      </div>
      <div className="relative lg:w-64">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Search order or customer" className="pl-9" />
      </div>
    </div>
  );
}
