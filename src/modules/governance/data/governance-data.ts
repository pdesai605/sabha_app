import type {
  DevelopmentProject,
  GovernmentScheme,
  PublicWork,
  PublicComplaint,
  Inspection,
  Tender,
  RecentActivity,
  WardProjectSummary,
} from "@/modules/governance/types";
import {
  PROJECT_CATEGORIES,
  DEPARTMENTS,
  CONTRACTORS,
  SCHEME_NAMES,
  COMPLAINT_CATEGORIES,
  PUBLIC_WORK_TYPES,
  GOV_TODAY,
  GOV_MONTH,
} from "@/modules/governance/constants";
import { WARDS, AREAS, BOOTHS } from "@/modules/people/constants";
import { getAllPeople } from "@/modules/people/data/people";

function pick<T>(arr: readonly T[], i: number): T {
  return arr[i % arr.length];
}

const people = getAllPeople();

const projectNames = [
  "FC Road Widening & Footpath",
  "Kothrud Drainage Line Upgrade",
  "Hadapsar Community Hall Construction",
  "Yerwada Primary Health Centre Renovation",
  "Aundh Sports Complex Development",
  "Baner Water Pipeline Extension",
  "Wagholi Road Resurfacing",
  "Pimpri Market Area Beautification",
  "Shivajinagar Street Light LED Upgrade",
  "Deccan Bridge Repair Works",
  "Koregaon Park Sewage Treatment",
  "Ward Office Building Renovation",
  "Public Toilet Block — 12 Units",
  "School Building Repair — ZP Primary",
  "Anganwadi Centre Construction",
  "Bus Stop Shelter Installation",
  "Rainwater Harvesting — 50 Buildings",
  "Solar Panel Installation — Ward Office",
  "Crematorium Ground Development",
  "Playground Development — Ward Park",
];

// ─── Development Projects (120) ───
export const developmentProjects: DevelopmentProject[] = Array.from({ length: 120 }, (_, i) => {
  const idx = i;
  const ward = pick(WARDS, idx);
  const area = pick(AREAS, idx);
  const budget = pick([2500000, 5000000, 8500000, 12000000, 25000000, 45000000, 75000000, 120000000], idx);
  const startOffset = idx % 180;
  const start = new Date("2025-10-01");
  start.setDate(start.getDate() + startOffset);
  const startDate = start.toISOString().split("T")[0];
  const end = new Date(start);
  end.setDate(end.getDate() + pick([90, 120, 180, 270, 365], idx));
  const endDate = end.toISOString().split("T")[0];

  let status: DevelopmentProject["status"];
  if (endDate < GOV_TODAY) status = pick(["Completed", "Completed", "Cancelled"] as const, idx);
  else if (startDate > GOV_TODAY) status = pick(["Planning", "Approved"] as const, idx);
  else status = pick(["In Progress", "In Progress", "Approved", "On Hold"] as const, idx);

  const progress = status === "Completed" ? 100 : status === "Planning" ? pick([5, 10, 15], idx) : status === "Approved" ? pick([20, 30], idx) : status === "On Hold" ? pick([40, 55], idx) : pick([35, 50, 65, 78, 85], idx);
  const spentAmount = Math.round(budget * (progress / 100));

  return {
    id: `proj-${String(i + 1).padStart(3, "0")}`,
    projectId: `PRJ-2026-${String(i + 1).padStart(4, "0")}`,
    projectName: `${pick(projectNames, idx)} — ${area}`,
    ward,
    area,
    category: pick(PROJECT_CATEGORIES, idx),
    department: pick(DEPARTMENTS, idx),
    budget,
    spentAmount,
    contractor: pick(CONTRACTORS, idx),
    startDate,
    endDate,
    progress,
    status,
  };
});

// ─── Government Schemes (30) ───
export const governmentSchemes: GovernmentScheme[] = SCHEME_NAMES.map((name, i) => {
  const applications = pick([450, 680, 920, 1200, 1500, 2100, 3500], i);
  const approved = Math.round(applications * pick([0.55, 0.62, 0.68, 0.72, 0.78], i));
  const rejected = Math.round(applications * pick([0.08, 0.12, 0.15], i));
  const pending = applications - approved - rejected;
  const progress = Math.round((approved / applications) * 100);

  return {
    id: `sch-${String(i + 1).padStart(2, "0")}`,
    schemeName: name,
    department: pick(DEPARTMENTS, i),
    beneficiaries: pick([500, 1200, 2500, 5000, 8500, 12000], i),
    ward: pick(WARDS, i),
    applications,
    approved,
    rejected,
    pending,
    budget: pick([5000000, 15000000, 35000000, 75000000, 150000000], i),
    status: pick(["active", "active", "completed", "paused"] as const, i),
    progress,
  };
});

// ─── Public Works (80) ───
export const publicWorks: PublicWork[] = Array.from({ length: 80 }, (_, i) => {
  const idx = i;
  const type = pick(PUBLIC_WORK_TYPES, idx);
  let status: PublicWork["status"];
  status = pick(["In Progress", "In Progress", "Completed", "Approved", "Planning"] as const, idx);
  const progress = status === "Completed" ? 100 : pick([25, 40, 55, 70, 85], idx);

  return {
    id: `pw-${String(i + 1).padStart(3, "0")}`,
    workId: `PW-2026-${String(i + 1).padStart(4, "0")}`,
    type,
    ward: pick(WARDS, idx),
    area: pick(AREAS, idx),
    contractor: pick(CONTRACTORS, idx),
    department: pick(DEPARTMENTS, idx),
    budget: pick([800000, 1500000, 2500000, 4500000, 8000000], idx),
    progress,
    status,
  };
});

// ─── Public Complaints (220) ───
const complaintDescriptions = [
  "Large potholes on main road causing accidents",
  "No water supply for 3 days in the area",
  "Garbage dump not cleared for a week",
  "Drainage overflow during monsoon",
  "Street lights not working on entire lane",
  "Frequent power cuts in the evening",
  "Primary health centre lacks basic medicines",
  "School boundary wall damaged and unsafe",
  "Illegal encroachment on public footpath",
  "Mosquito breeding in stagnant water",
];

export const publicComplaints: PublicComplaint[] = Array.from({ length: 220 }, (_, i) => {
  const idx = i;
  const citizen = pick(people, idx);
  const officer = pick(people, idx + 17);
  const dayOffset = idx % 60;
  const created = new Date("2026-06-01");
  created.setDate(created.getDate() + dayOffset);
  const createdDate = created.toISOString().split("T")[0];
  const due = new Date(created);
  due.setDate(due.getDate() + pick([7, 14, 21, 30], idx));
  const dueDate = due.toISOString().split("T")[0];

  let status: PublicComplaint["status"];
  if (dueDate < GOV_TODAY && idx % 7 === 0) status = "overdue";
  else if (dayOffset > 45) status = pick(["resolved", "closed", "closed"] as const, idx);
  else if (dayOffset > 30) status = pick(["in-progress", "resolved"] as const, idx);
  else status = pick(["open", "in-progress", "in-progress"] as const, idx);

  return {
    id: `cmp-${String(i + 1).padStart(3, "0")}`,
    complaintId: `CMP-2026-${String(i + 1).padStart(4, "0")}`,
    citizenName: citizen.fullName,
    personId: citizen.id,
    ward: citizen.ward,
    area: citizen.area,
    category: pick(COMPLAINT_CATEGORIES, idx),
    priority: pick(["low", "normal", "normal", "high", "urgent"] as const, idx),
    assignedOfficer: officer.fullName,
    officerPersonId: officer.id,
    createdDate,
    dueDate,
    status,
    description: pick(complaintDescriptions, idx),
  };
}).sort((a, b) => b.createdDate.localeCompare(a.createdDate));

// ─── Inspections (65) ───
export const inspections: Inspection[] = Array.from({ length: 65 }, (_, i) => {
  const idx = i;
  const project = pick(developmentProjects, idx);
  const officer = pick(people, idx + 5);
  const dayOffset = idx % 45;
  const d = new Date("2026-06-15");
  d.setDate(d.getDate() + dayOffset);
  const inspectionDate = d.toISOString().split("T")[0];
  const isPast = inspectionDate <= GOV_TODAY;
  const status: Inspection["status"] = isPast ? "completed" : pick(["scheduled", "scheduled", "rescheduled"] as const, idx);
  const result: Inspection["result"] = isPast ? pick(["Satisfactory", "Satisfactory", "Needs Improvement", "Unsatisfactory"] as const, idx) : "Pending";

  return {
    id: `insp-${String(i + 1).padStart(3, "0")}`,
    inspectionId: `INS-2026-${String(i + 1).padStart(4, "0")}`,
    projectName: project.projectName,
    projectId: project.projectId,
    officerName: officer.fullName,
    officerPersonId: officer.id,
    ward: project.ward,
    inspectionDate,
    status,
    remarks: isPast ? pick([
      "Work progressing as per schedule",
      "Quality standards maintained",
      "Minor delays noted — contractor instructed to expedite",
      "Material quality verified and approved",
      "Safety compliance checked — satisfactory",
    ], idx) : undefined,
    result,
  };
}).sort((a, b) => a.inspectionDate.localeCompare(b.inspectionDate));

// ─── Tenders (40) ───
export const tenders: Tender[] = Array.from({ length: 40 }, (_, i) => {
  const idx = i;
  const project = pick(developmentProjects, idx);
  const pubOffset = idx % 30;
  const published = new Date("2026-05-01");
  published.setDate(published.getDate() + pubOffset);
  const publishedDate = published.toISOString().split("T")[0];
  const closing = new Date(published);
  closing.setDate(closing.getDate() + pick([15, 21, 30, 45], idx));
  const closingDate = closing.toISOString().split("T")[0];

  let status: Tender["status"];
  if (closingDate > GOV_TODAY) status = "published";
  else status = pick(["closed", "awarded", "awarded", "under-review", "cancelled"] as const, idx);

  return {
    id: `tnd-${String(i + 1).padStart(3, "0")}`,
    tenderNo: `TND/PMC/2026/${String(i + 1).padStart(4, "0")}`,
    projectName: project.projectName,
    department: project.department,
    estimatedCost: project.budget,
    publishedDate,
    closingDate,
    bidders: pick([3, 5, 7, 8, 12, 15], idx),
    status,
    awardedTo: status === "awarded" ? pick(CONTRACTORS, idx) : undefined,
  };
});

// ─── Recent Activities ───
export const recentActivities: RecentActivity[] = [
  { id: "ga-1", action: "Project milestone completed", detail: "PRJ-2026-0042 — FC Road Widening 75% done", user: "Constituency Coordinator", timestamp: "2026-07-25T10:30:00" },
  { id: "ga-2", action: "Complaint resolved", detail: "CMP-2026-0088 — Water supply restored in Kothrud", user: "Ward Secretary", timestamp: "2026-07-25T09:15:00" },
  { id: "ga-3", action: "Inspection completed", detail: "INS-2026-0035 — Hadapsar Community Hall — Satisfactory", user: "Rajesh Vijay Patil", timestamp: "2026-07-24T16:00:00" },
  { id: "ga-4", action: "Tender awarded", detail: "TND/PMC/2026/0012 — Shree Construction Pvt Ltd", user: "Accounts Officer", timestamp: "2026-07-24T14:30:00" },
  { id: "ga-5", action: "Scheme applications approved", detail: "PM Awas Yojana — 45 applications approved", user: "Field Coordinator", timestamp: "2026-07-24T11:00:00" },
  { id: "ga-6", action: "Public work initiated", detail: "PW-2026-0067 — Drainage work started in Yerwada", user: "Program Coordinator", timestamp: "2026-07-23T15:45:00" },
];

// ─── Ward Project Summary ───
export const wardProjectSummaries: WardProjectSummary[] = WARDS.map((ward) => {
  const wardProjects = developmentProjects.filter((p) => p.ward === ward);
  return {
    ward,
    active: wardProjects.filter((p) => p.status === "In Progress" || p.status === "Approved").length,
    completed: wardProjects.filter((p) => p.status === "Completed").length,
    totalBudget: wardProjects.reduce((s, p) => s + p.budget, 0),
  };
});

// ─── Dashboard Stats ───
export function getDashboardStats() {
  const activeProjects = developmentProjects.filter((p) => p.status === "In Progress" || p.status === "Approved").length;
  const completedProjects = developmentProjects.filter((p) => p.status === "Completed").length;
  const pendingComplaints = publicComplaints.filter((c) => c.status === "open" || c.status === "in-progress" || c.status === "overdue").length;
  const resolvedComplaints = publicComplaints.filter((c) => c.status === "resolved" || c.status === "closed").length;
  const inspectionsThisMonth = inspections.filter((i) => i.inspectionDate.startsWith(GOV_MONTH)).length;
  const runningTenders = tenders.filter((t) => t.status === "published" || t.status === "under-review").length;
  const totalBudget = developmentProjects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = developmentProjects.reduce((s, p) => s + p.spentAmount, 0);
  const budgetUtilization = Math.round((totalSpent / totalBudget) * 100);

  return {
    activeProjects,
    completedProjects,
    governmentSchemes: governmentSchemes.length,
    pendingComplaints,
    resolvedComplaints,
    inspectionsThisMonth,
    runningTenders,
    budgetUtilization,
  };
}

export function getUpcomingInspections(limit = 6) {
  return inspections.filter((i) => i.status === "scheduled" && i.inspectionDate >= GOV_TODAY).slice(0, limit);
}

export function getLatestProjects(limit = 6) {
  return developmentProjects.filter((p) => p.status === "In Progress").slice(0, limit);
}

export { BOOTHS };
