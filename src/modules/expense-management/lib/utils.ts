import { format, parseISO } from "date-fns";
import type { Expense } from "@/modules/expense-management/types";

export function formatExpenseDate(iso: string): string {
  return format(parseISO(iso), "MMM d, yyyy");
}

export function formatExpenseDateTime(iso: string): string {
  return format(parseISO(iso), "MMM d, yyyy · h:mm a");
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyCompact(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return formatCurrency(amount);
}

export function getExpenseStatusVariant(
  status: Expense["status"]
): "active" | "pending" | "inactive" | "info" | "error" {
  switch (status) {
    case "paid":
      return "active";
    case "approved":
      return "info";
    case "pending":
      return "pending";
    case "rejected":
      return "error";
  }
}

export function getBudgetUtilization(spent: number, allocated: number): number {
  if (allocated === 0) return 0;
  return Math.min(Math.round((spent / allocated) * 100), 100);
}

export function getBudgetStatusColor(pct: number): string {
  if (pct >= 90) return "bg-semantic-danger";
  if (pct >= 75) return "bg-semantic-warning";
  return "bg-accent-primary";
}
