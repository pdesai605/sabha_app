"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useLocaleText } from "@/lib/i18n/locale-text";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      status: {
        active: "bg-semantic-success-muted text-semantic-success",
        pending: "bg-semantic-warning-muted text-semantic-warning",
        inactive: "bg-background-muted text-text-muted",
        error: "bg-semantic-danger-muted text-semantic-danger",
        info: "bg-semantic-info-muted text-semantic-info",
        draft: "bg-background-muted text-text-secondary",
      },
    },
    defaultVariants: {
      status: "inactive",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  label: string;
  showDot?: boolean;
}

export function StatusBadge({
  label,
  status,
  showDot = true,
  className,
  ...props
}: StatusBadgeProps) {
  const lt = useLocaleText();
  const dotColors: Record<NonNullable<typeof status>, string> = {
    active: "bg-semantic-success",
    pending: "bg-semantic-warning",
    inactive: "bg-text-muted",
    error: "bg-semantic-danger",
    info: "bg-semantic-info",
    draft: "bg-text-secondary",
  };

  return (
    <span
      className={cn(statusBadgeVariants({ status }), className)}
      {...props}
    >
      {showDot && (
        <span
          className={cn(
            "size-1.5 rounded-full",
            dotColors[status ?? "inactive"]
          )}
        />
      )}
      {lt(label)}
    </span>
  );
}

export { statusBadgeVariants };
