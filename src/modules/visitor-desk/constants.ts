import type { VisitPurpose, VisitorType } from "@/modules/visitor-desk/types";

export const MODULE_NAV = [
  { label: "Dashboard", href: "/visitor-desk" },
  { label: "Today's Visitors", href: "/visitor-desk/today" },
  { label: "Visitor Register", href: "/visitor-desk/register" },
  { label: "Follow-ups", href: "/visitor-desk/follow-ups" },
  { label: "Reports", href: "/visitor-desk/reports" },
] as const;

export const VISIT_PURPOSES: VisitPurpose[] = [
  "Complaint",
  "Request",
  "Meeting",
  "Invitation",
  "Scheme Application",
  "Greeting",
  "Document Submission",
];

export const VISITOR_TYPES: VisitorType[] = [
  "walk-in",
  "scheduled",
  "repeat",
  "first-time",
];

export const VISIT_STATUSES = [
  "waiting",
  "in-progress",
  "completed",
  "scheduled",
  "cancelled",
] as const;

export const VISIT_PRIORITIES = ["low", "normal", "high", "urgent"] as const;

export const STAFF_MEMBERS = [
  "Reception Desk",
  "Office Manager",
  "Personal Assistant",
  "Constituency Coordinator",
  "Legal Advisor",
  "Public Relations Officer",
] as const;

export const MEETING_WITH = [
  "Hon. MLA",
  "Office Manager",
  "Personal Assistant",
  "Constituency Coordinator",
  "Reception Desk",
  "Legal Advisor",
] as const;

export const PURPOSE_LABELS: Record<VisitPurpose, string> = {
  Complaint: "Complaint",
  Request: "Request",
  Meeting: "Meeting",
  Invitation: "Invitation",
  "Scheme Application": "Scheme Application",
  Greeting: "Greeting",
  "Document Submission": "Document Submission",
};

export const VISITOR_TYPE_LABELS: Record<VisitorType, string> = {
  "walk-in": "Walk-in",
  scheduled: "Scheduled",
  repeat: "Repeat Visitor",
  "first-time": "First Time",
};

export const STATUS_LABELS: Record<string, string> = {
  waiting: "Waiting",
  "in-progress": "In Progress",
  completed: "Completed",
  scheduled: "Scheduled",
  cancelled: "Cancelled",
};
