export type OrganizationType =
  | "corporation"
  | "panchayat"
  | "party"
  | "morcha"
  | "committees";

export type MemberStatus = "active" | "inactive" | "pending";

export interface PartyMember {
  id: string;
  personId: string;
  organizationType: OrganizationType;
  designation: string;
  ward: string;
  booth: string;
  area: string;
  committee?: string;
  morchaType?: string;
  panchayatName?: string;
  joiningDate: string;
  status: MemberStatus;
}

export interface PartyMemberWithPerson extends PartyMember {
  fullName: string;
  mobile: string;
  whatsapp: string;
  initials: string;
  gender: string;
  dateOfBirth?: string;
}

export interface MemberTransfer {
  id: string;
  memberId: string;
  memberName: string;
  fromWard: string;
  toWard: string;
  reason: string;
  effectiveDate: string;
  transferredAt: string;
}

export interface RoleChange {
  id: string;
  memberId: string;
  memberName: string;
  fromRole: string;
  toRole: string;
  changedAt: string;
}

export interface PendingApproval {
  id: string;
  memberName: string;
  organizationType: OrganizationType;
  designation: string;
  submittedAt: string;
}

export interface PartyMembersFilters {
  ward: string[];
  booth: string[];
  area: string[];
  organization: OrganizationType[];
  designation: string[];
  committee: string[];
  gender: string[];
  ageGroup: string[];
  status: MemberStatus[];
  joiningYear: string[];
}

export const defaultPartyMembersFilters: PartyMembersFilters = {
  ward: [],
  booth: [],
  area: [],
  organization: [],
  designation: [],
  committee: [],
  gender: [],
  ageGroup: [],
  status: [],
  joiningYear: [],
};

export interface HierarchyMember {
  id: string;
  personId: string;
  name: string;
  designation?: string;
}

export interface HierarchyNode {
  id: string;
  label: string;
  subtitle?: string;
  type: "root" | "ward" | "corporator" | "shakti" | "booth" | "president" | "workers" | "member";
  memberCount?: number;
  members?: HierarchyMember[];
  children?: HierarchyNode[];
}
