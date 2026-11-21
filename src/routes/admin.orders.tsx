import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { DashHeader, LiveIndicator } from "@/components/dashboard/DashboardShell";
import { OrderDetail } from "@/components/dashboard/OrderDetail";
import { filterOrders, OrderFilters, type StatusFilter } from "@/components/dashboard/OrderFilters";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { useDb } from "@/lib/store";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

function AdminOrders() {
  const db = useDb();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = db.orders.find((o) => o.id === selectedId) ?? null;
  const orders = filterOrders(db.orders, status, query);

  return (
    <>
      <DashHeader title="Orders" description="Monitor and manage every order across the restaurant." actions={<LiveIndicator />} />
      <div className="rounded-2xl border bg-card shadow-soft">
        <OrderFilters orders={db.orders} status={status} onStatus={setStatus} query={query} onQuery={setQuery} />
        <OrdersTable orders={orders} showStaff onSelect={(o) => setSelectedId(o.id)} />
      </div>
      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent className="w-full overflow-y-auto bg-background p-5 sm:max-w-2xl sm:p-6">
          <SheetTitle className="sr-only">Order details</SheetTitle>
          {selected && <OrderDetail order={selected} />}
        </SheetContent>
      </Sheet>
    </>
  );
}
