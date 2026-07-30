"use client";

import * as React from "react";
import { useTranslation } from "@/lib/i18n/context";
import { formatRelativeTimeLocalized } from "@/lib/i18n/format-relative-time";

/** Avoids hydration mismatch; locale-aware relative time. */
export function ClientRelativeTime({ iso }: { iso: string }) {
  const { locale } = useTranslation();
  const [text, setText] = React.useState<string>("");

  React.useEffect(() => {
    setText(formatRelativeTimeLocalized(iso, locale));
  }, [iso, locale]);

  if (!text) {
    return <span className="text-text-secondary text-[13px]">—</span>;
  }

  return (
    <span className="text-text-secondary text-[13px]" suppressHydrationWarning>
      {text}
    </span>
  );
}
