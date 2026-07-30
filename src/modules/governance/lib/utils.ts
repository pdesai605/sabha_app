import { format, parseISO } from "date-fns";
import type {
  ProjectStatus,
  ComplaintStatus,
  ComplaintPriority,
  TenderStatus,
  InspectionStatus,
} from "@/modules/governance/types";

export function formatGovDate(iso: string): string {
  return format(parseISO(iso), "MMM d, yyyy");
}

export function formatGovDateTime(iso: string): string {
  return format(parseISO(iso), "MMM d, yyyy · h:mm a");
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyCompact(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return formatCurrency(amount);
}

export function getProjectStatusVariant(
  status: ProjectStatus
): "active" | "pending" | "inactive" | "info" | "error" {
  switch (status) {
    case "Completed":
      return "active";
    case "In Progress":
      return "info";
    case "Approved":
      return "pending";
    case "Planning":
      return "pending";
    case "On Hold":
      return "error";
    case "Cancelled":
      return "inactive";
  }
}

export function getComplaintStatusVariant(
  status: ComplaintStatus
): "active" | "pending" | "inactive" | "info" | "error" {
  switch (status) {
    case "resolved":
    case "closed":
      return "active";
    case "in-progress":
      return "info";
    case "open":
      return "pending";
    case "overdue":
      return "error";
  }
}

export function getComplaintPriorityVariant(
  priority: ComplaintPriority
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

export function getTenderStatusVariant(
  status: TenderStatus
): "active" | "pending" | "inactive" | "info" | "error" {
  switch (status) {
    case "awarded":
      return "active";
    case "published":
      return "info";
    case "under-review":
      return "pending";
    case "closed":
      return "inactive";
    case "cancelled":
      return "error";
  }
}

export function getInspectionStatusVariant(
  status: InspectionStatus
): "active" | "pending" | "inactive" | "info" {
  switch (status) {
    case "completed":
      return "active";
    case "scheduled":
      return "info";
    case "rescheduled":
      return "pending";
    case "cancelled":
      return "inactive";
  }
}

export function getProgressColor(pct: number): string {
  if (pct >= 85) return "bg-semantic-success";
  if (pct >= 60) return "bg-accent-primary";
  if (pct >= 35) return "bg-semantic-warning";
  return "bg-semantic-danger";
}
