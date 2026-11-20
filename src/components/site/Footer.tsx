import { Link } from "@tanstack/react-router";
import { RESTAURANT } from "@/lib/config";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-20 border-t bg-card/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <Logo />
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">{RESTAURANT.tagline}</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-muted-foreground">
          <Link to="/menu" className="hover:text-foreground">Menu</Link>
          <Link to="/orders" className="hover:text-foreground">My orders</Link>
          <Link to="/login" search={{ role: "staff" }} className="hover:text-foreground">Staff sign in</Link>
          <Link to="/login" search={{ role: "admin" }} className="hover:text-foreground">Admin sign in</Link>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {RESTAURANT.name} · Product demo
      </div>
    </footer>
  );
}
