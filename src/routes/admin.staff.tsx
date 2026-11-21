import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DashHeader } from "@/components/dashboard/DashboardShell";
import { useCurrentUser } from "@/hooks/use-app";
import { initials, longDate } from "@/lib/format";
import { useDb } from "@/lib/store";
import { cn } from "@/lib/utils";
import { createStaff, removeStaff, setStaffActive } from "@/services/staff";

export const Route = createFileRoute("/admin/staff")({
  component: AdminStaff,
});

const EMPTY = { name: "", email: "", phone: "", password: "" };

function AdminStaff() {
  const db = useDb();
  const admin = useCurrentUser()!;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const staff = db.users.filter((u) => u.role === "staff");

  return (
    <>
      <DashHeader
        title="Staff"
        description="Add team members and control who can sign in to the kitchen dashboard."
        actions={<Button onClick={() => { setForm(EMPTY); setOpen(true); }}><Plus /> Add staff</Button>}
      />
      <div className="rounded-2xl border bg-card shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Team member</th>
                <th className="px-3 py-3">Phone</th>
                <th className="px-3 py-3">Joined</th>
                <th className="px-3 py-3">Orders handled</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id} className="border-b last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-full bg-status-preparing/12 text-xs font-bold text-status-preparing">{initials(s.name)}</span>
                      <div>
                        <div className="font-semibold">{s.name}</div>
                        <div className="text-xs text-muted-foreground">{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{s.phone || "—"}</td>
                  <td className="px-3 py-3 text-muted-foreground">{longDate(s.createdAt)}</td>
                  <td className="px-3 py-3 font-semibold">{db.orders.filter((o) => o.staffId === s.id).length}</td>
                  <td className="px-3 py-3">
                    <label className="flex items-center gap-2">
                      <Switch
                        checked={s.active}
                        onCheckedChange={(v) => {
                          setStaffActive(admin, s.id, v);
                          toast.success(`${s.name} ${v ? "reactivated" : "deactivated"}`);
                        }}
                        aria-label={`Toggle ${s.name}`}
                      />
                      <span className={cn("text-xs font-semibold", s.active ? "text-status-ready" : "text-muted-foreground")}>
                        {s.active ? "Active" : "Inactive"}
                      </span>
                    </label>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Remove ${s.name}`}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => {
                        if (!confirm(`Remove ${s.name} from the team?`)) return;
                        removeStaff(admin, s.id);
                        toast.success(`${s.name} removed`);
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {staff.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">No staff yet.</div>}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Add a team member</DialogTitle>
            <DialogDescription>They can sign in to the staff dashboard straight away.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              try {
                createStaff(admin, form);
                toast.success(`${form.name} added to the team`);
                setOpen(false);
              } catch (err) {
                toast.error((err as Error).message);
              }
            }}
          >
            {(["name", "email", "phone", "password"] as const).map((k) => (
              <div key={k} className="space-y-1.5">
                <Label htmlFor={`st-${k}`} className="capitalize">{k === "password" ? "Temporary password" : k}</Label>
                <Input
                  id={`st-${k}`}
                  type={k === "password" ? "password" : k === "email" ? "email" : "text"}
                  value={form[k]}
                  onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                  required={k !== "phone"}
                />
              </div>
            ))}
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Add staff</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
