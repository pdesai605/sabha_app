export const MODULE_NAV = [
  { label: "Dashboard", href: "/office-desk" },
  { label: "Appointments", href: "/office-desk/appointments" },
  { label: "Office Contacts", href: "/office-desk/contacts" },
  { label: "Events & Programs", href: "/office-desk/events" },
  { label: "Greetings", href: "/office-desk/greetings" },
  { label: "Press Notes", href: "/office-desk/press-notes" },
  { label: "Tasks", href: "/office-desk/tasks" },
  { label: "Reports", href: "/office-desk/reports" },
] as const;

export const STAFF_MEMBERS = [
  "Office Manager",
  "Personal Assistant",
  "Constituency Coordinator",
  "Reception Desk",
  "Public Relations Officer",
  "Legal Advisor",
  "Program Coordinator",
] as const;

export const MEETING_WITH = [
  "Hon. MLA",
  "Office Manager",
  "Personal Assistant",
  "Constituency Coordinator",
  "Legal Advisor",
  "Program Coordinator",
] as const;

export const CONTACT_CATEGORIES = [
  "Government",
  "Police",
  "Municipal",
  "NGO",
  "Media",
  "Business",
  "Healthcare",
  "Education",
] as const;

export const EVENT_TYPES = [
  "Public Meeting",
  "Ward Visit",
  "Inspection",
  "Inauguration",
  "Press Conference",
  "Government Program",
  "Party Program",
] as const;

export const GREETING_CATEGORIES = [
  "Birthday",
  "Anniversary",
  "Festival",
  "Congratulations",
  "Condolence",
] as const;

export const PRESS_CATEGORIES = [
  "Press Release",
  "Statement",
  "Media Advisory",
  "Event Coverage",
  "Policy Announcement",
  "Response",
] as const;

export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  scheduled: "Scheduled",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  "no-show": "No Show",
};

export const TASK_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  "in-progress": "In Progress",
  "on-hold": "On Hold",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const OFFICE_TODAY = "2026-07-25";
