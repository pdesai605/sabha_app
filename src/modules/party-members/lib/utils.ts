import type { PartyMember, PartyMemberWithPerson } from "@/modules/party-members/types";
import { getPersonById } from "@/modules/people/data/people";
import { format, parseISO } from "date-fns";

export function enrichMember(member: PartyMember): PartyMemberWithPerson | null {
  const person = getPersonById(member.personId);
  if (!person) return null;

  return {
    ...member,
    fullName: person.fullName,
    mobile: person.mobile,
    whatsapp: person.whatsapp,
    initials: person.initials,
    gender: person.gender,
    dateOfBirth: person.dateOfBirth,
  };
}

export function enrichMembers(members: PartyMember[]): PartyMemberWithPerson[] {
  return members
    .map(enrichMember)
    .filter((m): m is PartyMemberWithPerson => m !== null);
}

export function formatJoiningDate(iso: string): string {
  return format(parseISO(iso), "MMM d, yyyy");
}

export function getAgeGroup(dateOfBirth?: string): string {
  if (!dateOfBirth) return "Unknown";
  const age = new Date().getFullYear() - parseISO(dateOfBirth).getFullYear();
  if (age <= 25) return "18–25";
  if (age <= 35) return "26–35";
  if (age <= 45) return "36–45";
  if (age <= 55) return "46–55";
  if (age <= 65) return "56–65";
  return "65+";
}

export function getWhatsAppUrl(mobile: string): string {
  const digits = mobile.replace(/\D/g, "");
  const normalized = digits.startsWith("91") ? digits : `91${digits}`;
  return `https://wa.me/${normalized}`;
}

export function getMemberStatusVariant(
  status: PartyMember["status"]
): "active" | "pending" | "inactive" {
  if (status === "active") return "active";
  if (status === "pending") return "pending";
  return "inactive";
}
