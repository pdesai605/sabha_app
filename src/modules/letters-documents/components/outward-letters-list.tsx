"use client";

import * as React from "react";
import { useTranslation } from "@/lib/i18n/context";
import { getOutwardLetters } from "@/lib/i18n/localized-demo-data";
import { demoSuccess, demoExported, demoImported, demoPrinted, demoAssigned, demoWhatsAppSent, demoSaved, demoDeleted } from "@/lib/demo";
import Link from "next/link";
import { Plus, MoreHorizontal, Eye, Pencil, Printer, Download, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DataTable, DataTableCard, type DataTableColumn,
} from "@/components/data-table/data-table";
import { formatLetterDate, getOutwardStatusVariant } from "@/modules/letters-documents/lib/utils";
import { OUTWARD_STATUS_LABELS } from "@/modules/letters-documents/constants";
import type { OutwardLetter } from "@/modules/letters-documents/types";
import { OutwardCreateDialog } from "@/modules/letters-documents/components/outward-create-dialog";
import { L } from "@/components/shared/localized";

function RowActions({ row }: { row: OutwardLetter }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm"><MoreHorizontal className="size-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => demoSuccess("Action completed successfully.")}><Eye className="size-4" /><L>View</L></DropdownMenuItem>
        <DropdownMenuItem onClick={() => demoSuccess("Action completed successfully.")}><Pencil className="size-4" /><L>Edit</L></DropdownMenuItem>
        <DropdownMenuItem onClick={() => demoPrinted()}><Printer className="size-4" /><L>Print</L></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function OutwardLettersList() {
  const { locale } = useTranslation();
  const outwardLetters = React.useMemo(() => getOutwardLetters(locale), [locale]);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  const filtered = outwardLetters.filter((l) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return l.dispatchNumber.toLowerCase().includes(q) || l.recipient.toLowerCase().includes(q) || l.subject.toLowerCase().includes(q);
  });

  const paginated = filtered.slice((page - 1) * 10, page * 10);

  const columns: DataTableColumn<OutwardLetter>[] = [
    { id: "dispatchNumber", header: "Dispatch Number", cell: (row) => <span className="font-mono text-xs text-accent-primary">{row.dispatchNumber}</span> },
    { id: "issueDate", header: "Issue Date", hideOnMobile: true, cell: (row) => formatLetterDate(row.issueDate) },
    { id: "recipient", header: "Recipient", accessorKey: "recipient" },
    { id: "department", header: "Department", accessorKey: "department", hideOnMobile: true },
    { id: "subject", header: "Subject", cell: (row) => <span className="font-medium truncate max-w-[200px] block">{row.subject}</span> },
    { id: "referenceLetter", header: "Reference Letter", hideOnMobile: true, cell: (row) => row.referenceLetter ?? <span className="text-text-muted">—</span> },
    {
      id: "preparedBy",
      header: "Prepared By",
      hideOnMobile: true,
      cell: (row) => row.preparedByPersonId ? (
        <Link href={`/people/${row.preparedByPersonId}`} className="hover:text-accent-primary">{row.preparedBy}</Link>
      ) : row.preparedBy,
    },
    {
      id: "approvedBy",
      header: "Approved By",
      hideOnMobile: true,
      cell: (row) => row.approvedByPersonId ? (
        <Link href={`/people/${row.approvedByPersonId}`} className="hover:text-accent-primary">{row.approvedBy}</Link>
      ) : row.approvedBy,
    },
    { id: "deliveryMethod", header: "Delivery Method", accessorKey: "deliveryMethod", hideOnMobile: true },
    { id: "status", header: "Status", cell: (row) => <StatusBadge label={OUTWARD_STATUS_LABELS[row.status]} status={getOutwardStatusVariant(row.status)} /> },
    { id: "actions", header: "", className: "w-12", cell: (row) => <RowActions row={row} /> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Letters & Documents", href: "/letters-documents" }, { label: "Outward" }]} className="md:hidden" />
      <PageHeader
        title="Outward Letters"
        description="Official outgoing correspondence — dispatch numbers, approvals, and delivery tracking."
        actions={<Button onClick={() => setCreateOpen(true)}><Plus className="size-4" /><L>Create Outward</L></Button>}
      />
      <DataTable
        columns={columns}
        data={paginated}
        loading={loading}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search outward letters..."
        page={page}
        pageSize={10}
        totalItems={filtered.length}
        onPageChange={setPage}
        toolbarActions={
          <>
            <Button variant="outline" size="sm" onClick={() => demoExported("File")}><Download className="size-4" /><L>Export</L></Button>
            <Button variant="outline" size="sm" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 600); }}><RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /></Button>
          </>
        }
        cardRenderer={(row) => (
          <DataTableCard
            title={row.subject}
            subtitle={`${row.dispatchNumber} · ${row.recipient}`}
            badge={<StatusBadge label={OUTWARD_STATUS_LABELS[row.status]} status={getOutwardStatusVariant(row.status)} />}
            meta={<><span>{formatLetterDate(row.issueDate)}</span><span>{row.deliveryMethod}</span></>}
            actions={<RowActions row={row} />}
          />
        )}
      />
      <OutwardCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
