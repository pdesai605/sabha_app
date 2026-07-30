export type Locale = "en" | "mr";

type DeepStringRecord<T> = {
  [K in keyof T]: T[K] extends object ? DeepStringRecord<T[K]> : string;
};

export type TranslationDictionary = DeepStringRecord<typeof import("./translations/en").en>;
