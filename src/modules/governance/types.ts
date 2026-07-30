export type ProjectStatus =
  | "Planning"
  | "Approved"
  | "In Progress"
  | "On Hold"
  | "Completed"
  | "Cancelled";

export type ComplaintStatus = "open" | "in-progress" | "resolved" | "closed" | "overdue";
export type ComplaintPriority = "low" | "normal" | "high" | "urgent";
export type ComplaintCategory =
  | "Road"
  | "Water"
  | "Garbage"
  | "Drainage"
  | "Street Light"
  | "Electricity"
  | "Health"
  | "Education"
  | "Others";

export type SchemeStatus = "active" | "completed" | "paused" | "draft";
export type PublicWorkType =
  | "Road Repair"
  | "Drainage"
  | "Street Lights"
  | "Water Pipeline"
  | "Footpath"
  | "Garden"
  | "School"
  | "Hospital";

export type InspectionStatus = "scheduled" | "completed" | "cancelled" | "rescheduled";
export type InspectionResult = "Satisfactory" | "Needs Improvement" | "Unsatisfactory" | "Pending";
export type TenderStatus = "published" | "closed" | "awarded" | "cancelled" | "under-review";

export interface DevelopmentProject {
  id: string;
  projectId: string;
  projectName: string;
  ward: string;
  area: string;
  category: string;
  department: string;
  budget: number;
  spentAmount: number;
  contractor: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: ProjectStatus;
}

export interface GovernmentScheme {
  id: string;
  schemeName: string;
  department: string;
  beneficiaries: number;
  ward: string;
  applications: number;
  approved: number;
  rejected: number;
  pending: number;
  budget: number;
  status: SchemeStatus;
  progress: number;
}

export interface PublicWork {
  id: string;
  workId: string;
  type: PublicWorkType;
  ward: string;
  area: string;
  contractor: string;
  department: string;
  budget: number;
  progress: number;
  status: ProjectStatus;
}

export interface PublicComplaint {
  id: string;
  complaintId: string;
  citizenName: string;
  personId?: string;
  ward: string;
  area: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  assignedOfficer: string;
  officerPersonId?: string;
  createdDate: string;
  dueDate: string;
  status: ComplaintStatus;
  description: string;
}

export interface Inspection {
  id: string;
  inspectionId: string;
  projectName: string;
  projectId: string;
  officerName: string;
  officerPersonId?: string;
  ward: string;
  inspectionDate: string;
  status: InspectionStatus;
  remarks?: string;
  result: InspectionResult;
}

export interface Tender {
  id: string;
  tenderNo: string;
  projectName: string;
  department: string;
  estimatedCost: number;
  publishedDate: string;
  closingDate: string;
  bidders: number;
  status: TenderStatus;
  awardedTo?: string;
}

export interface RecentActivity {
  id: string;
  action: string;
  detail: string;
  user: string;
  timestamp: string;
}

export interface WardProjectSummary {
  ward: string;
  active: number;
  completed: number;
  totalBudget: number;
}
