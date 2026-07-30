"use client";

import * as React from "react";
import { demoSuccess, demoExported, demoImported, demoPrinted, demoAssigned, demoWhatsAppSent, demoSaved, demoDeleted } from "@/lib/demo";
import Link from "next/link";
import {
  Plus, MoreHorizontal, Eye, Pencil, UserPlus, Printer, Download, FileText, RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LBadge } from "@/components/shared/localized-badge";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DataTable, DataTableCard, type DataTableColumn, type SortDirection,
} from "@/components/data-table/data-table";
import {
  InwardFiltersDrawer, applyInwardFilters, type InwardFilters,
} from "@/modules/letters-documents/components/inward-filters-drawer";
import { inwardLetters } from "@/modules/letters-documents/data/letters-data";
import {
  formatLetterDate, getPriorityVariant, getInwardStatusVariant,
} from "@/modules/letters-documents/lib/utils";
import { INWARD_STATUS_LABELS } from "@/modules/letters-documents/constants";
import type { InwardLetter } from "@/modules/letters-documents/types";
import { InwardCreateDialog } from "@/modules/letters-documents/components/inward-create-dialog";
import { L } from "@/components/shared/localized";

const defaultFilters: InwardFilters = { departments: [], priorities: [], statuses: [], categories: [], assignedUsers: [] };

function RowActions({ row }: { row: InwardLetter }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm"><MoreHorizontal className="size-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={() => demoSuccess("Action completed successfully.")}><Eye className="size-4" /><L>View</L></DropdownMenuItem>
        <DropdownMenuItem onClick={() => demoSuccess("Action completed successfully.")}><Pencil className="size-4" /><L>Edit</L></DropdownMenuItem>
        <DropdownMenuItem onClick={() => demoAssigned("Action")}><UserPlus className="size-4" /><L>Assign</L></DropdownMenuItem>
        <DropdownMenuItem onClick={() => demoPrinted()}><Printer className="size-4" /><L>Print</L></DropdownMenuItem>
        <DropdownMenuItem onClick={() => demoSuccess("Action completed successfully.")}><Download className="size-4" /><L>Download</L></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function InwardLettersList() {
  const [createOpen, setCreateOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [sortColumn, setSortColumn] = React.useState<string>();
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);
  const [loading, setLoading] = React.useState(false);
  const [filters, setFilters] = React.useState<InwardFilters>(defaultFilters);
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  const activeFilterCount =
    filters.departments.length + filters.priorities.length + filters.statuses.length +
    filters.categories.length + filters.assignedUsers.length;

  const filtered = React.useMemo(() => {
    let result = applyInwardFilters(inwardLetters, filters);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.diaryNumber.toLowerCase().includes(q) ||
          l.sender.toLowerCase().includes(q) ||
          l.subject.toLowerCase().includes(q) ||
          l.senderDepartment.toLowerCase().includes(q)
      );
    }
    if (sortColumn && sortDirection) {
      result = [...result].sort((a, b) => {
        const aVal = String(a[sortColumn as keyof InwardLetter] ?? "");
        const bVal = String(b[sortColumn as keyof InwardLetter] ?? "");
        return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    }
    return result;
  }, [search, sortColumn, sortDirection, filters]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns: DataTableColumn<InwardLetter>[] = [
    { id: "diaryNumber", header: "Diary Number", sortable: true, cell: (row) => <span className="font-mono text-xs text-accent-primary">{row.diaryNumber}</span> },
    { id: "receivedDate", header: "Received Date", sortable: true, hideOnMobile: true, cell: (row) => formatLetterDate(row.receivedDate) },
    { id: "sender", header: "Sender", accessorKey: "sender", sortable: true },
    { id: "senderDepartment", header: "Department", accessorKey: "senderDepartment", hideOnMobile: true },
    { id: "subject", header: "Subject", cell: (row) => <span className="font-medium truncate max-w-[200px] block">{row.subject}</span> },
    { id: "category", header: "Category", accessorKey: "category", hideOnMobile: true, cell: (row) => <LBadge variant="outline">{row.category}</LBadge> },
    { id: "priority", header: "Priority", cell: (row) => <LBadge variant={getPriorityVariant(row.priority)}>{row.priority}</LBadge>, hideOnMobile: true },
    {
      id: "assignedTo",
      header: "Assigned To",
      hideOnMobile: true,
      cell: (row) => row.assignedPersonId ? (
        <Link href={`/people/${row.assignedPersonId}`} className="hover:text-accent-primary">{row.assignedTo}</Link>
      ) : row.assignedTo,
    },
    { id: "status", header: "Status", cell: (row) => <StatusBadge label={INWARD_STATUS_LABELS[row.status]} status={getInwardStatusVariant(row.status)} /> },
    { id: "referenceNumber", header: "Reference", hideOnMobile: true, cell: (row) => row.referenceNumber ?? <span className="text-text-muted">—</span> },
    {
      id: "attachment",
      header: "Attachments",
      hideOnMobile: true,
      cell: (row) => row.attachment ? <Badge variant="outline" className="gap-1"><FileText className="size-3" />{row.attachment}</Badge> : <span className="text-text-muted">—</span>,
    },
    { id: "actions", header: "", className: "w-12", cell: (row) => <RowActions row={row} /> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Letters & Documents", href: "/letters-documents" }, { label: "Inward" }]} className="md:hidden" />
      <PageHeader
        title="Inward Letters"
        description="Register and track all incoming correspondence — diary numbers, assignments, and action tracking."
        actions={<Button onClick={() => setCreateOpen(true)}><Plus className="size-4" /><L>Register Inward</L></Button>}
      />
      <DataTable
        columns={columns}
        data={paginated}
        loading={loading}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search by diary no, sender, subject..."
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={(col) => {
          if (sortColumn === col) setSortDirection((d) => d === "asc" ? "desc" : d === "desc" ? null : "asc");
          else { setSortColumn(col); setSortDirection("asc"); }
        }}
        page={page}
        pageSize={pageSize}
        totalItems={filtered.length}
        onPageChange={setPage}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        toolbarActions={
          <>
            <InwardFiltersDrawer filters={filters} onFiltersChange={(f) => { setFilters(f); setPage(1); }} activeCount={activeFilterCount} open={filtersOpen} onOpenChange={setFiltersOpen} />
            <Button variant="outline" size="sm" onClick={() => demoExported("File")}><Download className="size-4" /><span className="hidden sm:inline"><L>Export</L></span></Button>
            <Button variant="outline" size="sm" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 600); }}><RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /></Button>
          </>
        }
        cardRenderer={(row) => (
          <DataTableCard
            title={row.subject}
            subtitle={`${row.diaryNumber} · ${row.sender}`}
            badge={<StatusBadge label={INWARD_STATUS_LABELS[row.status]} status={getInwardStatusVariant(row.status)} />}
            meta={<><span>{formatLetterDate(row.receivedDate)}</span><LBadge variant={getPriorityVariant(row.priority)}>{row.priority}</LBadge></>}
            actions={<RowActions row={row} />}
          />
        )}
      />
      <InwardCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
