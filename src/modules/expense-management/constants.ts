export const MODULE_NAV = [
  { label: "Dashboard", href: "/expense-management" },
  { label: "Expenses", href: "/expense-management/expenses" },
  { label: "Categories", href: "/expense-management/categories" },
  { label: "Vendors", href: "/expense-management/vendors" },
  { label: "Approvals", href: "/expense-management/approvals" },
  { label: "Budgets", href: "/expense-management/budgets" },
  { label: "Reports", href: "/expense-management/reports" },
] as const;

export const DEFAULT_CATEGORIES = [
  "Office Rent",
  "Electricity",
  "Fuel",
  "Printing",
  "Events",
  "Campaign Material",
  "Internet",
  "Staff Salary",
  "Travel",
  "Food",
  "Maintenance",
  "Miscellaneous",
] as const;

export const DEPARTMENTS = [
  "Constituency Office",
  "Field Operations",
  "Media & PR",
  "Legal Cell",
  "Ward Coordination",
  "Accounts",
] as const;

export const STAFF_MEMBERS = [
  "Office Manager",
  "Accounts Officer",
  "Personal Assistant",
  "Constituency Coordinator",
  "Field Coordinator",
  "Ward Secretary",
] as const;

export const REVIEWERS = [
  "Hon. MLA",
  "Office Manager",
  "Accounts Officer",
] as const;

export const PAYMENT_MODES = [
  "Cash",
  "UPI",
  "Bank Transfer",
  "Cheque",
  "Card",
] as const;

export const EXPENSE_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  paid: "Paid",
};

export const EXPENSE_TODAY = "2026-07-25";
export const EXPENSE_MONTH = "2026-07";
