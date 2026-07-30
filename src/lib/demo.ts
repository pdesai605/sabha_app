import { toast } from "@/components/ui/sonner";
import { getCurrentLocale } from "@/lib/i18n/locale-store";
import { localeText, localeTextTemplate } from "@/lib/i18n/translate";

function t(message: string): string {
  const locale = getCurrentLocale();
  return localeTextTemplate(message, locale);
}

function ts(message: string): string {
  return localeText(message, getCurrentLocale());
}

/** Demo-mode success feedback — never mentions "UI only". */
export function demoSuccess(message: string) {
  toast.success(t(message));
}

export function demoInfo(message: string) {
  toast.info(t(message));
}

export function demoWhatsAppSent() {
  toast.success(ts("Demo Mode — WhatsApp message would be sent successfully."));
}

export function demoDeleted(item = "Record") {
  toast.success(t(`${item} removed successfully.`));
}

export function demoSaved(item = "Changes") {
  toast.success(t(`${item} saved successfully.`));
}

export function demoExported(format = "File") {
  toast.success(t(`${format} exported successfully.`));
}

export function demoPrinted() {
  toast.success(ts("Document sent to printer successfully."));
}

export function demoImported() {
  toast.success(ts("Import completed successfully."));
}

export function demoAssigned(item = "Assignment") {
  toast.success(t(`${item} completed successfully.`));
}

export function demoCreated(item?: string) {
  toast.success(
    item
      ? t(`${item} created successfully (Demo).`)
      : ts("Successfully created (Demo).")
  );
}

export function demoApproved(count?: number) {
  toast.success(
    count && count > 1
      ? t(`${count} items approved successfully.`)
      : ts("Approved successfully.")
  );
}

export function demoRejected(count?: number) {
  toast.success(
    count && count > 1
      ? t(`${count} items rejected successfully.`)
      : ts("Rejected successfully.")
  );
}
