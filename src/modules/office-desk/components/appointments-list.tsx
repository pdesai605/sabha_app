"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/context";
import { getAppointments } from "@/lib/i18n/localized-demo-data";
import Link from "next/link";
import { Plus, Eye, Pencil, MoreHorizontal, User, Download, RefreshCw, Printer } from "lucide-react";
import { demoExported, demoPrinted, demoSaved } from "@/lib/demo";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { APPOINTMENT_STATUS_LABELS } from "@/modules/office-desk/constants";
import {
  enrichAppointments,
  formatOfficeDate,
  formatTime,
  getAppointmentStatusVariant,
  type AppointmentWithPerson,
} from "@/modules/office-desk/lib/utils";
import { AppointmentCreateDialog } from "@/modules/office-desk/components/appointment-create-dialog";
import { AppointmentDetailDrawer } from "@/modules/office-desk/components/appointment-detail-drawer";

function RowActions({
  row,
  onView,
}: {
  row: AppointmentWithPerson;
  onView: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" onClick={(e) => e.stopPropagation()}><MoreHorizontal className="size-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(); }}><Eye className="size-4" /><L>View</L></DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(); }}><Pencil className="size-4" /><L>Edit</L></DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/people/${row.personId}`} onClick={(e) => e.stopPropagation()}><User className="size-4" /><L>Open Person</L></Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); demoPrinted(); }}><Printer className="size-4" /><L>Print</L></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppointmentsList() {
  const searchParams = useSearchParams();
  const { locale } = useTranslation();
  const appointments = React.useMemo(() => getAppointments(locale), [locale]);
  const base = React.useMemo(() => enrichAppointments(appointments), [appointments]);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [sortColumn, setSortColumn] = React.useState<string>();
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);
  const [loading, setLoading] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<AppointmentWithPerson | null>(null);

  const openDetail = (row: AppointmentWithPerson) => {
    setSelected(row);
    setDetailOpen(true);
  };

  React.useEffect(() => {
    const id = searchParams.get("id");
    if (!id) return;
    const match = base.find((a) => a.id === id);
    if (match) openDetail(match);
  }, [searchParams, base]);

  const filtered = React.useMemo(() => {
    let result = base;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.appointmentNo.toLowerCase().includes(q) ||
          a.fullName.toLowerCase().includes(q) ||
          a.purpose.toLowerCase().includes(q) ||
          a.meetingWith.toLowerCase().includes(q)
      );
    }
    if (sortColumn && sortDirection) {
      result = [...result].sort((a, b) => {
        const aVal = String(a[sortColumn as keyof AppointmentWithPerson] ?? "");
        const bVal = String(b[sortColumn as keyof AppointmentWithPerson] ?? "");
        return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    }
    return result;
  }, [base, search, sortColumn, sortDirection]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns: DataTableColumn<AppointmentWithPerson>[] = [
    {
      id: "appointmentNo",
      header: "Appointment No",
      sortable: true,
      cell: (row) => <span className="font-mono text-xs text-accent-primary">{row.appointmentNo}</span>,
    },
    {
      id: "person",
      header: "Person",
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Avatar size="sm"><AvatarFallback>{row.initials}</AvatarFallback></Avatar>
          <Link href={`/people/${row.personId}`} className="font-medium hover:text-accent-primary transition-colors" onClick={(e) => e.stopPropagation()}>{row.fullName}</Link>
        </div>
      ),
    },
    { id: "purpose", header: "Purpose", accessorKey: "purpose", sortable: true },
    { id: "meetingWith", header: "Meeting With", accessorKey: "meetingWith", hideOnMobile: true },
    {
      id: "date",
      header: "Date",
      sortable: true,
      hideOnMobile: true,
      cell: (row) => <span className="text-text-secondary text-[13px]">{formatOfficeDate(row.date)}</span>,
    },
    {
      id: "time",
      header: "Time",
      hideOnMobile: true,
      cell: (row) => formatTime(row.time),
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <StatusBadge label={APPOINTMENT_STATUS_LABELS[row.status]} status={getAppointmentStatusVariant(row.status)} />
      ),
    },
    { id: "actions", header: "", className: "w-12", cell: (row) => <RowActions row={row} onView={() => openDetail(row)} /> },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Office Desk", href: "/office-desk" }, { label: "Appointments" }]} className="md:hidden" />
      <PageHeader
        title="Appointments"
        description="Scheduled meetings with citizens and stakeholders. Each appointment links to an existing person."
        actions={<Button onClick={() => setCreateOpen(true)}><Plus className="size-4" /><L>New Appointment</L></Button>}
      />
      <DataTable
        columns={columns}
        data={paginated}
        loading={loading}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search by appointment no, name, purpose..."
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
        onRowClick={openDetail}
        toolbarActions={
          <>
            <Button variant="outline" size="sm" onClick={() => demoExported("File")}><Download className="size-4" /><span className="hidden sm:inline"><L>Export</L></span></Button>
            <Button variant="outline" size="sm" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 600); }}><RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /></Button>
          </>
        }
        cardRenderer={(row) => (
          <DataTableCard
            title={row.fullName}
            subtitle={`${row.appointmentNo} · ${row.purpose}`}
            badge={<StatusBadge label={APPOINTMENT_STATUS_LABELS[row.status]} status={getAppointmentStatusVariant(row.status)} />}
            meta={<><span>{formatOfficeDate(row.date)}</span><span>{formatTime(row.time)}</span></>}
            actions={<RowActions row={row} onView={() => openDetail(row)} />}
            onClick={() => openDetail(row)}
          />
        )}
      />
      <AppointmentCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
      <AppointmentDetailDrawer appointment={selected} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  );
}
