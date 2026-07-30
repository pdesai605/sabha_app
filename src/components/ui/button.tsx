import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-accent-primary text-white hover:bg-accent-primary-hover active:bg-accent-primary-hover",
        secondary:
          "bg-background-muted text-text-primary hover:bg-border-subtle active:bg-border-default",
        outline:
          "border border-border-default bg-background-secondary text-text-primary hover:bg-background-muted active:bg-border-subtle",
        ghost:
          "text-text-secondary hover:bg-background-muted hover:text-text-primary active:bg-border-subtle",
        danger:
          "bg-semantic-danger text-white hover:bg-semantic-danger/90 active:bg-semantic-danger/90",
      },
      size: {
        sm: "h-8 px-3 text-[13px] rounded-button",
        md: "h-10 px-4 text-sm rounded-button",
        lg: "h-11 px-5 text-sm rounded-button",
        icon: "size-9 rounded-button",
        "icon-sm": "size-8 rounded-button",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
