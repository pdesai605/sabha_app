"use client";

import * as React from "react";
import { demoExported, demoPrinted } from "@/lib/demo";
import {
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Clock,
  FileText,
  Printer,
  Download,
  RefreshCw,
  Paperclip,
  History,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { L } from "@/components/shared/localized";
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
import { useTranslation } from "@/lib/i18n/context";
import { getDevelopmentProjects } from "@/lib/i18n/localized-demo-data";
import {
  formatGovDate,
  formatCurrencyCompact,
  getProjectStatusVariant,
  getProgressColor,
} from "@/modules/governance/lib/utils";
import { PROJECT_STATUS_LABELS } from "@/modules/governance/constants";
import type { DevelopmentProject } from "@/modules/governance/types";
import { ProjectCreateDialog } from "@/modules/governance/components/governance-create-dialogs";
import { useGovernanceDrawer, type GovernanceDrawerTab } from "@/modules/governance/components/governance-record-drawer";

function RowActions({
  row,
  onAction,
}: {
  row: DevelopmentProject;
  onAction: (tab: GovernanceDrawerTab) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" onClick={(e) => e.stopPropagation()}><MoreHorizontal className="size-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onAction("view"); }}><Eye className="size-4" /><L>View</L></DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onAction("edit"); }}><Pencil className="size-4" /><L>Edit</L></DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onAction("history"); }}><History className="size-4" /><L>History</L></DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onAction("documents"); }}><FileText className="size-4" /><L>Documents</L></DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onAction("attachments"); }}><Paperclip className="size-4" /><L>Attachments</L></DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onAction("timeline"); }}><Clock className="size-4" /><L>Timeline</L></DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); demoPrinted(); }}><Printer className="size-4" /><L>Print</L></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ProjectsList() {
  const { locale } = useTranslation();
  const developmentProjects = React.useMemo(() => getDevelopmentProjects(locale), [locale]);
  const { openDrawer, drawer } = useGovernanceDrawer();
  const [createOpen, setCreateOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [sortColumn, setSortColumn] = React.useState<string>();
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);
  const [loading, setLoading] = React.useState(false);

  const showRecord = (row: DevelopmentProject, tab: GovernanceDrawerTab = "view") => {
    openDrawer({
      title: row.projectName,
      subtitle: row.projectId,
      initialTab: tab,
      documentName: `${row.projectId}-documents.pdf`,
      fields: [
        { label: "Project ID", value: row.projectId },
        { label: "Ward", value: row.ward },
        { label: "Area", value: row.area },
        { label: "Category", value: row.category },
        { label: "Department", value: row.department },
        { label: "Budget", value: formatCurrencyCompact(row.budget) },
        { label: "Spent", value: formatCurrencyCompact(row.spentAmount) },
        { label: "Contractor", value: row.contractor },
        { label: "Start Date", value: formatGovDate(row.startDate) },
        { label: "End Date", value: formatGovDate(row.endDate) },
        { label: "Progress", value: `${row.progress}%` },
        { label: "Status", value: PROJECT_STATUS_LABELS[row.status] },
      ],
    });
  };

  const filtered = React.useMemo(() => {
    let result = developmentProjects;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.projectId.toLowerCase().includes(q) ||
          p.projectName.toLowerCase().includes(q) ||
          p.ward.toLowerCase().includes(q) ||
          p.contractor.toLowerCase().includes(q)
      );
    }
    if (sortColumn && sortDirection) {
      result = [...result].sort((a, b) => {
        if (sortColumn === "budget" || sortColumn === "spentAmount" || sortColumn === "progress") {
          const aNum = a[sortColumn as keyof DevelopmentProject] as number;
          const bNum = b[sortColumn as keyof DevelopmentProject] as number;
          return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
        }
        const aVal = String(a[sortColumn as keyof DevelopmentProject] ?? "");
        const bVal = String(b[sortColumn as keyof DevelopmentProject] ?? "");
        return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    }
    return result;
  }, [developmentProjects, search, sortColumn, sortDirection]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns: DataTableColumn<DevelopmentProject>[] = [
    { id: "projectId", header: "Project ID", sortable: true, cell: (row) => <span className="font-mono text-xs text-accent-primary">{row.projectId}</span> },
    { id: "projectName", header: "Project Name", sortable: true, cell: (row) => <span className="font-medium">{row.projectName}</span> },
    { id: "ward", header: "Ward", accessorKey: "ward", hideOnMobile: true },
    { id: "area", header: "Area", accessorKey: "area", hideOnMobile: true },
    { id: "category", header: "Category", accessorKey: "category", hideOnMobile: true },
    { id: "department", header: "Department", accessorKey: "department", hideOnMobile: true },
    { id: "budget", header: "Budget", sortable: true, cell: (row) => formatCurrencyCompact(row.budget) },
    { id: "spentAmount", header: "Spent", hideOnMobile: true, cell: (row) => formatCurrencyCompact(row.spentAmount) },
    { id: "contractor", header: "Contractor", accessorKey: "contractor", hideOnMobile: true },
    { id: "startDate", header: "Start", hideOnMobile: true, cell: (row) => formatGovDate(row.startDate) },
    { id: "endDate", header: "End", hideOnMobile: true, cell: (row) => formatGovDate(row.endDate) },
    {
      id: "progress",
      header: "Progress",
      sortable: true,
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
    { id: "actions", header: "", className: "w-12", cell: (row) => <RowActions row={row} onAction={(tab) => showRecord(row, tab)} /> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Governance", href: "/governance" }, { label: "Projects" }]} className="md:hidden" />
      <PageHeader
        title="Development Projects"
        description="Constituency development projects — budget tracking, contractor management, and progress monitoring."
        actions={<Button onClick={() => setCreateOpen(true)}><Plus className="size-4" /><L>New Project</L></Button>}
      />
      <DataTable
        columns={columns}
        data={paginated}
        loading={loading}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search projects..."
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
        onRowClick={(row) => showRecord(row)}
        toolbarActions={
          <>
            <Button variant="outline" size="sm" onClick={() => demoExported("File")}><Download className="size-4" /><span className="hidden sm:inline"><L>Export</L></span></Button>
            <Button variant="outline" size="sm" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 600); }}><RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /></Button>
          </>
        }
        cardRenderer={(row) => (
          <DataTableCard
            title={row.projectName}
            subtitle={`${row.projectId} · ${row.ward.split("—")[0]?.trim()}`}
            badge={<StatusBadge label={PROJECT_STATUS_LABELS[row.status]} status={getProjectStatusVariant(row.status)} />}
            meta={<><span>{formatCurrencyCompact(row.budget)}</span><span>{row.progress}%</span></>}
            actions={<RowActions row={row} onAction={(tab) => showRecord(row, tab)} />}
            onClick={() => showRecord(row)}
          />
        )}
      />
      <ProjectCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
      {drawer}
    </div>
  );
}
