"use client";

import * as React from "react";
import {
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Download,
  Upload,
  Printer,
  RefreshCw,
  Trash2,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useDemoRole } from "@/contexts/demo-role-context";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DataTable,
  DataTableCard,
  type DataTableColumn,
  type SortDirection,
} from "@/components/data-table/data-table";
import { ExpenseFiltersDrawer } from "@/modules/expense-management/components/expense-filters-drawer";
import { useTranslation } from "@/lib/i18n/context";
import { getExpenses } from "@/lib/i18n/localized-demo-data";
import {
  formatCurrency,
  formatExpenseDate,
  getExpenseStatusVariant,
} from "@/modules/expense-management/lib/utils";
import { EXPENSE_STATUS_LABELS } from "@/modules/expense-management/constants";
import type { Expense } from "@/modules/expense-management/types";
import type { ExpenseFilters } from "@/modules/expense-management/components/expense-filters-drawer";
import { ExpenseCreateDialog } from "@/modules/expense-management/components/expense-create-dialog";
import { ExpenseDetailDrawer } from "@/modules/expense-management/components/expense-detail-drawer";
import { L } from "@/components/shared/localized";
import { demoApproved, demoExported, demoImported, demoPrinted, demoDeleted } from "@/lib/demo";

const defaultFilters: ExpenseFilters = {
  categories: [],
  statuses: [],
  paymentModes: [],
  wards: [],
  departments: [],
};

function PersonLink({ id, name }: { id: string; name: string }) {
  return (
    <Link href={`/people/${id}`} className="text-text-primary hover:text-accent-primary transition-colors">
      {name}
    </Link>
  );
}

function RowActions({ row, onView }: { row: Expense; onView: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" onClick={(e) => e.stopPropagation()}><MoreHorizontal className="size-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(); }}><Eye className="size-4" /><L>View</L></DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(); }}><Pencil className="size-4" /><L>Edit</L></DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); demoPrinted(); }}><Printer className="size-4" /><L>Print</L></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function applyFilters(list: Expense[], filters: ExpenseFilters): Expense[] {
  return list.filter((e) => {
    if (filters.categories.length && !filters.categories.includes(e.categoryName)) return false;
    if (filters.statuses.length && !filters.statuses.includes(e.status)) return false;
    if (filters.paymentModes.length && !filters.paymentModes.includes(e.paymentMode)) return false;
    if (filters.wards.length && !filters.wards.includes(e.ward)) return false;
    if (filters.departments.length && !filters.departments.includes(e.department)) return false;
    return true;
  });
}

export function ExpensesList() {
  const { locale } = useTranslation();
  const expenses = React.useMemo(() => getExpenses(locale), [locale]);
  const { role, currentPersonId } = useDemoRole();
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [sortColumn, setSortColumn] = React.useState<string>();
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);
  const [loading, setLoading] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [filters, setFilters] = React.useState<ExpenseFilters>(defaultFilters);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [selectedExpense, setSelectedExpense] = React.useState<Expense | null>(null);

  const openDetail = (expense: Expense) => {
    setSelectedExpense(expense);
    setDetailOpen(true);
  };

  const activeFilterCount =
    filters.categories.length +
    filters.statuses.length +
    filters.paymentModes.length +
    filters.wards.length +
    filters.departments.length;

  const filtered = React.useMemo(() => {
    let result = applyFilters(expenses, filters);
    if (role === "staff") {
      result = result.filter(
        (e) =>
          e.expenseOwnerId === currentPersonId ||
          e.createdById === currentPersonId ||
          e.submittedById === currentPersonId
      );
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.expenseId.toLowerCase().includes(q) ||
          e.vendorName.toLowerCase().includes(q) ||
          e.categoryName.toLowerCase().includes(q) ||
          e.expenseOwnerName.toLowerCase().includes(q) ||
          e.submittedByName.toLowerCase().includes(q) ||
          e.ward.toLowerCase().includes(q)
      );
    }
    if (sortColumn && sortDirection) {
      result = [...result].sort((a, b) => {
        const aVal = String(a[sortColumn as keyof Expense] ?? "");
        const bVal = String(b[sortColumn as keyof Expense] ?? "");
        if (sortColumn === "amount") {
          return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount;
        }
        return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    }
    return result;
  }, [expenses, search, sortColumn, sortDirection, filters, role, currentPersonId]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns: DataTableColumn<Expense>[] = [
    {
      id: "expenseId",
      header: "Expense ID",
      sortable: true,
      cell: (row) => <span className="font-mono text-xs text-accent-primary">{row.expenseId}</span>,
    },
    {
      id: "date",
      header: "Date",
      sortable: true,
      hideOnMobile: true,
      cell: (row) => <span className="text-text-secondary text-[13px]">{formatExpenseDate(row.date)}</span>,
    },
    { id: "categoryName", header: "Category", accessorKey: "categoryName", sortable: true },
    { id: "vendorName", header: "Vendor", accessorKey: "vendorName", sortable: true, hideOnMobile: true },
    {
      id: "amount",
      header: "Amount",
      sortable: true,
      cell: (row) => <span className="font-medium">{formatCurrency(row.amount)}</span>,
    },
    {
      id: "paymentMode",
      header: "Payment Mode",
      accessorKey: "paymentMode",
      hideOnMobile: true,
    },
    {
      id: "expenseOwnerName",
      header: "Expense Owner",
      hideOnMobile: true,
      cell: (row) => <PersonLink id={row.expenseOwnerId} name={row.expenseOwnerName} />,
    },
    {
      id: "submittedByName",
      header: "Submitted By",
      hideOnMobile: true,
      cell: (row) => <PersonLink id={row.submittedById} name={row.submittedByName} />,
    },
    {
      id: "approvedByName",
      header: "Approved By",
      hideOnMobile: true,
      cell: (row) => row.approvedById ? (
        <PersonLink id={row.approvedById} name={row.approvedByName!} />
      ) : <span className="text-text-muted">—</span>,
    },
    { id: "ward", header: "Ward", accessorKey: "ward", hideOnMobile: true },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <StatusBadge label={EXPENSE_STATUS_LABELS[row.status]} status={getExpenseStatusVariant(row.status)} />
      ),
    },
    {
      id: "attachment",
      header: "Attachment",
      hideOnMobile: true,
      cell: (row) => row.attachment ? (
        <Badge variant="outline" className="gap-1"><FileText className="size-3" />{row.attachment}</Badge>
      ) : <span className="text-text-muted">—</span>,
    },
    { id: "actions", header: "", className: "w-12", cell: (row) => <RowActions row={row} onView={() => openDetail(row)} /> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Expense Management", href: "/expense-management" }, { label: "Expenses" }]} className="md:hidden" />
      <PageHeader
        title="Expenses"
        description={role === "staff" ? "Showing expenses linked to your profile (Demo Role: Office Staff)." : "All office expenditure records — searchable, filterable, with bulk actions and export."}
        actions={<Button onClick={() => setCreateOpen(true)}><Plus className="size-4" /><L>Record Expense</L></Button>}
      />

      <DataTable
        columns={columns}
        data={paginated}
        loading={loading}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search by ID, vendor, category, ward..."
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={(col) => {
          if (sortColumn === col) setSortDirection((d) => d === "asc" ? "desc" : d === "desc" ? null : "asc");
          else { setSortColumn(col); setSortDirection("asc"); }
        }}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        page={page}
        pageSize={pageSize}
        totalItems={filtered.length}
        onPageChange={setPage}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        onRowClick={openDetail}
        bulkActions={
          selectedIds.size > 0 ? (
            <>
              <Button variant="outline" size="sm" onClick={() => demoApproved(selectedIds.size)}><L>Approve</L></Button>
              <Button variant="outline" size="sm" onClick={() => demoExported("File")}><Download className="size-4" /><L>Export</L></Button>
              <Button variant="outline" size="sm" onClick={() => { demoDeleted("Selected expenses"); setSelectedIds(new Set()); }}><Trash2 className="size-4" /><L>Delete</L></Button>
            </>
          ) : undefined
        }
        toolbarActions={
          <>
            <ExpenseFiltersDrawer
              filters={filters}
              onFiltersChange={(f) => { setFilters(f); setPage(1); }}
              activeCount={activeFilterCount}
              open={filtersOpen}
              onOpenChange={setFiltersOpen}
            />
            <Button variant="outline" size="sm" onClick={() => demoImported()}><Upload className="size-4" /><span className="hidden sm:inline">Import</span></Button>
            <Button variant="outline" size="sm" onClick={() => demoExported("File")}><Download className="size-4" /><span className="hidden sm:inline">Export</span></Button>
            <Button variant="outline" size="sm" onClick={() => demoPrinted()}><Printer className="size-4" /><span className="hidden sm:inline">Print</span></Button>
            <Button variant="outline" size="sm" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 600); }}><RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /></Button>
          </>
        }
        cardRenderer={(row) => (
          <DataTableCard
            title={row.vendorName}
            subtitle={`${row.expenseId} · ${row.categoryName}`}
            badge={<StatusBadge label={EXPENSE_STATUS_LABELS[row.status]} status={getExpenseStatusVariant(row.status)} />}
            meta={<><span>{formatExpenseDate(row.date)}</span><span className="font-medium">{formatCurrency(row.amount)}</span></>}
            actions={<RowActions row={row} onView={() => openDetail(row)} />}
            onClick={() => openDetail(row)}
          />
        )}
      />
      <ExpenseCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
      <ExpenseDetailDrawer expense={selectedExpense} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  );
}
