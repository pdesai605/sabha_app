"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocaleText } from "@/lib/i18n/locale-text";

export interface FilterChipProps {
  label: string;
  active?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
}

export function FilterChip({
  label,
  active = false,
  onRemove,
  onClick,
  className,
}: FilterChipProps) {
  const lt = useLocaleText();
  const Component = onClick ? "button" : "span";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-accent-primary/30 bg-accent-primary-muted text-accent-primary"
          : "border-border-default bg-background-secondary text-text-secondary hover:bg-background-muted",
        onClick && "cursor-pointer",
        className
      )}
    >
      {lt(label)}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="rounded-full p-0.5 hover:bg-black/5 transition-colors"
          aria-label={lt(`Remove ${label} filter`)}
        >
          <X className="size-3" />
        </button>
      )}
    </Component>
  );
}

export interface FilterChipsProps {
  chips: Array<{
    id: string;
    label: string;
    active?: boolean;
  }>;
  onToggle?: (id: string) => void;
  onRemove?: (id: string) => void;
  className?: string;
}

export function FilterChips({
  chips,
  onToggle,
  onRemove,
  className,
}: FilterChipsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {chips.map((chip) => (
        <FilterChip
          key={chip.id}
          label={chip.label}
          active={chip.active}
          onClick={onToggle ? () => onToggle(chip.id) : undefined}
          onRemove={onRemove ? () => onRemove(chip.id) : undefined}
        />
      ))}
    </div>
  );
}
