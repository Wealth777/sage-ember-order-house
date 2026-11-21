import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { DashHeader } from "@/components/dashboard/DashboardShell";
import { MenuItemDialog } from "@/components/dashboard/MenuItemDialog";
import { resolveImage } from "@/data/images";
import { useCurrentUser } from "@/hooks/use-app";
import { formatMoney } from "@/lib/config";
import { useDb } from "@/lib/store";
import type { MenuItem } from "@/lib/types";
import { deleteMenuItem, setItemAvailability } from "@/services/menu";

export const Route = createFileRoute("/admin/menu")({
  component: AdminMenu,
});

function AdminMenu() {
  const db = useDb();
  const admin = useCurrentUser()!;
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [open, setOpen] = useState(false);
  const q = query.trim().toLowerCase();
  const items = db.menuItems.filter((m) => !q || m.name.toLowerCase().includes(q));
  const catName = (id: string) => db.categories.find((c) => c.id === id)?.name ?? "—";

  return (
    <>
      <DashHeader
        title="Menu items"
        description={`${db.menuItems.length} dishes · ${db.menuItems.filter((m) => !m.available).length} sold out`}
        actions={
          <Button onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus /> Add dish
          </Button>
        }
      />
      <div className="rounded-2xl border bg-card shadow-soft">
        <div className="border-b p-4">
          <div className="relative sm:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search dishes" className="pl-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Dish</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3">Price</th>
                <th className="px-3 py-3">Available</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.id} className="border-b last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={resolveImage(m.image)} alt="" className="size-11 rounded-lg object-cover" />
                      <div>
                        <div className="font-semibold">{m.name}</div>
                        {m.popular && <div className="text-xs font-semibold text-brass">Chef's pick</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{catName(m.categoryId)}</td>
                  <td className="px-3 py-3 font-semibold">{formatMoney(m.price)}</td>
                  <td className="px-3 py-3">
                    <Switch
                      checked={m.available}
                      onCheckedChange={(v) => {
                        setItemAvailability(admin, m.id, v);
                        toast.success(`${m.name} is now ${v ? "available" : "sold out"}`);
                      }}
                      aria-label={`Toggle ${m.name} availability`}
                    />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button size="icon" variant="ghost" aria-label={`Edit ${m.name}`} onClick={() => { setEditing(m); setOpen(true); }}>
                      <Pencil />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Delete ${m.name}`}
                      onClick={() => {
                        if (!confirm(`Remove ${m.name} from the menu?`)) return;
                        deleteMenuItem(admin, m.id);
                        toast.success(`${m.name} removed`);
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <MenuItemDialog open={open} onOpenChange={setOpen} item={editing} categories={db.categories} />
    </>
  );
}
