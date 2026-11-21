import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DashHeader, LiveIndicator } from "@/components/dashboard/DashboardShell";
import { filterOrders, OrderFilters, type StatusFilter } from "@/components/dashboard/OrderFilters";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { useDb } from "@/lib/store";

export const Route = createFileRoute("/staff/orders/")({
  component: StaffOrders,
});

function StaffOrders() {
  const db = useDb();
  const navigate = useNavigate();
  const [status, setStatus] = useState<StatusFilter>("active");
  const [query, setQuery] = useState("");
  const orders = filterOrders(db.orders, status, query);

  return (
    <>
      <DashHeader title="Orders" description="Every order, newest first. Click one to see details and update it." actions={<LiveIndicator />} />
      <div className="rounded-2xl border bg-card shadow-soft">
        <OrderFilters orders={db.orders} status={status} onStatus={setStatus} query={query} onQuery={setQuery} />
        <OrdersTable orders={orders} showStaff onSelect={(o) => void navigate({ to: "/staff/orders/$orderId", params: { orderId: o.id } })} />
      </div>
    </>
  );
}
