export const MODULE_NAV = [
  { label: "Dashboard", href: "/governance" },
  { label: "Projects", href: "/governance/projects" },
  { label: "Schemes", href: "/governance/schemes" },
  { label: "Public Works", href: "/governance/public-works" },
  { label: "Complaints", href: "/governance/complaints" },
  { label: "Inspections", href: "/governance/inspections" },
  { label: "Tenders", href: "/governance/tenders" },
  { label: "Reports", href: "/governance/reports" },
] as const;

export const GOV_TODAY = "2026-07-25";
export const GOV_MONTH = "2026-07";

export const PROJECT_STATUSES = [
  "Planning",
  "Approved",
  "In Progress",
  "On Hold",
  "Completed",
  "Cancelled",
] as const;

export const PROJECT_CATEGORIES = [
  "Infrastructure",
  "Roads & Bridges",
  "Water Supply",
  "Drainage",
  "Health",
  "Education",
  "Community Hall",
  "Sports Facility",
  "Sanitation",
  "Electrification",
] as const;

export const DEPARTMENTS = [
  "PMC — Pune Municipal Corporation",
  "PWD — Public Works Department",
  "Zilla Parishad",
  "MLA Development Fund",
  "Minor Irrigation",
  "MSEDCL",
  "MHADA",
  "District Collectorate",
] as const;

export const CONTRACTORS = [
  "Shree Construction Pvt Ltd",
  "Maharashtra Infra Developers",
  "Pune Civic Builders",
  "Om Sai Engineering Works",
  "National Highway Contractors",
  "Green Earth Infrastructure",
  "Hadapsar Roadways Ltd",
  "Western Maharashtra Contractors",
  "Aundh Buildcon",
  "Pimpri Chinchwad Developers",
] as const;

export const SCHEME_NAMES = [
  "Mukhyamantri Majhi Ladki Bahin Yojana",
  "PM Awas Yojana — Urban",
  "Jal Jeevan Mission",
  "Swachh Bharat Mission",
  "MGNREGA",
  "Ayushman Bharat",
  "PM Kisan Samman Nidhi",
  "Maharashtra State Skill Development",
  "Chief Minister Rural Housing Scheme",
  "Solar Rooftop Subsidy Scheme",
  "Senior Citizen Pension Scheme",
  "Widow Pension Scheme",
  "Student Scholarship — SC/ST",
  "Free LPG Connection — Ujjwala",
  "PM Employment Generation Programme",
  "Street Vendor Atma Nirbhar Scheme",
  "Women Self-Help Group Subsidy",
  "Farm Pond Construction Scheme",
  "Drip Irrigation Subsidy",
  "Community Toilet Construction",
  "Anganwadi Upgrade Programme",
  "Primary Health Centre Upgrade",
  "School Digital Classroom Scheme",
  "LED Street Light Replacement",
  "Rainwater Harvesting Subsidy",
  "Disability Pension Scheme",
  "Tribal Development Fund",
  "Urban Livelihood Mission",
  "Handloom Weavers Subsidy",
  "Fishermen Welfare Scheme",
] as const;

export const COMPLAINT_CATEGORIES = [
  "Road",
  "Water",
  "Garbage",
  "Drainage",
  "Street Light",
  "Electricity",
  "Health",
  "Education",
  "Others",
] as const;

export const PUBLIC_WORK_TYPES = [
  "Road Repair",
  "Drainage",
  "Street Lights",
  "Water Pipeline",
  "Footpath",
  "Garden",
  "School",
  "Hospital",
] as const;

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  Planning: "Planning",
  Approved: "Approved",
  "In Progress": "In Progress",
  "On Hold": "On Hold",
  Completed: "Completed",
  Cancelled: "Cancelled",
};

export const COMPLAINT_STATUS_LABELS: Record<string, string> = {
  open: "Open",
  "in-progress": "In Progress",
  resolved: "Resolved",
  closed: "Closed",
  overdue: "Overdue",
};

export const TENDER_STATUS_LABELS: Record<string, string> = {
  published: "Published",
  closed: "Closed",
  awarded: "Awarded",
  cancelled: "Cancelled",
  "under-review": "Under Review",
};

export const INSPECTION_STATUS_LABELS: Record<string, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
  rescheduled: "Rescheduled",
};
