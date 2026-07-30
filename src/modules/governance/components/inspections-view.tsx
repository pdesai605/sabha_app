"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Calendar, List, User } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { L } from "@/components/shared/localized";
import { DataTable, type DataTableColumn } from "@/components/data-table/data-table";
import { useTranslation } from "@/lib/i18n/context";
import { getInspections } from "@/lib/i18n/localized-demo-data";
import { formatGovDate, getInspectionStatusVariant } from "@/modules/governance/lib/utils";
import { INSPECTION_STATUS_LABELS, GOV_TODAY } from "@/modules/governance/constants";
import { cn } from "@/lib/utils";
import type { Inspection } from "@/modules/governance/types";
import { InspectionScheduleDialog } from "@/modules/governance/components/governance-create-dialogs";
import { useGovernanceDrawer, type GovernanceDrawerTab } from "@/modules/governance/components/governance-record-drawer";
import { GovernanceRowActions } from "@/modules/governance/components/governance-row-actions";

type ViewMode = "calendar" | "list";

export function InspectionsView() {
  const { locale } = useTranslation();
  const inspections = React.useMemo(() => getInspections(locale), [locale]);
  const { openDrawer, drawer } = useGovernanceDrawer();
  const [createOpen, setCreateOpen] = React.useState(false);
  const [view, setView] = React.useState<ViewMode>("list");
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);

  const showRecord = (i: Inspection, tab: GovernanceDrawerTab = "view") => {
    openDrawer({
      title: i.inspectionId,
      subtitle: i.projectName,
      initialTab: tab,
      fields: [
        { label: "Project", value: i.projectName },
        { label: "Officer", value: i.officerName },
        { label: "Ward", value: i.ward },
        { label: "Date", value: formatGovDate(i.inspectionDate) },
        { label: "Status", value: INSPECTION_STATUS_LABELS[i.status] },
        { label: "Result", value: i.result },
        { label: "Remarks", value: i.remarks ?? "—" },
      ],
    });
  };

  const filtered = inspections.filter((i) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return i.inspectionId.toLowerCase().includes(q) || i.projectName.toLowerCase().includes(q) || i.officerName.toLowerCase().includes(q);
  });

  const paginated = filtered.slice((page - 1) * 10, page * 10);
  const sorted = [...inspections].sort((a, b) => a.inspectionDate.localeCompare(b.inspectionDate));

  const columns: DataTableColumn<Inspection>[] = [
    { id: "inspectionId", header: "Inspection ID", cell: (row) => <span className="font-mono text-xs text-accent-primary">{row.inspectionId}</span> },
    { id: "projectName", header: "Project", cell: (row) => <span className="font-medium truncate max-w-[200px] block">{row.projectName}</span> },
    {
      id: "officer",
      header: "Officer",
      cell: (row) => row.officerPersonId ? (
        <Link href={`/people/${row.officerPersonId}`} className="hover:text-accent-primary flex items-center gap-1"><User className="size-3" />{row.officerName}</Link>
      ) : row.officerName,
    },
    { id: "ward", header: "Ward", accessorKey: "ward", hideOnMobile: true },
    { id: "inspectionDate", header: "Date", cell: (row) => formatGovDate(row.inspectionDate) },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge label={INSPECTION_STATUS_LABELS[row.status]} status={getInspectionStatusVariant(row.status)} />,
    },
    { id: "remarks", header: "Remarks", hideOnMobile: true, cell: (row) => row.remarks ?? <span className="text-text-muted">—</span> },
    {
      id: "result",
      header: "Result",
      cell: (row) => (
        <Badge variant={row.result === "Satisfactory" ? "success" : row.result === "Unsatisfactory" ? "danger" : row.result === "Needs Improvement" ? "warning" : "default"}>
          {row.result}
        </Badge>
      ),
    },
    { id: "actions", header: "", className: "w-12", cell: (row) => <GovernanceRowActions onAction={(tab) => showRecord(row, tab)} /> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Governance", href: "/governance" }, { label: "Inspections" }]} className="md:hidden" />
      <PageHeader
        title="Inspections"
        description="Project inspection schedule — officer assignments, status tracking, and result recording."
        actions={<Button onClick={() => setCreateOpen(true)}><Plus className="size-4" /><L>Schedule Inspection</L></Button>}
      />

      <Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
        <TabsList>
          <TabsTrigger value="calendar"><Calendar className="size-4 mr-1.5" />Calendar</TabsTrigger>
          <TabsTrigger value="list"><List className="size-4 mr-1.5" />List</TabsTrigger>
        </TabsList>
      </Tabs>

      {view === "calendar" ? (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="text-center text-xs font-medium text-text-muted py-2">{d}</div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 3;
                const dateStr = day > 0 && day <= 31 ? `2026-07-${String(day).padStart(2, "0")}` : null;
                const dayInspections = dateStr ? sorted.filter((e) => e.inspectionDate === dateStr) : [];
                return (
                  <div
                    key={i}
                    className={cn(
                      "min-h-[72px] rounded-input border border-border-subtle p-1.5 text-xs",
                      dateStr === GOV_TODAY && "border-accent-primary/30 bg-accent-primary-muted/20"
                    )}
                  >
                    {day > 0 && day <= 31 && <span className="text-text-secondary font-medium">{day}</span>}
                    {dayInspections.slice(0, 2).map((e) => (
                      <div key={e.id} className="mt-0.5 truncate rounded px-1 py-0.5 bg-accent-primary-muted text-accent-primary text-[10px]">{e.inspectionId.split("-")[2]}</div>
                    ))}
                    {dayInspections.length > 2 && <span className="text-[10px] text-text-muted">+{dayInspections.length - 2}</span>}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <DataTable
          columns={columns}
          data={paginated}
          searchValue={search}
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          searchPlaceholder="Search inspections..."
          page={page}
          pageSize={10}
          totalItems={filtered.length}
          onPageChange={setPage}
          onRowClick={showRecord}
        />
      )}
      <InspectionScheduleDialog open={createOpen} onOpenChange={setCreateOpen} />
      {drawer}
    </div>
  );
}
