import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Activity, ClipboardList, LayoutDashboard, Layers, UserCog, Users, UtensilsCrossed } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/dashboard/DashboardShell";
import { useNewOrderAlerts } from "@/components/dashboard/useNewOrderAlerts";
import { RequireRole } from "@/components/shared/RequireRole";
import { RESTAURANT } from "@/lib/config";
import { useDb } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: `Admin — ${RESTAURANT.name}` },
      { name: "description", content: "Revenue, orders, menu, staff and activity at a glance." },
      { property: "og:title", content: `Admin — ${RESTAURANT.name}` },
      { property: "og:description", content: "Manage the restaurant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <RequireRole roles={["admin"]}>
      <AdminShell />
    </RequireRole>
  ),
});

function AdminShell() {
  const orders = useDb().orders;
  useNewOrderAlerts(orders);
  const pending = orders.filter((o) => o.status === "pending").length;
  const items: NavItem[] = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { to: "/admin/orders", label: "Orders", icon: ClipboardList, badge: pending },
    { to: "/admin/menu", label: "Menu items", icon: UtensilsCrossed },
    { to: "/admin/categories", label: "Categories", icon: Layers },
    { to: "/admin/customers", label: "Customers", icon: Users },
    { to: "/admin/staff", label: "Staff", icon: UserCog },
    { to: "/admin/activity", label: "Activity log", icon: Activity },
  ];
  return (
    <DashboardShell items={items} title="Admin">
      <Outlet />
    </DashboardShell>
  );
}
