"use client";

import * as React from "react";
import { Plus, LayoutGrid, List } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { L } from "@/components/shared/localized";
import { DataTable, type DataTableColumn } from "@/components/data-table/data-table";
import { governmentSchemes } from "@/modules/governance/data/governance-data";
import { formatCurrencyCompact, getProgressColor } from "@/modules/governance/lib/utils";
import type { GovernmentScheme } from "@/modules/governance/types";
import { SchemeCreateDialog } from "@/modules/governance/components/governance-create-dialogs";
import { useGovernanceDrawer, type GovernanceDrawerTab } from "@/modules/governance/components/governance-record-drawer";
import { GovernanceRowActions } from "@/modules/governance/components/governance-row-actions";

type ViewMode = "cards" | "table";

export function SchemesList() {
  const { openDrawer, drawer } = useGovernanceDrawer();
  const [createOpen, setCreateOpen] = React.useState(false);
  const [view, setView] = React.useState<ViewMode>("cards");
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);

  const showRecord = (s: GovernmentScheme, tab: GovernanceDrawerTab = "view") => {
    openDrawer({
      title: s.schemeName,
      subtitle: s.department,
      initialTab: tab,
      fields: [
        { label: "Department", value: s.department },
        { label: "Ward", value: s.ward },
        { label: "Beneficiaries", value: s.beneficiaries.toLocaleString("en-IN") },
        { label: "Applications", value: s.applications.toLocaleString("en-IN") },
        { label: "Approved", value: s.approved.toLocaleString("en-IN") },
        { label: "Rejected", value: s.rejected.toLocaleString("en-IN") },
        { label: "Pending", value: s.pending.toLocaleString("en-IN") },
        { label: "Budget", value: formatCurrencyCompact(s.budget) },
        { label: "Progress", value: `${s.progress}%` },
        { label: "Status", value: s.status },
      ],
    });
  };

  const filtered = governmentSchemes.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return s.schemeName.toLowerCase().includes(q) || s.department.toLowerCase().includes(q) || s.ward.toLowerCase().includes(q);
  });

  const paginated = filtered.slice((page - 1) * 10, page * 10);

  const columns: DataTableColumn<GovernmentScheme>[] = [
    { id: "schemeName", header: "Scheme Name", cell: (row) => <span className="font-medium">{row.schemeName}</span> },
    { id: "department", header: "Department", accessorKey: "department", hideOnMobile: true },
    { id: "beneficiaries", header: "Beneficiaries", hideOnMobile: true, cell: (row) => row.beneficiaries.toLocaleString("en-IN") },
    { id: "ward", header: "Ward", accessorKey: "ward", hideOnMobile: true },
    { id: "applications", header: "Applications", cell: (row) => row.applications.toLocaleString("en-IN") },
    { id: "approved", header: "Approved", hideOnMobile: true, cell: (row) => row.approved.toLocaleString("en-IN") },
    { id: "rejected", header: "Rejected", hideOnMobile: true, cell: (row) => row.rejected.toLocaleString("en-IN") },
    { id: "pending", header: "Pending", hideOnMobile: true, cell: (row) => row.pending.toLocaleString("en-IN") },
    { id: "budget", header: "Budget", hideOnMobile: true, cell: (row) => formatCurrencyCompact(row.budget) },
    { id: "status", header: "Status", cell: (row) => <Badge variant={row.status === "active" ? "primary" : row.status === "completed" ? "success" : "default"}>{row.status}</Badge> },
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
    { id: "actions", header: "", className: "w-12", cell: (row) => <GovernanceRowActions onAction={(tab) => showRecord(row, tab)} /> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Governance", href: "/governance" }, { label: "Schemes" }]} className="md:hidden" />
      <PageHeader
        title="Government Schemes"
        description="Central and state government schemes — applications, approvals, and beneficiary tracking."
        actions={<Button onClick={() => setCreateOpen(true)}><Plus className="size-4" /><L>Add Scheme</L></Button>}
      />

      <div className="flex items-center justify-between">
        <Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
          <TabsList>
            <TabsTrigger value="cards"><LayoutGrid className="size-4 mr-1.5" />Cards</TabsTrigger>
            <TabsTrigger value="table"><List className="size-4 mr-1.5" />Table</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === "cards" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((s) => (
            <Card key={s.id} className="hover:border-border-default transition-colors cursor-pointer" onClick={() => showRecord(s)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-text-primary leading-snug">{s.schemeName}</p>
                  <Badge variant={s.status === "active" ? "primary" : s.status === "completed" ? "success" : "default"}>{s.status}</Badge>
                </div>
                <p className="text-xs text-text-muted mt-1">{s.department}</p>
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div><span className="text-text-muted">Applications</span><p className="font-medium">{s.applications.toLocaleString("en-IN")}</p></div>
                  <div><span className="text-text-muted">Approved</span><p className="font-medium text-semantic-success">{s.approved.toLocaleString("en-IN")}</p></div>
                  <div><span className="text-text-muted">Pending</span><p className="font-medium">{s.pending.toLocaleString("en-IN")}</p></div>
                  <div><span className="text-text-muted">Budget</span><p className="font-medium">{formatCurrencyCompact(s.budget)}</p></div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1"><span className="text-text-muted">Progress</span><span>{s.progress}%</span></div>
                  <div className="h-2 rounded-full bg-background-muted overflow-hidden">
                    <div className={`h-full rounded-full ${getProgressColor(s.progress)}`} style={{ width: `${s.progress}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={paginated}
          searchValue={search}
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          searchPlaceholder="Search schemes..."
          page={page}
          pageSize={10}
          totalItems={filtered.length}
          onPageChange={setPage}
          onRowClick={showRecord}
        />
      )}
      <SchemeCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
      {drawer}
    </div>
  );
}
