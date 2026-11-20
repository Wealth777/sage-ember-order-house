import { useRouter } from "@tanstack/react-router";
import { ChefHat, ShieldCheck, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "@/data/mock-data";
import type { Role } from "@/lib/types";
import { login } from "@/services/auth";

const ICONS = { customer: ShoppingBag, staff: ChefHat, admin: ShieldCheck };

export function homeFor(role: Role) {
  return role === "admin" ? "/admin" : role === "staff" ? "/staff" : "/menu";
}

/** Only follow same-site paths after sign-in. */
export function safeRedirect(redirect: string | undefined) {
  return redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : undefined;
}

export function goAfterLogin(router: ReturnType<typeof useRouter>, role: Role, redirect?: string) {
  const target = safeRedirect(redirect);
  const allowed =
    target && (role === "admin" ? target.startsWith("/admin") : role === "staff" ? target.startsWith("/staff") : !target.startsWith("/admin") && !target.startsWith("/staff"));
  router.history.push(allowed ? target : homeFor(role));
}

export function DemoAccounts({ highlight, redirect }: { highlight?: Role; redirect?: string }) {
  const router = useRouter();
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {DEMO_ACCOUNTS.map((a) => {
        const Icon = ICONS[a.role];
        return (
          <button
            key={a.role}
            type="button"
            onClick={() => {
              try {
                const user = login(a.email, DEMO_PASSWORD);
                toast.success(`Signed in as ${user.name}`);
                goAfterLogin(router, user.role, redirect);
              } catch (e) {
                toast.error((e as Error).message);
              }
            }}
            className={cn(
              "flex items-center gap-3 rounded-xl border bg-card p-3 text-left transition-all hover:border-primary/50 hover:shadow-soft sm:flex-col sm:items-start",
              highlight === a.role && "border-primary ring-2 ring-primary/15",
            )}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
              <Icon className="size-4" />
            </span>
            <span>
              <span className="block text-sm font-bold">{a.label}</span>
              <span className="block text-xs text-muted-foreground">{a.blurb}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
