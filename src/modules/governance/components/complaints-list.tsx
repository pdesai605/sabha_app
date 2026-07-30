"use client";

import * as React from "react";
import { demoExported } from "@/lib/demo";
import Link from "next/link";
import { Plus, Download } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { L } from "@/components/shared/localized";
import { DataTable, DataTableCard, type DataTableColumn } from "@/components/data-table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/lib/i18n/context";
import { getPublicComplaints } from "@/lib/i18n/localized-demo-data";
import { formatGovDate, getComplaintStatusVariant, getComplaintPriorityVariant } from "@/modules/governance/lib/utils";
import { COMPLAINT_STATUS_LABELS, COMPLAINT_CATEGORIES } from "@/modules/governance/constants";
import type { PublicComplaint, ComplaintCategory } from "@/modules/governance/types";
import { ComplaintRegisterDialog } from "@/modules/governance/components/governance-create-dialogs";
import { useGovernanceDrawer, type GovernanceDrawerTab } from "@/modules/governance/components/governance-record-drawer";
import { GovernanceRowActions } from "@/modules/governance/components/governance-row-actions";

function RowActions({
  row,
  onAction,
}: {
  row: PublicComplaint;
  onAction: (tab: GovernanceDrawerTab) => void;
}) {
  return (
    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
      {row.personId && (
        <Link href={`/people/${row.personId}`} className="sr-only"><L>Citizen Profile</L></Link>
      )}
      <GovernanceRowActions onAction={onAction} />
    </div>
  );
}

export function ComplaintsList() {
  const { locale } = useTranslation();
  const publicComplaints = React.useMemo(() => getPublicComplaints(locale), [locale]);
  const { openDrawer, drawer } = useGovernanceDrawer();
  const [createOpen, setCreateOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [category, setCategory] = React.useState<ComplaintCategory | "all">("all");

  const showRecord = (c: PublicComplaint, tab: GovernanceDrawerTab = "view") => {
    openDrawer({
      title: c.complaintId,
      subtitle: c.citizenName,
      initialTab: tab,
      fields: [
        { label: "Citizen", value: c.citizenName },
        { label: "Ward", value: c.ward },
        { label: "Area", value: c.area },
        { label: "Category", value: c.category },
        { label: "Priority", value: c.priority },
        { label: "Assigned Officer", value: c.assignedOfficer },
        { label: "Created", value: formatGovDate(c.createdDate) },
        { label: "Due Date", value: formatGovDate(c.dueDate) },
        { label: "Status", value: COMPLAINT_STATUS_LABELS[c.status] },
        { label: "Description", value: c.description },
      ],
    });
  };

  const filtered = publicComplaints.filter((c) => {
    if (category !== "all" && c.category !== category) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return c.complaintId.toLowerCase().includes(q) || c.citizenName.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
  });

  const paginated = filtered.slice((page - 1) * 10, page * 10);

  const columns: DataTableColumn<PublicComplaint>[] = [
    { id: "complaintId", header: "Complaint ID", cell: (row) => <span className="font-mono text-xs text-accent-primary">{row.complaintId}</span> },
    {
      id: "citizen",
      header: "Citizen",
      cell: (row) => row.personId ? (
        <Link href={`/people/${row.personId}`} className="font-medium hover:text-accent-primary">{row.citizenName}</Link>
      ) : row.citizenName,
    },
    { id: "ward", header: "Ward", accessorKey: "ward", hideOnMobile: true },
    { id: "area", header: "Area", accessorKey: "area", hideOnMobile: true },
    { id: "category", header: "Category", cell: (row) => <Badge variant="outline">{row.category}</Badge> },
    { id: "priority", header: "Priority", cell: (row) => <Badge variant={getComplaintPriorityVariant(row.priority)}>{row.priority}</Badge>, hideOnMobile: true },
    {
      id: "assignedOfficer",
      header: "Assigned Officer",
      hideOnMobile: true,
      cell: (row) => row.officerPersonId ? (
        <Link href={`/people/${row.officerPersonId}`} className="hover:text-accent-primary">{row.assignedOfficer}</Link>
      ) : row.assignedOfficer,
    },
    { id: "createdDate", header: "Created", hideOnMobile: true, cell: (row) => formatGovDate(row.createdDate) },
    { id: "dueDate", header: "Due Date", hideOnMobile: true, cell: (row) => formatGovDate(row.dueDate) },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge label={COMPLAINT_STATUS_LABELS[row.status]} status={getComplaintStatusVariant(row.status)} />,
    },
    { id: "actions", header: "", className: "w-12", cell: (row) => <RowActions row={row} onAction={(tab) => showRecord(row, tab)} /> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Governance", href: "/governance" }, { label: "Complaints" }]} className="md:hidden" />
      <PageHeader
        title="Public Complaints"
        description="Citizen grievance register — road, water, drainage, health, and civic complaints with officer assignment."
        actions={<Button onClick={() => setCreateOpen(true)}><Plus className="size-4" /><L>Register Complaint</L></Button>}
      />

      <Tabs value={category} onValueChange={(v) => { setCategory(v as ComplaintCategory | "all"); setPage(1); }}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="all">All ({publicComplaints.length})</TabsTrigger>
          {COMPLAINT_CATEGORIES.map((cat) => (
            <TabsTrigger key={cat} value={cat}>{cat} ({publicComplaints.filter((c) => c.category === cat).length})</TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={category} className="mt-4">
          <DataTable
            columns={columns}
            data={paginated}
            searchValue={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            searchPlaceholder="Search complaints..."
            page={page}
            pageSize={10}
            totalItems={filtered.length}
            onPageChange={setPage}
            onRowClick={showRecord}
            toolbarActions={
              <Button variant="outline" size="sm" onClick={() => demoExported("File")}><Download className="size-4" /><L>Export</L></Button>
            }
            cardRenderer={(row) => (
              <DataTableCard
                title={row.description}
                subtitle={`${row.complaintId} · ${row.citizenName}`}
                badge={<StatusBadge label={COMPLAINT_STATUS_LABELS[row.status]} status={getComplaintStatusVariant(row.status)} />}
                meta={<><span>{row.category}</span><span>Due {formatGovDate(row.dueDate)}</span></>}
                actions={<RowActions row={row} onAction={(tab) => showRecord(row, tab)} />}
                onClick={() => showRecord(row)}
              />
            )}
          />
        </TabsContent>
      </Tabs>
      <ComplaintRegisterDialog open={createOpen} onOpenChange={setCreateOpen} />
      {drawer}
    </div>
  );
}
