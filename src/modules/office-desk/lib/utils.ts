import { format, parseISO } from "date-fns";
import type { Appointment } from "@/modules/office-desk/types";
import { getPersonById } from "@/modules/people/data/people";

export function enrichAppointment(appointment: Appointment) {
  const person = getPersonById(appointment.personId);
  if (!person) return null;
  return {
    ...appointment,
    fullName: person.fullName,
    mobile: person.mobile,
    initials: person.initials,
  };
}

export type AppointmentWithPerson = NonNullable<ReturnType<typeof enrichAppointment>>;

export function enrichAppointments(list: Appointment[]): AppointmentWithPerson[] {
  return list.map(enrichAppointment).filter((a): a is AppointmentWithPerson => a !== null);
}

export function formatOfficeDate(iso: string): string {
  return format(parseISO(iso), "MMM d, yyyy");
}

export function formatOfficeDateTime(iso: string): string {
  return format(parseISO(iso), "MMM d, yyyy · h:mm a");
}

export function formatTime(time: string): string {
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${m} ${ampm}`;
}

export function getAppointmentStatusVariant(
  status: Appointment["status"]
): "active" | "pending" | "inactive" | "info" | "error" {
  switch (status) {
    case "completed": return "active";
    case "confirmed": return "info";
    case "scheduled": return "pending";
    case "cancelled": return "inactive";
    case "no-show": return "error";
  }
}

export function getTaskStatusVariant(
  status: import("@/modules/office-desk/types").TaskStatus
): "active" | "pending" | "inactive" | "info" | "error" {
  switch (status) {
    case "completed": return "active";
    case "in-progress": return "info";
    case "on-hold": return "pending";
    case "pending": return "pending";
    case "cancelled": return "inactive";
  }
}

export function getTaskPriorityVariant(
  priority: import("@/modules/office-desk/types").TaskPriority
): "default" | "primary" | "warning" | "danger" {
  switch (priority) {
    case "urgent": return "danger";
    case "high": return "warning";
    case "normal": return "primary";
    default: return "default";
  }
}
