"use client";

import * as React from "react";
import type { Locale } from "./types";
import { en } from "./translations/en";
import { mr } from "./translations/mr";
import { setCurrentLocale } from "./locale-store";

const dictionaries = { en, mr } as const;

type NestedKeyOf<T, Prefix extends string = ""> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? NestedKeyOf<T[K], `${Prefix}${K}.`>
        : `${Prefix}${K}`;
    }[keyof T & string]
  : never;

export type TranslationKey = NestedKeyOf<typeof en>;

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = React.createContext<I18nContextValue | null>(null);

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>("en");

  React.useEffect(() => {
    const stored = localStorage.getItem("sabha-locale") as Locale | null;
    if (stored === "en" || stored === "mr") {
      setLocaleState(stored);
      setCurrentLocale(stored);
    }
  }, []);

  const setLocale = React.useCallback((next: Locale) => {
    setLocaleState(next);
    setCurrentLocale(next);
    localStorage.setItem("sabha-locale", next);
    document.documentElement.lang = next;
  }, []);

  const t = React.useCallback(
    (key: TranslationKey) => getNestedValue(dictionaries[locale] as unknown as Record<string, unknown>, key),
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used within LanguageProvider");
  return ctx;
}
