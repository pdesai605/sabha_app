import type { Visit, VisitTimelineEvent, FollowUpItem } from "@/modules/visitor-desk/types";
import {
  VISIT_PURPOSES,
  STAFF_MEMBERS,
  MEETING_WITH,
} from "@/modules/visitor-desk/constants";
import { getAllPeople } from "@/modules/people/data/people";
import { WARDS, AREAS } from "@/modules/people/constants";

const TODAY = "2026-07-25";
const people = getAllPeople();

function pick<T>(arr: readonly T[], i: number): T {
  return arr[i % arr.length];
}

function generateVisits(): Visit[] {
  const visits: Visit[] = [];
  const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];

  for (let i = 1; i <= 150; i++) {
    const idx = i - 1;
    const person = people[idx % people.length];
    const dayOffset = idx % 60;
    const visitDate = new Date("2026-06-01");
    visitDate.setDate(visitDate.getDate() + dayOffset);
    const dateStr = visitDate.toISOString().split("T")[0];

    const isToday = dateStr === TODAY;
    const isFuture = dateStr > TODAY;

    let status: Visit["status"];
    if (isFuture) {
      status = "scheduled";
    } else if (isToday) {
      status = pick(["waiting", "in-progress", "completed", "waiting", "completed"] as const, idx);
    } else {
      status = pick(["completed", "completed", "completed", "cancelled"] as const, idx);
    }

    const visitorType: Visit["visitorType"] =
      idx % 7 === 0 ? "first-time" :
      idx % 5 === 0 ? "repeat" :
      idx % 4 === 0 ? "scheduled" : "walk-in";

    const letterSubmitted = idx % 3 === 0;
    const hasFollowUp = idx % 6 === 0;

    const visit: Visit = {
      id: `v-${String(i).padStart(3, "0")}`,
      token: `VD-2026-${String(i).padStart(4, "0")}`,
      personId: person.id,
      purpose: pick(VISIT_PURPOSES, idx),
      visitorType,
      priority: pick(["low", "normal", "normal", "high", "urgent"] as const, idx),
      meetingWith: pick(MEETING_WITH, idx),
      assignedStaff: pick(STAFF_MEMBERS, idx + 2),
      visitDate: dateStr,
      visitTime: pick(times, idx),
      status,
      letterSubmitted,
      letter: letterSubmitted
        ? {
            referenceNumber: `LTR/2026/${String(i).padStart(5, "0")}`,
            fileName: idx % 2 === 0 ? "visitor_letter.pdf" : "application_scan.jpg",
            fileType: idx % 2 === 0 ? "PDF" : "Image",
            fileSize: idx % 2 === 0 ? "320 KB" : "1.1 MB",
            uploadedAt: `${dateStr}T${pick(times, idx)}:00`,
          }
        : undefined,
      internalNotes: idx % 4 === 0 ? "Follow up with ward office within 7 days." : undefined,
      citizenRemarks: idx % 3 === 0 ? "Citizen requested urgent resolution." : undefined,
      followUpDate: hasFollowUp
        ? (() => {
            const d = new Date(dateStr);
            d.setDate(d.getDate() + (idx % 14) + 1);
            return d.toISOString().split("T")[0];
          })()
        : undefined,
      attachments: idx % 5 === 0
        ? [{
            id: `att-${i}`,
            name: "supporting_document.pdf",
            type: "PDF",
            size: "180 KB",
            uploadedAt: `${dateStr}T10:00:00`,
          }]
        : [],
      createdAt: `${dateStr}T${pick(times, idx)}:00`,
      updatedAt: `${dateStr}T${pick(times, idx + 1)}:00`,
    };

    visits.push(visit);
  }

  return visits;
}

export const visits = generateVisits();

export function getVisitById(id: string): Visit | undefined {
  return visits.find((v) => v.id === id);
}

export function getVisitsForToday(): Visit[] {
  return visits.filter((v) => v.visitDate === TODAY);
}

export function getTimelineForVisit(visitId: string): VisitTimelineEvent[] {
  const visit = getVisitById(visitId);
  if (!visit) return [];

  const events: VisitTimelineEvent[] = [
    {
      id: `te-${visitId}-1`,
      visitId,
      title: "Visit Created",
      description: `Token ${visit.token} issued at reception.`,
      timestamp: visit.createdAt,
      type: "created",
    },
    {
      id: `te-${visitId}-2`,
      visitId,
      title: "Staff Assigned",
      description: `Assigned to ${visit.assignedStaff}.`,
      timestamp: visit.createdAt,
      type: "assigned",
    },
  ];

  if (visit.letterSubmitted && visit.letter) {
    events.push({
      id: `te-${visitId}-3`,
      visitId,
      title: "Letter Uploaded",
      description: `Reference: ${visit.letter.referenceNumber}`,
      timestamp: visit.letter.uploadedAt,
      type: "letter",
    });
  }

  if (visit.citizenRemarks || visit.internalNotes) {
    events.push({
      id: `te-${visitId}-4`,
      visitId,
      title: "Remarks Added",
      description: visit.citizenRemarks ?? visit.internalNotes,
      timestamp: visit.updatedAt,
      type: "remark",
    });
  }

  if (visit.status === "completed") {
    events.push({
      id: `te-${visitId}-5`,
      visitId,
      title: "Visit Closed",
      description: "Visit marked as completed.",
      timestamp: visit.updatedAt,
      type: "closed",
    });
  }

  if (visit.followUpDate) {
    events.push({
      id: `te-${visitId}-6`,
      visitId,
      title: "Follow-up Scheduled",
      description: `Follow-up on ${visit.followUpDate}.`,
      timestamp: visit.updatedAt,
      type: "follow-up",
    });
  }

  return events;
}

export function getFollowUps(): FollowUpItem[] {
  return visits
    .filter((v) => v.followUpDate)
    .map((v) => {
      const person = people.find((p) => p.id === v.personId);
      let status: FollowUpItem["status"] = "upcoming";
      if (v.followUpDate === TODAY) status = "today";
      else if (v.followUpDate! < TODAY) status = "missed";

      return {
        id: `fu-${v.id}`,
        visitId: v.id,
        personName: person?.fullName ?? "Unknown",
        purpose: v.purpose,
        followUpDate: v.followUpDate!,
        assignedStaff: v.assignedStaff,
        status,
      };
    })
    .sort((a, b) => a.followUpDate.localeCompare(b.followUpDate));
}

export function getDashboardStats() {
  const todayVisits = getVisitsForToday();
  const personVisitCounts = new Map<string, number>();
  visits.forEach((v) => {
    personVisitCounts.set(v.personId, (personVisitCounts.get(v.personId) ?? 0) + 1);
  });

  return {
    todayVisitors: todayVisits.length,
    waiting: todayVisits.filter((v) => v.status === "waiting").length,
    completed: todayVisits.filter((v) => v.status === "completed").length,
    scheduledAppointments: todayVisits.filter((v) => v.visitorType === "scheduled" || v.status === "scheduled").length,
    walkIns: todayVisits.filter((v) => v.visitorType === "walk-in").length,
    firstTime: todayVisits.filter((v) => v.visitorType === "first-time").length,
    repeat: todayVisits.filter((v) => v.visitorType === "repeat" || (personVisitCounts.get(v.personId) ?? 0) > 1).length,
    lettersToday: todayVisits.filter((v) => v.letterSubmitted).length,
  };
}

export { TODAY as VISITOR_DESK_TODAY };
