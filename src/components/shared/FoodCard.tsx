import { Link } from "@tanstack/react-router";
import { Clock, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { resolveImage } from "@/data/images";
import { formatMoney } from "@/lib/config";
import type { MenuItem } from "@/lib/types";
import { useCartLines } from "@/lib/store";
import { addToCart, setQuantity } from "@/services/cart";
import { QuantityStepper } from "./QuantityStepper";

export function FoodCard({ item, categoryName }: { item: MenuItem; categoryName?: string }) {
  const qty = useCartLines().find((l) => l.itemId === item.id)?.quantity ?? 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-soft transition-shadow hover:shadow-card">
      <Link to="/menu/$itemId" params={{ itemId: item.id }} className="relative block aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={resolveImage(item.image)}
          alt={item.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {item.popular && item.available && (
          <span className="absolute left-3 top-3 rounded-full bg-brass px-2.5 py-1 text-[0.7rem] font-bold text-brass-foreground">
            Chef's pick
          </span>
        )}
        {!item.available && (
          <span className="absolute inset-0 grid place-items-center bg-foreground/45 text-sm font-semibold text-primary-foreground">
            Sold out today
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        {categoryName && <span className="text-xs font-medium text-muted-foreground">{categoryName}</span>}
        <Link to="/menu/$itemId" params={{ itemId: item.id }} className="mt-0.5">
          <h3 className="text-lg font-semibold leading-snug hover:text-primary">{item.name}</h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <div>
            <div className="font-semibold">{formatMoney(item.price)}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3" /> {item.prepMinutes} min
            </div>
          </div>
          {qty > 0 ? (
            <QuantityStepper size="sm" value={qty} onChange={(n) => setQuantity(item.id, n)} />
          ) : (
            <Button
              size="sm"
              disabled={!item.available}
              onClick={() => {
                addToCart(item.id);
                toast.success(`${item.name} added to your cart`);
              }}
            >
              <Plus /> Add
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
