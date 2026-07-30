export type LetterPriority = "low" | "normal" | "high" | "urgent";
export type InwardStatus = "received" | "assigned" | "in-progress" | "replied" | "closed" | "archived";
export type OutwardStatus = "draft" | "pending-approval" | "approved" | "dispatched" | "delivered" | "archived";
export type FileStatus = "open" | "pending" | "in-movement" | "closed" | "archived";
export type DispatchStatus = "pending" | "dispatched" | "in-transit" | "delivered" | "returned";
export type DeliveryMethod = "Hand Delivery" | "Courier" | "Speed Post" | "Email" | "WhatsApp" | "Registered Post";
export type TemplateCategory =
  | "Official Letter"
  | "Acknowledgement"
  | "Approval"
  | "Complaint Reply"
  | "Invitation"
  | "Meeting Notice"
  | "Press Communication"
  | "Reminder";

export interface InwardLetter {
  id: string;
  diaryNumber: string;
  receivedDate: string;
  sender: string;
  senderDepartment: string;
  subject: string;
  category: string;
  priority: LetterPriority;
  assignedTo: string;
  assignedPersonId?: string;
  status: InwardStatus;
  referenceNumber?: string;
  attachment?: string;
  deadline?: string;
}

export interface OutwardLetter {
  id: string;
  dispatchNumber: string;
  issueDate: string;
  recipient: string;
  department: string;
  subject: string;
  referenceLetter?: string;
  preparedBy: string;
  preparedByPersonId?: string;
  approvedBy: string;
  approvedByPersonId?: string;
  deliveryMethod: DeliveryMethod;
  status: OutwardStatus;
}

export interface FileMovement {
  id: string;
  date: string;
  from: string;
  to: string;
  remarks?: string;
}

export interface OfficeFile {
  id: string;
  fileNumber: string;
  title: string;
  department: string;
  currentHolder: string;
  holderPersonId?: string;
  createdDate: string;
  priority: LetterPriority;
  status: FileStatus;
  movementHistory: FileMovement[];
  remarks?: string;
}

export interface LetterTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  lastUsed?: string;
  usageCount: number;
  isArchived: boolean;
}

export interface DispatchRecord {
  id: string;
  dispatchNumber: string;
  courier?: string;
  trackingNumber?: string;
  recipient: string;
  date: string;
  deliveryMethod: DeliveryMethod;
  status: DispatchStatus;
  deliveredOn?: string;
  acknowledgement?: string;
}

export interface ArchivedDocument {
  id: string;
  documentId: string;
  title: string;
  department: string;
  category: string;
  year: number;
  archivedDate: string;
  status: "active" | "restricted" | "expired";
}

export interface RecentActivity {
  id: string;
  action: string;
  detail: string;
  user: string;
  timestamp: string;
}
