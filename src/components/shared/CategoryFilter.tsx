import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

export function CategoryFilter({
  categories,
  value,
  onChange,
}: {
  categories: Category[];
  value: string;
  onChange: (id: string) => void;
}) {
  const options = [{ id: "all", name: "All dishes" }, ...categories];
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
      {options.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onChange(c.id)}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
            value === c.id
              ? "border-primary bg-primary text-primary-foreground"
              : "bg-card text-foreground hover:border-primary/40 hover:bg-primary-soft",
          )}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
