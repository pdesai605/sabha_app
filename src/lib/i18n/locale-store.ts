import type { Locale } from "./types";

/** Module-level locale for non-React code (toasts, utils). Synced by LanguageProvider. */
let currentLocale: Locale = "en";

export function setCurrentLocale(locale: Locale) {
  currentLocale = locale;
}

export function getCurrentLocale(): Locale {
  return currentLocale;
}
