export type AppointmentStatus = "scheduled" | "confirmed" | "completed" | "cancelled" | "no-show";
export type TaskStatus = "pending" | "in-progress" | "on-hold" | "completed" | "cancelled";
export type TaskPriority = "low" | "normal" | "high" | "urgent";
export type GreetingStatus = "draft" | "scheduled" | "sent";
export type GreetingCategory = "Birthday" | "Anniversary" | "Festival" | "Congratulations" | "Condolence";
export type PressNoteStatus = "draft" | "published" | "archived";
export type EventType =
  | "Public Meeting"
  | "Ward Visit"
  | "Inspection"
  | "Inauguration"
  | "Press Conference"
  | "Government Program"
  | "Party Program";

export type ContactCategory =
  | "Government"
  | "Police"
  | "Municipal"
  | "NGO"
  | "Media"
  | "Business"
  | "Healthcare"
  | "Education";

export interface Appointment {
  id: string;
  appointmentNo: string;
  personId: string;
  purpose: string;
  meetingWith: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface AppointmentWithPerson extends Appointment {
  fullName: string;
  mobile: string;
  initials: string;
}

export interface OfficeContact {
  id: string;
  name: string;
  organization: string;
  designation: string;
  phone: string;
  email?: string;
  address?: string;
  department?: string;
  category: ContactCategory;
}

export interface OfficeEvent {
  id: string;
  title: string;
  type: EventType;
  date: string;
  startTime: string;
  endTime?: string;
  location: string;
  ward?: string;
  description?: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
}

export interface Greeting {
  id: string;
  personId?: string;
  recipientName: string;
  category: GreetingCategory;
  occasion: string;
  scheduledDate: string;
  status: GreetingStatus;
  message?: string;
  sentAt?: string;
}

export interface PressNote {
  id: string;
  title: string;
  category: string;
  createdBy: string;
  date: string;
  status: PressNoteStatus;
  attachment?: string;
  summary?: string;
}

export interface OfficeTask {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  assignedStaff: string;
  dueDate: string;
  status: TaskStatus;
  comments: number;
  createdAt: string;
}

export interface RecentActivity {
  id: string;
  action: string;
  detail: string;
  user: string;
  timestamp: string;
}
