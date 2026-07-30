export type PersonStatus = "active" | "inactive" | "archived";
export type PersonGender = "male" | "female" | "other";

export interface PersonAddress {
  line1: string;
  line2?: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
}

export interface PersonSocialMedia {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  mobile: string;
  alternateMobile?: string;
  email?: string;
  whatsapp: string;
  gender: PersonGender;
  dateOfBirth?: string;
  area: string;
  ward: string;
  booth: string;
  address: PersonAddress;
  politicalDesignation?: string;
  partyAffiliation?: string;
  voterId?: string;
  socialMedia?: PersonSocialMedia;
  tags: string[];
  status: PersonStatus;
  notes?: string;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
  initials: string;
}

export interface PersonTimelineEvent {
  id: string;
  personId: string;
  title: string;
  description: string;
  timestamp: string;
  type: "visit" | "call" | "document" | "note" | "update" | "meeting";
}

export interface PersonDocument {
  id: string;
  personId: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface PersonNote {
  id: string;
  personId: string;
  content: string;
  author: string;
  createdAt: string;
  pinned?: boolean;
}

export interface PersonActivity {
  id: string;
  personId: string;
  action: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  user: string;
  timestamp: string;
}

export interface PeopleFilters {
  ward: string[];
  booth: string[];
  area: string[];
  gender: PersonGender[];
  status: PersonStatus[];
  tags: string[];
}

export const defaultPeopleFilters: PeopleFilters = {
  ward: [],
  booth: [],
  area: [],
  gender: [],
  status: [],
  tags: [],
};
