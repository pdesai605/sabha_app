"use client";

import { PageHeader } from "@/components/layout/page-header";
import { useLocaleText } from "@/lib/i18n/locale-text";

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  const lt = useLocaleText();

  return (
    <div className="space-y-8">
      <PageHeader
        title={title}
        description={
          description ??
          "This module will be implemented in a future release."
        }
      />
      <div className="flex min-h-[320px] items-center justify-center rounded-card border border-dashed border-border-default bg-background-muted/30">
        <p className="text-sm text-text-muted">{lt("Module placeholder")}</p>
      </div>
    </div>
  );
}
