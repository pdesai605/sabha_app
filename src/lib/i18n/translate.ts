import { EN_TO_MR } from "@/lib/i18n/en-to-mr-dictionary";
import { toMarathiNumerals } from "@/lib/i18n/numerals";

const lowerCaseMap = new Map<string, string>();
for (const [en, mr] of Object.entries(EN_TO_MR)) {
  lowerCaseMap.set(en.toLowerCase(), mr);
}

function lookup(text: string): string | undefined {
  if (EN_TO_MR[text]) return EN_TO_MR[text];
  const trimmed = text.trim();
  if (EN_TO_MR[trimmed]) return EN_TO_MR[trimmed];
  const lower = lowerCaseMap.get(text.toLowerCase());
  if (lower) return lower;
  const titled = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  if (EN_TO_MR[titled]) return EN_TO_MR[titled];
  return lowerCaseMap.get(titled.toLowerCase());
}

/** Translate English UI string to Marathi; pass-through in English locale. */
export function localeText(text: string, locale: "en" | "mr"): string {
  if (locale === "en" || !text) return text;
  const translated = lookup(text) ?? text;
  return toMarathiNumerals(translated);
}

/** Translate template / dynamic toast strings. */
export function localeTextTemplate(text: string, locale: "en" | "mr"): string {
  if (locale === "en") return text;
  const full = lookup(text);
  if (full) return toMarathiNumerals(full);

  const removed = text.match(/^(.+) removed successfully\.$/);
  if (removed) {
    const item = lookup(removed[1]!) ?? removed[1];
    return toMarathiNumerals(`${item} यशस्वीरित्या हटवले.`);
  }
  const saved = text.match(/^(.+) saved successfully\.$/);
  if (saved) {
    const item = lookup(saved[1]!) ?? saved[1];
    return toMarathiNumerals(`${item} यशस्वीरित्या जतन केले.`);
  }
  const exported = text.match(/^(.+) exported successfully\.$/);
  if (exported) {
    const item = lookup(exported[1]!) ?? exported[1];
    return toMarathiNumerals(`${item} यशस्वीरित्या निर्यात केले.`);
  }
  const created = text.match(/^(.+) created successfully \(Demo\)\.$/);
  if (created) {
    const item = lookup(created[1]!) ?? created[1];
    return toMarathiNumerals(`${item} यशस्वीरित्या तयार केले (डेमो).`);
  }
  const completed = text.match(/^(.+) completed successfully\.$/);
  if (completed) {
    const item = lookup(completed[1]!) ?? completed[1];
    return toMarathiNumerals(`${item} यशस्वीरित्या पूर्ण झाले.`);
  }
  if (text.match(/^\d+ items approved successfully\.$/)) {
    const count = text.match(/^(\d+)/)?.[1];
    return toMarathiNumerals(`${count} नोंदी यशस्वीरित्या मंजूर.`);
  }
  if (text === "Approved successfully.") return "यशस्वीरित्या मंजूर.";
  if (text.match(/^\d+ items rejected successfully\.$/)) {
    const count = text.match(/^(\d+)/)?.[1];
    return toMarathiNumerals(`${count} नोंदी यशस्वीरित्या नाकारल्या.`);
  }
  if (text === "Rejected successfully.") return "यशस्वीरित्या नाकारले.";
  if (text === "Successfully created (Demo).") return "यशस्वीरित्या तयार केले (डेमो).";
  if (text === "Appointment Created Successfully (Demo)") return "भेट यशस्वीरित्या नोंदवली (डेमो)";
  if (text === "Document sent to printer successfully.") return "दस्तऐवज यशस्वीरित्या मुद्रकास पाठवला.";
  if (text === "Import completed successfully.") return "आयात यशस्वीरित्या पूर्ण.";
  if (text === "Demo Mode — WhatsApp message would be sent successfully.") {
    return "डेमो मोड — व्हॉट्सअॅप संदेश यशस्वीरित्या पाठवला जाईल.";
  }
  if (text === "People list refreshed") return "लोक यादी रीफ्रेश केली.";
  if (text === "Refreshed") return "रीफ्रेश केले.";
  if (text === "File uploaded successfully.") return "फाईल यशस्वीरित्या अपलोड केली.";
  if (text === "Download started successfully.") return "डाउनलोड सुरू झाले.";
  if (text === "Profile link copied to clipboard.") return "प्रोफाइल दुवा क्लिपबोर्डवर कॉपी केला.";
  if (text === "Person archived successfully.") return "व्यक्ती संग्रहित केली.";
  return toMarathiNumerals(localeText(text, "mr"));
}

export { EN_TO_MR };
