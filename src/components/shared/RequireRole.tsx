import { Link, Navigate, useLocation } from "@tanstack/react-router";
import { Loader2, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-app";
import { useHydrated } from "@/lib/store";
import type { Role } from "@/lib/types";

/** Shows children only to signed-in users with one of the given roles. */
export function RequireRole({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const hydrated = useHydrated();
  const user = useCurrentUser();
  const location = useLocation();

  if (!hydrated) {
    return (
      <div className="grid min-h-[50vh] place-items-center text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" search={{ redirect: location.pathname }} replace />;
  if (!roles.includes(user.role)) {
    const home = user.role === "admin" ? "/admin" : user.role === "staff" ? "/staff" : "/menu";
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-6 text-center">
        <ShieldAlert className="size-10 text-status-pending" />
        <h2 className="mt-4 text-2xl font-semibold">This area isn't for your account</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You're signed in as {user.name} ({user.role}). Sign in with a different account to continue.
        </p>
        <div className="mt-6 flex gap-2">
          <Button asChild>
            <Link to={home}>Go to my area</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/login" search={{ redirect: location.pathname }}>
              Switch account
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
