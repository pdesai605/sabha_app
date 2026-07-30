"use client";

import * as React from "react";
import { demoSuccess, demoExported, demoImported, demoPrinted, demoAssigned, demoWhatsAppSent, demoSaved, demoDeleted } from "@/lib/demo";
import { Plus, Download, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  DataTable,
  DataTableCard,
  type DataTableColumn,
} from "@/components/data-table/data-table";
import { dispatchRecords } from "@/modules/letters-documents/data/letters-data";
import {
  formatLetterDate,
  getDispatchStatusVariant,
} from "@/modules/letters-documents/lib/utils";
import { DISPATCH_STATUS_LABELS } from "@/modules/letters-documents/constants";
import type { DispatchRecord } from "@/modules/letters-documents/types";

import { DispatchCreateDialog } from "@/modules/letters-documents/components/dispatch-create-dialog";
import { L } from "@/components/shared/localized";

export function DispatchRegisterList() {
  const [createOpen, setCreateOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  const filtered = dispatchRecords.filter((d) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      d.dispatchNumber.toLowerCase().includes(q) ||
      d.recipient.toLowerCase().includes(q) ||
      (d.trackingNumber?.toLowerCase().includes(q) ?? false) ||
      (d.courier?.toLowerCase().includes(q) ?? false)
    );
  });

  const paginated = filtered.slice((page - 1) * 10, page * 10);

  const columns: DataTableColumn<DispatchRecord>[] = [
    { id: "dispatchNumber", header: "Dispatch Number", cell: (row) => <span className="font-mono text-xs text-accent-primary">{row.dispatchNumber}</span> },
    { id: "courier", header: "Courier", cell: (row) => row.courier ?? <span className="text-text-muted">—</span>, hideOnMobile: true },
    { id: "trackingNumber", header: "Tracking Number", cell: (row) => row.trackingNumber ? <span className="font-mono text-xs">{row.trackingNumber}</span> : <span className="text-text-muted">—</span>, hideOnMobile: true },
    { id: "recipient", header: "Recipient", accessorKey: "recipient" },
    { id: "date", header: "Date", hideOnMobile: true, cell: (row) => formatLetterDate(row.date) },
    { id: "deliveryMethod", header: "Delivery Method", accessorKey: "deliveryMethod", hideOnMobile: true },
    { id: "status", header: "Status", cell: (row) => <StatusBadge label={DISPATCH_STATUS_LABELS[row.status]} status={getDispatchStatusVariant(row.status)} /> },
    { id: "deliveredOn", header: "Delivered On", hideOnMobile: true, cell: (row) => row.deliveredOn ? formatLetterDate(row.deliveredOn) : <span className="text-text-muted">—</span> },
    { id: "acknowledgement", header: "Acknowledgement", hideOnMobile: true, cell: (row) => row.acknowledgement ?? <span className="text-text-muted">—</span> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Letters & Documents", href: "/letters-documents" }, { label: "Dispatch" }]} className="md:hidden" />
      <PageHeader
        title="Dispatch Register"
        description="Courier, speed post, and hand delivery tracking with acknowledgement records."
        actions={<Button onClick={() => setCreateOpen(true)}><Plus className="size-4" /><L>Record Dispatch</L></Button>}
      />
      <DataTable
        columns={columns}
        data={paginated}
        loading={loading}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search dispatch records..."
        page={page}
        pageSize={10}
        totalItems={filtered.length}
        onPageChange={setPage}
        toolbarActions={
          <>
            <Button variant="outline" size="sm" onClick={() => demoExported("File")}><Download className="size-4" />Export</Button>
            <Button variant="outline" size="sm" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 600); }}><RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /></Button>
          </>
        }
        cardRenderer={(row) => (
          <DataTableCard
            title={row.recipient}
            subtitle={row.dispatchNumber}
            badge={<StatusBadge label={DISPATCH_STATUS_LABELS[row.status]} status={getDispatchStatusVariant(row.status)} />}
            meta={<><span>{formatLetterDate(row.date)}</span><span>{row.deliveryMethod}</span></>}
          />
        )}
      />
      <DispatchCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
