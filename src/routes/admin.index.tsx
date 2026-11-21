import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ClipboardList, UserCog, Users, Wallet } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ActivityTable } from "@/components/dashboard/ActivityTable";
import { DashHeader, LiveIndicator } from "@/components/dashboard/DashboardShell";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { Panel } from "@/components/dashboard/Panel";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatMoney } from "@/lib/config";
import { STATUS_FLOW, STATUS_LABEL } from "@/lib/order-workflow";
import { revenueByDay, topItems, totals } from "@/lib/stats";
import { useDb } from "@/lib/store";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
};

function AdminOverview() {
  const db = useDb();
  const navigate = useNavigate();
  const t = totals(db);
  const series = revenueByDay(db);
  const top = topItems(db);
  const byStatus = [...STATUS_FLOW, "cancelled" as const].map((s) => ({
    status: STATUS_LABEL[s],
    count: db.orders.filter((o) => o.status === s).length,
  }));
  const weekRevenue = series.reduce((s, d) => s + d.revenue, 0);

  return (
    <>
      <DashHeader title="Business overview" description="How the restaurant is doing, updated as orders come in." actions={<LiveIndicator />} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total revenue" value={formatMoney(t.revenue)} icon={Wallet} tone="brass" hint={`Avg. order ${formatMoney(t.avgOrder)}`} />
        <StatCard label="Total orders" value={t.orders} icon={ClipboardList} hint={`${db.orders.filter((o) => o.status === "pending").length} waiting now`} />
        <StatCard label="Customers" value={t.customers} icon={Users} tone="ready" hint="Registered accounts" />
        <StatCard label="Staff" value={t.staff} icon={UserCog} tone="preparing" hint={`${t.activeStaff} active`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel title="Revenue · last 7 days" action={<span className="text-sm font-bold">{formatMoney(weekRevenue)}</span>} className="xl:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ left: 0, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={48} stroke="var(--muted-foreground)" tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [formatMoney(v), "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Orders by status">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byStatus} layout="vertical" margin={{ left: 8, right: 16 }}>
                <XAxis type="number" hide allowDecimals={false} />
                <YAxis type="category" dataKey="status" tickLine={false} axisLine={false} fontSize={12} width={80} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="count" fill="var(--chart-2)" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel title="Recent orders" action={<Link to="/admin/orders" className="text-sm font-semibold text-primary hover:underline">View all</Link>} className="xl:col-span-2" bodyClassName="p-0">
          <OrdersTable orders={db.orders.slice(0, 6)} onSelect={() => void navigate({ to: "/admin/orders" })} />
        </Panel>
        <Panel title="Best sellers">
          <ol className="space-y-4">
            {top.map((item, i) => (
              <li key={item.name} className="flex items-center gap-3 text-sm">
                <span className="grid size-7 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">{i + 1}</span>
                <span className="flex-1 font-semibold">{item.name}</span>
                <span className="text-muted-foreground">{item.qty} sold</span>
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      <Panel title="Latest activity" className="mt-6" action={<Link to="/admin/activity" className="text-sm font-semibold text-primary hover:underline">Full log</Link>}>
        <ActivityTable logs={db.activity.slice(0, 8)} compact />
      </Panel>
    </>
  );
}
