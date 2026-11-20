import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  onChange,
  size = "md",
  className,
}: {
  value: number;
  onChange: (next: number) => void;
  size?: "sm" | "md";
  className?: string;
}) {
  const btn = size === "sm" ? "size-7" : "size-9";
  return (
    <div className={cn("inline-flex items-center rounded-full border bg-card p-0.5", className)}>
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(value - 1)}
        className={cn(btn, "grid place-items-center rounded-full text-foreground transition-colors hover:bg-muted")}
      >
        <Minus className="size-3.5" />
      </button>
      <span className={cn("min-w-7 text-center font-semibold tabular-nums", size === "sm" ? "text-sm" : "")}>{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        className={cn(btn, "grid place-items-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90")}
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
