import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-border-default bg-background-muted text-text-secondary",
        primary:
          "border-accent-primary/20 bg-accent-primary-muted text-accent-primary",
        success:
          "border-semantic-success/20 bg-semantic-success-muted text-semantic-success",
        warning:
          "border-semantic-warning/20 bg-semantic-warning-muted text-semantic-warning",
        danger:
          "border-semantic-danger/20 bg-semantic-danger-muted text-semantic-danger",
        info: "border-semantic-info/20 bg-semantic-info-muted text-semantic-info",
        outline: "border-border-default bg-transparent text-text-secondary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
