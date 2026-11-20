import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Receipt, Store, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { OrderProgress } from "@/components/shared/OrderProgress";
import { RequireRole } from "@/components/shared/RequireRole";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageContainer, SiteShell } from "@/components/site/SiteShell";
import { resolveImage } from "@/data/images";
import { useCurrentUser } from "@/hooks/use-app";
import { formatMoney, RESTAURANT } from "@/lib/config";
import { shortDate } from "@/lib/format";
import { canTransition } from "@/lib/order-workflow";
import { useDb } from "@/lib/store";
import type { OrderStatus } from "@/lib/types";
import { updateOrderStatus } from "@/services/orders";

export const Route = createFileRoute("/orders/$orderId")({
  validateSearch: (s: Record<string, unknown>): { placed?: boolean } =>
    s.placed === true || s.placed === "true" ? { placed: true } : {},
  head: () => ({
    meta: [
      { title: `Track your order — ${RESTAURANT.name}` },
      { name: "description", content: "Follow your order live from the kitchen to your table." },
      { property: "og:title", content: `Track your order — ${RESTAURANT.name}` },
      { property: "og:description", content: "Live order tracking." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <SiteShell>
      <RequireRole roles={["customer"]}>
        <TrackOrder />
      </RequireRole>
    </SiteShell>
  ),
});

const MESSAGES: Record<OrderStatus, string> = {
  pending: "We've received your order and the kitchen will confirm it shortly.",
  confirmed: "Your order is confirmed and queued in the kitchen.",
  preparing: "Our chefs are preparing your food right now.",
  ready: "Your order is ready! It's on its way to you.",
  completed: "Enjoy your meal — thanks for ordering with us.",
  cancelled: "This order was cancelled.",
};

function TrackOrder() {
  const { orderId } = Route.useParams();
  const { placed } = Route.useSearch();
  const user = useCurrentUser()!;
  const order = useDb().orders.find((o) => o.id === orderId && o.customerId === user.id);

  if (!order) {
    return (
      <PageContainer className="max-w-3xl">
        <EmptyState icon={Receipt} title="Order not found" description="We couldn't find this order on your account." action={<Button asChild><Link to="/orders">My orders</Link></Button>} />
      </PageContainer>
    );
  }

  const canCancel = canTransition(order.status, "cancelled", "customer");

  return (
    <PageContainer className="max-w-3xl">
      <Link to="/orders" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> My orders
      </Link>

      {placed && order.status === "pending" && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-status-ready/30 bg-status-ready/10 p-4 fade-up">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-status-ready" />
          <div className="text-sm">
            <p className="font-bold">Order placed — thank you!</p>
            <p className="text-muted-foreground">
              This page updates by itself. Demo tip: open the{" "}
              <a href="/login?role=staff" target="_blank" rel="noreferrer" className="font-semibold text-primary underline">staff dashboard</a>{" "}
              in a new tab and accept the order to see it move here.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 rounded-3xl border bg-card p-5 shadow-card sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Order {order.code} · {shortDate(order.createdAt)}</p>
            <h1 className="mt-1 text-3xl font-semibold">{MESSAGES[order.status]}</h1>
          </div>
          <StatusBadge status={order.status} className="text-sm" />
        </div>
        <div className="mt-8">
          <OrderProgress order={order} />
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4 border-t pt-5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            {order.type === "dine-in" ? <UtensilsCrossed className="size-4" /> : <Store className="size-4" />}
            {order.type === "dine-in" ? `Dine-in · Table ${order.tableNumber}` : "Pickup at the counter"}
          </span>
          {order.staffName && <span>Handled by {order.staffName}</span>}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border bg-card shadow-soft">
        <div className="divide-y">
          {order.items.map((l) => (
            <div key={l.itemId} className="flex items-center gap-4 p-4">
              <img src={resolveImage(l.image)} alt="" className="size-14 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="font-semibold">{l.name}</div>
                <div className="text-sm text-muted-foreground">{l.quantity} × {formatMoney(l.price)}</div>
              </div>
              <div className="font-semibold">{formatMoney(l.price * l.quantity)}</div>
            </div>
          ))}
        </div>
        {order.notes && <div className="border-t px-4 py-3 text-sm"><span className="font-semibold">Notes:</span> {order.notes}</div>}
        <div className="flex justify-between border-t bg-muted/50 px-4 py-3 font-bold">
          <span>Total</span>
          <span>{formatMoney(order.total)}</span>
        </div>
      </div>

      {canCancel && (
        <div className="mt-6 flex justify-end">
          <Button
            variant="outline"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => {
              if (!confirm("Cancel this order?")) return;
              try {
                updateOrderStatus(user, order.id, "cancelled");
                toast.success("Your order was cancelled");
              } catch (e) {
                toast.error((e as Error).message);
              }
            }}
          >
            Cancel order
          </Button>
        </div>
      )}
    </PageContainer>
  );
}
