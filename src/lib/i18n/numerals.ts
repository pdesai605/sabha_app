const MR_NUMERALS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"] as const;

/** Convert ASCII digits in a string to Devanagari numerals. */
export function toMarathiNumerals(text: string): string {
  return text.replace(/\d/g, (d) => MR_NUMERALS[parseInt(d, 10)] ?? d);
}

export function formatNumberForLocale(value: number | string, locale: "en" | "mr"): string {
  const s = String(value);
  return locale === "mr" ? toMarathiNumerals(s) : s;
}
