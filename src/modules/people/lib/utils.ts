import { format, formatDistanceToNow, parseISO } from "date-fns";
import type { Person, PersonStatus } from "@/modules/people/types";

export function formatPersonDate(iso: string): string {
  return format(parseISO(iso), "MMM d, yyyy");
}

export function formatPersonDateTime(iso: string): string {
  return format(parseISO(iso), "MMM d, yyyy · h:mm a");
}

export function formatRelativeTime(iso: string): string {
  return formatDistanceToNow(parseISO(iso), { addSuffix: true });
}

export function getWhatsAppUrl(mobile: string): string {
  const digits = mobile.replace(/\D/g, "");
  const normalized = digits.startsWith("91") ? digits : `91${digits}`;
  return `https://wa.me/${normalized}`;
}

export function getStatusLabel(status: PersonStatus): string {
  const labels: Record<PersonStatus, string> = {
    active: "Active",
    inactive: "Inactive",
    archived: "Archived",
  };
  return labels[status];
}

export function getStatusVariant(
  status: PersonStatus
): "active" | "inactive" | "pending" {
  if (status === "active") return "active";
  if (status === "inactive") return "pending";
  return "inactive";
}

export function getPersonDisplayTags(person: Person, max = 2): {
  visible: string[];
  overflow: number;
} {
  const visible = person.tags.slice(0, max);
  const overflow = Math.max(0, person.tags.length - max);
  return { visible, overflow };
}

export function personToFormDefaults(person: Person) {
  return {
    firstName: person.firstName,
    lastName: person.lastName,
    gender: person.gender,
    dateOfBirth: person.dateOfBirth ?? "",
    mobile: person.mobile,
    alternateMobile: person.alternateMobile ?? "",
    email: person.email ?? "",
    whatsapp: person.whatsapp,
    line1: person.address.line1,
    line2: person.address.line2 ?? "",
    city: person.address.city,
    district: person.address.district,
    state: person.address.state,
    pincode: person.address.pincode,
    area: person.area,
    ward: person.ward,
    booth: person.booth,
    politicalDesignation: person.politicalDesignation ?? "",
    partyAffiliation: person.partyAffiliation ?? "",
    voterId: person.voterId ?? "",
    facebook: person.socialMedia?.facebook ?? "",
    twitter: person.socialMedia?.twitter ?? "",
    instagram: person.socialMedia?.instagram ?? "",
    linkedin: person.socialMedia?.linkedin ?? "",
    tags: person.tags,
    status: person.status,
    notes: person.notes ?? "",
  };
}

export type PersonFormValues = ReturnType<typeof personToFormDefaults>;
