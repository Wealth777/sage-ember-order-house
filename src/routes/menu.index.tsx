import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, UtensilsCrossed } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { CategoryFilter } from "@/components/shared/CategoryFilter";
import { EmptyState } from "@/components/shared/EmptyState";
import { FoodCard } from "@/components/shared/FoodCard";
import { PageContainer, SiteShell } from "@/components/site/SiteShell";
import { RESTAURANT } from "@/lib/config";
import { useDb } from "@/lib/store";

export const Route = createFileRoute("/menu/")({
  validateSearch: (s: Record<string, unknown>): { category?: string } =>
    typeof s.category === "string" ? { category: s.category } : {},
  head: () => ({
    meta: [
      { title: `Menu — ${RESTAURANT.name}` },
      { name: "description", content: "Starters, grills, fresh pasta, salads, desserts and drinks — with photos, prices and prep times." },
      { property: "og:title", content: `Menu — ${RESTAURANT.name}` },
      { property: "og:description", content: "Explore the full menu and order online." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const db = useDb();
  const { category = "all" } = Route.useSearch();
  const navigate = useNavigate({ from: "/menu/" });
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return db.menuItems.filter(
      (m) =>
        (category === "all" || m.categoryId === category) &&
        (!q || m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.tags.some((t) => t.toLowerCase().includes(q))),
    );
  }, [db.menuItems, category, query]);

  const catName = (id: string) => db.categories.find((c) => c.id === id)?.name;
  const active = db.categories.find((c) => c.id === category);

  return (
    <SiteShell>
      <PageContainer>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">Our menu</span>
            <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">{active ? active.name : "Everything we cook"}</h1>
            <p className="mt-2 text-muted-foreground">{active ? active.description : "Made fresh to order, every day."}</p>
          </div>
          <div className="relative sm:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search dishes, e.g. vegan" className="h-11 bg-card pl-9" />
          </div>
        </div>
        <div className="mt-6">
          <CategoryFilter
            categories={db.categories}
            value={category}
            onChange={(id) => void navigate({ search: id === "all" ? {} : { category: id }, replace: true })}
          />
        </div>
        <div className="mt-8">
          {items.length === 0 ? (
            <EmptyState icon={UtensilsCrossed} title="No dishes found" description="Try a different search or category." />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => (
                <FoodCard key={item.id} item={item} categoryName={catName(item.categoryId)} />
              ))}
            </div>
          )}
        </div>
      </PageContainer>
    </SiteShell>
  );
}
