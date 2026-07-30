"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useLocaleText } from "@/lib/i18n/locale-text";

export interface SearchBarProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  onClear?: () => void;
  containerClassName?: string;
  size?: "sm" | "md" | "lg";
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      className,
      containerClassName,
      value,
      onClear,
      size = "md",
      placeholder = "Search...",
      ...props
    },
    ref
  ) => {
    const lt = useLocaleText();
    const hasValue = value !== undefined && value !== "";

    return (
      <div className={cn("relative w-full", containerClassName)}>
        <Search
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none",
            size === "sm" && "size-3.5",
            size === "md" && "size-4",
            size === "lg" && "size-4"
          )}
        />
        <Input
          ref={ref}
          type="search"
          value={value}
          placeholder={lt(placeholder)}
          className={cn(
            "pl-9",
            hasValue && onClear && "pr-9",
            size === "sm" && "h-8 text-[13px]",
            size === "lg" && "h-11",
            className
          )}
          {...props}
        />
        {hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-text-muted hover:text-text-primary transition-colors"
            aria-label={lt("Clear search")}
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
    );
  }
);
SearchBar.displayName = "SearchBar";

export { SearchBar };
