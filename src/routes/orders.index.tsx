import { createFileRoute, Link } from "@tanstack/react-router";
import { Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { OrderCard } from "@/components/shared/OrderCard";
import { RequireRole } from "@/components/shared/RequireRole";
import { PageContainer, SiteShell } from "@/components/site/SiteShell";
import { useCurrentUser } from "@/hooks/use-app";
import { RESTAURANT } from "@/lib/config";
import { isActiveStatus } from "@/lib/order-workflow";
import { useDb } from "@/lib/store";

export const Route = createFileRoute("/orders/")({
  head: () => ({
    meta: [
      { title: `My orders — ${RESTAURANT.name}` },
      { name: "description", content: "See your current and past orders and track their progress." },
      { property: "og:title", content: `My orders — ${RESTAURANT.name}` },
      { property: "og:description", content: "Your order history and live tracking." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <SiteShell>
      <RequireRole roles={["customer"]}>
        <MyOrders />
      </RequireRole>
    </SiteShell>
  ),
});

function MyOrders() {
  const user = useCurrentUser()!;
  const db = useDb();
  const mine = db.orders.filter((o) => o.customerId === user.id);
  const active = mine.filter((o) => isActiveStatus(o.status));
  const past = mine.filter((o) => !isActiveStatus(o.status));

  return (
    <PageContainer className="max-w-3xl">
      <h1 className="text-4xl font-semibold">My orders</h1>
      {mine.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={Receipt} title="No orders yet" description="When you place an order it will appear here so you can track it." action={<Button asChild><Link to="/menu">Order something delicious</Link></Button>} />
        </div>
      ) : (
        <>
          <section className="mt-8">
            <h2 className="font-sans text-sm font-bold uppercase tracking-wider text-muted-foreground">In progress ({active.length})</h2>
            <div className="mt-3 space-y-3">
              {active.length === 0 ? (
                <p className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground">No active orders right now.</p>
              ) : (
                active.map((o) => <OrderCard key={o.id} order={o} />)
              )}
            </div>
          </section>
          <section className="mt-10">
            <h2 className="font-sans text-sm font-bold uppercase tracking-wider text-muted-foreground">Past orders ({past.length})</h2>
            <div className="mt-3 space-y-3">
              {past.map((o) => <OrderCard key={o.id} order={o} />)}
            </div>
          </section>
        </>
      )}
    </PageContainer>
  );
}
