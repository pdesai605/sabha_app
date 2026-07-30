import { differenceInYears, parseISO } from "date-fns";
import type {
  Voter,
  Booth,
  WardAnalytics,
  CitizenIssue,
  SurveyCampaign,
  SurveyResponse,
  Campaign,
} from "@/modules/voter-intelligence/types";
import {
  BOOTH_DEFINITIONS,
  PARTY_INCLINATIONS,
  SURVEY_STATUSES,
  ISSUE_CATEGORIES,
  CAMPAIGN_TYPES,
  FIELD_VOLUNTEERS,
  ASSIGNED_STAFF,
  VI_TODAY,
} from "@/modules/voter-intelligence/constants";
import { getAllPeople } from "@/modules/people/data/people";
import { WARDS } from "@/modules/people/constants";

function pick<T>(arr: readonly T[], i: number): T {
  return arr[i % arr.length];
}

function getAge(dob: string): number {
  return differenceInYears(parseISO(VI_TODAY), parseISO(dob));
}

const FIRST = ["Amit", "Sneha", "Ravi", "Kiran", "Pooja", "Sanjay", "Anjali", "Vijay", "Smita", "Nilesh", "Ritu", "Pradeep", "Manisha", "Ashok", "Divya", "Sunil", "Geeta", "Ramesh", "Usha", "Mahesh"];
const LAST = ["Patil", "Deshmukh", "Kulkarni", "Jadhav", "Shinde", "Bhosale", "More", "Naik", "Pawar", "Gaikwad", "Chavan", "Salunkhe", "Thorat", "Kadam", "Raut", "Mane"];

// ─── Voters (~250: 100 from People + 150 generated) ───
function buildVoters(): Voter[] {
  const people = getAllPeople();
  const fromPeople: Voter[] = people.map((p, i) => ({
    id: `v-${String(i + 1).padStart(3, "0")}`,
    voterId: p.voterId ?? `MH/12/345/${String(678900 + i + 1).padStart(6, "0")}`,
    name: p.fullName,
    age: p.dateOfBirth ? getAge(p.dateOfBirth) : 30 + (i % 40),
    gender: p.gender,
    mobile: p.mobile,
    ward: p.ward,
    booth: p.booth,
    area: p.area,
    houseNo: p.address.line1.split(",")[0]?.trim() ?? `${(i % 99) + 1}`,
    familyId: `FAM-${String(Math.floor(i / 3) + 1).padStart(4, "0")}`,
    partyInclination: pick(PARTY_INCLINATIONS, i),
    surveyStatus: pick(SURVEY_STATUSES, i),
    lastContact: p.lastActivity.split("T")[0],
    personId: p.id,
  }));

  const extra: Voter[] = [];
  for (let i = 101; i <= 250; i++) {
    const idx = i - 101;
    const boothDef = pick(BOOTH_DEFINITIONS, idx);
    const first = pick(FIRST, idx);
    const last = pick(LAST, idx + 5);
    const gender = idx % 3 === 0 ? "female" : "male";
    const age = 18 + (idx % 62);
    extra.push({
      id: `v-${String(i).padStart(3, "0")}`,
      voterId: `MH/12/345/${String(680000 + i).padStart(6, "0")}`,
      name: `${first} ${last.charAt(0)}. ${last}`,
      age,
      gender: gender as Voter["gender"],
      mobile: `9${String(200000000 + idx * 98765).slice(0, 9)}`,
      ward: boothDef.ward,
      booth: `Booth ${boothDef.number}`,
      area: boothDef.area,
      houseNo: `${(idx % 120) + 1}`,
      familyId: `FAM-${String(Math.floor(i / 4) + 50).padStart(4, "0")}`,
      partyInclination: pick(PARTY_INCLINATIONS, idx),
      surveyStatus: pick(SURVEY_STATUSES, idx),
      lastContact: idx % 5 === 0 ? undefined : (() => {
        const d = new Date(VI_TODAY);
        d.setDate(d.getDate() - (idx % 30));
        return d.toISOString().split("T")[0];
      })(),
    });
  }

  return [...fromPeople, ...extra];
}

export const voters = buildVoters();

// ─── Booths (24) ───
export const booths: Booth[] = BOOTH_DEFINITIONS.map((b, i) => {
  const boothVoters = voters.filter((v) => v.booth === `Booth ${b.number}`);
  const total = boothVoters.length || pick([850, 920, 1050, 1180, 1320], i);
  const coverage = pick([62, 68, 71, 74, 78, 82, 85, 88, 91], i);
  const surveyDone = boothVoters.filter((v) => v.surveyStatus === "Completed").length;
  const surveyCompletion = boothVoters.length ? Math.round((surveyDone / boothVoters.length) * 100) : pick([55, 62, 68, 72, 78, 84], i);

  return {
    id: `booth-${b.number}`,
    boothNumber: b.number,
    name: `Booth ${b.number}`,
    ward: b.ward,
    area: b.area,
    totalVoters: boothVoters.length || total,
    coveragePercent: coverage,
    volunteers: [pick(FIELD_VOLUNTEERS, i), pick(FIELD_VOLUNTEERS, i + 3), pick(FIELD_VOLUNTEERS, i + 6)].filter((v, idx, arr) => arr.indexOf(v) === idx),
    pendingSurveys: boothVoters.filter((v) => v.surveyStatus === "Pending" || v.surveyStatus === "Not Started").length || pick([45, 62, 78, 95, 110], i),
    recentActivity: pick([
      "Door-to-door survey completed — 12 households",
      "Booth agent meeting held",
      "Issue follow-up — water supply complaint",
      "WhatsApp group outreach — 45 members added",
      "Senior citizen contact drive",
      "Youth voter registration camp",
    ], i),
    surveyCompletion,
  };
});

// ─── Ward Analytics ───
export const wardAnalytics: WardAnalytics[] = WARDS.map((ward, i) => {
  const wardVoters = voters.filter((v) => v.ward === ward);
  const wardBooths = booths.filter((b) => b.ward === ward);
  const surveyed = wardVoters.filter((v) => v.surveyStatus === "Completed").length;
  const surveyPct = wardVoters.length ? Math.round((surveyed / wardVoters.length) * 100) : pick([58, 65, 70, 74, 78], i);

  return {
    id: `ward-${i + 1}`,
    ward,
    population: pick([42000, 48000, 55000, 38000, 62000, 71000, 35000, 89000], i),
    registeredVoters: wardVoters.length || pick([8500, 9200, 10500, 7800, 11200, 9800, 7200, 13500], i),
    booths: wardBooths.length,
    coverage: Math.round(wardBooths.reduce((s, b) => s + b.coveragePercent, 0) / wardBooths.length),
    surveyPercent: surveyPct,
    openIssues: pick([8, 12, 15, 6, 18, 10, 7, 22], i),
    partyWorkers: pick([24, 32, 28, 18, 35, 30, 16, 42], i),
  };
});

// ─── Citizen Issues (~75) ───
const issueDescriptions = [
  "Potholes on main road causing traffic issues",
  "Irregular water supply in the area",
  "Blocked drainage leading to waterlogging",
  "Street lights not working for 2 weeks",
  "Primary health centre needs more staff",
  "School building requires repair",
  "Frequent power cuts in the evening",
  "Garbage not collected regularly",
  "Footpath encroachment by vendors",
  "Bus stop shelter damaged",
];

export const citizenIssues: CitizenIssue[] = Array.from({ length: 75 }, (_, i) => {
  const idx = i;
  const voter = pick(voters, idx);
  const dayOffset = idx % 45;
  const d = new Date("2026-06-01");
  d.setDate(d.getDate() + dayOffset);
  const created = d.toISOString().split("T")[0];
  let status: CitizenIssue["status"];
  if (dayOffset > 35) status = "open";
  else if (dayOffset > 25) status = pick(["open", "in-progress"] as const, idx);
  else status = pick(["in-progress", "resolved", "resolved", "closed"] as const, idx);

  return {
    id: `iss-${String(i + 1).padStart(3, "0")}`,
    issueId: `ISS-2026-${String(i + 1).padStart(4, "0")}`,
    citizenName: voter.name,
    personId: voter.personId,
    ward: voter.ward,
    booth: voter.booth,
    category: pick(ISSUE_CATEGORIES, idx),
    priority: pick(["low", "normal", "normal", "high", "urgent"] as const, idx),
    assignedTo: pick(ASSIGNED_STAFF, idx),
    status,
    description: pick(issueDescriptions, idx),
    created,
    resolved: status === "resolved" || status === "closed" ? (() => {
      const r = new Date(created);
      r.setDate(r.getDate() + pick([3, 5, 7, 10, 14], idx));
      return r.toISOString().split("T")[0];
    })() : undefined,
  };
}).sort((a, b) => b.created.localeCompare(a.created));

// ─── Survey Campaigns ───
export const surveyCampaigns: SurveyCampaign[] = [
  { id: "sc-1", title: "Monsoon Preparedness Survey", description: "Drainage and waterlogging assessment across all wards", startDate: "2026-06-15", endDate: "2026-07-31", targetBooths: 24, completionPercent: 68, status: "active", questions: 12 },
  { id: "sc-2", title: "Youth Employment Survey", description: "Employment and skill development needs of youth voters", startDate: "2026-07-01", endDate: "2026-08-15", targetBooths: 24, completionPercent: 42, status: "active", questions: 8 },
  { id: "sc-3", title: "Senior Citizen Welfare Survey", description: "Healthcare and pension-related concerns", startDate: "2026-05-01", endDate: "2026-06-30", targetBooths: 24, completionPercent: 91, status: "completed", questions: 10 },
  { id: "sc-4", title: "Public Transport Feedback", description: "PMPML bus service and connectivity feedback", startDate: "2026-07-10", endDate: "2026-08-10", targetBooths: 16, completionPercent: 35, status: "active", questions: 6 },
  { id: "sc-5", title: "Women Safety Assessment", description: "Street lighting and safety concerns in residential areas", startDate: "2026-04-01", endDate: "2026-05-31", targetBooths: 24, completionPercent: 88, status: "completed", questions: 9 },
];

export const surveyResponses: SurveyResponse[] = Array.from({ length: 48 }, (_, i) => {
  const idx = i;
  const campaign = pick(surveyCampaigns, idx);
  const booth = pick(booths, idx);
  const target = pick([40, 50, 60, 75, 85], idx);
  const done = Math.round(target * (pick([0.4, 0.55, 0.7, 0.85, 0.95], idx)));
  const d = new Date("2026-07-01");
  d.setDate(d.getDate() + (idx % 24));

  return {
    id: `sr-${String(i + 1).padStart(3, "0")}`,
    campaignId: campaign.id,
    campaignTitle: campaign.title,
    volunteer: pick(FIELD_VOLUNTEERS, idx),
    booth: booth.name,
    ward: booth.ward,
    date: d.toISOString().split("T")[0],
    responsesCount: done,
    targetCount: target,
    completionPercent: Math.round((done / target) * 100),
  };
});

// ─── Campaigns (~24) ───
export const campaigns: Campaign[] = Array.from({ length: 24 }, (_, i) => {
  const idx = i;
  const booth = pick(booths, idx);
  const wardBooths = booths.filter((b) => b.ward === booth.ward).map((b) => b.name);
  const type = pick(CAMPAIGN_TYPES, idx);
  const d = new Date("2026-07-01");
  d.setDate(d.getDate() + (idx % 20) - 5);
  const startDate = d.toISOString().split("T")[0];

  let status: Campaign["status"];
  if (startDate > VI_TODAY) status = "planned";
  else if (startDate === VI_TODAY || idx % 4 === 0) status = "ongoing";
  else status = pick(["completed", "completed", "planned", "ongoing"] as const, idx);

  return {
    id: `camp-${String(i + 1).padStart(3, "0")}`,
    title: pick([
      `${booth.area} Outreach Drive`,
      `${booth.ward.split("—")[1]?.trim()} Voter Connect`,
      "Grievance Redressal Camp",
      "Booth Committee Meeting",
      "Digital Outreach — WhatsApp Groups",
      "Senior Citizen Home Visit",
      "Youth Voter Registration Drive",
      "Women's Wing Door Campaign",
    ], idx),
    type,
    area: booth.area,
    ward: booth.ward,
    boothsCovered: wardBooths.slice(0, pick([1, 2, 3], idx)),
    assignedTeam: `${pick(FIELD_VOLUNTEERS, idx)}, ${pick(FIELD_VOLUNTEERS, idx + 2)}`,
    targetAudience: pick(["All Voters", "Senior Citizens", "Youth (18-35)", "Women Voters", "Undecided Voters", "New Voters"], idx),
    progress: status === "completed" ? 100 : status === "ongoing" ? pick([35, 45, 55, 65, 75], idx) : pick([0, 10, 20], idx),
    status,
    startDate,
    endDate: status === "completed" ? startDate : undefined,
  };
});

// ─── Dashboard helpers ───
export function getDashboardStats() {
  const male = voters.filter((v) => v.gender === "male").length;
  const female = voters.filter((v) => v.gender === "female").length;
  const senior = voters.filter((v) => v.age >= 60).length;
  const youth = voters.filter((v) => v.age >= 18 && v.age <= 35).length;
  const newVoters = voters.filter((v) => v.age >= 18 && v.age <= 21).length;
  const pendingSurveys = voters.filter((v) => v.surveyStatus === "Pending" || v.surveyStatus === "Not Started").length;

  return {
    totalVoters: voters.length,
    male,
    female,
    seniorCitizens: senior,
    youth,
    newVoters,
    boothsCovered: booths.length,
    pendingSurveys,
  };
}

export function getTopBooths(limit = 5) {
  return [...booths].sort((a, b) => b.coveragePercent - a.coveragePercent).slice(0, limit);
}

export function getUpcomingCampaigns() {
  return campaigns.filter((c) => c.status === "planned" || c.status === "ongoing").slice(0, 6);
}

export function getRecentIssues(limit = 6) {
  return citizenIssues.slice(0, limit);
}

export function getOverallSurveyCompletion() {
  const completed = voters.filter((v) => v.surveyStatus === "Completed").length;
  return Math.round((completed / voters.length) * 100);
}
