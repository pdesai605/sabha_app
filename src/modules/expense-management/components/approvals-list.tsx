"use client";

import * as React from "react";
import { useTranslation } from "@/lib/i18n/context";
import { getExpenses } from "@/lib/i18n/localized-demo-data";
import { demoApproved, demoRejected } from "@/lib/demo";
import { CheckCircle2, XCircle, Clock, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { L } from "@/components/shared/localized";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/data-table/data-table";
import {
  formatCurrency,
  formatExpenseDate,
  getExpenseStatusVariant,
} from "@/modules/expense-management/lib/utils";
import { EXPENSE_STATUS_LABELS } from "@/modules/expense-management/constants";
import { ExpenseDetailDrawer } from "@/modules/expense-management/components/expense-detail-drawer";
import type { Expense } from "@/modules/expense-management/types";

export function ApprovalsList() {
  const { locale } = useTranslation();
  const expenses = React.useMemo(() => getExpenses(locale), [locale]);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [tab, setTab] = React.useState<"pending" | "approved" | "rejected">("pending");
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [selectedExpense, setSelectedExpense] = React.useState<Expense | null>(null);

  const tabExpenses = React.useMemo(() => {
    if (tab === "pending") return expenses.filter((e) => e.status === "pending");
    if (tab === "approved") return expenses.filter((e) => e.status === "approved" || e.status === "paid");
    return expenses.filter((e) => e.status === "rejected");
  }, [tab]);

  const filtered = tabExpenses.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      e.expenseId.toLowerCase().includes(q) ||
      e.vendorName.toLowerCase().includes(q) ||
      (e.reviewer?.toLowerCase().includes(q) ?? false)
    );
  });

  const paginated = filtered.slice((page - 1) * 10, page * 10);

  const openDetail = (expense: Expense) => {
    setSelectedExpense(expense);
    setDetailOpen(true);
  };

  const columns: DataTableColumn<Expense>[] = [
    {
      id: "expenseId",
      header: "Expense ID",
      cell: (row) => <span className="font-mono text-xs text-accent-primary">{row.expenseId}</span>,
    },
    {
      id: "date",
      header: "Date",
      hideOnMobile: true,
      cell: (row) => formatExpenseDate(row.date),
    },
    { id: "categoryName", header: "Category", accessorKey: "categoryName" },
    { id: "vendorName", header: "Vendor", accessorKey: "vendorName", hideOnMobile: true },
    {
      id: "amount",
      header: "Amount",
      cell: (row) => <span className="font-medium">{formatCurrency(row.amount)}</span>,
    },
    {
      id: "reviewer",
      header: "Reviewer",
      cell: (row) => row.reviewer ?? <span className="text-text-muted">—</span>,
      hideOnMobile: true,
    },
    {
      id: "approvalDate",
      header: "Approval Date",
      hideOnMobile: true,
      cell: (row) => row.approvalDate ? formatExpenseDate(row.approvalDate) : <span className="text-text-muted">—</span>,
    },
    {
      id: "remarks",
      header: "Remarks",
      hideOnMobile: true,
      cell: (row) => row.remarks ? (
        <span className="text-xs text-text-secondary flex items-center gap-1 max-w-[200px] truncate"><MessageSquare className="size-3 shrink-0" />{row.remarks}</span>
      ) : <span className="text-text-muted">—</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <StatusBadge label={EXPENSE_STATUS_LABELS[row.status]} status={getExpenseStatusVariant(row.status)} />
      ),
    },
  ];

  const counts = {
    pending: expenses.filter((e) => e.status === "pending").length,
    approved: expenses.filter((e) => e.status === "approved" || e.status === "paid").length,
    rejected: expenses.filter((e) => e.status === "rejected").length,
  };

  const handleBulkApprove = () => {
    demoApproved(selectedIds.size);
    setSelectedIds(new Set());
  };

  const handleBulkReject = () => {
    demoRejected(selectedIds.size);
    setSelectedIds(new Set());
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Expense Management", href: "/expense-management" }, { label: "Approvals" }]} className="md:hidden" />
      <PageHeader
        title="Approvals"
        description="Review and approve office expenditure — pending, approved, and rejected entries."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-input bg-semantic-warning-muted text-semantic-warning"><Clock className="size-5" /></div>
            <div><p className="text-2xl font-semibold">{counts.pending}</p><p className="text-xs text-text-muted"><L>Pending</L></p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-input bg-semantic-success-muted text-semantic-success"><CheckCircle2 className="size-5" /></div>
            <div><p className="text-2xl font-semibold">{counts.approved}</p><p className="text-xs text-text-muted"><L>Approved</L></p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-input bg-semantic-danger-muted text-semantic-danger"><XCircle className="size-5" /></div>
            <div><p className="text-2xl font-semibold">{counts.rejected}</p><p className="text-xs text-text-muted"><L>Rejected</L></p></div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={(v) => { setTab(v as typeof tab); setPage(1); setSelectedIds(new Set()); }}>
        <TabsList>
          <TabsTrigger value="pending"><L>Pending</L> ({counts.pending})</TabsTrigger>
          <TabsTrigger value="approved"><L>Approved</L> ({counts.approved})</TabsTrigger>
          <TabsTrigger value="rejected"><L>Rejected</L> ({counts.rejected})</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="mt-4">
          <DataTable
            columns={columns}
            data={paginated}
            searchValue={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            searchPlaceholder="Search approvals..."
            page={page}
            pageSize={10}
            totalItems={filtered.length}
            onPageChange={setPage}
            onRowClick={openDetail}
            selectedIds={tab === "pending" ? selectedIds : undefined}
            onSelectionChange={tab === "pending" ? setSelectedIds : undefined}
            bulkActions={
              tab === "pending" ? (
                <>
                  <Button size="sm" onClick={handleBulkApprove}><CheckCircle2 className="size-4" /><L>Bulk Approve</L></Button>
                  <Button size="sm" variant="outline" onClick={handleBulkReject}><XCircle className="size-4" /><L>Bulk Reject</L></Button>
                </>
              ) : undefined
            }
          />
        </TabsContent>
      </Tabs>

      <ExpenseDetailDrawer
        expense={selectedExpense}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        showApprovalActions={tab === "pending"}
      />
    </div>
  );
}
