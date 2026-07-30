import type {
  Appointment,
  OfficeContact,
  OfficeEvent,
  Greeting,
  PressNote,
  OfficeTask,
  RecentActivity,
} from "@/modules/office-desk/types";
import {
  CONTACT_CATEGORIES,
  EVENT_TYPES,
  GREETING_CATEGORIES,
  PRESS_CATEGORIES,
  STAFF_MEMBERS,
  MEETING_WITH,
  OFFICE_TODAY,
} from "@/modules/office-desk/constants";
import { getAllPeople } from "@/modules/people/data/people";
import { WARDS } from "@/modules/people/constants";

const people = getAllPeople();
const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "14:00", "15:00", "15:30", "16:00", "17:00"];
const purposes = ["Constituency Issue", "Personal Meeting", "Scheme Discussion", "Follow-up", "Document Review", "Invitation", "Request", "Feedback"];

function pick<T>(arr: readonly T[], i: number): T {
  return arr[i % arr.length];
}

// ─── Appointments (~80) ───
function generateAppointments(): Appointment[] {
  const items: Appointment[] = [];
  for (let i = 1; i <= 80; i++) {
    const idx = i - 1;
    const person = people[idx % people.length];
    const dayOffset = idx % 45;
    const d = new Date("2026-06-15");
    d.setDate(d.getDate() + dayOffset);
    const dateStr = d.toISOString().split("T")[0];
    const isToday = dateStr === OFFICE_TODAY;
    let status: Appointment["status"];
    if (dateStr > OFFICE_TODAY) status = "scheduled";
    else if (isToday) status = pick(["scheduled", "confirmed", "completed"] as const, idx);
    else status = pick(["completed", "completed", "cancelled", "no-show"] as const, idx);

    items.push({
      id: `ap-${String(i).padStart(3, "0")}`,
      appointmentNo: `APT-2026-${String(i).padStart(4, "0")}`,
      personId: person.id,
      purpose: pick(purposes, idx),
      meetingWith: pick(MEETING_WITH, idx),
      date: dateStr,
      time: pick(times, idx),
      status,
      createdAt: `${dateStr}T08:00:00`,
    });
  }
  return items;
}

export const appointments = generateAppointments();

export function getAppointmentById(id: string) {
  return appointments.find((a) => a.id === id);
}

export function getTodayAppointments() {
  return appointments.filter((a) => a.date === OFFICE_TODAY);
}

// ─── Office Contacts (~48) ───
const contactData: Omit<OfficeContact, "id" | "category">[] = [
  { name: "Dr. Rajendra Shinde", organization: "District Collector Office", designation: "Deputy Collector", phone: "020-25671234", email: "dc.office@maharashtra.gov.in", address: "Collector Office, Pune", department: "Revenue" },
  { name: "Smt. Anuradha Patil", organization: "Pune Municipal Corporation", designation: "Additional Commissioner", phone: "020-25501234", email: "addl.comm@pmc.gov.in", address: "PMC Main Building", department: "Administration" },
  { name: "Shri. Vikram Jadhav", organization: "Pune City Police", designation: "DCP Zone II", phone: "020-26201234", email: "dcp.zone2@police.gov.in", address: "Police Commissioner Office" },
  { name: "Ms. Kavita Deshmukh", organization: "Times of India", designation: "Bureau Chief", phone: "9822012345", email: "kavita.d@timesgroup.com", address: "FC Road, Pune" },
  { name: "Dr. Sunil More", organization: "Sassoon General Hospital", designation: "Medical Superintendent", phone: "020-26101234", email: "ms@sassoonhospital.org" },
  { name: "Prof. Meera Bhosale", organization: "Savitribai Phule Pune University", designation: "Registrar", phone: "020-25690123", email: "registrar@unipune.ac.in" },
  { name: "Shri. Ganesh Pawar", organization: "Rotary Club Pune", designation: "President", phone: "9876012345", email: "president@rotarypune.org" },
  { name: "Mrs. Sunita Gaikwad", organization: "Maharashtra Chamber of Commerce", designation: "Director", phone: "9823012345", email: "sunita@mccia.org" },
];

export const officeContacts: OfficeContact[] = CONTACT_CATEGORIES.flatMap((category, ci) =>
  Array.from({ length: 6 }, (_, j) => {
    const idx = ci * 6 + j;
    const base = contactData[idx % contactData.length];
    return {
      id: `oc-${String(idx + 1).padStart(3, "0")}`,
      ...base,
      name: j === 0 ? base.name : `${base.name.split(" ")[0]} ${pick(["Kulkarni", "Naik", "Sharma", "Joshi", "Reddy"], idx)}`,
      category,
    };
  })
);

// ─── Events (~35) ───
export const officeEvents: OfficeEvent[] = Array.from({ length: 35 }, (_, i) => {
  const idx = i;
  const dayOffset = idx % 40;
  const d = new Date("2026-06-01");
  d.setDate(d.getDate() + dayOffset);
  const dateStr = d.toISOString().split("T")[0];
  const type = pick(EVENT_TYPES, idx);
  let status: OfficeEvent["status"];
  if (dateStr > OFFICE_TODAY) status = "upcoming";
  else if (dateStr === OFFICE_TODAY) status = "ongoing";
  else status = "completed";

  return {
    id: `ev-${String(i + 1).padStart(3, "0")}`,
    title: `${type} — ${pick(WARDS, idx).split("—")[1]?.trim() ?? "Pune Central"}`,
    type,
    date: dateStr,
    startTime: pick(times, idx),
    endTime: pick(times, idx + 2),
    location: pick(["Constituency Office", "Ward Office", "Public Ground", "Community Hall", "PMC Building"], idx),
    ward: pick(WARDS, idx),
    description: `Scheduled ${type.toLowerCase()} for constituency engagement.`,
    status,
  };
});

// ─── Greetings (~45) ───
export const greetings: Greeting[] = Array.from({ length: 45 }, (_, i) => {
  const idx = i;
  const person = people[idx % people.length];
  const dayOffset = (idx % 30) - 5;
  const d = new Date(OFFICE_TODAY);
  d.setDate(d.getDate() + dayOffset);
  const dateStr = d.toISOString().split("T")[0];
  let status: Greeting["status"];
  if (dayOffset < 0) status = "sent";
  else if (dayOffset === 0) status = pick(["scheduled", "sent"] as const, idx);
  else status = pick(["draft", "scheduled"] as const, idx);

  return {
    id: `gr-${String(i + 1).padStart(3, "0")}`,
    personId: person.id,
    recipientName: person.fullName,
    category: pick(GREETING_CATEGORIES, idx),
    occasion: pick(["Birthday", "Work Anniversary", "Diwali", "Achievement", "Condolence Meeting"], idx),
    scheduledDate: dateStr,
    status,
    message: status === "sent" ? "Warm wishes on this special occasion." : undefined,
    sentAt: status === "sent" ? `${dateStr}T09:00:00` : undefined,
  };
});

// ─── Press Notes (~28) ───
export const pressNotes: PressNote[] = Array.from({ length: 28 }, (_, i) => {
  const idx = i;
  const dayOffset = idx % 35;
  const d = new Date("2026-06-01");
  d.setDate(d.getDate() + dayOffset);
  const dateStr = d.toISOString().split("T")[0];
  return {
    id: `pn-${String(i + 1).padStart(3, "0")}`,
    title: pick([
      "Constituency Development Update",
      "Response to Opposition Statement",
      "New Scheme Launch Announcement",
      "Monsoon Preparedness Press Release",
      "Ward Development Project Inauguration",
      "Public Meeting Summary",
    ], idx),
    category: pick(PRESS_CATEGORIES, idx),
    createdBy: pick(STAFF_MEMBERS, idx),
    date: dateStr,
    status: pick(["draft", "published", "published", "archived"] as const, idx),
    attachment: idx % 2 === 0 ? "press_note.pdf" : undefined,
    summary: "Official communication regarding constituency matters.",
  };
});

// ─── Tasks (~40) ───
export const officeTasks: OfficeTask[] = Array.from({ length: 40 }, (_, i) => {
  const idx = i;
  const dayOffset = (idx % 20) - 3;
  const d = new Date(OFFICE_TODAY);
  d.setDate(d.getDate() + dayOffset);
  const dateStr = d.toISOString().split("T")[0];
  let status: OfficeTask["status"];
  if (dayOffset < 0) status = pick(["completed", "completed", "cancelled"] as const, idx);
  else if (dayOffset === 0) status = pick(["pending", "in-progress", "on-hold"] as const, idx);
  else status = "pending";

  return {
    id: `tk-${String(i + 1).padStart(3, "0")}`,
    title: pick([
      "Prepare ward meeting agenda",
      "Follow up with PMC on road repair",
      "Coordinate event logistics",
      "Review pending letters",
      "Update constituency database",
      "Schedule press briefing",
      "Send greeting cards batch",
      "Compile monthly report",
    ], idx),
    description: "Internal office task for daily operations.",
    priority: pick(["low", "normal", "normal", "high", "urgent"] as const, idx),
    assignedStaff: pick(STAFF_MEMBERS, idx),
    dueDate: dateStr,
    status,
    comments: idx % 4,
    createdAt: `${dateStr}T08:00:00`,
  };
});

// ─── Recent Activities ───
export const recentActivities: RecentActivity[] = [
  { id: "ra-1", action: "Appointment confirmed", detail: "APT-2026-0042 with Rajesh Patil", user: "Reception Desk", timestamp: "2026-07-25T09:15:00" },
  { id: "ra-2", action: "Task completed", detail: "Prepare ward meeting agenda", user: "Office Manager", timestamp: "2026-07-25T08:45:00" },
  { id: "ra-3", action: "Greeting sent", detail: "Birthday wish to Priya Deshmukh", user: "Personal Assistant", timestamp: "2026-07-25T08:30:00" },
  { id: "ra-4", action: "Press note published", detail: "Constituency Development Update", user: "PRO", timestamp: "2026-07-24T17:00:00" },
  { id: "ra-5", action: "Event scheduled", detail: "Ward Visit — Kothrud on Jul 28", user: "Program Coordinator", timestamp: "2026-07-24T15:30:00" },
  { id: "ra-6", action: "Contact updated", detail: "PMC Additional Commissioner details", user: "Office Manager", timestamp: "2026-07-24T11:00:00" },
];

export function getDashboardStats() {
  const todayApts = getTodayAppointments();
  return {
    todayAppointments: todayApts.length,
    upcomingEvents: officeEvents.filter((e) => e.status === "upcoming" || e.date >= OFFICE_TODAY).length,
    pendingTasks: officeTasks.filter((t) => t.status === "pending" || t.status === "in-progress").length,
    completedTasks: officeTasks.filter((t) => t.status === "completed").length,
    todayGreetings: greetings.filter((g) => g.scheduledDate === OFFICE_TODAY).length,
    pressNotesDraft: pressNotes.filter((p) => p.status === "draft").length,
    officeContacts: officeContacts.length,
  };
}
