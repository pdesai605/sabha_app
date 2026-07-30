"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useLocaleText } from "@/lib/i18n/locale-text";

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  const lt = useLocaleText();
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="min-w-0 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
          {lt(title)}
        </h1>
        {description && (
          <p className="text-sm text-text-secondary max-w-2xl">{lt(description)}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
