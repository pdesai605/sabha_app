import type { OrganizationType } from "@/modules/party-members/types";

export const ORGANIZATION_LABELS: Record<OrganizationType, string> = {
  corporation: "Corporation",
  panchayat: "Panchayat",
  party: "Party",
  morcha: "Morcha",
  committees: "Committees",
};

export const ORGANIZATION_ROUTES: Record<OrganizationType, string> = {
  corporation: "/party-members/corporation",
  panchayat: "/party-members/panchayat",
  party: "/party-members/party",
  morcha: "/party-members/morcha",
  committees: "/party-members/committees",
};

export const MODULE_NAV = [
  { label: "Dashboard", href: "/party-members" },
  { label: "Corporation", href: "/party-members/corporation" },
  { label: "Panchayat", href: "/party-members/panchayat" },
  { label: "Party", href: "/party-members/party" },
  { label: "Morcha", href: "/party-members/morcha" },
  { label: "Committees", href: "/party-members/committees" },
  { label: "Hierarchy", href: "/party-members/hierarchy" },
  { label: "Reports", href: "/party-members/reports" },
] as const;

export const CORPORATION_DESIGNATIONS = [
  "Corporator",
  "Deputy Mayor",
  "Standing Committee Chair",
  "Ward Councillor",
  "Ward President",
  "Booth Agent",
  "Area Coordinator",
  "Party Worker",
] as const;

export const PANCHAYAT_DESIGNATIONS = [
  "Sarpanch",
  "Deputy Sarpanch",
  "Gram Panchayat Member",
  "Panchayat Samiti Member",
  "Zilla Parishad Member",
  "Village Coordinator",
  "Booth Agent",
  "Party Worker",
] as const;

export const PARTY_DESIGNATIONS = [
  "District President",
  "Block President",
  "Constituency Coordinator",
  "Ward President",
  "Shakti Kendra Pramukh",
  "Booth Agent",
  "Karyakarta",
  "General Worker",
] as const;

export const MORCHA_TYPES = [
  "Youth Morcha",
  "Women's Morcha",
  "Trade Union Morcha",
  "Farmer Morcha",
  "Minority Morcha",
  "SC/ST Morcha",
] as const;

export const MORCHA_DESIGNATIONS = [
  "Morcha President",
  "Morcha Vice President",
  "Morcha Secretary",
  "Morcha Treasurer",
  "Morcha Member",
  "Active Worker",
] as const;

export const COMMITTEES = [
  "Core Committee",
  "Election Committee",
  "Finance Committee",
  "Disciplinary Committee",
  "Public Relations Committee",
  "Campaign Committee",
  "Women's Committee",
  "Youth Committee",
] as const;

export const COMMITTEE_DESIGNATIONS = [
  "Chairperson",
  "Vice Chairperson",
  "Secretary",
  "Joint Secretary",
  "Treasurer",
  "Member",
] as const;

export const AGE_GROUPS = [
  "18–25",
  "26–35",
  "36–45",
  "46–55",
  "56–65",
  "65+",
] as const;

export const PANCHAYAT_NAMES = [
  "Wagholi Gram Panchayat",
  "Kesnand Gram Panchayat",
  "Loni Kalbhor Gram Panchayat",
  "Uruli Devachi Gram Panchayat",
  "Manjri Gram Panchayat",
  "Phursungi Gram Panchayat",
] as const;

export function getDesignationsForOrg(org: OrganizationType): readonly string[] {
  switch (org) {
    case "corporation":
      return CORPORATION_DESIGNATIONS;
    case "panchayat":
      return PANCHAYAT_DESIGNATIONS;
    case "party":
      return PARTY_DESIGNATIONS;
    case "morcha":
      return MORCHA_DESIGNATIONS;
    case "committees":
      return COMMITTEE_DESIGNATIONS;
  }
}
