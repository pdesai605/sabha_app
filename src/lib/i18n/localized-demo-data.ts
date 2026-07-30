/**
 * Locale-aware demo data accessors — use these in UI components with useTranslation().locale.
 */
import type { Locale } from "./types";
import { getCurrentLocale } from "./locale-store";
import {
  localizeDemoText,
  localizeList,
  localizeVisit,
  localizeVisitTimelineEvent,
  localizeFollowUp,
  localizeDevelopmentProject,
  localizeGovernmentScheme,
  localizePublicWork,
  localizePublicComplaint,
  localizeInspection,
  localizeTender,
  localizeGovRecentActivity,
  localizeWardProjectSummary,
  localizeExpenseCategory,
  localizeVendor,
  localizeExpense,
  localizeBudgetEntry,
  localizeAppointment,
  localizeOfficeContact,
  localizeOfficeEvent,
  localizeGreeting,
  localizePressNote,
  localizeOfficeTask,
  localizeOfficeRecentActivity,
  localizeInwardLetter,
  localizeOutwardLetter,
  localizeOfficeFile,
  localizeLetterTemplate,
  localizeDispatchRecord,
  localizeArchivedDocument,
  localizeLetterRecentActivity,
  localizeVoter,
  localizeBoothRecord,
  localizeWardAnalytics,
  localizeCitizenIssue,
  localizeSurveyCampaign,
  localizeSurveyResponse,
  localizeCampaign,
  localizePartyMember,
  localizeHierarchyNode,
} from "./demo-data-localize";

import {
  people,
  getAllPeople,
  getPersonById,
  getTimelineForPerson,
  getDocumentsForPerson,
  getNotesForPerson,
  getActivitiesForPerson,
} from "@/modules/people/data/people";

import {
  visits,
  getVisitById as getVisitByIdRaw,
  getVisitsForToday as getVisitsForTodayRaw,
  getTimelineForVisit as getTimelineForVisitRaw,
  getFollowUps as getFollowUpsRaw,
} from "@/modules/visitor-desk/data/visits";

import {
  developmentProjects,
  governmentSchemes,
  publicWorks,
  publicComplaints,
  inspections,
  tenders,
  recentActivities as govRecentActivities,
  wardProjectSummaries,
  getUpcomingInspections as getUpcomingInspectionsRaw,
  getLatestProjects as getLatestProjectsRaw,
} from "@/modules/governance/data/governance-data";

import {
  expenseCategories,
  vendors,
  expenses,
  budgets,
} from "@/modules/expense-management/data/expense-data";

import {
  appointments,
  getAppointmentById as getAppointmentByIdRaw,
  getTodayAppointments as getTodayAppointmentsRaw,
  officeContacts,
  officeEvents,
  greetings,
  pressNotes,
  officeTasks,
  recentActivities as officeRecentActivities,
} from "@/modules/office-desk/data/office-data";

import {
  inwardLetters,
  outwardLetters,
  officeFiles,
  letterTemplates,
  dispatchRecords,
  archivedDocuments,
  recentActivities as letterRecentActivities,
  getRecentLetters as getRecentLettersRaw,
  getPendingFileMovement as getPendingFileMovementRaw,
  getRecentDispatch as getRecentDispatchRaw,
  getUpcomingDeadlines as getUpcomingDeadlinesRaw,
} from "@/modules/letters-documents/data/letters-data";

import {
  voters,
  booths,
  wardAnalytics,
  citizenIssues,
  surveyCampaigns,
  surveyResponses,
  campaigns,
  getTopBooths as getTopBoothsRaw,
  getUpcomingCampaigns as getUpcomingCampaignsRaw,
  getRecentIssues as getRecentIssuesRaw,
} from "@/modules/voter-intelligence/data/voter-data";

import {
  partyMembers,
  getMemberById as getMemberByIdRaw,
  getMembersByOrg as getMembersByOrgRaw,
  organizationHierarchy,
} from "@/modules/party-members/data/members";

function loc(locale?: Locale): Locale {
  return locale ?? getCurrentLocale();
}

// ─── People ───
export {
  getAllPeople,
  getPersonById,
  getTimelineForPerson,
  getDocumentsForPerson,
  getNotesForPerson,
  getActivitiesForPerson,
};
export function getPeople(locale?: Locale) {
  return getAllPeople(loc(locale));
}

// ─── Visitor Desk ───
export function getVisits(locale?: Locale) {
  return localizeList(visits, localizeVisit, loc(locale));
}
export function getVisitById(id: string, locale?: Locale) {
  const v = getVisitByIdRaw(id);
  return v ? localizeVisit(v, loc(locale)) : undefined;
}
export function getVisitsForToday(locale?: Locale) {
  return localizeList(getVisitsForTodayRaw(), localizeVisit, loc(locale));
}
export function getTimelineForVisit(visitId: string, locale?: Locale) {
  return localizeList(getTimelineForVisitRaw(visitId), localizeVisitTimelineEvent, loc(locale));
}
export function getFollowUps(locale?: Locale) {
  return localizeList(getFollowUpsRaw(), localizeFollowUp, loc(locale));
}

// ─── Governance ───
export function getDevelopmentProjects(locale?: Locale) {
  return localizeList(developmentProjects, localizeDevelopmentProject, loc(locale));
}
export function getGovernmentSchemes(locale?: Locale) {
  return localizeList(governmentSchemes, localizeGovernmentScheme, loc(locale));
}
export function getPublicWorks(locale?: Locale) {
  return localizeList(publicWorks, localizePublicWork, loc(locale));
}
export function getPublicComplaints(locale?: Locale) {
  return localizeList(publicComplaints, localizePublicComplaint, loc(locale));
}
export function getInspections(locale?: Locale) {
  return localizeList(inspections, localizeInspection, loc(locale));
}
export function getTenders(locale?: Locale) {
  return localizeList(tenders, localizeTender, loc(locale));
}
export function getGovRecentActivities(locale?: Locale) {
  return localizeList(govRecentActivities, localizeGovRecentActivity, loc(locale));
}
export function getWardProjectSummaries(locale?: Locale) {
  return localizeList(wardProjectSummaries, localizeWardProjectSummary, loc(locale));
}
export function getUpcomingInspections(limit = 6, locale?: Locale) {
  return localizeList(getUpcomingInspectionsRaw(limit), localizeInspection, loc(locale));
}
export function getLatestProjects(limit = 6, locale?: Locale) {
  return localizeList(getLatestProjectsRaw(limit), localizeDevelopmentProject, loc(locale));
}

// ─── Expense ───
export function getExpenseCategories(locale?: Locale) {
  return localizeList(expenseCategories, localizeExpenseCategory, loc(locale));
}
export function getVendors(locale?: Locale) {
  return localizeList(vendors, localizeVendor, loc(locale));
}
export function getExpenses(locale?: Locale) {
  return localizeList(expenses, localizeExpense, loc(locale));
}
export function getBudgets(locale?: Locale) {
  return localizeList(budgets, localizeBudgetEntry, loc(locale));
}

// ─── Office Desk ───
export function getAppointments(locale?: Locale) {
  return localizeList(appointments, localizeAppointment, loc(locale));
}
export function getAppointmentById(id: string, locale?: Locale) {
  const a = getAppointmentByIdRaw(id);
  return a ? localizeAppointment(a, loc(locale)) : undefined;
}
export function getTodayAppointments(locale?: Locale) {
  return localizeList(getTodayAppointmentsRaw(), localizeAppointment, loc(locale));
}
export function getOfficeContacts(locale?: Locale) {
  return localizeList(officeContacts, localizeOfficeContact, loc(locale));
}
export function getOfficeEvents(locale?: Locale) {
  return localizeList(officeEvents, localizeOfficeEvent, loc(locale));
}
export function getGreetings(locale?: Locale) {
  return localizeList(greetings, localizeGreeting, loc(locale));
}
export function getPressNotes(locale?: Locale) {
  return localizeList(pressNotes, localizePressNote, loc(locale));
}
export function getOfficeTasks(locale?: Locale) {
  return localizeList(officeTasks, localizeOfficeTask, loc(locale));
}
export function getOfficeRecentActivities(locale?: Locale) {
  return localizeList(officeRecentActivities, localizeOfficeRecentActivity, loc(locale));
}

// ─── Letters ───
export function getInwardLetters(locale?: Locale) {
  return localizeList(inwardLetters, localizeInwardLetter, loc(locale));
}
export function getOutwardLetters(locale?: Locale) {
  return localizeList(outwardLetters, localizeOutwardLetter, loc(locale));
}
export function getOfficeFiles(locale?: Locale) {
  return localizeList(officeFiles, localizeOfficeFile, loc(locale));
}
export function getLetterTemplates(locale?: Locale) {
  return localizeList(letterTemplates, localizeLetterTemplate, loc(locale));
}
export function getDispatchRecords(locale?: Locale) {
  return localizeList(dispatchRecords, localizeDispatchRecord, loc(locale));
}
export function getArchivedDocuments(locale?: Locale) {
  return localizeList(archivedDocuments, localizeArchivedDocument, loc(locale));
}
export function getLetterRecentActivities(locale?: Locale) {
  return localizeList(letterRecentActivities, localizeLetterRecentActivity, loc(locale));
}
export function getRecentLetters(limit = 8, locale?: Locale) {
  const l = loc(locale);
  return getRecentLettersRaw(limit).map((item) => ({
    ...item,
    subject: localizeDemoText(item.subject, l),
  }));
}
export function getPendingFileMovement(limit = 6, locale?: Locale) {
  return localizeList(getPendingFileMovementRaw(limit), localizeOfficeFile, loc(locale));
}
export function getRecentDispatch(limit = 6, locale?: Locale) {
  return localizeList(getRecentDispatchRaw(limit), localizeDispatchRecord, loc(locale));
}
export function getUpcomingDeadlines(limit = 6, locale?: Locale) {
  return localizeList(getUpcomingDeadlinesRaw(limit), localizeInwardLetter, loc(locale));
}

// ─── Voter Intelligence ───
export function getVoters(locale?: Locale) {
  return localizeList(voters, localizeVoter, loc(locale));
}
export function getBooths(locale?: Locale) {
  return localizeList(booths, localizeBoothRecord, loc(locale));
}
export function getWardAnalytics(locale?: Locale) {
  return localizeList(wardAnalytics, localizeWardAnalytics, loc(locale));
}
export function getCitizenIssues(locale?: Locale) {
  return localizeList(citizenIssues, localizeCitizenIssue, loc(locale));
}
export function getSurveyCampaigns(locale?: Locale) {
  return localizeList(surveyCampaigns, localizeSurveyCampaign, loc(locale));
}
export function getSurveyResponses(locale?: Locale) {
  return localizeList(surveyResponses, localizeSurveyResponse, loc(locale));
}
export function getCampaigns(locale?: Locale) {
  return localizeList(campaigns, localizeCampaign, loc(locale));
}
export function getTopBooths(limit = 5, locale?: Locale) {
  return localizeList(getTopBoothsRaw(limit), localizeBoothRecord, loc(locale));
}
export function getUpcomingCampaigns(locale?: Locale) {
  return localizeList(getUpcomingCampaignsRaw(), localizeCampaign, loc(locale));
}
export function getRecentIssues(limit = 6, locale?: Locale) {
  return localizeList(getRecentIssuesRaw(limit), localizeCitizenIssue, loc(locale));
}

// ─── Party Members ───
export function getPartyMembers(locale?: Locale) {
  return localizeList(partyMembers, localizePartyMember, loc(locale));
}
export function getMemberById(id: string, locale?: Locale) {
  const m = getMemberByIdRaw(id);
  return m ? localizePartyMember(m, loc(locale)) : undefined;
}
export function getMembersByOrg(org: Parameters<typeof getMembersByOrgRaw>[0], locale?: Locale) {
  return localizeList(getMembersByOrgRaw(org), localizePartyMember, loc(locale));
}
export function getOrganizationHierarchy(locale?: Locale) {
  return localizeHierarchyNode(organizationHierarchy, loc(locale));
}

/** Re-export raw English arrays for modules that only need counts/stats. */
export { people, visits, expenses, partyMembers };
