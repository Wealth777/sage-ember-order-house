import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCheck, ClipboardCheck, Wallet } from "lucide-react";
import { ActivityTable } from "@/components/dashboard/ActivityTable";
import { DashHeader } from "@/components/dashboard/DashboardShell";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { Panel } from "@/components/dashboard/Panel";
import { StatCard } from "@/components/dashboard/StatCard";
import { useCurrentUser } from "@/hooks/use-app";
import { formatMoney } from "@/lib/config";
import { useDb } from "@/lib/store";

export const Route = createFileRoute("/staff/history")({
  component: StaffHistory,
});

function StaffHistory() {
  const db = useDb();
  const user = useCurrentUser()!;
  const navigate = useNavigate();
  const handled = db.orders.filter((o) => o.staffId === user.id);
  const done = handled.filter((o) => o.status === "completed");
  const myLogs = db.activity.filter((l) => l.userId === user.id).slice(0, 40);

  return (
    <>
      <DashHeader title="My history" description="Orders you've accepted and everything you've done." />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Orders accepted" value={handled.length} icon={ClipboardCheck} />
        <StatCard label="Completed" value={done.length} icon={CheckCheck} tone="ready" />
        <StatCard label="Value served" value={formatMoney(done.reduce((s, o) => s + o.total, 0))} icon={Wallet} tone="brass" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Orders I handled" bodyClassName="p-0">
          <OrdersTable orders={handled} onSelect={(o) => void navigate({ to: "/staff/orders/$orderId", params: { orderId: o.id } })} />
        </Panel>
        <Panel title="My activity">
          <ActivityTable logs={myLogs} compact />
        </Panel>
      </div>
    </>
  );
}
