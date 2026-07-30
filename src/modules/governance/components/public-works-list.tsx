"use client";

import * as React from "react";
import { demoExported } from "@/lib/demo";
import { Plus, Download, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { L } from "@/components/shared/localized";
import { DataTable, DataTableCard, type DataTableColumn } from "@/components/data-table/data-table";
import { publicWorks } from "@/modules/governance/data/governance-data";
import { formatCurrencyCompact, getProjectStatusVariant, getProgressColor } from "@/modules/governance/lib/utils";
import { PROJECT_STATUS_LABELS } from "@/modules/governance/constants";
import type { PublicWork } from "@/modules/governance/types";
import { PublicWorkCreateDialog } from "@/modules/governance/components/governance-create-dialogs";
import { useGovernanceDrawer, type GovernanceDrawerTab } from "@/modules/governance/components/governance-record-drawer";
import { GovernanceRowActions } from "@/modules/governance/components/governance-row-actions";

export function PublicWorksList() {
  const { openDrawer, drawer } = useGovernanceDrawer();
  const [createOpen, setCreateOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  const showRecord = (w: PublicWork, tab: GovernanceDrawerTab = "view") => {
    openDrawer({
      title: w.type,
      subtitle: w.workId,
      initialTab: tab,
      fields: [
        { label: "Work ID", value: w.workId },
        { label: "Ward", value: w.ward },
        { label: "Area", value: w.area },
        { label: "Contractor", value: w.contractor },
        { label: "Department", value: w.department },
        { label: "Budget", value: formatCurrencyCompact(w.budget) },
        { label: "Progress", value: `${w.progress}%` },
        { label: "Status", value: PROJECT_STATUS_LABELS[w.status] },
      ],
    });
  };

  const filtered = publicWorks.filter((w) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return w.workId.toLowerCase().includes(q) || w.type.toLowerCase().includes(q) || w.ward.toLowerCase().includes(q) || w.contractor.toLowerCase().includes(q);
  });

  const paginated = filtered.slice((page - 1) * 10, page * 10);

  const columns: DataTableColumn<PublicWork>[] = [
    { id: "workId", header: "Work ID", cell: (row) => <span className="font-mono text-xs text-accent-primary">{row.workId}</span> },
    { id: "type", header: "Type", cell: (row) => <Badge variant="outline">{row.type}</Badge> },
    { id: "ward", header: "Ward", accessorKey: "ward" },
    { id: "area", header: "Area", accessorKey: "area", hideOnMobile: true },
    { id: "contractor", header: "Contractor", accessorKey: "contractor", hideOnMobile: true },
    { id: "department", header: "Department", accessorKey: "department", hideOnMobile: true },
    { id: "budget", header: "Budget", cell: (row) => formatCurrencyCompact(row.budget) },
    {
      id: "progress",
      header: "Progress",
      cell: (row) => (
        <div className="flex items-center gap-2 min-w-[80px]">
          <div className="flex-1 h-2 rounded-full bg-background-muted overflow-hidden">
            <div className={`h-full rounded-full ${getProgressColor(row.progress)}`} style={{ width: `${row.progress}%` }} />
          </div>
          <span className="text-xs">{row.progress}%</span>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge label={PROJECT_STATUS_LABELS[row.status]} status={getProjectStatusVariant(row.status)} />,
    },
    { id: "actions", header: "", className: "w-12", cell: (row) => <GovernanceRowActions onAction={(tab) => showRecord(row, tab)} /> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Governance", href: "/governance" }, { label: "Public Works" }]} className="md:hidden" />
      <PageHeader
        title="Public Works"
        description="Civic infrastructure — road repair, drainage, street lights, water pipelines, and public facilities."
        actions={<Button onClick={() => setCreateOpen(true)}><Plus className="size-4" /><L>Add Work</L></Button>}
      />
      <DataTable
        columns={columns}
        data={paginated}
        loading={loading}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search public works..."
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
            title={row.type}
            subtitle={`${row.workId} · ${row.area}`}
            badge={<StatusBadge label={PROJECT_STATUS_LABELS[row.status]} status={getProjectStatusVariant(row.status)} />}
            meta={<><span>{formatCurrencyCompact(row.budget)}</span><span>{row.progress}%</span></>}
            actions={<GovernanceRowActions onAction={(tab) => showRecord(row, tab)} />}
            onClick={() => showRecord(row)}
          />
        )}
      />
      <PublicWorkCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
      {drawer}
    </div>
  );
}
