export const MODULE_NAV = [
  { label: "Dashboard", href: "/voter-intelligence" },
  { label: "Voters", href: "/voter-intelligence/voters" },
  { label: "Booths", href: "/voter-intelligence/booths" },
  { label: "Wards", href: "/voter-intelligence/wards" },
  { label: "Surveys", href: "/voter-intelligence/surveys" },
  { label: "Campaigns", href: "/voter-intelligence/campaigns" },
  { label: "Analytics", href: "/voter-intelligence/analytics" },
  { label: "Reports", href: "/voter-intelligence/reports" },
] as const;

export const VI_TODAY = "2026-07-25";

export const PARTY_INCLINATIONS = [
  "Strong Support",
  "Lean Support",
  "Neutral",
  "Lean Opposition",
  "Strong Opposition",
  "Undecided",
] as const;

export const SURVEY_STATUSES = [
  "Completed",
  "Pending",
  "Not Started",
  "Refused",
] as const;

export const ISSUE_CATEGORIES = [
  "Road",
  "Water",
  "Drainage",
  "Street Lights",
  "Health",
  "Education",
  "Electricity",
  "Garbage",
  "Others",
] as const;

export const CAMPAIGN_TYPES = [
  "Door-to-door",
  "Booth Meeting",
  "Public Meeting",
  "WhatsApp Campaign",
  "Phone Campaign",
  "Street Campaign",
] as const;

export const FIELD_VOLUNTEERS = [
  "Amit Kulkarni",
  "Sneha Patil",
  "Ravi Jadhav",
  "Kiran Deshmukh",
  "Pooja Shinde",
  "Sanjay Bhosale",
  "Anjali More",
  "Vijay Naik",
  "Smita Pawar",
  "Nilesh Gaikwad",
] as const;

export const ASSIGNED_STAFF = [
  "Constituency Coordinator",
  "Ward Secretary",
  "Booth Agent",
  "Field Coordinator",
  "Youth Wing Secretary",
  "Women's Wing President",
] as const;

export const ISSUE_STATUS_LABELS: Record<string, string> = {
  open: "Open",
  "in-progress": "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

export const CAMPAIGN_STATUS_LABELS: Record<string, string> = {
  planned: "Planned",
  ongoing: "Ongoing",
  completed: "Completed",
  cancelled: "Cancelled",
};

/** 3 booths per ward across 8 wards */
export const BOOTH_DEFINITIONS = [
  { number: "101", ward: "Ward 1 — Shivajinagar", area: "Shivajinagar" },
  { number: "102", ward: "Ward 1 — Shivajinagar", area: "Deccan" },
  { number: "103", ward: "Ward 1 — Shivajinagar", area: "Shivajinagar" },
  { number: "201", ward: "Ward 2 — Kothrud", area: "Kothrud" },
  { number: "202", ward: "Ward 2 — Kothrud", area: "Kothrud" },
  { number: "203", ward: "Ward 2 — Kothrud", area: "Deccan" },
  { number: "301", ward: "Ward 3 — Hadapsar", area: "Hadapsar" },
  { number: "302", ward: "Ward 3 — Hadapsar", area: "Hadapsar" },
  { number: "303", ward: "Ward 3 — Hadapsar", area: "Wagholi" },
  { number: "401", ward: "Ward 4 — Yerwada", area: "Yerwada" },
  { number: "402", ward: "Ward 4 — Yerwada", area: "Yerwada" },
  { number: "403", ward: "Ward 4 — Yerwada", area: "Koregaon Park" },
  { number: "501", ward: "Ward 5 — Aundh", area: "Aundh" },
  { number: "502", ward: "Ward 5 — Aundh", area: "Aundh" },
  { number: "503", ward: "Ward 5 — Aundh", area: "Baner" },
  { number: "601", ward: "Ward 6 — Baner", area: "Baner" },
  { number: "602", ward: "Ward 6 — Baner", area: "Baner" },
  { number: "603", ward: "Ward 6 — Baner", area: "Aundh" },
  { number: "701", ward: "Ward 7 — Wagholi", area: "Wagholi" },
  { number: "702", ward: "Ward 7 — Wagholi", area: "Wagholi" },
  { number: "703", ward: "Ward 7 — Wagholi", area: "Hadapsar" },
  { number: "801", ward: "Ward 8 — Pimpri", area: "Pimpri" },
  { number: "802", ward: "Ward 8 — Pimpri", area: "Pimpri" },
  { number: "803", ward: "Ward 8 — Pimpri", area: "Pimpri" },
] as const;
