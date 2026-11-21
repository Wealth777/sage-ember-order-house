import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DemoAccounts, goAfterLogin } from "@/components/site/DemoAccounts";
import { Logo } from "@/components/site/Logo";
import hero from "@/assets/food/hero.jpg";
import { DEMO_PASSWORD } from "@/data/mock-data";
import { RESTAURANT } from "@/lib/config";
import type { Role } from "@/lib/types";
import { login } from "@/services/auth";

type LoginSearch = { redirect?: string; role?: Role };

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): LoginSearch => {
    const out: LoginSearch = {};
    if (typeof s["redirect"] === "string") out.redirect = s["redirect"];
    if (s["role"] === "customer" || s["role"] === "staff" || s["role"] === "admin") out.role = s["role"];
    return out;
  },
  head: () => ({
    meta: [
      { title: `Sign in — ${RESTAURANT.name}` },
      { name: "description", content: "Sign in as a customer, staff member or admin." },
      { property: "og:title", content: `Sign in — ${RESTAURANT.name}` },
      { property: "og:description", content: "Sign in to order, run the kitchen or manage the restaurant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

const ROLE_TITLES: Record<Role, string> = {
  customer: "Welcome back",
  staff: "Staff sign in",
  admin: "Admin sign in",
};

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-5 py-6 sm:px-10">
        <Logo />
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">{children}</div>
      </div>
      <div className="relative hidden lg:block">
        <img src={hero} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="absolute bottom-10 left-10 right-10 text-primary-foreground">
          <p className="font-display text-3xl font-semibold leading-tight">"{RESTAURANT.tagline}"</p>
        </div>
      </div>
    </div>
  );
}

function LoginPage() {
  const { redirect, role } = Route.useSearch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <AuthLayout>
      <h1 className="text-4xl font-semibold">{ROLE_TITLES[role ?? "customer"]}</h1>
      <p className="mt-2 text-muted-foreground">Sign in with your email and password.</p>
      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setError("");
          setBusy(true);
          setTimeout(() => {
            try {
              const user = login(email, password);
              toast.success(`Welcome, ${user.name.split(" ")[0]}`);
              goAfterLogin(router, user.role, redirect);
            } catch (err) {
              setError((err as Error).message);
              setBusy(false);
            }
          }, 400);
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-11" />
        </div>
        {error && <p className="rounded-lg bg-destructive/10 p-3 text-sm font-semibold text-destructive">{error}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? <Loader2 className="animate-spin" /> : "Sign in"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link to="/register" search={redirect ? { redirect } : {}} className="font-semibold text-primary hover:underline">Create an account</Link>
      </p>

      <div className="mt-10">
        <div className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> One-click demo accounts <span className="h-px flex-1 bg-border" />
        </div>
        <DemoAccounts {...(role ? { highlight: role } : {})} {...(redirect ? { redirect } : {})} />
        <p className="mt-3 text-center text-xs text-muted-foreground">All demo accounts use the password <code className="font-bold">{DEMO_PASSWORD}</code></p>
      </div>
    </AuthLayout>
  );
}
