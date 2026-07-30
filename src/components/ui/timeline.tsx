import * as React from "react";
import { cn } from "@/lib/utils";

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  icon?: React.ReactNode;
  status?: "completed" | "current" | "upcoming";
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("relative space-y-0", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const status = item.status ?? "completed";

        return (
          <div key={item.id} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && (
              <div
                className={cn(
                  "absolute left-[15px] top-8 h-[calc(100%-16px)] w-px",
                  status === "upcoming"
                    ? "bg-border-subtle"
                    : "bg-border-default"
                )}
              />
            )}

            <div
              className={cn(
                "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2",
                status === "completed" &&
                  "border-accent-primary bg-accent-primary text-white",
                status === "current" &&
                  "border-accent-primary bg-accent-primary-muted text-accent-primary",
                status === "upcoming" &&
                  "border-border-default bg-background-secondary text-text-muted"
              )}
            >
              {item.icon ?? (
                <span className="size-2 rounded-full bg-current" />
              )}
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-start justify-between gap-4">
                <p
                  className={cn(
                    "text-sm font-medium",
                    status === "upcoming"
                      ? "text-text-muted"
                      : "text-text-primary"
                  )}
                >
                  {item.title}
                </p>
                {item.timestamp && (
                  <time className="shrink-0 text-xs text-text-muted">
                    {item.timestamp}
                  </time>
                )}
              </div>
              {item.description && (
                <p className="mt-1 text-sm text-text-secondary">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
