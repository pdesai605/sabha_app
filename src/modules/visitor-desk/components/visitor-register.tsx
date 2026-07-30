"use client";

import * as React from "react";
import { demoSuccess, demoExported, demoImported, demoPrinted, demoAssigned, demoWhatsAppSent, demoSaved, demoDeleted } from "@/lib/demo";
import Link from "next/link";
import {
  Download,
  Eye,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Plus,
  Printer,
  RefreshCw,
  SlidersHorizontal,
  User,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DataTable,
  DataTableCard,
  type DataTableColumn,
  type SortDirection,
} from "@/components/data-table/data-table";
import type { VisitWithPerson } from "@/modules/visitor-desk/lib/utils";
import { defaultVisitorDeskFilters } from "@/modules/visitor-desk/types";
import { visits, VISITOR_DESK_TODAY } from "@/modules/visitor-desk/data/visits";
import {
  STATUS_LABELS,
  VISITOR_TYPE_LABELS,
} from "@/modules/visitor-desk/constants";
import {
  enrichVisits,
  formatVisitDate,
  formatVisitTime,
  getWhatsAppUrl,
  getVisitStatusVariant,
} from "@/modules/visitor-desk/lib/utils";

const allColumns = [
  "token", "person", "mobile", "purpose", "visitorType",
  "staff", "visitDate", "status", "actions",
];

interface VisitorRegisterProps {
  title?: string;
  description?: string;
  filterToday?: boolean;
  breadcrumbExtra?: { label: string; href?: string };
}

function RowActions({ visit }: { visit: VisitWithPerson }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Row actions">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href={`/visitor-desk/${visit.id}`}>
            <Eye className="size-4" />
            Open Visit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/people/${visit.personId}`}>
            <User className="size-4" />
            Open Person
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/visitor-desk/${visit.id}/edit`}>
            <Pencil className="size-4" />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => demoPrinted()}>
          <Printer className="size-4" />
          Print Slip
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={getWhatsAppUrl(visit.whatsapp)} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4" />
            WhatsApp
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-semantic-danger focus:text-semantic-danger"
          onClick={() => demoSuccess("Action completed successfully.")}
        >
          Cancel Visit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function VisitorRegister({
  title = "Visitor Register",
  description = "Complete register of all citizen visits to the office.",
  filterToday = false,
  breadcrumbExtra,
}: VisitorRegisterProps) {
  const baseVisits = React.useMemo(() => {
    const raw = filterToday
      ? visits.filter((v) => v.visitDate === VISITOR_DESK_TODAY)
      : visits;
    return enrichVisits(raw);
  }, [filterToday]);

  const [search, setSearch] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(allColumns));
  const [sortColumn, setSortColumn] = React.useState<string>();
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [loading, setLoading] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<string[]>([]);

  const filtered = React.useMemo(() => {
    let result = baseVisits;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.token.toLowerCase().includes(q) ||
          v.fullName.toLowerCase().includes(q) ||
          v.mobile.includes(q) ||
          v.purpose.toLowerCase().includes(q) ||
          v.assignedStaff.toLowerCase().includes(q)
      );
    }
    if (statusFilter.length) {
      result = result.filter((v) => statusFilter.includes(v.status));
    }
    if (sortColumn && sortDirection) {
      result = [...result].sort((a, b) => {
        const aVal = String(a[sortColumn as keyof VisitWithPerson] ?? "");
        const bVal = String(b[sortColumn as keyof VisitWithPerson] ?? "");
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [baseVisits, search, statusFilter, sortColumn, sortDirection]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"));
      if (sortDirection === "desc") setSortColumn(undefined);
    } else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  const columns: DataTableColumn<VisitWithPerson>[] = [
    {
      id: "token",
      header: "Token",
      sortable: true,
      cell: (row) => (
        <Link
          href={`/visitor-desk/${row.id}`}
          className="font-mono text-xs font-medium text-accent-primary hover:underline"
        >
          {row.token}
        </Link>
      ),
    },
    {
      id: "person",
      header: "Person",
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar size="sm">
            <AvatarFallback>{row.initials}</AvatarFallback>
          </Avatar>
          <Link
            href={`/people/${row.personId}`}
            className="font-medium text-text-primary hover:text-accent-primary transition-colors"
          >
            {row.fullName}
          </Link>
        </div>
      ),
    },
    {
      id: "mobile",
      header: "Mobile",
      accessorKey: "mobile",
      hideOnMobile: true,
    },
    {
      id: "purpose",
      header: "Purpose",
      accessorKey: "purpose",
      sortable: true,
    },
    {
      id: "visitorType",
      header: "Visitor Type",
      hideOnMobile: true,
      cell: (row) => (
        <Badge variant="outline">{VISITOR_TYPE_LABELS[row.visitorType]}</Badge>
      ),
    },
    {
      id: "staff",
      header: "Staff Assigned",
      accessorKey: "assignedStaff",
      hideOnMobile: true,
    },
    {
      id: "visitDate",
      header: "Visit Date",
      sortable: true,
      hideOnMobile: true,
      cell: (row) => (
        <span className="text-text-secondary text-[13px]">
          {formatVisitDate(row.visitDate)} · {formatVisitTime(row.visitTime)}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      cell: (row) => (
        <StatusBadge
          label={STATUS_LABELS[row.status]}
          status={getVisitStatusVariant(row.status)}
        />
      ),
    },
    {
      id: "actions",
      header: "",
      className: "w-12",
      cell: (row) => <RowActions visit={row} />,
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Visitor Desk", href: "/visitor-desk" },
          ...(breadcrumbExtra ? [breadcrumbExtra] : [{ label: title }]),
        ]}
        className="md:hidden"
      />

      <PageHeader
        title={title}
        description={description}
        actions={
          <Link href="/visitor-desk/new">
            <Button>
              <Plus className="size-4" />
              Add Visitor
            </Button>
          </Link>
        }
      />

      <DataTable
        columns={columns}
        data={paginated}
        loading={loading}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search by token, name, mobile, purpose..."
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
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        bulkActions={
          <>
            <Button variant="outline" size="sm" onClick={() => demoExported("File")}>
              <Download className="size-3.5" /> Export
            </Button>
            <Button variant="outline" size="sm" onClick={() => demoPrinted()}>
              <Printer className="size-3.5" /> Print
            </Button>
          </>
        }
        toolbarActions={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <SlidersHorizontal className="size-4" />
                  Status
                  {statusFilter.length > 0 && (
                    <span className="ml-1 rounded-full bg-accent-primary-muted px-1.5 text-xs text-accent-primary">
                      {statusFilter.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => {
                      setStatusFilter((prev) =>
                        prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
                      );
                      setPage(1);
                    }}
                  >
                    <span className={statusFilter.includes(key) ? "font-medium text-accent-primary" : ""}>
                      {label}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={() => demoExported("File")}>
              <Download className="size-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setLoading(true);
                setTimeout(() => { setLoading(false); toast.success("Refreshed"); }, 600);
              }}
            >
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </>
        }
        cardRenderer={(row) => (
          <DataTableCard
            title={row.fullName}
            subtitle={`${row.token} · ${row.purpose}`}
            badge={
              <StatusBadge
                label={STATUS_LABELS[row.status]}
                status={getVisitStatusVariant(row.status)}
              />
            }
            meta={
              <>
                <span>{formatVisitTime(row.visitTime)}</span>
                <span>{row.assignedStaff}</span>
              </>
            }
            selected={selectedIds.has(row.id)}
            onSelect={() => {
              const next = new Set(selectedIds);
              if (next.has(row.id)) next.delete(row.id);
              else next.add(row.id);
              setSelectedIds(next);
            }}
            actions={<RowActions visit={row} />}
          />
        )}
      />
    </div>
  );
}
