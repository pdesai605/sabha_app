import type {
  InwardLetter,
  OutwardLetter,
  OfficeFile,
  LetterTemplate,
  DispatchRecord,
  ArchivedDocument,
  RecentActivity,
  FileMovement,
} from "@/modules/letters-documents/types";
import {
  GOVT_DEPARTMENTS,
  INWARD_CATEGORIES,
  TEMPLATE_CATEGORIES,
  DELIVERY_METHODS,
  COURIERS,
  LD_TODAY,
  LD_MONTH,
} from "@/modules/letters-documents/constants";
import { getAllPeople } from "@/modules/people/data/people";

function pick<T>(arr: readonly T[], i: number): T {
  return arr[i % arr.length];
}

const people = getAllPeople();

const inwardSubjects = [
  "Request for road repair in Ward area",
  "Complaint regarding water supply disruption",
  "Invitation for inauguration ceremony",
  "RTI application for project details",
  "Transfer order for staff posting",
  "Scheme application under PM Awas Yojana",
  "Legal notice regarding land dispute",
  "Meeting notice — District Coordination Committee",
  "Request for appointment with Hon. MLA",
  "Government circular — Monsoon preparedness",
  "Complaint about street light malfunction",
  "Application for pension scheme",
  "Request for community hall booking",
  "Press note submission for approval",
  "Follow-up on pending grievance",
];

const outwardSubjects = [
  "Reply to water supply complaint — CMP reference",
  "Official letter to PMC Commissioner",
  "Acknowledgement of RTI application received",
  "Invitation to constituency development meeting",
  "Approval letter for scheme beneficiary",
  "Complaint reply — drainage issue resolved",
  "Meeting notice — Ward Committee",
  "Press communication — Development update",
  "Reminder for pending file action",
  "Request to PWD for road inspection",
  "Letter to Collector regarding land acquisition",
  "Official communication to Police Commissioner",
];

const fileTitles = [
  "Ward Development Fund — FY 2025-26",
  "Constituency Grievance Redressal",
  "PM Awas Yojana Applications",
  "Road Repair — FC Road Project",
  "Community Hall Construction Proposal",
  "Health Centre Upgrade File",
  "School Building Repair — ZP Primary",
  "Water Pipeline Extension — Aundh",
  "Legal Case — Land Encroachment",
  "Press Note Approvals — July 2026",
];

const senders = [
  "Shri. Rajesh Patil, Citizen",
  "PMC — Additional Commissioner",
  "District Collector, Pune",
  "Superintendent of Police, Pune City",
  "Tehsildar, Haveli Taluka",
  "Chief Engineer, PWD",
  "Municipal Commissioner, PMC",
  "Block Development Officer",
  "Primary Health Centre, Kothrud",
  "Zilla Parishad Education Officer",
];

const recipients = [
  "Municipal Commissioner, PMC",
  "District Collector, Pune",
  "Superintendent of Police",
  "Chief Engineer, PWD",
  "Block Development Officer, Haveli",
  "Tehsildar, Pune",
  "Commissioner, MSEDCL",
  "Director, Health Services",
  "Education Officer, ZP",
  "Forest Range Officer",
];

// ─── Inward Letters (220) ───
export const inwardLetters: InwardLetter[] = Array.from({ length: 220 }, (_, i) => {
  const idx = i;
  const assignee = pick(people, idx + 3);
  const dayOffset = idx % 90;
  const d = new Date("2026-05-01");
  d.setDate(d.getDate() + dayOffset);
  const receivedDate = d.toISOString().split("T")[0];

  let status: InwardLetter["status"];
  if (dayOffset > 75) status = pick(["closed", "archived", "archived"] as const, idx);
  else if (dayOffset > 60) status = pick(["replied", "closed"] as const, idx);
  else if (dayOffset > 40) status = pick(["in-progress", "assigned"] as const, idx);
  else status = pick(["received", "assigned", "in-progress"] as const, idx);

  const deadline = new Date(receivedDate);
  deadline.setDate(deadline.getDate() + pick([7, 14, 21, 30], idx));

  return {
    id: `in-${String(i + 1).padStart(3, "0")}`,
    diaryNumber: `LTR-IN-2026-${String(i + 1).padStart(4, "0")}`,
    receivedDate,
    sender: pick(senders, idx),
    senderDepartment: pick(GOVT_DEPARTMENTS, idx),
    subject: pick(inwardSubjects, idx),
    category: pick(INWARD_CATEGORIES, idx),
    priority: pick(["low", "normal", "normal", "high", "urgent"] as const, idx),
    assignedTo: assignee.fullName,
    assignedPersonId: assignee.id,
    status,
    referenceNumber: idx % 3 === 0 ? `REF/PMC/${2026}/${String(idx + 100).padStart(4, "0")}` : undefined,
    attachment: idx % 4 === 0 ? `inward-${String(i + 1).padStart(4, "0")}.pdf` : undefined,
    deadline: deadline.toISOString().split("T")[0],
  };
}).sort((a, b) => b.receivedDate.localeCompare(a.receivedDate));

// ─── Outward Letters (180) ───
export const outwardLetters: OutwardLetter[] = Array.from({ length: 180 }, (_, i) => {
  const idx = i;
  const preparer = pick(people, idx + 8);
  const approver = pick(people, idx + 20);
  const dayOffset = idx % 80;
  const d = new Date("2026-05-15");
  d.setDate(d.getDate() + dayOffset);
  const issueDate = d.toISOString().split("T")[0];

  let status: OutwardLetter["status"];
  if (dayOffset > 65) status = pick(["delivered", "archived"] as const, idx);
  else if (dayOffset > 50) status = pick(["dispatched", "delivered"] as const, idx);
  else if (dayOffset > 35) status = pick(["approved", "dispatched"] as const, idx);
  else status = pick(["draft", "pending-approval", "approved"] as const, idx);

  return {
    id: `out-${String(i + 1).padStart(3, "0")}`,
    dispatchNumber: `LTR-OUT-2026-${String(i + 1).padStart(4, "0")}`,
    issueDate,
    recipient: pick(recipients, idx),
    department: pick(GOVT_DEPARTMENTS, idx),
    subject: pick(outwardSubjects, idx),
    referenceLetter: idx % 3 === 0 ? `LTR-IN-2026-${String(pick([1, 5, 12, 25, 48], idx)).padStart(4, "0")}` : undefined,
    preparedBy: preparer.fullName,
    preparedByPersonId: preparer.id,
    approvedBy: approver.fullName,
    approvedByPersonId: approver.id,
    deliveryMethod: pick(DELIVERY_METHODS, idx),
    status,
  };
}).sort((a, b) => b.issueDate.localeCompare(a.issueDate));

// ─── Office Files (140) ───
function generateMovement(idx: number, holder: string): FileMovement[] {
  const count = pick([2, 3, 4, 5], idx);
  const movements: FileMovement[] = [];
  for (let m = 0; m < count; m++) {
    const d = new Date("2026-04-01");
    d.setDate(d.getDate() + idx + m * 7);
    movements.push({
      id: `mv-${idx}-${m}`,
      date: d.toISOString().split("T")[0],
      from: m === 0 ? "Reception Desk" : pick(people, idx + m).fullName,
      to: pick(people, idx + m + 1).fullName,
      remarks: pick(["For review and action", "Returned with comments", "Forwarded for approval", "File noted", undefined], idx + m),
    });
  }
  return movements;
}

export const officeFiles: OfficeFile[] = Array.from({ length: 140 }, (_, i) => {
  const idx = i;
  const holder = pick(people, idx + 10);
  const dayOffset = idx % 120;
  const d = new Date("2026-01-15");
  d.setDate(d.getDate() + dayOffset);
  const createdDate = d.toISOString().split("T")[0];

  let status: OfficeFile["status"];
  if (dayOffset > 100) status = pick(["closed", "archived"] as const, idx);
  else if (dayOffset > 80) status = pick(["in-movement", "pending"] as const, idx);
  else status = pick(["open", "pending", "in-movement"] as const, idx);

  return {
    id: `file-${String(i + 1).padStart(3, "0")}`,
    fileNumber: `FILE-2026-${String(i + 1).padStart(4, "0")}`,
    title: `${pick(fileTitles, idx)} — ${pick(["Shivajinagar", "Kothrud", "Hadapsar", "Aundh"], idx)}`,
    department: pick(GOVT_DEPARTMENTS, idx),
    currentHolder: holder.fullName,
    holderPersonId: holder.id,
    createdDate,
    priority: pick(["low", "normal", "normal", "high", "urgent"] as const, idx),
    status,
    movementHistory: generateMovement(idx, holder.fullName),
    remarks: idx % 5 === 0 ? pick(["Awaiting MLA approval", "Pending documents from PMC", "Under legal review", undefined], idx) : undefined,
  };
});

// ─── Letter Templates (60) ───
const templateNames: Record<string, string[]> = {
  "Official Letter": ["Standard Official Letter", "Letter to Government Department", "Letter to Municipal Commissioner"],
  Acknowledgement: ["Acknowledgement of Receipt", "Acknowledgement of Complaint", "Acknowledgement of Application"],
  Approval: ["Scheme Approval Letter", "Project Approval Letter", "Fund Release Approval"],
  "Complaint Reply": ["Water Supply Complaint Reply", "Road Repair Complaint Reply", "General Complaint Reply"],
  Invitation: ["Inauguration Invitation", "Public Meeting Invitation", "Ward Committee Invitation"],
  "Meeting Notice": ["Ward Committee Meeting Notice", "Coordination Meeting Notice", "Review Meeting Notice"],
  "Press Communication": ["Press Release Template", "Media Statement Template", "Development Update Release"],
  Reminder: ["First Reminder", "Second Reminder", "Final Reminder Notice"],
};

export const letterTemplates: LetterTemplate[] = Array.from({ length: 60 }, (_, i) => {
  const idx = i;
  const category = pick(TEMPLATE_CATEGORIES, idx);
  const names = templateNames[category];
  const name = `${pick(names, idx)}${idx >= 8 ? ` — Variant ${Math.floor(idx / 8) + 1}` : ""}`;

  return {
    id: `tpl-${String(i + 1).padStart(3, "0")}`,
    name,
    category,
    description: `Standard template for ${category.toLowerCase()} correspondence.`,
    lastUsed: idx % 3 === 0 ? undefined : (() => {
      const d = new Date(LD_TODAY);
      d.setDate(d.getDate() - (idx % 30));
      return d.toISOString().split("T")[0];
    })(),
    usageCount: pick([3, 8, 15, 22, 35, 48, 67, 89], idx),
    isArchived: idx >= 55,
  };
});

// ─── Dispatch Records (110) ───
export const dispatchRecords: DispatchRecord[] = Array.from({ length: 110 }, (_, i) => {
  const idx = i;
  const outward = pick(outwardLetters, idx);
  const dayOffset = idx % 60;
  const d = new Date("2026-06-01");
  d.setDate(d.getDate() + dayOffset);
  const date = d.toISOString().split("T")[0];
  const method = outward.deliveryMethod;

  let status: DispatchRecord["status"];
  if (dayOffset > 45) status = "delivered";
  else if (dayOffset > 30) status = pick(["delivered", "in-transit"] as const, idx);
  else if (dayOffset > 15) status = pick(["dispatched", "in-transit"] as const, idx);
  else status = pick(["pending", "dispatched"] as const, idx);

  const deliveredOn = status === "delivered" ? (() => {
    const dd = new Date(date);
    dd.setDate(dd.getDate() + pick([2, 3, 5, 7], idx));
    return dd.toISOString().split("T")[0];
  })() : undefined;

  return {
    id: `disp-${String(i + 1).padStart(3, "0")}`,
    dispatchNumber: outward.dispatchNumber,
    courier: method === "Hand Delivery" || method === "Email" || method === "WhatsApp" ? undefined : pick(COURIERS, idx),
    trackingNumber: method === "Courier" || method === "Speed Post" || method === "Registered Post"
      ? `${pick(["BD", "DTDC", "IN", "SP"], idx)}${String(1000000000 + idx * 123457).slice(0, 10)}`
      : undefined,
    recipient: outward.recipient,
    date,
    deliveryMethod: method,
    status,
    deliveredOn,
    acknowledgement: status === "delivered" ? pick(["Received and acknowledged", "Delivered — signed receipt", "Email delivery confirmed", undefined], idx) : undefined,
  };
}).sort((a, b) => b.date.localeCompare(a.date));

// ─── Archived Documents (350) ───
export const archivedDocuments: ArchivedDocument[] = Array.from({ length: 350 }, (_, i) => {
  const idx = i;
  const year = pick([2022, 2023, 2024, 2025, 2026], idx);
  const d = new Date(`${year}-${String((idx % 12) + 1).padStart(2, "0")}-15`);
  d.setDate(d.getDate() + (idx % 28));

  return {
    id: `arc-${String(i + 1).padStart(3, "0")}`,
    documentId: `DOC-ARC-${year}-${String(i + 1).padStart(4, "0")}`,
    title: `${pick([...inwardSubjects, ...outwardSubjects, ...fileTitles], idx)}`,
    department: pick(GOVT_DEPARTMENTS, idx),
    category: pick([...INWARD_CATEGORIES, "Outward Letter", "File Record", "Dispatch Record"], idx),
    year,
    archivedDate: d.toISOString().split("T")[0],
    status: pick(["active", "active", "active", "restricted", "expired"] as const, idx),
  };
});

// ─── Recent Activities ───
export const recentActivities: RecentActivity[] = [
  { id: "la-1", action: "Inward letter received", detail: "LTR-IN-2026-0042 from PMC Additional Commissioner", user: "Reception Desk", timestamp: "2026-07-25T09:30:00" },
  { id: "la-2", action: "Outward letter dispatched", detail: "LTR-OUT-2026-0038 via Speed Post to District Collector", user: "Office Manager", timestamp: "2026-07-25T08:45:00" },
  { id: "la-3", action: "File forwarded", detail: "FILE-2026-0015 to Constituency Coordinator", user: "Personal Assistant", timestamp: "2026-07-24T16:00:00" },
  { id: "la-4", action: "Template used", detail: "Complaint Reply template for water supply grievance", user: "Field Coordinator", timestamp: "2026-07-24T14:30:00" },
  { id: "la-5", action: "Dispatch delivered", detail: "BD9123456789 — Acknowledgement received", user: "Reception Desk", timestamp: "2026-07-24T11:00:00" },
  { id: "la-6", action: "Document archived", detail: "DOC-ARC-2026-0288 — RTI application records", user: "Accounts Officer", timestamp: "2026-07-23T15:45:00" },
];

// ─── Dashboard helpers ───
export function getDashboardStats() {
  const todayInward = inwardLetters.filter((l) => l.receivedDate === LD_TODAY).length;
  const todayOutward = outwardLetters.filter((l) => l.issueDate === LD_TODAY).length;
  const pendingFiles = officeFiles.filter((f) => f.status === "open" || f.status === "pending" || f.status === "in-movement").length;
  const closedFiles = officeFiles.filter((f) => f.status === "closed" || f.status === "archived").length;
  const pendingDispatch = dispatchRecords.filter((d) => d.status === "pending" || d.status === "dispatched" || d.status === "in-transit").length;
  const monthLetters = inwardLetters.filter((l) => l.receivedDate.startsWith(LD_MONTH)).length +
    outwardLetters.filter((l) => l.issueDate.startsWith(LD_MONTH)).length;

  return {
    todayInward,
    todayOutward,
    pendingFiles,
    closedFiles,
    pendingDispatch,
    archivedDocuments: archivedDocuments.length,
    templates: letterTemplates.filter((t) => !t.isArchived).length,
    monthLetters,
  };
}

export function getRecentLetters(limit = 8) {
  const combined = [
    ...inwardLetters.slice(0, 20).map((l) => ({ type: "inward" as const, date: l.receivedDate, subject: l.subject, id: l.diaryNumber, status: l.status })),
    ...outwardLetters.slice(0, 20).map((l) => ({ type: "outward" as const, date: l.issueDate, subject: l.subject, id: l.dispatchNumber, status: l.status })),
  ].sort((a, b) => b.date.localeCompare(a.date));
  return combined.slice(0, limit);
}

export function getPendingFileMovement(limit = 6) {
  return officeFiles.filter((f) => f.status === "in-movement" || f.status === "pending").slice(0, limit);
}

export function getRecentDispatch(limit = 6) {
  return dispatchRecords.slice(0, limit);
}

export function getUpcomingDeadlines(limit = 6) {
  return inwardLetters
    .filter((l) => l.deadline && l.deadline >= LD_TODAY && (l.status === "assigned" || l.status === "in-progress" || l.status === "received"))
    .sort((a, b) => (a.deadline ?? "").localeCompare(b.deadline ?? ""))
    .slice(0, limit);
}
