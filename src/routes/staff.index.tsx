import { createFileRoute, Link } from "@tanstack/react-router";
import { BellRing, CheckCheck, ChefHat, PackageCheck, StickyNote, Store, UtensilsCrossed } from "lucide-react";
import { DashHeader, LiveIndicator } from "@/components/dashboard/DashboardShell";
import { OrderActions } from "@/components/dashboard/OrderActions";
import { StatCard } from "@/components/dashboard/StatCard";
import { useCurrentUser } from "@/hooks/use-app";
import { formatMoney } from "@/lib/config";
import { timeAgo } from "@/lib/format";
import { STATUS_LABEL } from "@/lib/order-workflow";
import { useDb } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";

export const Route = createFileRoute("/staff/")({
  component: StaffDashboard,
});

const COLUMNS: { status: OrderStatus; tone: string }[] = [
  { status: "pending", tone: "bg-status-pending" },
  { status: "confirmed", tone: "bg-status-confirmed" },
  { status: "preparing", tone: "bg-status-preparing" },
  { status: "ready", tone: "bg-status-ready" },
];

function BoardCard({ order }: { order: Order }) {
  return (
    <div className="rounded-xl border bg-card p-3.5 shadow-soft fade-up">
      <div className="flex items-center justify-between gap-2">
        <Link to="/staff/orders/$orderId" params={{ orderId: order.id }} className="font-bold hover:text-primary">
          {order.code}
        </Link>
        <span className="text-xs text-muted-foreground">{timeAgo(order.createdAt)}</span>
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
        {order.type === "dine-in" ? <UtensilsCrossed className="size-3" /> : <Store className="size-3" />}
        {order.type === "dine-in" ? `Table ${order.tableNumber}` : "Pickup"} · {order.customerName}
      </div>
      <ul className="mt-2.5 space-y-0.5 text-sm">
        {order.items.map((l) => (
          <li key={l.itemId}><span className="font-bold">{l.quantity}×</span> {l.name}</li>
        ))}
      </ul>
      {order.notes && (
        <p className="mt-2 flex items-start gap-1.5 rounded-md bg-status-pending/10 p-2 text-xs">
          <StickyNote className="mt-0.5 size-3 shrink-0 text-status-pending" /> {order.notes}
        </p>
      )}
      <div className="mt-3 flex items-center justify-between gap-2 border-t pt-3">
        <span className="text-sm font-semibold">{formatMoney(order.total)}</span>
        <OrderActions order={order} size="sm" showCancel={false} />
      </div>
    </div>
  );
}

function StaffDashboard() {
  const db = useDb();
  const user = useCurrentUser();
  const today = new Date().toDateString();
  const count = (s: OrderStatus) => db.orders.filter((o) => o.status === s).length;
  const completedToday = db.orders.filter((o) => o.status === "completed" && new Date(o.updatedAt).toDateString() === today).length;

  return (
    <>
      <DashHeader
        title={`Good to see you, ${user?.name.split(" ")[0] ?? "chef"}`}
        description="Orders move left to right as you work through them."
        actions={<LiveIndicator />}
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="New orders" value={count("pending")} icon={BellRing} tone="pending" hint="Waiting to be accepted" />
        <StatCard label="In the kitchen" value={count("confirmed") + count("preparing")} icon={ChefHat} tone="preparing" hint="Confirmed or preparing" />
        <StatCard label="Ready" value={count("ready")} icon={PackageCheck} tone="ready" hint="Waiting for hand-off" />
        <StatCard label="Completed today" value={completedToday} icon={CheckCheck} hint="Served or collected" />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const orders = db.orders
            .filter((o) => o.status === col.status)
            .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
          return (
            <section key={col.status} className="flex flex-col rounded-2xl bg-muted/70 p-3">
              <header className="mb-3 flex items-center gap-2 px-1">
                <span className={cn("size-2 rounded-full", col.tone)} />
                <h2 className="font-sans text-sm font-bold tracking-normal">{STATUS_LABEL[col.status]}</h2>
                <span className="ml-auto rounded-full bg-card px-2 text-xs font-bold">{orders.length}</span>
              </header>
              <div className="space-y-3">
                {orders.length === 0 ? (
                  <p className="rounded-xl border border-dashed p-4 text-center text-xs text-muted-foreground">Nothing here</p>
                ) : (
                  orders.map((o) => <BoardCard key={o.id} order={o} />)
                )}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
