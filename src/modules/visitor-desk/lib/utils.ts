import { format, parseISO } from "date-fns";
import type { Locale } from "@/lib/i18n/types";
import { getPersonById } from "@/lib/i18n/localized-demo-data";
import type { Visit, VisitStatus, VisitPriority } from "@/modules/visitor-desk/types";

export function enrichVisit(visit: Visit, locale?: Locale) {
  const person = getPersonById(visit.personId, locale);
  if (!person) return null;

  return {
    ...visit,
    fullName: person.fullName,
    mobile: person.mobile,
    whatsapp: person.whatsapp,
    initials: person.initials,
    area: person.area,
    ward: person.ward,
  };
}

export type VisitWithPerson = NonNullable<ReturnType<typeof enrichVisit>>;

export function enrichVisits(visitList: Visit[], locale?: Locale): VisitWithPerson[] {
  return visitList.map((v) => enrichVisit(v, locale)).filter((v): v is VisitWithPerson => v !== null);
}

export function formatVisitDate(iso: string): string {
  return format(parseISO(iso), "MMM d, yyyy");
}

export function formatVisitDateTime(iso: string): string {
  return format(parseISO(iso), "MMM d, yyyy · h:mm a");
}

export function formatVisitTime(time: string): string {
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export function getWhatsAppUrl(mobile: string): string {
  const digits = mobile.replace(/\D/g, "");
  const normalized = digits.startsWith("91") ? digits : `91${digits}`;
  return `https://wa.me/${normalized}`;
}

export function getVisitStatusVariant(
  status: VisitStatus
): "active" | "pending" | "inactive" | "info" | "error" {
  switch (status) {
    case "completed":
      return "active";
    case "waiting":
      return "pending";
    case "in-progress":
      return "info";
    case "scheduled":
      return "info";
    case "cancelled":
      return "inactive";
  }
}

export function getPriorityVariant(
  priority: VisitPriority
): "default" | "primary" | "warning" | "danger" {
  switch (priority) {
    case "urgent":
      return "danger";
    case "high":
      return "warning";
    case "normal":
      return "primary";
    default:
      return "default";
  }
}

export function visitToFormDefaults(visit: Visit) {
  return {
    purpose: visit.purpose,
    visitorType: visit.visitorType,
    priority: visit.priority,
    meetingWith: visit.meetingWith,
    assignedStaff: visit.assignedStaff,
    visitDate: visit.visitDate,
    visitTime: visit.visitTime,
    status: visit.status,
    letterSubmitted: visit.letterSubmitted,
    letterReference: visit.letter?.referenceNumber ?? "",
    internalNotes: visit.internalNotes ?? "",
    citizenRemarks: visit.citizenRemarks ?? "",
  };
}
