import { Link } from "@tanstack/react-router";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { RESTAURANT } from "@/lib/config";

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2", className)}>
      <span className={cn("grid size-8 place-items-center rounded-full", light ? "bg-sidebar-primary text-sidebar-primary-foreground" : "bg-primary text-primary-foreground")}>
        <Flame className="size-4" />
      </span>
      <span className="font-display text-xl font-semibold tracking-tight">{RESTAURANT.name}</span>
    </Link>
  );
}
