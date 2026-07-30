"use client";

import {
  Download,
  Printer,
  FileSpreadsheet,
  Tag,
  Building2,
  MapPin,
  CreditCard,
  Calendar,
  PieChart,
  BarChart3,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { demoSuccess, demoExported, demoImported, demoPrinted, demoAssigned, demoWhatsAppSent, demoSaved, demoDeleted } from "@/lib/demo";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { expenses, expenseCategories, vendors } from "@/modules/expense-management/data/expense-data";
import { formatCurrency } from "@/modules/expense-management/lib/utils";
import { EXPENSE_MONTH } from "@/modules/expense-management/constants";

const reports = [
  { id: "category", title: "Category Report", description: "Expenditure breakdown by expense category.", icon: Tag, count: expenseCategories.length },
  { id: "vendor", title: "Vendor Report", description: "Payments made to each registered vendor.", icon: Building2, count: vendors.length },
  { id: "ward", title: "Ward Report", description: "Ward-wise expense allocation and spending.", icon: MapPin, count: 8 },
  { id: "payment", title: "Payment Mode Report", description: "Cash, UPI, bank transfer, cheque, and card payments.", icon: CreditCard, count: 5 },
  { id: "monthly", title: "Monthly Report", description: "Month-on-month expenditure summary.", icon: Calendar, count: 6 },
  { id: "budget", title: "Budget Report", description: "Budget vs actual across all scopes.", icon: PieChart, count: 3 },
];

export function ExpenseReports() {
  const monthlyTotal = expenses
    .filter((e) => e.date.startsWith(EXPENSE_MONTH))
    .reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Expense Management", href: "/expense-management" }, { label: "Reports" }]} className="md:hidden" />
      <PageHeader
        title="Expense Reports"
        description="Generate reports by category, vendor, ward, payment mode, monthly trends, and budget analysis."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => demoSuccess("Action completed successfully.")}><Download className="size-4" />PDF</Button>
            <Button variant="outline" size="sm" onClick={() => demoSuccess("Action completed successfully.")}><FileSpreadsheet className="size-4" />Excel</Button>
            <Button variant="outline" size="sm" onClick={() => demoPrinted()}><Printer className="size-4" />Print</Button>
          </div>
        }
      />

      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted">Current Month Total</p>
            <p className="text-2xl font-semibold text-text-primary">{formatCurrency(monthlyTotal)}</p>
          </div>
          <p className="text-xs text-text-muted">July 2026 · {expenses.filter((e) => e.date.startsWith(EXPENSE_MONTH)).length} transactions</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.id} className="hover:border-border-default transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="flex size-10 items-center justify-center rounded-input bg-accent-primary-muted text-accent-primary">
                  <report.icon className="size-5" />
                </div>
                <span className="text-2xl font-semibold text-text-primary">{report.count}</span>
              </div>
              <CardTitle className="text-base mt-2">{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full" onClick={() => demoSuccess("Action completed successfully.")}>
                <BarChart3 className="size-3.5" />View Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
