"use client";

import * as React from "react";
import { demoExported } from "@/lib/demo";
import { Plus, Download, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { L } from "@/components/shared/localized";
import { DataTable, DataTableCard, type DataTableColumn } from "@/components/data-table/data-table";
import { tenders } from "@/modules/governance/data/governance-data";
import { formatGovDate, formatCurrencyCompact, getTenderStatusVariant } from "@/modules/governance/lib/utils";
import { TENDER_STATUS_LABELS } from "@/modules/governance/constants";
import type { Tender } from "@/modules/governance/types";
import { TenderPublishDialog } from "@/modules/governance/components/governance-create-dialogs";
import { useGovernanceDrawer, type GovernanceDrawerTab } from "@/modules/governance/components/governance-record-drawer";
import { GovernanceRowActions } from "@/modules/governance/components/governance-row-actions";

export function TendersList() {
  const { openDrawer, drawer } = useGovernanceDrawer();
  const [createOpen, setCreateOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  const showRecord = (t: Tender, tab: GovernanceDrawerTab = "view") => {
    openDrawer({
      title: t.projectName,
      subtitle: t.tenderNo,
      initialTab: tab,
      documentName: `${t.tenderNo}-tender.pdf`,
      fields: [
        { label: "Tender No", value: t.tenderNo },
        { label: "Department", value: t.department },
        { label: "Estimated Cost", value: formatCurrencyCompact(t.estimatedCost) },
        { label: "Published", value: formatGovDate(t.publishedDate) },
        { label: "Closing", value: formatGovDate(t.closingDate) },
        { label: "Bidders", value: t.bidders },
        { label: "Status", value: TENDER_STATUS_LABELS[t.status] },
        { label: "Awarded To", value: t.awardedTo ?? "—" },
      ],
    });
  };

  const filtered = tenders.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return t.tenderNo.toLowerCase().includes(q) || t.projectName.toLowerCase().includes(q) || (t.awardedTo?.toLowerCase().includes(q) ?? false);
  });

  const paginated = filtered.slice((page - 1) * 10, page * 10);

  const columns: DataTableColumn<Tender>[] = [
    { id: "tenderNo", header: "Tender No", cell: (row) => <span className="font-mono text-xs text-accent-primary">{row.tenderNo}</span> },
    { id: "projectName", header: "Project", cell: (row) => <span className="font-medium truncate max-w-[200px] block">{row.projectName}</span> },
    { id: "department", header: "Department", accessorKey: "department", hideOnMobile: true },
    { id: "estimatedCost", header: "Est. Cost", cell: (row) => formatCurrencyCompact(row.estimatedCost) },
    { id: "publishedDate", header: "Published", hideOnMobile: true, cell: (row) => formatGovDate(row.publishedDate) },
    { id: "closingDate", header: "Closing", hideOnMobile: true, cell: (row) => formatGovDate(row.closingDate) },
    { id: "bidders", header: "Bidders", cell: (row) => row.bidders },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge label={TENDER_STATUS_LABELS[row.status]} status={getTenderStatusVariant(row.status)} />,
    },
    { id: "awardedTo", header: "Awarded To", hideOnMobile: true, cell: (row) => row.awardedTo ?? <span className="text-text-muted">—</span> },
    { id: "actions", header: "", className: "w-12", cell: (row) => <GovernanceRowActions onAction={(tab) => showRecord(row, tab)} /> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Governance", href: "/governance" }, { label: "Tenders" }]} className="md:hidden" />
      <PageHeader
        title="Tenders"
        description="Tender management — publication, bidding, evaluation, and award tracking."
        actions={<Button onClick={() => setCreateOpen(true)}><Plus className="size-4" /><L>Publish Tender</L></Button>}
      />
      <DataTable
        columns={columns}
        data={paginated}
        loading={loading}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search tenders..."
        page={page}
        pageSize={10}
        totalItems={filtered.length}
        onPageChange={setPage}
        onRowClick={showRecord}
        toolbarActions={
          <>
            <Button variant="outline" size="sm" onClick={() => demoExported("File")}><Download className="size-4" /><L>Export</L></Button>
            <Button variant="outline" size="sm" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 600); }}><RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /></Button>
          </>
        }
        cardRenderer={(row) => (
          <DataTableCard
            title={row.projectName}
            subtitle={row.tenderNo}
            badge={<StatusBadge label={TENDER_STATUS_LABELS[row.status]} status={getTenderStatusVariant(row.status)} />}
            meta={<><span>{formatCurrencyCompact(row.estimatedCost)}</span><span>{row.bidders} bidders</span></>}
            actions={<GovernanceRowActions onAction={(tab) => showRecord(row, tab)} />}
            onClick={() => showRecord(row)}
          />
        )}
      />
      <TenderPublishDialog open={createOpen} onOpenChange={setCreateOpen} />
      {drawer}
    </div>
  );
}
