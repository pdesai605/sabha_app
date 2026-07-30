export type VisitStatus =
  | "waiting"
  | "in-progress"
  | "completed"
  | "scheduled"
  | "cancelled";

export type VisitPriority = "low" | "normal" | "high" | "urgent";

export type VisitorType = "walk-in" | "scheduled" | "repeat" | "first-time";

export type VisitPurpose =
  | "Complaint"
  | "Request"
  | "Meeting"
  | "Invitation"
  | "Scheme Application"
  | "Greeting"
  | "Document Submission";

export interface VisitLetter {
  referenceNumber: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
}

export interface VisitAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

export interface VisitTimelineEvent {
  id: string;
  visitId: string;
  title: string;
  description?: string;
  timestamp: string;
  type: "created" | "assigned" | "letter" | "remark" | "closed" | "follow-up";
}

export interface Visit {
  id: string;
  token: string;
  personId: string;
  purpose: VisitPurpose;
  visitorType: VisitorType;
  priority: VisitPriority;
  meetingWith: string;
  assignedStaff: string;
  visitDate: string;
  visitTime: string;
  status: VisitStatus;
  letterSubmitted: boolean;
  letter?: VisitLetter;
  internalNotes?: string;
  citizenRemarks?: string;
  followUpDate?: string;
  attachments: VisitAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface VisitWithPerson extends Visit {
  fullName: string;
  mobile: string;
  whatsapp: string;
  initials: string;
  area: string;
  ward: string;
}

export interface VisitorDeskFilters {
  status: VisitStatus[];
  purpose: VisitPurpose[];
  visitorType: VisitorType[];
  priority: VisitPriority[];
  assignedStaff: string[];
  ward: string[];
  area: string[];
  dateFrom?: string;
  dateTo?: string;
}

export const defaultVisitorDeskFilters: VisitorDeskFilters = {
  status: [],
  purpose: [],
  visitorType: [],
  priority: [],
  assignedStaff: [],
  ward: [],
  area: [],
};

export interface FollowUpItem {
  id: string;
  visitId: string;
  personName: string;
  purpose: string;
  followUpDate: string;
  assignedStaff: string;
  status: "upcoming" | "today" | "missed";
}
