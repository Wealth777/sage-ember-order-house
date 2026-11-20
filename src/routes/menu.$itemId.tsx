import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Clock, Flame, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { FoodCard } from "@/components/shared/FoodCard";
import { QuantityStepper } from "@/components/shared/QuantityStepper";
import { PageContainer, SiteShell } from "@/components/site/SiteShell";
import { resolveImage } from "@/data/images";
import { SEED_MENU_ITEMS } from "@/data/mock-data";
import { formatMoney, RESTAURANT } from "@/lib/config";
import { useDb } from "@/lib/store";
import { addToCart } from "@/services/cart";

export const Route = createFileRoute("/menu/$itemId")({
  head: ({ params }) => {
    const item = SEED_MENU_ITEMS.find((m) => m.id === params.itemId);
    const title = item ? `${item.name} — ${RESTAURANT.name}` : `Dish — ${RESTAURANT.name}`;
    const description = item?.description ?? "See dish details, price and prep time.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: FoodDetails,
});

function FoodDetails() {
  const { itemId } = Route.useParams();
  const db = useDb();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const item = db.menuItems.find((m) => m.id === itemId);

  if (!item) {
    return (
      <SiteShell>
        <PageContainer>
          <EmptyState
            icon={ShoppingBag}
            title="This dish isn't on the menu"
            description="It may have been removed. Have a look at what's cooking today."
            action={<Button asChild><Link to="/menu">Back to menu</Link></Button>}
          />
        </PageContainer>
      </SiteShell>
    );
  }

  const category = db.categories.find((c) => c.id === item.categoryId);
  const related = db.menuItems.filter((m) => m.categoryId === item.categoryId && m.id !== item.id).slice(0, 3);

  return (
    <SiteShell>
      <PageContainer>
        <Link to="/menu" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to menu
        </Link>
        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="overflow-hidden rounded-3xl bg-muted shadow-card">
            <img src={resolveImage(item.image)} alt={item.name} className="aspect-[4/3] size-full object-cover lg:aspect-square" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="eyebrow">{category?.name}</span>
            <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">{item.name}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{item.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm font-medium">
                <Clock className="size-3.5" /> {item.prepMinutes} min
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm font-medium">
                <Flame className="size-3.5" /> {item.calories} kcal
              </span>
              {item.tags.map((t) => (
                <span key={t} className="rounded-full bg-primary-soft px-3 py-1 text-sm font-semibold text-primary">{t}</span>
              ))}
            </div>
            <div className="mt-8 font-display text-3xl font-semibold">{formatMoney(item.price)}</div>
            {item.available ? (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <QuantityStepper value={qty} onChange={(n) => setQty(Math.max(1, n))} />
                <Button
                  size="lg"
                  onClick={() => {
                    addToCart(item.id, qty);
                    toast.success(`${qty}× ${item.name} added`, {
                      action: { label: "View cart", onClick: () => void navigate({ to: "/cart" }) },
                    });
                  }}
                >
                  <ShoppingBag /> Add to cart · {formatMoney(item.price * qty)}
                </Button>
              </div>
            ) : (
              <p className="mt-6 rounded-xl bg-muted p-4 text-sm font-semibold text-muted-foreground">Sold out for today — check back tomorrow.</p>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold">More from {category?.name}</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => <FoodCard key={r.id} item={r} />)}
            </div>
          </div>
        )}
      </PageContainer>
    </SiteShell>
  );
}
