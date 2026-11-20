import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Menu as MenuIcon, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart, useCurrentUser } from "@/hooks/use-app";
import { Logo } from "./Logo";
import { UserMenu } from "./UserMenu";

const linkClass = "text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground";
const activeProps = { className: "text-foreground" };

export function Navbar() {
  const user = useCurrentUser();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const dashboard = user?.role === "admin" ? "/admin" : user?.role === "staff" ? "/staff" : null;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/menu" className={linkClass} activeProps={activeProps}>Menu</Link>
          {user?.role === "customer" && (
            <Link to="/orders" className={linkClass} activeProps={activeProps}>My orders</Link>
          )}
          {dashboard && (
            <Link to={dashboard} className={linkClass}>Dashboard</Link>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/cart"
            className="relative grid size-9 place-items-center rounded-full transition-colors hover:bg-muted"
            aria-label={`Cart, ${count} items`}
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-brass px-1 text-[0.68rem] font-bold text-brass-foreground">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <UserMenu user={user} />
          ) : (
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/login">Sign in</Link>
            </Button>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left font-display">Navigate</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 flex flex-col gap-1 px-4" onClick={() => setOpen(false)}>
                <Link to="/" className="rounded-lg px-3 py-2.5 font-semibold hover:bg-muted">Home</Link>
                <Link to="/menu" className="rounded-lg px-3 py-2.5 font-semibold hover:bg-muted">Menu</Link>
                <Link to="/cart" className="rounded-lg px-3 py-2.5 font-semibold hover:bg-muted">Cart ({count})</Link>
                {user?.role === "customer" && (
                  <>
                    <Link to="/orders" className="rounded-lg px-3 py-2.5 font-semibold hover:bg-muted">My orders</Link>
                    <Link to="/profile" className="rounded-lg px-3 py-2.5 font-semibold hover:bg-muted">Profile</Link>
                  </>
                )}
                {dashboard && (
                  <Link to={dashboard} className="flex items-center gap-2 rounded-lg px-3 py-2.5 font-semibold hover:bg-muted">
                    <LayoutDashboard className="size-4" /> Dashboard
                  </Link>
                )}
                {!user && (
                  <Button asChild className="mt-3">
                    <Link to="/login">Sign in</Link>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
