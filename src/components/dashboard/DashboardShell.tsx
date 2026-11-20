import { Link, useNavigate } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { ExternalLink, LogOut, Menu as MenuIcon, RotateCcw } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/site/Logo";
import { useCurrentUser } from "@/hooks/use-app";
import { initials } from "@/lib/format";
import { resetDemo } from "@/lib/store";
import { logout } from "@/services/auth";

export type DashPath =
  | "/staff"
  | "/staff/orders"
  | "/staff/history"
  | "/admin"
  | "/admin/orders"
  | "/admin/menu"
  | "/admin/categories"
  | "/admin/customers"
  | "/admin/staff"
  | "/admin/activity";

export interface NavItem {
  to: DashPath;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: number;
}

function SidebarNav({ items, title, onNavigate }: { items: NavItem[]; title: string; onNavigate?: () => void }) {
  const user = useCurrentUser();
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-5 pb-4 pt-5">
        <Logo light />
        <div className="mt-1 pl-10 text-xs font-semibold uppercase tracking-[0.16em] text-sidebar-primary">{title}</div>
      </div>
      <nav className="flex-1 space-y-1 px-3" onClick={onNavigate}>
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.exact ?? false }}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
          >
            <item.icon className="size-4" />
            <span className="flex-1">{item.label}</span>
            {item.badge ? (
              <span className="rounded-full bg-sidebar-primary px-2 py-0.5 text-[0.7rem] font-bold text-sidebar-primary-foreground">
                {item.badge}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>
      <div className="space-y-1 border-t border-sidebar-border p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <ExternalLink className="size-4" /> View restaurant site
        </Link>
        <button
          type="button"
          onClick={() => {
            if (!confirm("Reset all demo data back to the original sample data?")) return;
            resetDemo();
            toast.success("Demo data reset");
            void navigate({ to: "/login" });
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <RotateCcw className="size-4" /> Reset demo data
        </button>
        {user && (
          <div className="mt-2 flex items-center gap-3 rounded-lg bg-sidebar-accent/60 p-2.5">
            <span className="grid size-9 place-items-center rounded-full bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
              {initials(user.name)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-sidebar-accent-foreground">{user.name}</div>
              <div className="text-xs capitalize text-sidebar-foreground/70">{user.role}</div>
            </div>
            <button
              type="button"
              aria-label="Sign out"
              onClick={() => {
                logout(user);
                void navigate({ to: "/login" });
              }}
              className="grid size-8 place-items-center rounded-md text-sidebar-foreground/70 hover:bg-sidebar hover:text-sidebar-accent-foreground"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function DashboardShell({ items, title, children }: { items: NavItem[]; title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <SidebarNav items={items} title={title} />
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 border-none p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarNav items={items} title={title} onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <Logo />
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

export function DashHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function LiveIndicator() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-status-ready/10 px-3 py-1 text-xs font-semibold text-status-ready">
      <span className="live-dot size-2 rounded-full bg-current" /> Live updates
    </span>
  );
}
