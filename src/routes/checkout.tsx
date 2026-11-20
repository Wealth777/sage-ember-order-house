import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, ShoppingBag, Store, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/shared/EmptyState";
import { RequireRole } from "@/components/shared/RequireRole";
import { PageContainer, SiteShell } from "@/components/site/SiteShell";
import { resolveImage } from "@/data/images";
import { useCart, useCurrentUser } from "@/hooks/use-app";
import { formatMoney, RESTAURANT } from "@/lib/config";
import { cn } from "@/lib/utils";
import type { OrderType } from "@/lib/types";
import { readCart } from "@/lib/store";
import { clearCart } from "@/services/cart";
import { placeOrder } from "@/services/orders";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: `Checkout — ${RESTAURANT.name}` },
      { name: "description", content: "Choose dine-in or pickup and place your order." },
      { property: "og:title", content: `Checkout — ${RESTAURANT.name}` },
      { property: "og:description", content: "Place your order in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <SiteShell>
      <RequireRole roles={["customer"]}>
        <Checkout />
      </RequireRole>
    </SiteShell>
  ),
});

function Checkout() {
  const user = useCurrentUser()!;
  const { lines, total } = useCart();
  const navigate = useNavigate();
  const [type, setType] = useState<OrderType>("dine-in");
  const [table, setTable] = useState("");
  const [phone, setPhone] = useState(user.phone);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (lines.length === 0) {
    return (
      <PageContainer className="max-w-3xl">
        <EmptyState icon={ShoppingBag} title="Nothing to check out" description="Your cart is empty." action={<Button asChild><Link to="/menu">Browse the menu</Link></Button>} />
      </PageContainer>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    // Small delay so the demo feels like a real network request.
    setTimeout(() => {
      try {
        const order = placeOrder(user, readCart(), { type, tableNumber: table, notes, phone });
        clearCart();
        toast.success(`Order ${order.code} placed!`, { description: "The kitchen has it now." });
        void navigate({ to: "/orders/$orderId", params: { orderId: order.id }, search: { placed: true } });
      } catch (err) {
        setError((err as Error).message);
        setBusy(false);
      }
    }, 600);
  };

  const typeOption = (value: OrderType, title: string, text: string, Icon: typeof Store) => (
    <button
      type="button"
      onClick={() => setType(value)}
      className={cn(
        "flex flex-1 items-start gap-3 rounded-xl border bg-card p-4 text-left transition-all",
        type === value ? "border-primary ring-2 ring-primary/15" : "hover:border-primary/40",
      )}
    >
      <span className={cn("grid size-9 place-items-center rounded-full", type === value ? "bg-primary text-primary-foreground" : "bg-muted")}>
        <Icon className="size-4" />
      </span>
      <span>
        <span className="block font-bold">{title}</span>
        <span className="block text-xs text-muted-foreground">{text}</span>
      </span>
    </button>
  );

  return (
    <PageContainer className="max-w-5xl">
      <h1 className="text-4xl font-semibold">Checkout</h1>
      <form onSubmit={submit} className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6 rounded-2xl border bg-card p-5 shadow-soft sm:p-6">
          <div>
            <h2 className="font-sans text-base font-bold tracking-normal">How would you like it?</h2>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              {typeOption("dine-in", "Dine-in", "Served to your table", UtensilsCrossed)}
              {typeOption("pickup", "Pickup", "Collect at the counter", Store)}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {type === "dine-in" && (
              <div className="space-y-1.5">
                <Label htmlFor="table">Table number</Label>
                <Input id="table" inputMode="numeric" value={table} onChange={(e) => setTable(e.target.value)} placeholder="e.g. 7" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone number</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes for the kitchen (optional)</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Allergies, preferences, celebrations…" rows={3} />
          </div>
          <div className="rounded-xl bg-secondary p-4 text-sm">
            <span className="font-bold">Payment:</span> pay at the counter or when your food is served. Online payment can be added later.
          </div>
          {error && <p className="rounded-lg bg-destructive/10 p-3 text-sm font-semibold text-destructive">{error}</p>}
        </div>

        <aside className="h-fit rounded-2xl border bg-card p-5 shadow-soft">
          <h2 className="font-sans text-base font-bold tracking-normal">Your order</h2>
          <ul className="mt-4 space-y-3">
            {lines.map(({ item, quantity }) => (
              <li key={item.id} className="flex items-center gap-3 text-sm">
                <img src={resolveImage(item.image)} alt="" className="size-11 rounded-lg object-cover" />
                <span className="flex-1"><span className="font-bold">{quantity}×</span> {item.name}</span>
                <span className="font-semibold">{formatMoney(item.price * quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t pt-3 text-lg font-bold"><span>Total</span><span>{formatMoney(total)}</span></div>
          <Button type="submit" size="lg" className="mt-5 w-full" disabled={busy}>
            {busy ? <><Loader2 className="animate-spin" /> Placing order…</> : `Place order · ${formatMoney(total)}`}
          </Button>
        </aside>
      </form>
    </PageContainer>
  );
}
