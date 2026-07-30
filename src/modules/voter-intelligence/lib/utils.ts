import { format, parseISO } from "date-fns";
import type {
  IssueStatus,
  IssuePriority,
  CampaignStatus,
  PartyInclination,
  SurveyStatus,
} from "@/modules/voter-intelligence/types";

export function formatVIDate(iso: string): string {
  return format(parseISO(iso), "MMM d, yyyy");
}

export function getIssueStatusVariant(
  status: IssueStatus
): "active" | "pending" | "inactive" | "info" | "error" {
  switch (status) {
    case "resolved":
      return "active";
    case "in-progress":
      return "info";
    case "open":
      return "pending";
    case "closed":
      return "inactive";
  }
}

export function getIssuePriorityVariant(
  priority: IssuePriority
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

export function getCampaignStatusVariant(
  status: CampaignStatus
): "active" | "pending" | "inactive" | "info" {
  switch (status) {
    case "completed":
      return "active";
    case "ongoing":
      return "info";
    case "planned":
      return "pending";
    case "cancelled":
      return "inactive";
  }
}

export function getPartyInclinationVariant(
  inclination: PartyInclination
): "success" | "primary" | "default" | "warning" | "danger" | "outline" {
  switch (inclination) {
    case "Strong Support":
      return "success";
    case "Lean Support":
      return "primary";
    case "Neutral":
      return "default";
    case "Undecided":
      return "outline";
    case "Lean Opposition":
      return "warning";
    case "Strong Opposition":
      return "danger";
  }
}

export function getSurveyStatusVariant(
  status: SurveyStatus
): "success" | "primary" | "default" | "danger" {
  switch (status) {
    case "Completed":
      return "success";
    case "Pending":
      return "primary";
    case "Not Started":
      return "default";
    case "Refused":
      return "danger";
  }
}

export function getCoverageColor(pct: number): string {
  if (pct >= 85) return "bg-semantic-success";
  if (pct >= 70) return "bg-accent-primary";
  if (pct >= 55) return "bg-semantic-warning";
  return "bg-semantic-danger";
}
