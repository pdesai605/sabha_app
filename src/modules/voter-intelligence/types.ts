export type PartyInclination =
  | "Strong Support"
  | "Lean Support"
  | "Neutral"
  | "Lean Opposition"
  | "Strong Opposition"
  | "Undecided";

export type SurveyStatus = "Completed" | "Pending" | "Not Started" | "Refused";
export type IssueCategory =
  | "Road"
  | "Water"
  | "Drainage"
  | "Street Lights"
  | "Health"
  | "Education"
  | "Electricity"
  | "Garbage"
  | "Others";

export type IssuePriority = "low" | "normal" | "high" | "urgent";
export type IssueStatus = "open" | "in-progress" | "resolved" | "closed";

export type CampaignType =
  | "Door-to-door"
  | "Booth Meeting"
  | "Public Meeting"
  | "WhatsApp Campaign"
  | "Phone Campaign"
  | "Street Campaign";

export type CampaignStatus = "planned" | "ongoing" | "completed" | "cancelled";

export interface Voter {
  id: string;
  voterId: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  mobile: string;
  ward: string;
  booth: string;
  area: string;
  houseNo: string;
  familyId: string;
  partyInclination: PartyInclination;
  surveyStatus: SurveyStatus;
  lastContact?: string;
  personId?: string;
}

export interface Booth {
  id: string;
  boothNumber: string;
  name: string;
  ward: string;
  area: string;
  totalVoters: number;
  coveragePercent: number;
  volunteers: string[];
  pendingSurveys: number;
  recentActivity: string;
  surveyCompletion: number;
}

export interface WardAnalytics {
  id: string;
  ward: string;
  population: number;
  registeredVoters: number;
  booths: number;
  coverage: number;
  surveyPercent: number;
  openIssues: number;
  partyWorkers: number;
}

export interface CitizenIssue {
  id: string;
  issueId: string;
  citizenName: string;
  personId?: string;
  ward: string;
  booth: string;
  category: IssueCategory;
  priority: IssuePriority;
  assignedTo: string;
  status: IssueStatus;
  description: string;
  created: string;
  resolved?: string;
}

export interface SurveyCampaign {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  targetBooths: number;
  completionPercent: number;
  status: "active" | "completed" | "draft";
  questions: number;
}

export interface SurveyResponse {
  id: string;
  campaignId: string;
  campaignTitle: string;
  volunteer: string;
  booth: string;
  ward: string;
  date: string;
  responsesCount: number;
  targetCount: number;
  completionPercent: number;
}

export interface Campaign {
  id: string;
  title: string;
  type: CampaignType;
  area: string;
  ward: string;
  boothsCovered: string[];
  assignedTeam: string;
  targetAudience: string;
  progress: number;
  status: CampaignStatus;
  startDate: string;
  endDate?: string;
}
