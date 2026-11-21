import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ClipboardList, History, LayoutDashboard } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/dashboard/DashboardShell";
import { useNewOrderAlerts } from "@/components/dashboard/useNewOrderAlerts";
import { RequireRole } from "@/components/shared/RequireRole";
import { RESTAURANT } from "@/lib/config";
import { useDb } from "@/lib/store";

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [
      { title: `Staff dashboard — ${RESTAURANT.name}` },
      { name: "description", content: "Incoming orders and the live kitchen queue." },
      { property: "og:title", content: `Staff dashboard — ${RESTAURANT.name}` },
      { property: "og:description", content: "Run the kitchen order queue." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: StaffLayout,
});

function StaffLayout() {
  return (
    <RequireRole roles={["staff", "admin"]}>
      <StaffShell />
    </RequireRole>
  );
}

function StaffShell() {
  const orders = useDb().orders;
  useNewOrderAlerts(orders);
  const pending = orders.filter((o) => o.status === "pending").length;
  const items: NavItem[] = [
    { to: "/staff", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/staff/orders", label: "Orders", icon: ClipboardList, badge: pending },
    { to: "/staff/history", label: "My history", icon: History },
  ];
  return (
    <DashboardShell items={items} title="Kitchen">
      <Outlet />
    </DashboardShell>
  );
}
