"use client";

import * as React from "react";
import { useTranslation } from "@/lib/i18n/context";
import { localeText } from "@/lib/i18n/translate";

export { localeText, localeTextTemplate } from "@/lib/i18n/translate";
export { toMarathiNumerals } from "@/lib/i18n/numerals";
export { EN_TO_MR } from "@/lib/i18n/en-to-mr-dictionary";

export function useLocaleText() {
  const { locale } = useTranslation();
  return React.useCallback(
    (text: string) => localeText(text, locale),
    [locale]
  );
}
