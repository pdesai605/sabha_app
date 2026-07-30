import type { Locale } from "@/lib/i18n/types";
import { localizeDemoText, localizeFullName } from "@/lib/i18n/demo-data-localize";
import { localeTextTemplate } from "@/lib/i18n/translate";
import { formatNumberForLocale } from "@/lib/i18n/numerals";
import { getAllPeople } from "@/modules/people/data/people";
import { partyMembers } from "@/modules/party-members/data/members";
import { getDashboardStats as getVisitorStats, getVisitsForToday, visits, getFollowUps } from "@/modules/visitor-desk/data/visits";
import { getDashboardStats as getOfficeStats, getTodayAppointments, officeEvents, greetings } from "@/modules/office-desk/data/office-data";
import { getDashboardStats as getGovStats, developmentProjects, publicComplaints, publicWorks, governmentSchemes, inspections, tenders } from "@/modules/governance/data/governance-data";
import { getPendingApprovals } from "@/modules/expense-management/data/expense-data";
import { getDashboardStats as getVoterStats, getOverallSurveyCompletion } from "@/modules/voter-intelligence/data/voter-data";
import { outwardLetters } from "@/modules/letters-documents/data/letters-data";
import { OFFICE_TODAY } from "@/modules/office-desk/constants";
import { addDays, format, parseISO } from "date-fns";
import { getPersonById } from "@/modules/people/data/people";

const TODAY = OFFICE_TODAY;

function loc(text: string, locale: Locale) {
  return localizeDemoText(text, locale);
}

function locName(name: string, locale: Locale) {
  return localizeFullName(name, locale);
}

export function buildDashboardData(locale: Locale) {
  const visitorStats = getVisitorStats();
  const officeStats = getOfficeStats();
  const govStats = getGovStats();
  const voterStats = getVoterStats();

  const yesterday = format(addDays(parseISO(TODAY), -1), "yyyy-MM-dd");
  const yesterdayVisitors = visits.filter((v) => v.visitDate === yesterday).length;
  const todayVisitors = getVisitsForToday().length;
  const visitorDelta = todayVisitors - yesterdayVisitors;

  const todayMeetings = getTodayAppointments().length;
  const pendingApprovals = getPendingApprovals();
  const pendingApprovalAmount = pendingApprovals.reduce((s, e) => s + e.amount, 0);

  const lettersAwaitingSignature = outwardLetters.filter(
    (l) => l.status === "pending-approval" || l.status === "draft"
  ).length;

  const scheduledInspections = inspections.filter(
    (i) => i.status === "scheduled" && i.inspectionDate >= TODAY
  ).length;

  const tendersAwaitingReview = tenders.filter(
    (t) => t.status === "under-review" || t.status === "published"
  ).length;

  const followUpCount = getFollowUps().filter(
    (f) => f.status === "today" || f.status === "upcoming" || f.status === "missed"
  ).length;

  const birthdaysToday = greetings.filter(
    (g) => g.category === "Birthday" && g.scheduledDate === TODAY
  ).length;

  const totalProjects = developmentProjects.length;
  const projectProgress = totalProjects
    ? Math.round(
        developmentProjects.reduce((s, p) => s + p.progress, 0) / totalProjects
      )
    : 0;

  const resolvedComplaints = publicComplaints.filter(
    (c) => c.status === "resolved" || c.status === "closed"
  ).length;
  const complaintResolution = publicComplaints.length
    ? Math.round((resolvedComplaints / publicComplaints.length) * 100)
    : 0;

  const schemeProgress = governmentSchemes.length
    ? Math.round(
        governmentSchemes.reduce((s, sch) => s + sch.progress, 0) /
          governmentSchemes.length
      )
    : 0;

  const surveyCompletion = getOverallSurveyCompletion();

  const worksProgress = publicWorks.length
    ? Math.round(publicWorks.reduce((s, w) => s + w.progress, 0) / publicWorks.length)
    : 0;

  const peopleConnected =
    getAllPeople().length + voterStats.totalVoters + partyMembers.length + officeStats.officeContacts;

  const todaySchedule = [
    { id: "sch-1", time: "09:30", title: "Meeting with PMC Commissioner", href: "/office-desk/appointments", appointmentId: getTodayAppointments().find((a) => a.time === "09:30")?.id },
    { id: "sch-2", time: "11:00", title: "Citizen Grievance Meeting", href: "/office-desk/appointments", appointmentId: getTodayAppointments().find((a) => a.time === "11:00")?.id },
    { id: "sch-3", time: "13:30", title: "Review Public Works", href: "/governance/public-works", appointmentId: undefined },
    { id: "sch-4", time: "15:00", title: "Inspection", href: "/governance/inspections", appointmentId: undefined },
    { id: "sch-5", time: "17:00", title: "Party Office Meeting", href: "/office-desk/appointments", appointmentId: getTodayAppointments().find((a) => a.time === "17:00")?.id },
  ].map((item) => ({
    ...item,
    title: loc(item.title, locale),
    href: item.appointmentId
      ? `/office-desk/appointments?id=${item.appointmentId}`
      : item.href,
  }));

  const notifications = [
    { id: "n-1", text: "Complaint assigned", href: "/governance/complaints" },
    { id: "n-2", text: "Inspection completed", href: "/governance/inspections" },
    { id: "n-3", text: "New visitor registered", href: "/visitor-desk/register" },
    { id: "n-4", text: "Expense approved", href: "/expense-management/approvals" },
    { id: "n-5", text: "Tender published", href: "/governance/tenders" },
    { id: "n-6", text: "Birthday greeting scheduled", href: "/office-desk/greetings" },
  ].map((n) => ({ ...n, text: loc(n.text, locale) }));

  const constituencyProgress = [
    { id: "cp-1", label: "Development Projects", value: projectProgress, href: "/governance/projects" },
    { id: "cp-2", label: "Complaints Resolved", value: complaintResolution, href: "/governance/complaints" },
    { id: "cp-3", label: "Government Schemes", value: schemeProgress, href: "/governance/schemes" },
    { id: "cp-4", label: "Survey Completion", value: surveyCompletion, href: "/voter-intelligence/surveys" },
    { id: "cp-5", label: "Public Works", value: worksProgress, href: "/governance/public-works" },
  ].map((p) => ({ ...p, label: loc(p.label, locale) }));

  const pendingWork = [
    { id: "pw-1", count: pendingApprovals.length, label: "Expense Approvals", href: "/expense-management/approvals" },
    { id: "pw-2", count: lettersAwaitingSignature, label: "Letters awaiting signature", href: "/letters-documents/outward" },
    { id: "pw-3", count: govStats.pendingComplaints, label: "Complaints pending", href: "/governance/complaints" },
    { id: "pw-4", count: scheduledInspections, label: "Site inspections", href: "/governance/inspections" },
    { id: "pw-5", count: tendersAwaitingReview, label: "Tenders awaiting review", href: "/governance/tenders" },
    { id: "pw-6", count: followUpCount, label: "Visitor follow-ups", href: "/visitor-desk/follow-ups" },
  ].map((p) => ({ ...p, label: loc(p.label, locale) }));

  const activityFeed = [
    { id: "af-1", time: "09:15", text: "Rajesh Patil visited office.", icon: "visitor" as const, href: "/visitor-desk" },
    { id: "af-2", time: "09:40", text: "Water complaint assigned.", icon: "governance" as const, href: "/governance/complaints" },
    { id: "af-3", time: "10:05", text: "Road inspection scheduled.", icon: "governance" as const, href: "/governance/inspections" },
    { id: "af-4", time: "11:20", text: "Expense approved.", icon: "expense" as const, href: "/expense-management/approvals" },
    { id: "af-5", time: "12:10", text: "Official letter generated.", icon: "letters" as const, href: "/letters-documents/outward" },
    { id: "af-6", time: "12:40", text: "Scheme beneficiary added.", icon: "governance" as const, href: "/governance/schemes" },
  ].map((a) => ({ ...a, text: loc(a.text, locale) }));

  const nextWeek = format(addDays(parseISO(TODAY), 7), "yyyy-MM-dd");
  const upcomingBirthdays = greetings
    .filter(
      (g) =>
        g.category === "Birthday" &&
        g.scheduledDate >= TODAY &&
        g.scheduledDate <= nextWeek
    )
    .slice(0, 5)
    .map((g) => {
      const person = g.personId ? getPersonById(g.personId, locale) : undefined;
      return {
        id: g.id,
        name: person?.fullName ?? locName(g.recipientName, locale),
        designation: person?.politicalDesignation
          ? loc(person.politicalDesignation, locale)
          : loc("Constituency Supporter", locale),
        date: g.scheduledDate,
        personId: g.personId,
        mobile: person?.mobile,
        initials: person?.initials ?? g.recipientName.slice(0, 2).toUpperCase(),
        href: g.personId ? `/people/${g.personId}` : "/office-desk/greetings",
      };
    });

  if (upcomingBirthdays.length < 3) {
    const fallbackPeople = getAllPeople(locale)
      .filter((p) => p.dateOfBirth)
      .slice(0, 5 - upcomingBirthdays.length)
      .map((p, i) => ({
        id: `bday-fb-${p.id}`,
        name: p.fullName,
        designation: p.politicalDesignation
          ? loc(p.politicalDesignation, locale)
          : loc("Local Leader", locale),
        date: format(addDays(parseISO(TODAY), i + 1), "yyyy-MM-dd"),
        personId: p.id,
        mobile: p.mobile,
        initials: p.initials,
        href: `/people/${p.id}`,
      }));
    upcomingBirthdays.push(...fallbackPeople);
  }

  const publicEvents = officeEvents
    .filter((e) => e.date >= TODAY && e.status !== "cancelled")
    .slice(0, 5)
    .map((e) => ({
      id: e.id,
      title: loc(e.title, locale),
      date: e.date,
      href: "/office-desk/events",
    }));

  const fallbackEvents = [
    { id: "ev-fb-1", title: "Health Camp", href: "/office-desk/events" },
    { id: "ev-fb-2", title: "Tree Plantation", href: "/office-desk/events" },
    { id: "ev-fb-3", title: "Public Meeting", href: "/office-desk/events" },
    { id: "ev-fb-4", title: "Blood Donation Camp", href: "/office-desk/events" },
    { id: "ev-fb-5", title: "Women Self Help Group Meeting", href: "/office-desk/events" },
  ].map((e) => ({ ...e, title: loc(e.title, locale), date: TODAY }));

  const upcomingEvents =
    publicEvents.length >= 3
      ? publicEvents
      : fallbackEvents.slice(0, 5);

  const tendersClosingToday = tenders.filter(
    (t) => t.closingDate === TODAY && t.status === "published"
  ).length;

  const summaryBullets = [
    `${formatNumberForLocale(todayVisitors, locale)} visitors expected today`,
    `${formatNumberForLocale(todayMeetings, locale)} meetings scheduled`,
    `${formatNumberForLocale(govStats.pendingComplaints, locale)} complaints require attention`,
    `${formatNumberForLocale(birthdaysToday, locale)} birthdays today`,
    `₹${formatNumberForLocale(pendingApprovalAmount, locale)} expenses awaiting approval`,
    `${formatNumberForLocale(scheduledInspections, locale)} inspections scheduled`,
    `${formatNumberForLocale(tendersClosingToday, locale)} tender${tendersClosingToday === 1 ? "" : "s"} closing today`,
    `${formatNumberForLocale(lettersAwaitingSignature, locale)} letters pending signature`,
  ].map((b) => localeTextTemplate(b, locale));

  return {
    kpis: {
      todayVisitors: {
        value: todayVisitors,
        trend:
          visitorDelta >= 0
            ? localeTextTemplate(`+${formatNumberForLocale(visitorDelta, locale)} from yesterday`, locale)
            : localeTextTemplate(`${formatNumberForLocale(visitorDelta, locale)} from yesterday`, locale),
        positive: visitorDelta >= 0,
        href: "/visitor-desk",
      },
      todayMeetings: { value: todayMeetings, href: "/office-desk/appointments" },
      pendingComplaints: { value: govStats.pendingComplaints, href: "/governance/complaints" },
      activeProjects: { value: govStats.activeProjects, href: "/governance/projects" },
      pendingExpenseApprovals: { value: pendingApprovals.length, href: "/expense-management/approvals" },
      peopleConnected: { value: peopleConnected, href: "/people" },
    },
    summaryBullets,
    todaySchedule,
    notifications,
    constituencyProgress,
    pendingWork,
    activityFeed,
    upcomingBirthdays: upcomingBirthdays.slice(0, 5),
    upcomingEvents: upcomingEvents.slice(0, 5),
    pendingApprovalAmount,
  };
}

export type DashboardData = ReturnType<typeof buildDashboardData>;
