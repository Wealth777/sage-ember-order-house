import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  title,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("rounded-2xl border bg-card shadow-soft", className)}>
      {title && (
        <div className="flex items-center justify-between gap-3 border-b px-5 py-3.5">
          <h2 className="font-sans text-base font-bold tracking-normal">{title}</h2>
          {action}
        </div>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}
