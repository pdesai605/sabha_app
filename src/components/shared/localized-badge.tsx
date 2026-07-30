"use client";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { useLocaleText } from "@/lib/i18n/locale-text";

/** Badge with auto-translated label text. */
export function LBadge({
  children,
  ...props
}: BadgeProps & { children: string }) {
  const lt = useLocaleText();
  return <Badge {...props}>{lt(children)}</Badge>;
}
