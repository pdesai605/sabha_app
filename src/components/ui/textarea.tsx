import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-input border border-border-default bg-background-secondary px-3 py-2.5 text-sm text-text-primary transition-colors resize-y",
        "placeholder:text-text-muted",
        "hover:border-border-default/80",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/20 focus-visible:border-accent-primary/40",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-background-muted",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
