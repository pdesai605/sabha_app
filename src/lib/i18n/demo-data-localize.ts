import type { Locale } from "./types";
import { EN_TO_MR } from "./en-to-mr-dictionary";
import {
  DEMO_DATA_MR,
  FIRST_NAMES_MR,
  LAST_NAMES_MR,
  MIDDLE_NAMES_MR,
} from "./demo-data-maps";
import { toMarathiNumerals } from "./numerals";
import { getCurrentLocale } from "./locale-store";
import type { Person, PersonActivity, PersonDocument, PersonNote, PersonTimelineEvent } from "@/modules/people/types";
import type { Visit, VisitTimelineEvent, FollowUpItem } from "@/modules/visitor-desk/types";
import type {
  DevelopmentProject,
  GovernmentScheme,
  PublicWork,
  PublicComplaint,
  Inspection,
  Tender,
  RecentActivity as GovRecentActivity,
  WardProjectSummary,
} from "@/modules/governance/types";
import type { Expense, ExpenseCategory, Vendor, BudgetEntry } from "@/modules/expense-management/types";
import type {
  Appointment,
  OfficeContact,
  OfficeEvent,
  Greeting,
  PressNote,
  OfficeTask,
  RecentActivity as OfficeRecentActivity,
} from "@/modules/office-desk/types";
import type {
  InwardLetter,
  OutwardLetter,
  OfficeFile,
  LetterTemplate,
  DispatchRecord,
  ArchivedDocument,
  RecentActivity as LetterRecentActivity,
} from "@/modules/letters-documents/types";
import type {
  Voter,
  Booth,
  WardAnalytics,
  CitizenIssue,
  SurveyCampaign,
  SurveyResponse,
  Campaign,
} from "@/modules/voter-intelligence/types";
import type { PartyMember, HierarchyNode } from "@/modules/party-members/types";

const LOOKUP = new Map<string, string>();
for (const [en, mr] of Object.entries(EN_TO_MR)) LOOKUP.set(en, mr);
for (const [en, mr] of Object.entries(DEMO_DATA_MR)) LOOKUP.set(en, mr);

function resolveLocale(locale?: Locale): Locale {
  return locale ?? getCurrentLocale();
}

/** Translate a demo-data string; pass-through for English locale. */
export function localizeDemoText(text: string | undefined, locale?: Locale): string {
  const loc = resolveLocale(locale);
  if (loc === "en" || !text) return text ?? "";

  const trimmed = text.trim();
  const exact = LOOKUP.get(text) ?? LOOKUP.get(trimmed);
  if (exact) return toMarathiNumerals(exact);

  const wardMatch = text.match(/^Ward (\d+) — (.+)$/);
  if (wardMatch) {
    const area = localizeArea(wardMatch[2]!, loc);
    return toMarathiNumerals(`प्रभाग ${wardMatch[1]} — ${area}`);
  }

  const boothMatch = text.match(/^Booth (\d+)$/);
  if (boothMatch) return toMarathiNumerals(`बूथ ${boothMatch[1]}`);

  if (text.includes(" — ")) {
    const idx = text.lastIndexOf(" — ");
    const left = text.slice(0, idx);
    const right = text.slice(idx + 3);
    const leftMr = LOOKUP.get(left) ?? left;
    const rightMr = localizeArea(right, loc);
    return toMarathiNumerals(`${leftMr} — ${rightMr}`);
  }

  const scheduled = text.match(/^Scheduled (.+) for constituency engagement\.$/i);
  if (scheduled) {
    const type = localizeDemoText(scheduled[1]!, loc);
    return toMarathiNumerals(`मतदारसंघ सहभागासाठी ${type} नियोजित.`);
  }

  const assigned = text.match(/^Assigned to (.+)\.$/);
  if (assigned) return toMarathiNumerals(`${localizeDemoText(assigned[1]!, loc)} यांना नियुक्त.`);

  const tokenIssued = text.match(/^Token (.+) issued at reception\.$/);
  if (tokenIssued) return toMarathiNumerals(`स्वागत कक्षात ${tokenIssued[1]} टोकन जारी.`);

  const ref = text.match(/^Reference: (.+)$/);
  if (ref) return toMarathiNumerals(`संदर्भ: ${ref[1]}`);

  const visitCreated = text.match(/^Visit Created$/);
  if (visitCreated) return "भेट नोंद";

  const staffAssigned = text.match(/^Staff Assigned$/);
  if (staffAssigned) return "कर्मचारी नियुक्त";

  const letterUploaded = text.match(/^Letter Uploaded$/);
  if (letterUploaded) return "पत्र अपलोड";

  const remarksAdded = text.match(/^Remarks Added$/);
  if (remarksAdded) return "शेरा जोडला";

  const relatedExp = text.match(/^(.+) related office expenditure$/);
  if (relatedExp) {
    const cat = localizeDemoText(relatedExp[1]!, loc);
    return toMarathiNumerals(`${cat} संबंधित कार्यालय खर्च`);
  }

  const outreach = text.match(/^(.+) Outreach Drive$/);
  if (outreach) return toMarathiNumerals(`${localizeArea(outreach[1]!, loc)} संपर्क मोहीम`);

  const voterConnect = text.match(/^(.+) Voter Connect$/);
  if (voterConnect) return toMarathiNumerals(`${localizeDemoText(voterConnect[1]!, loc)} मतदार संपर्क`);

  const withPerson = text.match(/^(.+) with (.+)$/);
  if (withPerson && LOOKUP.has(withPerson[1]!)) {
    return toMarathiNumerals(`${localizeDemoText(withPerson[1]!, loc)} — ${localizeFullName(withPerson[2]!, loc)}`);
  }

  const addedDir = text.match(/^(.+) was added to the people directory\.$/);
  if (addedDir) {
    return toMarathiNumerals(`${localizeFullName(addedDir[1]!, loc)} लोक नोंदवहीत जोडले.`);
  }

  return toMarathiNumerals(text);
}

export function localizeArea(area: string, locale?: Locale): string {
  const loc = resolveLocale(locale);
  if (loc === "en") return area;
  return LOOKUP.get(area) ?? area;
}

export function localizeWard(ward: string, locale?: Locale): string {
  return localizeDemoText(ward, locale);
}

export function localizeBooth(booth: string, locale?: Locale): string {
  return localizeDemoText(booth, locale);
}

export function localizeFullName(fullName: string, locale?: Locale): string {
  const loc = resolveLocale(locale);
  if (loc === "en" || !fullName) return fullName;

  return fullName
    .split(/\s+/)
    .map((part) => {
      const withDot = part.endsWith(".");
      const clean = withDot ? part.slice(0, -1) : part;
      if (clean.length <= 1 && withDot) return `${clean}.`;
      const translated =
        FIRST_NAMES_MR[clean] ??
        LAST_NAMES_MR[clean] ??
        MIDDLE_NAMES_MR[clean] ??
        LOOKUP.get(clean) ??
        clean;
      return withDot && translated.length > 1 ? `${translated.charAt(0)}.` : translated;
    })
    .join(" ");
}

export function localizePersonName(first: string, last: string, full: string, locale?: Locale): {
  firstName: string;
  lastName: string;
  fullName: string;
} {
  const loc = resolveLocale(locale);
  if (loc === "en") return { firstName: first, lastName: last, fullName: full };
  return {
    firstName: FIRST_NAMES_MR[first] ?? first,
    lastName: LAST_NAMES_MR[last] ?? last,
    fullName: localizeFullName(full, loc),
  };
}

function localizeAddress(address: Person["address"], locale?: Locale): Person["address"] {
  const loc = resolveLocale(locale);
  if (loc === "en") return address;
  return {
    ...address,
    line1: localizeDemoText(address.line1, loc),
    line2: address.line2 ? localizeDemoText(address.line2, loc) : undefined,
    city: localizeDemoText(address.city, loc),
    district: localizeDemoText(address.district, loc),
    state: localizeDemoText(address.state, loc),
  };
}

export function localizePerson(person: Person, locale?: Locale): Person {
  const loc = resolveLocale(locale);
  if (loc === "en") return person;
  const names = localizePersonName(person.firstName, person.lastName, person.fullName, loc);
  return {
    ...person,
    ...names,
    area: localizeArea(person.area, loc),
    ward: localizeWard(person.ward, loc),
    booth: localizeBooth(person.booth, loc),
    address: localizeAddress(person.address, loc),
    politicalDesignation: person.politicalDesignation
      ? localizeDemoText(person.politicalDesignation, loc)
      : undefined,
    partyAffiliation: person.partyAffiliation
      ? localizeDemoText(person.partyAffiliation, loc)
      : undefined,
    tags: person.tags.map((t) => localizeDemoText(t, loc)),
    notes: person.notes ? localizeDemoText(person.notes, loc) : undefined,
  };
}

export function localizeTimelineEvent(e: PersonTimelineEvent, locale?: Locale): PersonTimelineEvent {
  const loc = resolveLocale(locale);
  if (loc === "en") return e;
  return {
    ...e,
    title: localizeDemoText(e.title, loc),
    description: localizeDemoText(e.description, loc),
  };
}

export function localizePersonDocument(d: PersonDocument, locale?: Locale): PersonDocument {
  const loc = resolveLocale(locale);
  if (loc === "en") return d;
  return {
    ...d,
    name: localizeDemoText(d.name, loc),
    uploadedBy: localizeDemoText(d.uploadedBy, loc),
  };
}

export function localizePersonNote(n: PersonNote, locale?: Locale): PersonNote {
  const loc = resolveLocale(locale);
  if (loc === "en") return n;
  return {
    ...n,
    content: localizeDemoText(n.content, loc),
    author: localizeDemoText(n.author, loc),
  };
}

export function localizePersonActivity(a: PersonActivity, locale?: Locale): PersonActivity {
  const loc = resolveLocale(locale);
  if (loc === "en") return a;
  return {
    ...a,
    action: localizeDemoText(a.action, loc),
    field: a.field ? localizeDemoText(a.field, loc) : undefined,
    oldValue: a.oldValue ? localizeDemoText(a.oldValue, loc) : undefined,
    newValue: a.newValue ? localizeDemoText(a.newValue, loc) : undefined,
    user: localizeDemoText(a.user, loc),
  };
}

export function localizeVisit(v: Visit, locale?: Locale): Visit {
  const loc = resolveLocale(locale);
  if (loc === "en") return v;
  return {
    ...v,
    purpose: localizeDemoText(v.purpose, loc) as Visit["purpose"],
    meetingWith: localizeDemoText(v.meetingWith, loc),
    assignedStaff: localizeDemoText(v.assignedStaff, loc),
    internalNotes: v.internalNotes ? localizeDemoText(v.internalNotes, loc) : undefined,
    citizenRemarks: v.citizenRemarks ? localizeDemoText(v.citizenRemarks, loc) : undefined,
  };
}

export function localizeVisitTimelineEvent(e: VisitTimelineEvent, locale?: Locale): VisitTimelineEvent {
  const loc = resolveLocale(locale);
  if (loc === "en") return e;
  return {
    ...e,
    title: localizeDemoText(e.title, loc),
    description: localizeDemoText(e.description, loc),
  };
}

export function localizeFollowUp(f: FollowUpItem, locale?: Locale): FollowUpItem {
  const loc = resolveLocale(locale);
  if (loc === "en") return f;
  return {
    ...f,
    purpose: localizeDemoText(f.purpose, loc),
    assignedStaff: localizeDemoText(f.assignedStaff, loc),
    personName: localizeFullName(f.personName, loc),
  };
}

export function localizeDevelopmentProject(p: DevelopmentProject, locale?: Locale): DevelopmentProject {
  const loc = resolveLocale(locale);
  if (loc === "en") return p;
  return {
    ...p,
    projectName: localizeDemoText(p.projectName, loc),
    ward: localizeWard(p.ward, loc),
    area: localizeArea(p.area, loc),
    category: localizeDemoText(p.category, loc),
    department: localizeDemoText(p.department, loc),
    contractor: localizeDemoText(p.contractor, loc),
    status: localizeDemoText(p.status, loc) as DevelopmentProject["status"],
  };
}

export function localizeGovernmentScheme(s: GovernmentScheme, locale?: Locale): GovernmentScheme {
  const loc = resolveLocale(locale);
  if (loc === "en") return s;
  return {
    ...s,
    schemeName: localizeDemoText(s.schemeName, loc),
    department: localizeDemoText(s.department, loc),
    ward: localizeWard(s.ward, loc),
  };
}

export function localizePublicWork(w: PublicWork, locale?: Locale): PublicWork {
  const loc = resolveLocale(locale);
  if (loc === "en") return w;
  return {
    ...w,
    type: localizeDemoText(w.type, loc) as PublicWork["type"],
    ward: localizeWard(w.ward, loc),
    area: localizeArea(w.area, loc),
    contractor: localizeDemoText(w.contractor, loc),
    department: localizeDemoText(w.department, loc),
    status: localizeDemoText(w.status, loc) as PublicWork["status"],
  };
}

export function localizePublicComplaint(c: PublicComplaint, locale?: Locale): PublicComplaint {
  const loc = resolveLocale(locale);
  if (loc === "en") return c;
  return {
    ...c,
    citizenName: localizeFullName(c.citizenName, loc),
    ward: localizeWard(c.ward, loc),
    area: localizeArea(c.area, loc),
    category: localizeDemoText(c.category, loc) as PublicComplaint["category"],
    assignedOfficer: localizeFullName(c.assignedOfficer, loc),
    description: localizeDemoText(c.description, loc),
  };
}

export function localizeInspection(i: Inspection, locale?: Locale): Inspection {
  const loc = resolveLocale(locale);
  if (loc === "en") return i;
  return {
    ...i,
    projectName: localizeDemoText(i.projectName, loc),
    officerName: localizeFullName(i.officerName, loc),
    ward: localizeWard(i.ward, loc),
    remarks: i.remarks ? localizeDemoText(i.remarks, loc) : undefined,
    result: localizeDemoText(i.result, loc) as Inspection["result"],
  };
}

export function localizeTender(t: Tender, locale?: Locale): Tender {
  const loc = resolveLocale(locale);
  if (loc === "en") return t;
  return {
    ...t,
    projectName: localizeDemoText(t.projectName, loc),
    department: localizeDemoText(t.department, loc),
    awardedTo: t.awardedTo ? localizeDemoText(t.awardedTo, loc) : undefined,
  };
}

export function localizeGovRecentActivity(a: GovRecentActivity, locale?: Locale): GovRecentActivity {
  const loc = resolveLocale(locale);
  if (loc === "en") return a;
  return {
    ...a,
    action: localizeDemoText(a.action, loc),
    detail: localizeDemoText(a.detail, loc),
    user: localizeDemoText(a.user, loc),
  };
}

export function localizeWardProjectSummary(s: WardProjectSummary, locale?: Locale): WardProjectSummary {
  const loc = resolveLocale(locale);
  if (loc === "en") return s;
  return { ...s, ward: localizeWard(s.ward, loc) };
}

export function localizeExpenseCategory(c: ExpenseCategory, locale?: Locale): ExpenseCategory {
  const loc = resolveLocale(locale);
  if (loc === "en") return c;
  return {
    ...c,
    name: localizeDemoText(c.name, loc),
    description: c.description ? localizeDemoText(c.description, loc) : undefined,
  };
}

export function localizeVendor(v: Vendor, locale?: Locale): Vendor {
  const loc = resolveLocale(locale);
  if (loc === "en") return v;
  return {
    ...v,
    name: localizeDemoText(v.name, loc),
    category: localizeDemoText(v.category, loc),
    address: localizeDemoText(v.address, loc),
    bankName: v.bankName ? localizeDemoText(v.bankName, loc) : undefined,
  };
}

export function localizeExpense(e: Expense, locale?: Locale): Expense {
  const loc = resolveLocale(locale);
  if (loc === "en") return e;
  return {
    ...e,
    categoryName: localizeDemoText(e.categoryName, loc),
    vendorName: localizeDemoText(e.vendorName, loc),
    description: e.description ? localizeDemoText(e.description, loc) : undefined,
    department: localizeDemoText(e.department, loc),
    ward: localizeWard(e.ward, loc),
    paidBy: localizeFullName(e.paidBy, loc),
    createdByName: localizeFullName(e.createdByName, loc),
    submittedByName: localizeFullName(e.submittedByName, loc),
    expenseOwnerName: localizeFullName(e.expenseOwnerName, loc),
    approvedByName: e.approvedByName ? localizeFullName(e.approvedByName, loc) : undefined,
    paymentMode: localizeDemoText(e.paymentMode, loc) as Expense["paymentMode"],
    remarks: e.remarks ? localizeDemoText(e.remarks, loc) : undefined,
    reviewer: e.reviewer ? localizeDemoText(e.reviewer, loc) : undefined,
  };
}

export function localizeBudgetEntry(b: BudgetEntry, locale?: Locale): BudgetEntry {
  const loc = resolveLocale(locale);
  if (loc === "en") return b;
  return {
    ...b,
    label: localizeDemoText(b.label, loc),
    department: b.department ? localizeDemoText(b.department, loc) : undefined,
  };
}

export function localizeAppointment(a: Appointment, locale?: Locale): Appointment {
  const loc = resolveLocale(locale);
  if (loc === "en") return a;
  return {
    ...a,
    purpose: localizeDemoText(a.purpose, loc),
    meetingWith: localizeDemoText(a.meetingWith, loc),
  };
}

export function localizeOfficeContact(c: OfficeContact, locale?: Locale): OfficeContact {
  const loc = resolveLocale(locale);
  if (loc === "en") return c;
  return {
    ...c,
    name: localizeFullName(c.name, loc),
    organization: localizeDemoText(c.organization, loc),
    designation: localizeDemoText(c.designation, loc),
    address: c.address ? localizeDemoText(c.address, loc) : undefined,
    department: c.department ? localizeDemoText(c.department, loc) : undefined,
    category: localizeDemoText(c.category, loc) as OfficeContact["category"],
  };
}

export function localizeOfficeEvent(e: OfficeEvent, locale?: Locale): OfficeEvent {
  const loc = resolveLocale(locale);
  if (loc === "en") return e;
  return {
    ...e,
    title: localizeDemoText(e.title, loc),
    type: localizeDemoText(e.type, loc) as OfficeEvent["type"],
    location: localizeDemoText(e.location, loc),
    ward: e.ward ? localizeWard(e.ward, loc) : e.ward,
    description: e.description ? localizeDemoText(e.description, loc) : undefined,
  };
}

export function localizeGreeting(g: Greeting, locale?: Locale): Greeting {
  const loc = resolveLocale(locale);
  if (loc === "en") return g;
  return {
    ...g,
    recipientName: localizeFullName(g.recipientName, loc),
    category: localizeDemoText(g.category, loc) as Greeting["category"],
    occasion: localizeDemoText(g.occasion, loc),
    message: g.message ? localizeDemoText(g.message, loc) : undefined,
  };
}

export function localizePressNote(p: PressNote, locale?: Locale): PressNote {
  const loc = resolveLocale(locale);
  if (loc === "en") return p;
  return {
    ...p,
    title: localizeDemoText(p.title, loc),
    category: localizeDemoText(p.category, loc),
    createdBy: localizeDemoText(p.createdBy, loc),
    summary: localizeDemoText(p.summary, loc),
  };
}

export function localizeOfficeTask(t: OfficeTask, locale?: Locale): OfficeTask {
  const loc = resolveLocale(locale);
  if (loc === "en") return t;
  return {
    ...t,
    title: localizeDemoText(t.title, loc),
    description: localizeDemoText(t.description, loc),
    assignedStaff: localizeDemoText(t.assignedStaff, loc),
  };
}

export function localizeOfficeRecentActivity(a: OfficeRecentActivity, locale?: Locale): OfficeRecentActivity {
  const loc = resolveLocale(locale);
  if (loc === "en") return a;
  return {
    ...a,
    action: localizeDemoText(a.action, loc),
    detail: localizeDemoText(a.detail, loc),
    user: localizeDemoText(a.user, loc),
  };
}

export function localizeInwardLetter(l: InwardLetter, locale?: Locale): InwardLetter {
  const loc = resolveLocale(locale);
  if (loc === "en") return l;
  return {
    ...l,
    subject: localizeDemoText(l.subject, loc),
    sender: localizeDemoText(l.sender, loc),
    senderDepartment: localizeDemoText(l.senderDepartment, loc),
    category: localizeDemoText(l.category, loc),
    assignedTo: localizeDemoText(l.assignedTo, loc),
  };
}

export function localizeOutwardLetter(l: OutwardLetter, locale?: Locale): OutwardLetter {
  const loc = resolveLocale(locale);
  if (loc === "en") return l;
  return {
    ...l,
    subject: localizeDemoText(l.subject, loc),
    recipient: localizeDemoText(l.recipient, loc),
    department: localizeDemoText(l.department, loc),
    preparedBy: localizeDemoText(l.preparedBy, loc),
    approvedBy: localizeDemoText(l.approvedBy, loc),
  };
}

export function localizeOfficeFile(f: OfficeFile, locale?: Locale): OfficeFile {
  const loc = resolveLocale(locale);
  if (loc === "en") return f;
  return {
    ...f,
    title: localizeDemoText(f.title, loc),
    department: localizeDemoText(f.department, loc),
    currentHolder: localizeDemoText(f.currentHolder, loc),
    remarks: f.remarks ? localizeDemoText(f.remarks, loc) : undefined,
    movementHistory: f.movementHistory.map((m) => ({
      ...m,
      from: localizeDemoText(m.from, loc),
      to: localizeDemoText(m.to, loc),
      remarks: m.remarks ? localizeDemoText(m.remarks, loc) : undefined,
    })),
  };
}

export function localizeLetterTemplate(t: LetterTemplate, locale?: Locale): LetterTemplate {
  const loc = resolveLocale(locale);
  if (loc === "en") return t;
  return {
    ...t,
    name: localizeDemoText(t.name, loc),
    category: localizeDemoText(t.category, loc) as LetterTemplate["category"],
    description: localizeDemoText(t.description, loc),
  };
}

export function localizeDispatchRecord(d: DispatchRecord, locale?: Locale): DispatchRecord {
  const loc = resolveLocale(locale);
  if (loc === "en") return d;
  return {
    ...d,
    recipient: localizeDemoText(d.recipient, loc),
    deliveryMethod: localizeDemoText(d.deliveryMethod, loc) as DispatchRecord["deliveryMethod"],
    courier: d.courier ? localizeDemoText(d.courier, loc) : undefined,
    acknowledgement: d.acknowledgement ? localizeDemoText(d.acknowledgement, loc) : undefined,
  };
}

export function localizeArchivedDocument(d: ArchivedDocument, locale?: Locale): ArchivedDocument {
  const loc = resolveLocale(locale);
  if (loc === "en") return d;
  return {
    ...d,
    title: localizeDemoText(d.title, loc),
    category: localizeDemoText(d.category, loc),
    department: localizeDemoText(d.department, loc),
  };
}

export function localizeLetterRecentActivity(a: LetterRecentActivity, locale?: Locale): LetterRecentActivity {
  const loc = resolveLocale(locale);
  if (loc === "en") return a;
  return {
    ...a,
    action: localizeDemoText(a.action, loc),
    detail: localizeDemoText(a.detail, loc),
    user: localizeDemoText(a.user, loc),
  };
}

export function localizeVoter(v: Voter, locale?: Locale): Voter {
  const loc = resolveLocale(locale);
  if (loc === "en") return v;
  return {
    ...v,
    name: localizeFullName(v.name, loc),
    ward: localizeWard(v.ward, loc),
    booth: localizeBooth(v.booth, loc),
    area: localizeArea(v.area, loc),
    partyInclination: localizeDemoText(v.partyInclination, loc) as Voter["partyInclination"],
    surveyStatus: localizeDemoText(v.surveyStatus, loc) as Voter["surveyStatus"],
  };
}

export function localizeBoothRecord(b: Booth, locale?: Locale): Booth {
  const loc = resolveLocale(locale);
  if (loc === "en") return b;
  return {
    ...b,
    name: localizeBooth(b.name, loc),
    ward: localizeWard(b.ward, loc),
    area: localizeArea(b.area, loc),
    volunteers: b.volunteers.map((v) => localizeDemoText(v, loc)),
    recentActivity: localizeDemoText(b.recentActivity, loc),
  };
}

export function localizeWardAnalytics(w: WardAnalytics, locale?: Locale): WardAnalytics {
  const loc = resolveLocale(locale);
  if (loc === "en") return w;
  return { ...w, ward: localizeWard(w.ward, loc) };
}

export function localizeCitizenIssue(i: CitizenIssue, locale?: Locale): CitizenIssue {
  const loc = resolveLocale(locale);
  if (loc === "en") return i;
  return {
    ...i,
    citizenName: localizeFullName(i.citizenName, loc),
    ward: localizeWard(i.ward, loc),
    booth: localizeBooth(i.booth, loc),
    category: localizeDemoText(i.category, loc) as CitizenIssue["category"],
    assignedTo: localizeDemoText(i.assignedTo, loc),
    description: localizeDemoText(i.description, loc),
  };
}

export function localizeSurveyCampaign(c: SurveyCampaign, locale?: Locale): SurveyCampaign {
  const loc = resolveLocale(locale);
  if (loc === "en") return c;
  return {
    ...c,
    title: localizeDemoText(c.title, loc),
    description: localizeDemoText(c.description, loc),
  };
}

export function localizeSurveyResponse(r: SurveyResponse, locale?: Locale): SurveyResponse {
  const loc = resolveLocale(locale);
  if (loc === "en") return r;
  return {
    ...r,
    campaignTitle: localizeDemoText(r.campaignTitle, loc),
    volunteer: localizeDemoText(r.volunteer, loc),
    booth: localizeBooth(r.booth, loc),
    ward: localizeWard(r.ward, loc),
  };
}

export function localizeCampaign(c: Campaign, locale?: Locale): Campaign {
  const loc = resolveLocale(locale);
  if (loc === "en") return c;
  return {
    ...c,
    title: localizeDemoText(c.title, loc),
    type: localizeDemoText(c.type, loc) as Campaign["type"],
    area: localizeArea(c.area, loc),
    ward: localizeWard(c.ward, loc),
    boothsCovered: c.boothsCovered.map((b) => localizeBooth(b, loc)),
    assignedTeam: c.assignedTeam.split(", ").map((m) => localizeDemoText(m, loc)).join(", "),
    targetAudience: localizeDemoText(c.targetAudience, loc),
  };
}

export function localizePartyMember(m: PartyMember, locale?: Locale): PartyMember {
  const loc = resolveLocale(locale);
  if (loc === "en") return m;
  return {
    ...m,
    designation: localizeDemoText(m.designation, loc),
    ward: localizeWard(m.ward, loc),
    booth: localizeBooth(m.booth, loc),
    area: localizeArea(m.area, loc),
    committee: m.committee ? localizeDemoText(m.committee, loc) : undefined,
    morchaType: m.morchaType ? localizeDemoText(m.morchaType, loc) : undefined,
    panchayatName: m.panchayatName ? localizeDemoText(m.panchayatName, loc) : undefined,
  };
}

export function localizeHierarchyNode(n: HierarchyNode, locale?: Locale): HierarchyNode {
  const loc = resolveLocale(locale);
  if (loc === "en") return n;
  return {
    ...n,
    label: localizeDemoText(n.label, loc),
    subtitle: n.subtitle ? localizeDemoText(n.subtitle, loc) : undefined,
    members: n.members?.map((m) => ({
      ...m,
      name: localizeFullName(m.name, loc),
      designation: m.designation ? localizeDemoText(m.designation, loc) : undefined,
    })),
    children: n.children?.map((c) => localizeHierarchyNode(c, loc)),
  };
}

/** Map an array with locale-aware localization. */
export function localizeList<T>(items: T[], fn: (item: T, locale?: Locale) => T, locale?: Locale): T[] {
  const loc = resolveLocale(locale);
  if (loc === "en") return items;
  return items.map((item) => fn(item, loc));
}
