"use client";

import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { L } from "@/components/shared/localized";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { budgets } from "@/modules/expense-management/data/expense-data";
import { DEPARTMENTS } from "@/modules/expense-management/constants";
import { WARDS } from "@/modules/people/constants";
import {
  formatCurrency,
  getBudgetUtilization,
  getBudgetStatusColor,
} from "@/modules/expense-management/lib/utils";
import type { BudgetScope } from "@/modules/expense-management/types";

const YEARS = ["2024", "2025", "2026"];
const FINANCIAL_YEARS = ["2024-25", "2025-26", "2026-27"];
const QUARTERS = ["Q1 (Apr-Jun)", "Q2 (Jul-Sep)", "Q3 (Oct-Dec)", "Q4 (Jan-Mar)"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const BUDGET_TYPES = ["Revenue", "Capital", "Special", "Contingency"];
const CATEGORIES = ["Office Operations", "Travel", "Events", "Publicity", "Staff Welfare", "Constituency Development"];

function filterMultiplier(filters: Record<string, string>): number {
  let m = 1;
  const seed = Object.values(filters).join("|").length;
  m += (seed % 7) * 0.03;
  if (filters.quarter) m += 0.05;
  if (filters.month) m += 0.02;
  if (filters.ward && filters.ward !== "all") m -= 0.08;
  if (filters.department && filters.department !== "all") m -= 0.05;
  return Math.max(0.55, Math.min(1.15, m));
}

function BudgetRow({ label, allocated, spent }: { label: string; allocated: number; spent: number }) {
  const pct = getBudgetUtilization(spent, allocated);
  const remaining = Math.max(allocated - spent, 0);

  return (
    <div className="py-4 border-b border-border-subtle last:border-0">
      <div className="flex items-center justify-between gap-4 mb-2">
        <p className="text-sm font-medium text-text-primary truncate">{label}</p>
        <Badge variant={pct >= 90 ? "danger" : pct >= 75 ? "warning" : "primary"} className="shrink-0">{pct}%</Badge>
      </div>
      <div className="h-2.5 rounded-full bg-background-muted overflow-hidden mb-2">
        <div className={`h-full rounded-full transition-all ${getBudgetStatusColor(pct)}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
        <span><L>Budget</L>: <span className="text-text-secondary">{formatCurrency(allocated)}</span></span>
        <span><L>Actual</L>: <span className="text-text-secondary">{formatCurrency(spent)}</span></span>
        <span><L>Remaining</L>: <span className="text-text-secondary">{formatCurrency(remaining)}</span></span>
      </div>
    </div>
  );
}

export function BudgetsView() {
  const [scope, setScope] = React.useState<BudgetScope>("category");
  const [filters, setFilters] = React.useState({
    year: "2026",
    financialYear: "2026-27",
    quarter: "Q2 (Jul-Sep)",
    month: "July",
    dateFrom: "2026-07-01",
    dateTo: "2026-09-30",
    ward: "all",
    department: "all",
    category: "all",
    budgetType: "Revenue",
  });

  const multiplier = filterMultiplier(filters);

  const scoped = budgets
    .filter((b) => b.scope === scope)
    .map((b) => ({
      ...b,
      allocated: Math.round(b.allocated * multiplier),
      spent: Math.round(b.spent * multiplier),
    }));

  const totalAllocated = scoped.reduce((s, b) => s + b.allocated, 0);
  const totalSpent = scoped.reduce((s, b) => s + b.spent, 0);
  const overallPct = getBudgetUtilization(totalSpent, totalAllocated);

  const setFilter = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Expense Management", href: "/expense-management" }, { label: "Budgets" }]} className="md:hidden" />
      <PageHeader
        title="Budgets"
        description="Category-wise, ward-wise, and department-wise budget tracking with utilization progress."
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base"><L>Period & Filters</L></CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label><L>Year</L></Label>
            <Select value={filters.year} onValueChange={(v) => setFilter("year", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{YEARS.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label><L>Financial Year</L></Label>
            <Select value={filters.financialYear} onValueChange={(v) => setFilter("financialYear", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{FINANCIAL_YEARS.map((fy) => <SelectItem key={fy} value={fy}>{fy}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label><L>Quarter</L></Label>
            <Select value={filters.quarter} onValueChange={(v) => setFilter("quarter", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{QUARTERS.map((q) => <SelectItem key={q} value={q}>{q}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label><L>Month</L></Label>
            <Select value={filters.month} onValueChange={(v) => setFilter("month", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{MONTHS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label><L>From Date</L></Label>
            <Input type="date" value={filters.dateFrom} onChange={(e) => setFilter("dateFrom", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label><L>To Date</L></Label>
            <Input type="date" value={filters.dateTo} onChange={(e) => setFilter("dateTo", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label><L>Ward</L></Label>
            <Select value={filters.ward} onValueChange={(v) => setFilter("ward", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all"><L>All Wards</L></SelectItem>
                {WARDS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label><L>Department</L></Label>
            <Select value={filters.department} onValueChange={(v) => setFilter("department", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all"><L>All Departments</L></SelectItem>
                {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label><L>Category</L></Label>
            <Select value={filters.category} onValueChange={(v) => setFilter("category", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all"><L>All Categories</L></SelectItem>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label><L>Budget Type</L></Label>
            <Select value={filters.budgetType} onValueChange={(v) => setFilter("budgetType", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{BUDGET_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2 flex items-end">
            <Button variant="outline" size="sm" onClick={() => setFilters({
              year: "2026", financialYear: "2026-27", quarter: "Q2 (Jul-Sep)", month: "July",
              dateFrom: "2026-07-01", dateTo: "2026-09-30", ward: "all", department: "all", category: "all", budgetType: "Revenue",
            })}><L>Reset Filters</L></Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-text-muted"><L>Total Allocated</L></p>
            <p className="text-2xl font-semibold text-text-primary mt-1">{formatCurrency(totalAllocated)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-text-muted"><L>Total Spent</L></p>
            <p className="text-2xl font-semibold text-text-primary mt-1">{formatCurrency(totalSpent)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-text-muted"><L>Overall Utilization</L></p>
            <p className="text-2xl font-semibold text-text-primary mt-1">{overallPct}%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={scope} onValueChange={(v) => setScope(v as BudgetScope)}>
        <TabsList>
          <TabsTrigger value="category"><L>Category-wise</L></TabsTrigger>
          <TabsTrigger value="ward"><L>Ward-wise</L></TabsTrigger>
          <TabsTrigger value="department"><L>Department-wise</L></TabsTrigger>
        </TabsList>

        {(["category", "ward", "department"] as const).map((s) => (
          <TabsContent key={s} value={s} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base capitalize">{s.replace("-", " ")} <L>Budget vs Actual</L></CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {scoped.map((b) => (
                  <BudgetRow key={b.id} label={b.label} allocated={b.allocated} spent={b.spent} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
