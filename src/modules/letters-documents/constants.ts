export const MODULE_NAV = [
  { label: "Dashboard", href: "/letters-documents" },
  { label: "Inward", href: "/letters-documents/inward" },
  { label: "Outward", href: "/letters-documents/outward" },
  { label: "Files", href: "/letters-documents/files" },
  { label: "Templates", href: "/letters-documents/templates" },
  { label: "Dispatch", href: "/letters-documents/dispatch" },
  { label: "Archive", href: "/letters-documents/archive" },
  { label: "Reports", href: "/letters-documents/reports" },
] as const;

export const LD_TODAY = "2026-07-25";
export const LD_MONTH = "2026-07";

export const GOVT_DEPARTMENTS = [
  "PMC — Pune Municipal Corporation",
  "PWD — Public Works Department",
  "Collector Office — Pune",
  "Police — Pune City",
  "Revenue Department",
  "Health Department",
  "Education Department",
  "Water Supply — PMC",
  "MSEDCL — Electricity",
  "Zilla Parishad",
  "District Collectorate",
  "MHADA",
  "Forest Department",
  "Transport Department",
] as const;

export const INWARD_CATEGORIES = [
  "General Correspondence",
  "Complaint",
  "Request",
  "Invitation",
  "Government Circular",
  "Legal Notice",
  "RTI Application",
  "Scheme Application",
  "Transfer Order",
  "Meeting Notice",
] as const;

export const TEMPLATE_CATEGORIES = [
  "Official Letter",
  "Acknowledgement",
  "Approval",
  "Complaint Reply",
  "Invitation",
  "Meeting Notice",
  "Press Communication",
  "Reminder",
] as const;

export const DELIVERY_METHODS = [
  "Hand Delivery",
  "Courier",
  "Speed Post",
  "Email",
  "WhatsApp",
  "Registered Post",
] as const;

export const INWARD_STATUS_LABELS: Record<string, string> = {
  received: "Received",
  assigned: "Assigned",
  "in-progress": "In Progress",
  replied: "Replied",
  closed: "Closed",
  archived: "Archived",
};

export const OUTWARD_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  "pending-approval": "Pending Approval",
  approved: "Approved",
  dispatched: "Dispatched",
  delivered: "Delivered",
  archived: "Archived",
};

export const FILE_STATUS_LABELS: Record<string, string> = {
  open: "Open",
  pending: "Pending",
  "in-movement": "In Movement",
  closed: "Closed",
  archived: "Archived",
};

export const DISPATCH_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  dispatched: "Dispatched",
  "in-transit": "In Transit",
  delivered: "Delivered",
  returned: "Returned",
};

export const COURIERS = [
  "Blue Dart",
  "DTDC",
  "India Post — Speed Post",
  "Professional Couriers",
  "Maruti Couriers",
  "Hand Delivery",
] as const;
