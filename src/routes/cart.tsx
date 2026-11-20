import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { QuantityStepper } from "@/components/shared/QuantityStepper";
import { PageContainer, SiteShell } from "@/components/site/SiteShell";
import { resolveImage } from "@/data/images";
import { useCart, useCurrentUser } from "@/hooks/use-app";
import { formatMoney, RESTAURANT } from "@/lib/config";
import { removeFromCart, setQuantity } from "@/services/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: `Your cart — ${RESTAURANT.name}` },
      { name: "description", content: "Review your dishes and quantities before checking out." },
      { property: "og:title", content: `Your cart — ${RESTAURANT.name}` },
      { property: "og:description", content: "Review your order before checkout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, count, total } = useCart();
  const user = useCurrentUser();

  return (
    <SiteShell>
      <PageContainer className="max-w-4xl">
        <h1 className="text-4xl font-semibold">Your cart</h1>
        {lines.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is empty"
              description="Add a few dishes from the menu and they'll show up here."
              action={<Button asChild><Link to="/menu">Browse the menu</Link></Button>}
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="divide-y rounded-2xl border bg-card shadow-soft">
              {lines.map(({ item, quantity }) => (
                <div key={item.id} className="flex items-center gap-4 p-4">
                  <img src={resolveImage(item.image)} alt={item.name} className="size-20 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <Link to="/menu/$itemId" params={{ itemId: item.id }} className="font-semibold hover:text-primary">{item.name}</Link>
                    <div className="text-sm text-muted-foreground">{formatMoney(item.price)}</div>
                    {!item.available && <div className="text-xs font-semibold text-destructive">Sold out — remove to continue</div>}
                    <div className="mt-2 flex items-center gap-3">
                      <QuantityStepper size="sm" value={quantity} onChange={(n) => setQuantity(item.id, n)} />
                      <button type="button" onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive" aria-label={`Remove ${item.name}`}>
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                  <div className="font-semibold">{formatMoney(item.price * quantity)}</div>
                </div>
              ))}
            </div>
            <aside className="h-fit rounded-2xl border bg-card p-5 shadow-soft">
              <h2 className="font-sans text-base font-bold tracking-normal">Summary</h2>
              <div className="mt-4 flex justify-between text-sm"><span className="text-muted-foreground">Items</span><span>{count}</span></div>
              <div className="mt-2 flex justify-between border-t pt-3 text-lg font-bold"><span>Total</span><span>{formatMoney(total)}</span></div>
              <p className="mt-1 text-xs text-muted-foreground">You'll pay at the counter or when served.</p>
              <Button asChild size="lg" className="mt-5 w-full" disabled={lines.some((l) => !l.item.available)}>
                {user ? (
                  <Link to="/checkout">Checkout <ArrowRight /></Link>
                ) : (
                  <Link to="/login" search={{ redirect: "/checkout" }}>Sign in to checkout <ArrowRight /></Link>
                )}
              </Button>
              <Button asChild variant="ghost" className="mt-2 w-full">
                <Link to="/menu">Add more dishes</Link>
              </Button>
            </aside>
          </div>
        )}
      </PageContainer>
    </SiteShell>
  );
}
