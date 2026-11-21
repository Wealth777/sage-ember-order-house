import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RequireRole } from "@/components/shared/RequireRole";
import { PageContainer, SiteShell } from "@/components/site/SiteShell";
import { useCurrentUser } from "@/hooks/use-app";
import { formatMoney, RESTAURANT } from "@/lib/config";
import { initials, longDate } from "@/lib/format";
import { useDb } from "@/lib/store";
import { logout, updateProfile } from "@/services/auth";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: `Your profile — ${RESTAURANT.name}` },
      { name: "description", content: "Update your name and phone number." },
      { property: "og:title", content: `Your profile — ${RESTAURANT.name}` },
      { property: "og:description", content: "Manage your customer account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <SiteShell>
      <RequireRole roles={["customer"]}>
        <Profile />
      </RequireRole>
    </SiteShell>
  ),
});

function Profile() {
  const user = useCurrentUser()!;
  const db = useDb();
  const navigate = useNavigate();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const orders = db.orders.filter((o) => o.customerId === user.id);
  const spent = orders.filter((o) => o.status === "completed").reduce((s, o) => s + o.total, 0);

  return (
    <PageContainer className="max-w-3xl">
      <div className="flex items-center gap-4">
        <span className="grid size-16 place-items-center rounded-full bg-primary font-display text-2xl font-semibold text-primary-foreground">
          {initials(user.name)}
        </span>
        <div>
          <h1 className="text-3xl font-semibold">{user.name}</h1>
          <p className="text-sm text-muted-foreground">Member since {longDate(user.createdAt)}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-card p-5 shadow-soft">
          <div className="text-sm text-muted-foreground">Orders placed</div>
          <div className="mt-1 font-display text-3xl font-semibold">{orders.length}</div>
        </div>
        <div className="rounded-2xl border bg-card p-5 shadow-soft">
          <div className="text-sm text-muted-foreground">Total spent</div>
          <div className="mt-1 font-display text-3xl font-semibold">{formatMoney(spent)}</div>
        </div>
      </div>

      <form
        className="mt-6 space-y-4 rounded-2xl border bg-card p-5 shadow-soft sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim().length < 2) {
            toast.error("Please enter your name.");
            return;
          }
          updateProfile(user, { name, phone });
          toast.success("Profile saved");
        }}
      >
        <h2 className="font-sans text-base font-bold tracking-normal">Account details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email} disabled />
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              logout(user);
              void navigate({ to: "/" });
            }}
          >
            <LogOut /> Sign out
          </Button>
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </PageContainer>
  );
}
