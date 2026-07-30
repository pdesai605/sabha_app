"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { useLocaleText } from "@/lib/i18n/locale-text";
import { useTranslation } from "@/lib/i18n/context";
import { formatNumberForLocale } from "@/lib/i18n/numerals";

export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    positive?: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatCardProps) {
  const lt = useLocaleText();
  const { locale } = useTranslation();
  const displayValue =
    typeof value === "number"
      ? formatNumberForLocale(value, locale)
      : lt(String(value));

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-sm font-medium text-text-secondary truncate">
              {lt(title)}
            </p>
            <p className="text-2xl font-semibold tracking-tight text-text-primary">
              {displayValue}
            </p>
            {description && (
              <p className="text-xs text-text-muted mt-1">{lt(description)}</p>
            )}
            {trend && (
              <p
                className={cn(
                  "text-xs font-medium mt-1",
                  trend.positive
                    ? "text-semantic-success"
                    : "text-semantic-danger"
                )}
              >
                {lt(trend.value)}
              </p>
            )}
          </div>
          {icon && (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-input bg-accent-primary-muted text-accent-primary">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
