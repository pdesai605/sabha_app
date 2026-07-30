"use client";

import { useLocaleText } from "@/lib/i18n/locale-text";

/** Inline localized text for buttons, tabs, badges. */
export function L({ children }: { children: string }) {
  const lt = useLocaleText();
  return <>{lt(children)}</>;
}
