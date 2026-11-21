import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { DashHeader } from "@/components/dashboard/DashboardShell";
import { formatMoney } from "@/lib/config";
import { initials, longDate, shortDate } from "@/lib/format";
import { useDb } from "@/lib/store";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomers,
});

function AdminCustomers() {
  const db = useDb();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const rows = db.users
    .filter((u) => u.role === "customer")
    .filter((u) => !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    .map((u) => {
      const orders = db.orders.filter((o) => o.customerId === u.id);
      return {
        user: u,
        count: orders.length,
        spent: orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0),
        last: orders[0]?.createdAt ?? null,
      };
    })
    .sort((a, b) => b.spent - a.spent);

  return (
    <>
      <DashHeader title="Customers" description="Everyone who has an account, ranked by spend." />
      <div className="rounded-2xl border bg-card shadow-soft">
        <div className="border-b p-4">
          <div className="relative sm:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or email" className="pl-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Customer</th>
                <th className="px-3 py-3">Phone</th>
                <th className="px-3 py-3">Joined</th>
                <th className="px-3 py-3">Orders</th>
                <th className="px-3 py-3">Total spent</th>
                <th className="px-5 py-3 text-right">Last order</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ user, count, spent, last }) => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">{initials(user.name)}</span>
                      <div>
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{user.phone}</td>
                  <td className="px-3 py-3 text-muted-foreground">{longDate(user.createdAt)}</td>
                  <td className="px-3 py-3 font-semibold">{count}</td>
                  <td className="px-3 py-3 font-semibold">{formatMoney(spent)}</td>
                  <td className="px-5 py-3 text-right text-muted-foreground">{last ? shortDate(last) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">No customers found.</div>}
        </div>
      </div>
    </>
  );
}
