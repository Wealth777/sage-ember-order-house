import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderDetail } from "@/components/dashboard/OrderDetail";
import { EmptyState } from "@/components/shared/EmptyState";
import { useDb } from "@/lib/store";

export const Route = createFileRoute("/staff/orders/$orderId")({
  component: StaffOrderDetail,
});

function StaffOrderDetail() {
  const { orderId } = Route.useParams();
  const order = useDb().orders.find((o) => o.id === orderId);
  return (
    <div className="max-w-4xl">
      <Link to="/staff/orders" className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> All orders
      </Link>
      {order ? (
        <OrderDetail order={order} />
      ) : (
        <EmptyState icon={Receipt} title="Order not found" action={<Button asChild><Link to="/staff/orders">Back to orders</Link></Button>} />
      )}
    </div>
  );
}
