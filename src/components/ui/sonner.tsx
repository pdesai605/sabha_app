"use client";

import { Toaster as Sonner, toast } from "sonner";
import { cn } from "@/lib/utils";

type ToasterProps = React.ComponentProps<typeof Sonner>;

function Toaster({ className, ...props }: ToasterProps) {
  return (
    <Sonner
      className={cn("toaster group", className)}
      toastOptions={{
        classNames: {
          toast:
            "group toast flex w-full items-center gap-3 rounded-input border border-border-default bg-background-secondary p-4 shadow-elevated",
          title: "text-sm font-medium text-text-primary",
          description: "text-sm text-text-secondary",
          actionButton:
            "rounded-button bg-accent-primary px-3 py-1.5 text-xs font-medium text-white",
          cancelButton:
            "rounded-button bg-background-muted px-3 py-1.5 text-xs font-medium text-text-secondary",
          success: "border-semantic-success/20 bg-semantic-success-muted",
          error: "border-semantic-danger/20 bg-semantic-danger-muted",
          warning: "border-semantic-warning/20 bg-semantic-warning-muted",
          info: "border-semantic-info/20 bg-semantic-info-muted",
        },
      }}
      {...props}
    />
  );
}

export { Toaster, toast };
