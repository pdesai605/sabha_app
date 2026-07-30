import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-input border border-border-default bg-background-secondary px-3 py-2 text-sm text-text-primary transition-colors",
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
Input.displayName = "Input";

export { Input };
