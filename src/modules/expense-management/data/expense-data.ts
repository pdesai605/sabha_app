import type {
  Expense,
  ExpenseCategory,
  Vendor,
  BudgetEntry,
  MonthlyTrendPoint,
} from "@/modules/expense-management/types";
import {
  DEFAULT_CATEGORIES,
  DEPARTMENTS,
  STAFF_MEMBERS,
  REVIEWERS,
  PAYMENT_MODES,
  EXPENSE_TODAY,
  EXPENSE_MONTH,
} from "@/modules/expense-management/constants";
import { WARDS } from "@/modules/people/constants";
import { getAllPeople } from "@/modules/people/data/people";

function pick<T>(arr: readonly T[], i: number): T {
  return arr[i % arr.length];
}

// ─── Categories ───
export const expenseCategories: ExpenseCategory[] = DEFAULT_CATEGORIES.map((name, i) => ({
  id: `cat-${String(i + 1).padStart(2, "0")}`,
  name,
  description: `${name} related office expenditure`,
  budgetAllocated: pick([50000, 75000, 100000, 150000, 200000, 250000, 500000, 800000], i),
  isDefault: true,
}));

const categoryByName = Object.fromEntries(expenseCategories.map((c) => [c.name, c]));

// ─── Vendors (~28) ───
const vendorData: Omit<Vendor, "id">[] = [
  { name: "Shree Sai Printing Works", category: "Printing", gst: "27AABCS1234F1Z5", phone: "+91 98230 44120", email: "orders@saisai.in", address: "Shop 12, FC Road, Pune 411004", bankName: "State Bank of India", accountNumber: "30123456789", ifsc: "SBIN0001234" },
  { name: "Maharashtra State Electricity Board", category: "Electricity", gst: "27AAECM1234G1Z2", phone: "1912", email: "mseb.pune@mahadiscom.in", address: "MSEB Office, Shivajinagar, Pune", bankName: "RBI", accountNumber: "00000000001", ifsc: "RBIS0MAH001" },
  { name: "Bharat Petroleum — Kothrud", category: "Fuel", gst: "27AABCB5678H1Z3", phone: "+91 97654 33210", address: "Karve Road, Kothrud, Pune 411038", bankName: "HDFC Bank", accountNumber: "50123456789012", ifsc: "HDFC0000123" },
  { name: "Pune Municipal Corporation", category: "Maintenance", gst: "27AAAPU1234L1Z8", phone: "+91 20 2550 1000", email: "accounts@pmc.gov.in", address: "PMC Main Building, Shivajinagar, Pune", bankName: "State Bank of India", accountNumber: "30234567890", ifsc: "SBIN0002345" },
  { name: "Reliance Jio Infocomm", category: "Internet", gst: "27AAACR5055K1Z5", phone: "1800 889 9999", email: "enterprise@jio.com", address: "Reliance Corporate Park, Navi Mumbai", bankName: "ICICI Bank", accountNumber: "601234567890", ifsc: "ICIC0000123" },
  { name: "Rajesh Travels & Tours", category: "Travel", gst: "27AABFR7890J1Z1", phone: "+91 98765 12340", email: "bookings@rajeshtravels.in", address: "Station Road, Pune 411001", bankName: "Axis Bank", accountNumber: "912345678901", ifsc: "UTIB0000123" },
  { name: "Hotel Shree Krishna", category: "Food", gst: "27AABFH2345K1Z6", phone: "+91 98901 23456", address: "Deccan Gymkhana, Pune 411004", bankName: "Kotak Mahindra Bank", accountNumber: "8012345678", ifsc: "KKBK0000123" },
  { name: "Om Sai Event Management", category: "Events", gst: "27AABCO3456L1Z7", phone: "+91 98220 55678", email: "events@omsai.in", address: "Hadapsar Industrial Estate, Pune", bankName: "State Bank of India", accountNumber: "30345678901", ifsc: "SBIN0003456" },
  { name: "National Flex & Banner", category: "Campaign Material", gst: "27AABCN4567M1Z8", phone: "+91 97654 88990", email: "flex@nationalflex.in", address: "Bhosari, Pune 411026", bankName: "Bank of Baroda", accountNumber: "401234567890", ifsc: "BARB0BHOSAR" },
  { name: "Shiv Property Consultants", category: "Office Rent", gst: "27AABCS5678N1Z9", phone: "+91 98231 66770", email: "rent@shivproperty.in", address: "Aundh, Pune 411007", bankName: "HDFC Bank", accountNumber: "50234567890123", ifsc: "HDFC0000234" },
  { name: "Pune Hardware & Electricals", category: "Maintenance", gst: "27AABCP6789O1Z0", phone: "+91 98812 33445", address: "Laxmi Road, Pune 411030", bankName: "State Bank of India", accountNumber: "30456789012", ifsc: "SBIN0004567" },
  { name: "Creative Digital Solutions", category: "Campaign Material", gst: "27AABCD7890P1Z1", phone: "+91 98908 77665", email: "hello@creativedigital.in", address: "Baner, Pune 411045", bankName: "ICICI Bank", accountNumber: "602345678901", ifsc: "ICIC0000234" },
  { name: "Indian Oil — Yerwada", category: "Fuel", gst: "27AABCI8901Q1Z2", phone: "+91 97654 11223", address: "Nagar Road, Yerwada, Pune", bankName: "Punjab National Bank", accountNumber: "701234567890", ifsc: "PUNB0123400" },
  { name: "Star Office Supplies", category: "Miscellaneous", gst: "27AABCS9012R1Z3", phone: "+91 98220 99887", email: "sales@staroffice.in", address: "Camp, Pune 411001", bankName: "State Bank of India", accountNumber: "30567890123", ifsc: "SBIN0005678" },
  { name: "Wagholi Catering Services", category: "Food", gst: "27AABCW0123S1Z4", phone: "+91 98760 55443", address: "Wagholi, Pune 412207", bankName: "HDFC Bank", accountNumber: "50345678901234", ifsc: "HDFC0000345" },
  { name: "Pimpri Auto Works", category: "Maintenance", gst: "27AABCP1234T1Z5", phone: "+91 97654 77889", address: "Pimpri, Pune 411018", bankName: "Axis Bank", accountNumber: "913456789012", ifsc: "UTIB0000234" },
  { name: "Airtel Business Services", category: "Internet", gst: "27AAACA1234U1Z6", phone: "1800 103 0404", email: "business@airtel.in", address: "Viman Nagar, Pune 411014", bankName: "ICICI Bank", accountNumber: "603456789012", ifsc: "ICIC0000345" },
  { name: "Desai & Associates (CA)", category: "Miscellaneous", gst: "27AABFD2345V1Z7", phone: "+91 98230 11223", email: "accounts@desaica.in", address: "Deccan, Pune 411004", bankName: "State Bank of India", accountNumber: "30678901234", ifsc: "SBIN0006789" },
  { name: "Maharashtra Flex Printers", category: "Printing", gst: "27AABFM3456W1Z8", phone: "+91 98901 44556", address: "Katraj, Pune 411046", bankName: "Bank of Maharashtra", accountNumber: "6012345678901", ifsc: "MAHB0000123" },
  { name: "Green Valley Resort", category: "Events", gst: "27AABFG4567X1Z9", phone: "+91 98220 33445", email: "bookings@greenvalley.in", address: "Mulshi Road, Pune", bankName: "HDFC Bank", accountNumber: "50456789012345", ifsc: "HDFC0000456" },
  { name: "Pune Courier Express", category: "Miscellaneous", gst: "27AABFP5678Y1Z0", phone: "+91 97654 99001", address: "Swargate, Pune 411042", bankName: "State Bank of India", accountNumber: "30789012345", ifsc: "SBIN0007890" },
  { name: "Sunrise Staffing Agency", category: "Staff Salary", gst: "27AABFS6789Z1A1", phone: "+91 98765 88776", email: "payroll@sunrise.in", address: "Koregaon Park, Pune 411001", bankName: "ICICI Bank", accountNumber: "604567890123", ifsc: "ICIC0000456" },
  { name: "Hadapsar Event Decorators", category: "Events", gst: "27AABFH7890A1B2", phone: "+91 98230 55667", address: "Hadapsar, Pune 411028", bankName: "Axis Bank", accountNumber: "914567890123", ifsc: "UTIB0000345" },
  { name: "Quick Print Digital", category: "Printing", gst: "27AABFQ8901C1D3", phone: "+91 98908 22334", email: "print@quickprint.in", address: "FC Road, Pune 411004", bankName: "Kotak Mahindra Bank", accountNumber: "8023456789", ifsc: "KKBK0000234" },
  { name: "National Highway Fuel Station", category: "Fuel", gst: "27AABFN9012E1F4", phone: "+91 97654 44556", address: "Pune-Nashik Highway, Chakan", bankName: "State Bank of India", accountNumber: "30890123456", ifsc: "SBIN0008901" },
  { name: "Aundh IT Solutions", category: "Internet", gst: "27AABFA0123G1H5", phone: "+91 98220 77889", email: "support@aundhit.in", address: "Aundh, Pune 411007", bankName: "HDFC Bank", accountNumber: "50567890123456", ifsc: "HDFC0000567" },
  { name: "Shivaji Nagar Stationery", category: "Miscellaneous", gst: "27AABFS1234I1J6", phone: "+91 98812 66778", address: "Shivajinagar, Pune 411005", bankName: "Punjab National Bank", accountNumber: "702345678901", ifsc: "PUNB0234500" },
  { name: "Pune Banner House", category: "Campaign Material", gst: "27AABFB2345K1L7", phone: "+91 98760 33442", email: "orders@bannerhouse.in", address: "Bhosari, Pune 411026", bankName: "Bank of Baroda", accountNumber: "402345678901", ifsc: "BARB0PUNE01" },
];

export const vendors: Vendor[] = vendorData.map((v, i) => ({
  id: `ven-${String(i + 1).padStart(3, "0")}`,
  ...v,
}));

const vendorByCategory: Record<string, Vendor[]> = {};
vendors.forEach((v) => {
  if (!vendorByCategory[v.category]) vendorByCategory[v.category] = [];
  vendorByCategory[v.category].push(v);
});

function getVendorForCategory(categoryName: string, idx: number): Vendor {
  const matches = vendorByCategory[categoryName] ?? vendors;
  return matches[idx % matches.length];
}

const descriptions = [
  "Monthly office expenditure",
  "Ward program supplies",
  "Constituency event expense",
  "Field visit logistics",
  "Routine operational cost",
  "Campaign outreach material",
  "Staff welfare expense",
  "Public meeting arrangement",
];

// ─── Expenses (~110) ───
function generateExpenses(): Expense[] {
  const people = getAllPeople();
  const items: Expense[] = [];
  for (let i = 1; i <= 110; i++) {
    const idx = i - 1;
    const category = pick(expenseCategories, idx);
    const vendor = getVendorForCategory(category.name, idx);
    const dayOffset = idx % 60;
    const d = new Date("2026-06-01");
    d.setDate(d.getDate() + dayOffset);
    const dateStr = d.toISOString().split("T")[0];
    const isToday = dateStr === EXPENSE_TODAY;
    const isCurrentMonth = dateStr.startsWith(EXPENSE_MONTH);

    let status: Expense["status"];
    if (dateStr > EXPENSE_TODAY) status = "pending";
    else if (isToday) status = pick(["pending", "pending", "approved", "paid"] as const, idx);
    else status = pick(["approved", "approved", "paid", "paid", "rejected", "pending"] as const, idx);

    const amount = pick([450, 850, 1200, 2500, 3500, 5000, 7500, 12000, 18000, 25000, 45000, 85000, 125000], idx);
    const paymentMode = pick(PAYMENT_MODES, idx);
    const hasReviewer = status === "approved" || status === "rejected" || status === "paid";
    const owner = pick(people, idx);
    const submitter = pick(people, idx + 3);
    const creator = pick(people, idx + 7);
    const approver = hasReviewer ? pick(people, idx + 11) : undefined;

    items.push({
      id: `exp-${String(i).padStart(3, "0")}`,
      expenseId: `EXP-2026-${String(i).padStart(4, "0")}`,
      date: dateStr,
      categoryId: category.id,
      categoryName: category.name,
      vendorId: vendor.id,
      vendorName: vendor.name,
      amount,
      paymentMode,
      paidBy: owner.fullName,
      createdById: creator.id,
      createdByName: creator.fullName,
      submittedById: submitter.id,
      submittedByName: submitter.fullName,
      expenseOwnerId: owner.id,
      expenseOwnerName: owner.fullName,
      approvedById: approver?.id,
      approvedByName: approver?.fullName,
      ward: pick(WARDS, idx),
      department: pick(DEPARTMENTS, idx),
      status,
      attachment: idx % 3 === 0 ? `receipt-${String(i).padStart(4, "0")}.pdf` : undefined,
      description: pick(descriptions, idx),
      reviewer: hasReviewer ? pick(REVIEWERS, idx) : undefined,
      approvalDate: hasReviewer && status !== "pending" ? dateStr : undefined,
      remarks: status === "rejected" ? pick(["Insufficient documentation", "Budget exceeded for category", "Duplicate entry", "Requires MLA approval"], idx) : hasReviewer && status !== "pending" ? pick(["Approved as per budget", "Verified against invoice", "Routine operational expense", "Within ward allocation"], idx) : undefined,
      createdAt: `${dateStr}T10:00:00`,
    });
  }
  return items.sort((a, b) => b.date.localeCompare(a.date));
}

export const expenses = generateExpenses();

// ─── Budgets ───
function buildBudgets(): BudgetEntry[] {
  const entries: BudgetEntry[] = [];

  expenseCategories.forEach((cat, i) => {
    const spent = expenses
      .filter((e) => e.categoryId === cat.id && (e.status === "approved" || e.status === "paid"))
      .reduce((sum, e) => sum + e.amount, 0);
    entries.push({
      id: `bud-cat-${String(i + 1).padStart(2, "0")}`,
      scope: "category",
      label: cat.name,
      allocated: cat.budgetAllocated,
      spent,
    });
  });

  WARDS.forEach((ward, i) => {
    const allocated = pick([100000, 150000, 200000, 250000, 300000], i);
    const spent = expenses
      .filter((e) => e.ward === ward && (e.status === "approved" || e.status === "paid"))
      .reduce((sum, e) => sum + e.amount, 0);
    entries.push({
      id: `bud-ward-${String(i + 1).padStart(2, "0")}`,
      scope: "ward",
      label: ward,
      allocated,
      spent,
    });
  });

  DEPARTMENTS.forEach((dept, i) => {
    const allocated = pick([200000, 350000, 500000, 750000, 1000000], i);
    const spent = expenses
      .filter((e) => e.department === dept && (e.status === "approved" || e.status === "paid"))
      .reduce((sum, e) => sum + e.amount, 0);
    entries.push({
      id: `bud-dept-${String(i + 1).padStart(2, "0")}`,
      scope: "department",
      label: dept,
      allocated,
      spent,
      department: dept,
    });
  });

  return entries;
}

export const budgets = buildBudgets();

// ─── Monthly Trend ───
export const monthlyTrend: MonthlyTrendPoint[] = [
  { month: "Feb 2026", amount: 285000 },
  { month: "Mar 2026", amount: 342000 },
  { month: "Apr 2026", amount: 398000 },
  { month: "May 2026", amount: 415000 },
  { month: "Jun 2026", amount: 367000 },
  { month: "Jul 2026", amount: expenses.filter((e) => e.date.startsWith(EXPENSE_MONTH)).reduce((s, e) => s + e.amount, 0) },
];

// ─── Helpers ───
export function getTodayExpenses() {
  return expenses.filter((e) => e.date === EXPENSE_TODAY);
}

export function getMonthlyExpenses() {
  return expenses.filter((e) => e.date.startsWith(EXPENSE_MONTH));
}

export function getPendingApprovals() {
  return expenses.filter((e) => e.status === "pending");
}

export function getDashboardStats() {
  const today = getTodayExpenses();
  const monthly = getMonthlyExpenses();
  const totalBudget = expenseCategories.reduce((s, c) => s + c.budgetAllocated, 0);
  const totalSpent = expenses
    .filter((e) => e.status === "approved" || e.status === "paid")
    .reduce((s, e) => s + e.amount, 0);

  return {
    todayExpenses: today.reduce((s, e) => s + e.amount, 0),
    todayCount: today.length,
    monthlyExpenses: monthly.reduce((s, e) => s + e.amount, 0),
    monthlyCount: monthly.length,
    pendingApproval: expenses.filter((e) => e.status === "pending").length,
    approved: expenses.filter((e) => e.status === "approved" || e.status === "paid").length,
    rejected: expenses.filter((e) => e.status === "rejected").length,
    budgetUtilization: Math.round((totalSpent / totalBudget) * 100),
    cashExpenses: expenses.filter((e) => e.paymentMode === "Cash" && e.date.startsWith(EXPENSE_MONTH)).reduce((s, e) => s + e.amount, 0),
    bankExpenses: expenses.filter((e) => e.paymentMode !== "Cash" && e.date.startsWith(EXPENSE_MONTH)).reduce((s, e) => s + e.amount, 0),
  };
}

export { categoryByName };
