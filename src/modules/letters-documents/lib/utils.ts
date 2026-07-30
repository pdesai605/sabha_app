import { format, parseISO } from "date-fns";
import type {
  LetterPriority,
  InwardStatus,
  OutwardStatus,
  FileStatus,
  DispatchStatus,
} from "@/modules/letters-documents/types";

export function formatLetterDate(iso: string): string {
  return format(parseISO(iso), "MMM d, yyyy");
}

export function formatLetterDateTime(iso: string): string {
  return format(parseISO(iso), "MMM d, yyyy · h:mm a");
}

export function getPriorityVariant(
  priority: LetterPriority
): "default" | "primary" | "warning" | "danger" {
  switch (priority) {
    case "urgent": return "danger";
    case "high": return "warning";
    case "normal": return "primary";
    default: return "default";
  }
}

export function getInwardStatusVariant(
  status: InwardStatus
): "active" | "pending" | "inactive" | "info" | "error" {
  switch (status) {
    case "closed": case "replied": return "active";
    case "in-progress": return "info";
    case "assigned": return "pending";
    case "received": return "pending";
    case "archived": return "inactive";
  }
}

export function getOutwardStatusVariant(
  status: OutwardStatus
): "active" | "pending" | "inactive" | "info" | "error" {
  switch (status) {
    case "delivered": return "active";
    case "dispatched": case "approved": return "info";
    case "pending-approval": case "draft": return "pending";
    case "archived": return "inactive";
  }
}

export function getFileStatusVariant(
  status: FileStatus
): "active" | "pending" | "inactive" | "info" {
  switch (status) {
    case "closed": return "active";
    case "in-movement": return "info";
    case "open": case "pending": return "pending";
    case "archived": return "inactive";
  }
}

export function getDispatchStatusVariant(
  status: DispatchStatus
): "active" | "pending" | "inactive" | "info" | "error" {
  switch (status) {
    case "delivered": return "active";
    case "in-transit": case "dispatched": return "info";
    case "pending": return "pending";
    case "returned": return "error";
  }
}
