export type ExpenseStatus = "pending" | "approved" | "rejected" | "paid";
export type PaymentMode = "Cash" | "UPI" | "Bank Transfer" | "Cheque" | "Card";
export type BudgetScope = "category" | "ward" | "department";

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  budgetAllocated: number;
  isDefault: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  gst?: string;
  phone: string;
  email?: string;
  address: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
}

export interface Expense {
  id: string;
  expenseId: string;
  date: string;
  categoryId: string;
  categoryName: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  paymentMode: PaymentMode;
  paidBy: string;
  createdById: string;
  createdByName: string;
  submittedById: string;
  submittedByName: string;
  expenseOwnerId: string;
  expenseOwnerName: string;
  approvedById?: string;
  approvedByName?: string;
  ward: string;
  department: string;
  status: ExpenseStatus;
  attachment?: string;
  description?: string;
  reviewer?: string;
  approvalDate?: string;
  remarks?: string;
  createdAt: string;
}

export interface BudgetEntry {
  id: string;
  scope: BudgetScope;
  label: string;
  allocated: number;
  spent: number;
  department?: string;
}

export interface MonthlyTrendPoint {
  month: string;
  amount: number;
}
