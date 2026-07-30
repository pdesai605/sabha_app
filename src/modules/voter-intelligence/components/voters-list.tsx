"use client";

import * as React from "react";
import { demoSuccess, demoExported, demoImported, demoPrinted, demoAssigned, demoWhatsAppSent, demoSaved, demoDeleted } from "@/lib/demo";
import Link from "next/link";
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
  User,
} from "lucide-react";
import { AddVoterDialog } from "@/modules/voter-intelligence/components/add-voter-dialog";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { LBadge } from "@/components/shared/localized-badge";
import { L } from "@/components/shared/localized";
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
import {
  VoterFiltersDrawer,
  applyVoterFilters,
  type VoterFilters,
} from "@/modules/voter-intelligence/components/voter-filters-drawer";
import { voters } from "@/modules/voter-intelligence/data/voter-data";
import {
  formatVIDate,
  getPartyInclinationVariant,
  getSurveyStatusVariant,
} from "@/modules/voter-intelligence/lib/utils";
import type { Voter } from "@/modules/voter-intelligence/types";

const defaultFilters: VoterFilters = {
  wards: [], booths: [], areas: [], genders: [], partyInclinations: [], surveyStatuses: [], ageGroups: [],
};

function RowActions({ row }: { row: Voter }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm"><MoreHorizontal className="size-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {row.personId && (
          <DropdownMenuItem asChild>
            <Link href={`/people/${row.personId}`}><User className="size-4" /><L>Open Person</L></Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => demoSuccess("Action completed successfully.")}><Eye className="size-4" /><L>View</L></DropdownMenuItem>
        <DropdownMenuItem onClick={() => demoSuccess("Action completed successfully.")}><Pencil className="size-4" /><L>Edit</L></DropdownMenuItem>
        <DropdownMenuItem onClick={() => demoPrinted()}><Printer className="size-4" /><L>Print</L></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function VotersList() {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [sortColumn, setSortColumn] = React.useState<string>();
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);
  const [loading, setLoading] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [filters, setFilters] = React.useState<VoterFilters>(defaultFilters);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [addVoterOpen, setAddVoterOpen] = React.useState(false);
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(
    new Set(["voterId", "name", "age", "gender", "mobile", "ward", "booth", "area", "houseNo", "familyId", "partyInclination", "surveyStatus", "lastContact", "actions"])
  );

  const activeFilterCount =
    filters.wards.length + filters.booths.length + filters.areas.length +
    filters.genders.length + filters.partyInclinations.length + filters.surveyStatuses.length + filters.ageGroups.length;

  const filtered = React.useMemo(() => {
    let result = applyVoterFilters(voters, filters);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.voterId.toLowerCase().includes(q) ||
          v.name.toLowerCase().includes(q) ||
          v.mobile.includes(q) ||
          v.familyId.toLowerCase().includes(q) ||
          v.ward.toLowerCase().includes(q) ||
          v.booth.toLowerCase().includes(q)
      );
    }
    if (sortColumn && sortDirection) {
      result = [...result].sort((a, b) => {
        if (sortColumn === "age") return sortDirection === "asc" ? a.age - b.age : b.age - a.age;
        const aVal = String(a[sortColumn as keyof Voter] ?? "");
        const bVal = String(b[sortColumn as keyof Voter] ?? "");
        return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    }
    return result;
  }, [search, sortColumn, sortDirection, filters]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns: DataTableColumn<Voter>[] = [
    { id: "voterId", header: "Voter ID", sortable: true, cell: (row) => <span className="font-mono text-xs text-accent-primary">{row.voterId}</span> },
    {
      id: "name",
      header: "Name",
      sortable: true,
      cell: (row) => row.personId ? (
        <Link href={`/people/${row.personId}`} className="font-medium hover:text-accent-primary transition-colors">{row.name}</Link>
      ) : <span className="font-medium">{row.name}</span>,
    },
    { id: "age", header: "Age", sortable: true, hideOnMobile: true, cell: (row) => row.age },
    { id: "gender", header: "Gender", accessorKey: "gender", hideOnMobile: true, cell: (row) => <span className="capitalize">{row.gender}</span> },
    { id: "mobile", header: "Mobile", accessorKey: "mobile", hideOnMobile: true },
    { id: "ward", header: "Ward", accessorKey: "ward", sortable: true, hideOnMobile: true },
    { id: "booth", header: "Booth", accessorKey: "booth", hideOnMobile: true },
    { id: "area", header: "Area", accessorKey: "area", hideOnMobile: true },
    { id: "houseNo", header: "House No", accessorKey: "houseNo", hideOnMobile: true },
    { id: "familyId", header: "Family ID", accessorKey: "familyId", hideOnMobile: true, cell: (row) => <span className="font-mono text-xs">{row.familyId}</span> },
    {
      id: "partyInclination",
      header: "Party Inclination",
      hideOnMobile: true,
      cell: (row) => <LBadge variant={getPartyInclinationVariant(row.partyInclination)}>{row.partyInclination}</LBadge>,
    },
    {
      id: "surveyStatus",
      header: "Survey Status",
      cell: (row) => <LBadge variant={getSurveyStatusVariant(row.surveyStatus)}>{row.surveyStatus}</LBadge>,
    },
    {
      id: "lastContact",
      header: "Last Contact",
      hideOnMobile: true,
      cell: (row) => row.lastContact ? formatVIDate(row.lastContact) : <span className="text-text-muted">—</span>,
    },
    { id: "actions", header: "", className: "w-12", cell: (row) => <RowActions row={row} /> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Voter Intelligence", href: "/voter-intelligence" }, { label: "Voters" }]} className="md:hidden" />
      <PageHeader
        title="Master Voter Directory"
        description="Complete voter registry linked to People records where applicable — searchable with advanced filters."
        actions={<Button onClick={() => setAddVoterOpen(true)}><Plus className="size-4" /><L>Add Voter</L></Button>}
      />

      <DataTable
        columns={columns}
        data={paginated}
        loading={loading}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search by voter ID, name, mobile, family ID..."
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={(col) => {
          if (sortColumn === col) setSortDirection((d) => d === "asc" ? "desc" : d === "desc" ? null : "asc");
          else { setSortColumn(col); setSortDirection("asc"); }
        }}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={setVisibleColumns}
        page={page}
        pageSize={pageSize}
        totalItems={filtered.length}
        onPageChange={setPage}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        bulkActions={
          selectedIds.size > 0 ? (
            <>
              <Button variant="outline" size="sm" onClick={() => demoAssigned("Action")}><L>Assign Survey</L></Button>
              <Button variant="outline" size="sm" onClick={() => demoExported("File")}><Download className="size-4" /><L>Export</L></Button>
              <Button variant="outline" size="sm" onClick={() => demoSuccess("Removed successfully.")}><Trash2 className="size-4" /><L>Delete</L></Button>
            </>
          ) : undefined
        }
        toolbarActions={
          <>
            <VoterFiltersDrawer filters={filters} onFiltersChange={(f) => { setFilters(f); setPage(1); }} activeCount={activeFilterCount} open={filtersOpen} onOpenChange={setFiltersOpen} />
            <Button variant="outline" size="sm" onClick={() => demoImported()}><Upload className="size-4" /><span className="hidden sm:inline"><L>Import</L></span></Button>
            <Button variant="outline" size="sm" onClick={() => demoExported("File")}><Download className="size-4" /><span className="hidden sm:inline"><L>Export</L></span></Button>
            <Button variant="outline" size="sm" onClick={() => demoPrinted()}><Printer className="size-4" /><span className="hidden sm:inline"><L>Print</L></span></Button>
            <Button variant="outline" size="sm" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 600); }}><RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /></Button>
          </>
        }
        cardRenderer={(row) => (
          <DataTableCard
            title={row.name}
            subtitle={`${row.voterId} · ${row.booth} · ${row.ward.split("—")[0]?.trim()}`}
            badge={<LBadge variant={getSurveyStatusVariant(row.surveyStatus)}>{row.surveyStatus}</LBadge>}
            meta={<><span><L>Age</L> {row.age}</span><span>{row.partyInclination}</span></>}
            actions={<RowActions row={row} />}
          />
        )}
      />
      <AddVoterDialog open={addVoterOpen} onOpenChange={setAddVoterOpen} />
    </div>
  );
}
