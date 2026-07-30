import { parseISO, differenceInMinutes, differenceInHours, differenceInDays, differenceInMonths, differenceInYears } from "date-fns";
import type { Locale } from "./types";
import { toMarathiNumerals } from "./numerals";

function n(num: number, locale: Locale): string {
  const s = String(num);
  return locale === "mr" ? toMarathiNumerals(s) : s;
}

/** Locale-aware relative time (replaces English date-fns output for MR demo). */
export function formatRelativeTimeLocalized(iso: string, locale: Locale): string {
  const date = parseISO(iso);
  const now = new Date();

  const mins = differenceInMinutes(now, date);
  if (mins < 1) return locale === "mr" ? "आत्ताच" : "just now";
  if (mins < 60) {
    return locale === "mr"
      ? `${n(mins, locale)} मिनिटांपूर्वी`
      : `${mins} minute${mins === 1 ? "" : "s"} ago`;
  }

  const hours = differenceInHours(now, date);
  if (hours < 24) {
    return locale === "mr"
      ? `${n(hours, locale)} तासांपूर्वी`
      : `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = differenceInDays(now, date);
  if (days === 0) return locale === "mr" ? "आज" : "today";
  if (days === 1) return locale === "mr" ? "काल" : "yesterday";
  if (days === -1) return locale === "mr" ? "उद्या" : "tomorrow";
  if (days > 0 && days < 7) {
    return locale === "mr"
      ? `${n(days, locale)} दिवसांपूर्वी`
      : `${days} days ago`;
  }

  const months = differenceInMonths(now, date);
  if (months >= 1 && months < 12) {
    return locale === "mr"
      ? `सुमारे ${n(months, locale)} महिन्यापूर्वी`
      : `about ${months} month${months === 1 ? "" : "s"} ago`;
  }

  const years = differenceInYears(now, date);
  if (years >= 1) {
    return locale === "mr"
      ? `सुमारे ${n(years, locale)} वर्षांपूर्वी`
      : `about ${years} year${years === 1 ? "" : "s"} ago`;
  }

  if (days >= 7 && days < 30) {
    const weeks = Math.floor(days / 7);
    return locale === "mr"
      ? `${n(weeks, locale)} आठवड्यांपूर्वी`
      : `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  }

  return locale === "mr" ? `${n(Math.abs(days), locale)} दिवसांपूर्वी` : `${Math.abs(days)} days ago`;
}
