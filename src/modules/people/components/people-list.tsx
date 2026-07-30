"use client";

import * as React from "react";
import Link from "next/link";
import {
  Download,
  Eye,
  MessageCircle,
  Pencil,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  Trash2,
  Upload,
  Tag,
} from "lucide-react";
import { demoSuccess, demoExported, demoImported } from "@/lib/demo";
import { WhatsAppDialog } from "@/components/shared/whatsapp-dialog";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { ClientRelativeTime } from "@/components/shared/client-relative-time";
import { LBadge } from "@/components/shared/localized-badge";
import { L } from "@/components/shared/localized";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  DataTable,
  DataTableCard,
  type DataTableColumn,
  type SortDirection,
} from "@/components/data-table/data-table";
import { people } from "@/modules/people/data/people";
import type { Person } from "@/modules/people/types";
import { defaultPeopleFilters, type PeopleFilters } from "@/modules/people/types";
import {
  PeopleFiltersDrawer,
  applyPeopleFilters,
  countActiveFilters,
} from "@/modules/people/components/people-filters-drawer";
import {
  getStatusVariant,
  getPersonDisplayTags,
} from "@/modules/people/lib/utils";
const allColumns = [
  "profile",
  "fullName",
  "mobile",
  "area",
  "ward",
  "booth",
  "tags",
  "status",
  "lastActivity",
  "actions",
];

function RowActions({ person }: { person: Person }) {
  const [waOpen, setWaOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <>
      <div className="flex items-center gap-0.5">
        <Link href={`/people/${person.id}`}>
          <Button variant="ghost" size="icon-sm" aria-label="View"><Eye className="size-4" /></Button>
        </Link>
        <Link href={`/people/${person.id}/edit`}>
          <Button variant="ghost" size="icon-sm" aria-label="Edit"><Pencil className="size-4" /></Button>
        </Link>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="WhatsApp"
          onClick={() => setWaOpen(true)}
          className="text-[#25D366] hover:text-[#20BD5A] hover:bg-[#25D366]/10"
        >
          <MessageCircle className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Delete"
          onClick={() => setDeleteOpen(true)}
          className="text-semantic-danger hover:text-semantic-danger"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
      <WhatsAppDialog
        open={waOpen}
        onOpenChange={setWaOpen}
        recipient={person.fullName}
        mobile={person.mobile}
        defaultMessage={`Namaskar ${person.fullName.split(" ")[0]}, this is a message from the MLA Office.`}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        itemLabel={person.fullName}
      />
    </>
  );
}

function sortPeople(
  data: Person[],
  column: string | undefined,
  direction: SortDirection
): Person[] {
  if (!column || !direction) return data;
  return [...data].sort((a, b) => {
    let aVal: string | number = "";
    let bVal: string | number = "";
    switch (column) {
      case "fullName":
        aVal = a.fullName;
        bVal = b.fullName;
        break;
      case "mobile":
        aVal = a.mobile;
        bVal = b.mobile;
        break;
      case "area":
        aVal = a.area;
        bVal = b.area;
        break;
      case "ward":
        aVal = a.ward;
        bVal = b.ward;
        break;
      case "booth":
        aVal = a.booth;
        bVal = b.booth;
        break;
      case "status":
        aVal = a.status;
        bVal = b.status;
        break;
      case "lastActivity":
        aVal = new Date(a.lastActivity).getTime();
        bVal = new Date(b.lastActivity).getTime();
        break;
      default:
        return 0;
    }
    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

export function PeopleList() {
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState<PeopleFilters>(defaultPeopleFilters);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(allColumns));
  const [sortColumn, setSortColumn] = React.useState<string | undefined>();
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [loading, setLoading] = React.useState(false);

  const activeFilterCount = countActiveFilters(filters);

  const filtered = React.useMemo(() => {
    let result = applyPeopleFilters(people, filters);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.fullName.toLowerCase().includes(q) ||
          p.mobile.includes(q) ||
          p.area.toLowerCase().includes(q) ||
          p.ward.toLowerCase().includes(q) ||
          p.booth.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return sortPeople(result, sortColumn, sortDirection);
  }, [filters, search, sortColumn, sortDirection]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection((d) =>
        d === "asc" ? "desc" : d === "desc" ? null : "asc"
      );
      if (sortDirection === "desc") setSortColumn(undefined);
    } else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      demoSuccess("People list refreshed");
    }, 800);
  };

  const columns: DataTableColumn<Person>[] = [
    {
      id: "profile",
      header: "Profile",
      cell: (row) => (
        <Avatar size="sm">
          <AvatarFallback>{row.initials}</AvatarFallback>
        </Avatar>
      ),
      className: "w-12",
    },
    {
      id: "fullName",
      header: "Full Name",
      sortable: true,
      cell: (row) => (
        <Link
          href={`/people/${row.id}`}
          className="font-medium text-text-primary hover:text-accent-primary transition-colors"
        >
          {row.fullName}
        </Link>
      ),
    },
    {
      id: "mobile",
      header: "Mobile",
      accessorKey: "mobile",
      sortable: true,
    },
    {
      id: "area",
      header: "Area",
      accessorKey: "area",
      sortable: true,
      hideOnMobile: true,
    },
    {
      id: "ward",
      header: "Ward",
      accessorKey: "ward",
      sortable: true,
      hideOnMobile: true,
    },
    {
      id: "booth",
      header: "Booth",
      accessorKey: "booth",
      sortable: true,
      hideOnMobile: true,
    },
    {
      id: "tags",
      header: "Tags",
      hideOnMobile: true,
      cell: (row) => {
        const { visible, overflow } = getPersonDisplayTags(row);
        return (
          <div className="flex flex-wrap gap-1">
            {visible.map((tag) => (
              <LBadge key={tag} variant="outline" className="text-[11px]">
                {tag}
              </LBadge>
            ))}
            {overflow > 0 && (
              <Badge variant="default" className="text-[11px]">
                +{overflow}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      cell: (row) => (
        <StatusBadge
          label={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          status={getStatusVariant(row.status)}
        />
      ),
    },
    {
      id: "lastActivity",
      header: "Last Activity",
      sortable: true,
      hideOnMobile: true,
      cell: (row) => <ClientRelativeTime iso={row.lastActivity} />,
    },
    {
      id: "actions",
      header: "",
      className: "w-36",
      cell: (row) => <RowActions person={row} />,
    },
  ];

  const displayColumns = columns;

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "People" },
        ]}
        className="md:hidden mb-2"
      />

      <PageHeader
        title="People"
        description="Manage master profiles for everyone connected to your office — supporters, volunteers, contacts, and community leaders."
        actions={
          <Link href="/people/new">
            <Button>
              <Plus className="size-4" />
              <L>Add Person</L>
            </Button>
          </Link>
        }
      />

      <DataTable
        columns={displayColumns}
        data={paginated}
        loading={loading}
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="Search by name, mobile, area, ward, booth, or tags..."
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={setVisibleColumns}
        page={page}
        pageSize={pageSize}
        totalItems={filtered.length}
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
        bulkActions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => demoExported("People list")}
            >
              <Download className="size-3.5" />
              <L>Export</L>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => demoSuccess("Tags applied successfully.")}
            >
              <Tag className="size-3.5" />
              Tag
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => demoSuccess("Selected records removed successfully.")}
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          </>
        }
        toolbarActions={
          <>
            <PeopleFiltersDrawer
              filters={filters}
              onFiltersChange={(f) => {
                setFilters(f);
                setPage(1);
              }}
              activeCount={activeFilterCount}
              open={filtersOpen}
              onOpenChange={setFiltersOpen}
              trigger={
                <Button variant="outline" size="sm">
                  <SlidersHorizontal className="size-4" />
                  <L>Filters</L>
                  {activeFilterCount > 0 && (
                    <Badge variant="primary" className="ml-1 px-1.5 py-0">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              }
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => demoExported("People list")}
            >
              <Download className="size-4" />
              <span className="hidden sm:inline"><L>Export</L></span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => demoImported()}
            >
              <Upload className="size-4" />
              <span className="hidden sm:inline"><L>Import</L></span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline"><L>Refresh</L></span>
            </Button>
          </>
        }
        emptyTitle="No people found"
        emptyDescription="Try adjusting your search or filters, or add a new person to get started."
        cardRenderer={(row) => (
          <DataTableCard
            title={row.fullName}
            subtitle={`${row.area} · ${row.booth}`}
            badge={
              <StatusBadge
                label={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                status={getStatusVariant(row.status)}
              />
            }
            meta={
              <>
                <span>{row.mobile}</span>
                <ClientRelativeTime iso={row.lastActivity} />
              </>
            }
            selected={selectedIds.has(row.id)}
            onSelect={() => {
              const next = new Set(selectedIds);
              if (next.has(row.id)) next.delete(row.id);
              else next.add(row.id);
              setSelectedIds(next);
            }}
            actions={<RowActions person={row} />}
          />
        )}
      />
    </div>
  );
}
