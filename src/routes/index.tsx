import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChefHat, ClipboardList, MapPin, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FoodCard } from "@/components/shared/FoodCard";
import { DemoAccounts } from "@/components/site/DemoAccounts";
import { PageContainer, SiteShell } from "@/components/site/SiteShell";
import hero from "@/assets/food/hero.jpg";
import { RESTAURANT } from "@/lib/config";
import { useDb } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${RESTAURANT.name} — Seasonal plates, ordered online` },
      { name: "description", content: "Browse the menu, order in a few taps and follow your order from the kitchen to your table." },
      { property: "og:title", content: `${RESTAURANT.name} — Order online` },
      { property: "og:description", content: "Browse the menu, order in a few taps and follow your order live." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const STEPS = [
  { icon: ClipboardList, title: "Pick your dishes", text: "Browse the full menu with photos, prices and prep times." },
  { icon: ChefHat, title: "We start cooking", text: "Your order goes straight to the kitchen the moment you place it." },
  { icon: Timer, title: "Track it live", text: "Watch each step, from confirmed to ready, in real time." },
];

function Home() {
  const db = useDb();
  const popular = db.menuItems.filter((m) => m.popular && m.available).slice(0, 4);
  const catName = (id: string) => db.categories.find((c) => c.id === id)?.name;

  return (
    <SiteShell>
      <section className="relative isolate overflow-hidden">
        <img src={hero} alt="A table set with roast chicken, pasta, salad and wine" className="absolute inset-0 -z-10 size-full object-cover" />
        <div className="hero-overlay absolute inset-0 -z-10" />
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
          <div className="max-w-xl text-primary-foreground fade-up">
            <span className="eyebrow">Open today · 11am – 10pm</span>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] sm:text-6xl">
              Seasonal plates, ordered in a few taps.
            </h1>
            <p className="mt-5 max-w-md text-base text-primary-foreground/80 sm:text-lg">
              Wood-fired grills, fresh pasta and bright salads — order for your table or for pickup, and follow it live.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="brass">
                <Link to="/menu">Browse the menu <ArrowRight /></Link>
              </Button>
              <Button asChild size="lg" variant="outline-light">
                <Link to="/orders">Track an order</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <PageContainer>
        <div className="flex flex-wrap gap-2">
          {db.categories.map((c) => (
            <Link
              key={c.id}
              to="/menu"
              search={{ category: c.id }}
              className="rounded-full border bg-card px-4 py-2 text-sm font-semibold transition-colors hover:border-primary/40 hover:bg-primary-soft"
            >
              {c.name}
            </Link>
          ))}
        </div>

        <div className="mt-12 flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Chef's favourites</span>
            <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">What everyone's ordering</h2>
          </div>
          <Link to="/menu" className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:flex">
            Full menu <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((item) => (
            <FoodCard key={item.id} item={item} categoryName={catName(item.categoryId)} />
          ))}
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="rounded-2xl border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground">
                  <s.icon className="size-4" />
                </span>
                <span className="text-xs font-bold text-muted-foreground">STEP {i + 1}</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-primary p-6 text-primary-foreground sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div>
              <span className="eyebrow">Product demo</span>
              <h2 className="mt-2 text-3xl font-semibold">See it from every side</h2>
              <p className="mt-2 text-sm text-primary-foreground/75">
                Sign in instantly as a customer, a member of staff or the owner. Tip: open staff in a second tab and watch new orders arrive live.
              </p>
              <p className="mt-4 flex items-center gap-2 text-xs text-primary-foreground/60">
                <MapPin className="size-3.5" /> All data here is sample data and can be reset any time.
              </p>
            </div>
            <div className="text-foreground">
              <DemoAccounts />
            </div>
          </div>
        </div>
      </PageContainer>
    </SiteShell>
  );
}
