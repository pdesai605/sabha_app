"use client";

import * as React from "react";
import Link from "next/link";
import {
  Wallet,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  PieChart,
  Banknote,
  Building2,
  ChevronRight,
  Plus,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { useTranslation } from "@/lib/i18n/context";
import { getExpenses, getBudgets } from "@/lib/i18n/localized-demo-data";
import {
  getDashboardStats,
  getPendingApprovals,
  monthlyTrend,
} from "@/modules/expense-management/data/expense-data";
import {
  formatCurrency,
  formatExpenseDate,
  getExpenseStatusVariant,
  getBudgetUtilization,
  getBudgetStatusColor,
} from "@/modules/expense-management/lib/utils";
import { EXPENSE_STATUS_LABELS } from "@/modules/expense-management/constants";
import { L } from "@/components/shared/localized";

const quickActions = [
  { label: "Record Expense", href: "/expense-management/expenses", icon: Plus },
  { label: "Review Approvals", href: "/expense-management/approvals", icon: CheckCircle2 },
  { label: "View Budgets", href: "/expense-management/budgets", icon: PieChart },
  { label: "Manage Vendors", href: "/expense-management/vendors", icon: Building2 },
];

export function ExpenseDashboard() {
  const { locale } = useTranslation();
  const expenses = React.useMemo(() => getExpenses(locale), [locale]);
  const budgets = React.useMemo(() => getBudgets(locale), [locale]);
  const stats = getDashboardStats();
  const recentExpenses = expenses.slice(0, 8);
  const pendingApprovals = getPendingApprovals().slice(0, 6);
  const categoryBudgets = budgets.filter((b) => b.scope === "category").slice(0, 6);
  const maxTrend = Math.max(...monthlyTrend.map((m) => m.amount));

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Expense Management" }]} className="md:hidden" />

      <PageHeader
        title="Expense Management"
        description="Track office expenditure, vendor payments, budget utilization, and approval workflows."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Today's Expenses" value={formatCurrency(stats.todayExpenses)} description={`${stats.todayCount} transactions`} icon={<Calendar className="size-5" />} />
        <StatCard title="Monthly Expenses" value={formatCurrency(stats.monthlyExpenses)} description={`${stats.monthlyCount} this month`} icon={<Wallet className="size-5" />} />
        <StatCard title="Pending Approval" value={stats.pendingApproval} icon={<Clock className="size-5" />} />
        <StatCard title="Approved" value={stats.approved} icon={<CheckCircle2 className="size-5" />} />
        <StatCard title="Rejected" value={stats.rejected} icon={<XCircle className="size-5" />} />
        <StatCard title="Budget Utilization" value={`${stats.budgetUtilization}%`} icon={<PieChart className="size-5" />} />
        <StatCard title="Cash Expenses" value={formatCurrency(stats.cashExpenses)} icon={<Banknote className="size-5" />} />
        <StatCard title="Bank Expenses" value={formatCurrency(stats.bankExpenses)} icon={<Building2 className="size-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base"><L>Recent Expenses</L></CardTitle>
            <Link href="/expense-management/expenses"><Button variant="ghost" size="sm"><L>All</L><ChevronRight className="size-4" /></Button></Link>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border-subtle">
              {recentExpenses.map((e) => (
                <li key={e.id} className="flex items-center gap-3 px-6 py-3.5 hover:bg-background-muted/50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary truncate">{e.vendorName}</p>
                    <p className="text-xs text-text-muted">{e.expenseId} · {e.categoryName} · {formatExpenseDate(e.date)}</p>
                  </div>
                  <span className="text-sm font-medium text-text-primary shrink-0">{formatCurrency(e.amount)}</span>
                  <StatusBadge label={EXPENSE_STATUS_LABELS[e.status]} status={getExpenseStatusVariant(e.status)} showDot={false} />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base"><L>Quick Actions</L></CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action) => (
              <Link key={action.href + action.label} href={action.href}>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <action.icon className="size-4 text-text-muted" />
                  <L>{action.label}</L>
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="size-4" /><L>Monthly Trend</L></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-32">
              {monthlyTrend.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-sm bg-accent-primary/80 transition-all"
                    style={{ height: `${(m.amount / maxTrend) * 100}%`, minHeight: 4 }}
                  />
                  <span className="text-[10px] text-text-muted truncate w-full text-center">{m.month.split(" ")[0]}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-text-muted mt-3 text-center"><L>Last 6 months expenditure (₹)</L></p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base"><L>Budget Utilization</L></CardTitle>
            <Link href="/expense-management/budgets"><Button variant="ghost" size="sm"><L>Details</L><ChevronRight className="size-4" /></Button></Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryBudgets.map((b) => {
              const pct = getBudgetUtilization(b.spent, b.allocated);
              return (
                <div key={b.id}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-text-secondary truncate">{b.label}</span>
                    <span className="text-text-muted shrink-0 ml-2">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-background-muted overflow-hidden">
                    <div className={`h-full rounded-full ${getBudgetStatusColor(pct)}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base"><L>Pending Approvals</L></CardTitle>
            <Link href="/expense-management/approvals"><Button variant="ghost" size="sm"><L>Review</L><ChevronRight className="size-4" /></Button></Link>
          </CardHeader>
          <CardContent className="p-0">
            {pendingApprovals.length === 0 ? (
              <p className="px-6 py-8 text-sm text-text-muted text-center"><L>No pending approvals</L></p>
            ) : (
              <ul className="divide-y divide-border-subtle">
                {pendingApprovals.map((e) => (
                  <li key={e.id} className="flex items-center gap-3 px-6 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-text-primary truncate">{e.description ?? e.categoryName}</p>
                      <p className="text-xs text-text-muted"><Link href={`/people/${e.expenseOwnerId}`} className="hover:text-accent-primary">{e.expenseOwnerName}</Link> · {e.ward}</p>
                    </div>
                    <span className="text-sm font-medium shrink-0">{formatCurrency(e.amount)}</span>
                    <Badge variant="outline" className="text-[10px] shrink-0">{e.categoryName}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
