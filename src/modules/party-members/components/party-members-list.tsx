"use client";

import * as React from "react";
import Link from "next/link";
import {
  Download,
  Eye,
  MessageCircle,
  Pencil,
  Plus,
  Printer,
  RefreshCw,
  ArrowRightLeft,
  SlidersHorizontal,
  Trash2,
  Upload,
  Tag,
  Send,
  MessageSquare,
  Users,
} from "lucide-react";
import { demoSuccess, demoExported, demoImported, demoPrinted, demoAssigned, demoWhatsAppSent } from "@/lib/demo";
import { L } from "@/components/shared/localized";
import { WhatsAppDialog } from "@/components/shared/whatsapp-dialog";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  DataTable,
  DataTableCard,
  type DataTableColumn,
  type SortDirection,
} from "@/components/data-table/data-table";
import type { OrganizationType, PartyMemberWithPerson } from "@/modules/party-members/types";
import { defaultPartyMembersFilters } from "@/modules/party-members/types";
import { useTranslation } from "@/lib/i18n/context";
import { getPartyMembers, getMembersByOrg } from "@/lib/i18n/localized-demo-data";
import { ORGANIZATION_LABELS } from "@/modules/party-members/constants";
import {
  PartyMembersFiltersDrawer,
  applyPartyMemberFilters,
  countPartyMemberFilters,
} from "@/modules/party-members/components/party-members-filters-drawer";
import { TransferMemberDialog } from "@/modules/party-members/components/transfer-member-dialog";
import {
  enrichMembers,
  formatJoiningDate,
  getMemberStatusVariant,
} from "@/modules/party-members/lib/utils";

const allColumns = [
  "profile", "name", "designation", "ward", "booth", "area",
  "mobile", "joiningDate", "status", "actions",
];

interface PartyMembersListProps {
  organizationType?: OrganizationType;
  title?: string;
  description?: string;
}

function RowActions({
  member,
  onTransfer,
}: {
  member: PartyMemberWithPerson;
  onTransfer: (member: PartyMemberWithPerson) => void;
}) {
  const [waOpen, setWaOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <>
      <div className="flex items-center gap-0.5">
        <Link href={`/people/${member.personId}`}>
          <Button variant="ghost" size="icon-sm" aria-label="View"><Eye className="size-4" /></Button>
        </Link>
        <Link href={`/party-members/${member.id}/edit`}>
          <Button variant="ghost" size="icon-sm" aria-label="Edit"><Pencil className="size-4" /></Button>
        </Link>
        <Button variant="ghost" size="icon-sm" aria-label="Transfer" onClick={() => onTransfer(member)}>
          <ArrowRightLeft className="size-4" />
        </Button>
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
        recipient={member.fullName}
        mobile={member.mobile}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Remove Assignment"
        description={`Remove ${member.fullName}'s party assignment? The person profile will remain.`}
        itemLabel="Assignment"
      />
    </>
  );
}

export function PartyMembersList({
  organizationType,
  title,
  description,
}: PartyMembersListProps) {
  const orgLabel = organizationType
    ? ORGANIZATION_LABELS[organizationType]
    : "Party Members";

  const { locale } = useTranslation();

  const baseMembers = React.useMemo(() => {
    const raw = organizationType
      ? getMembersByOrg(organizationType, locale)
      : getPartyMembers(locale);
    return enrichMembers(raw, locale);
  }, [organizationType, locale]);

  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState(defaultPartyMembersFilters);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(allColumns));
  const [sortColumn, setSortColumn] = React.useState<string>();
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [loading, setLoading] = React.useState(false);
  const [transferMember, setTransferMember] = React.useState<PartyMemberWithPerson | null>(null);

  const activeFilterCount = countPartyMemberFilters(filters);

  const filtered = React.useMemo(() => {
    let result = applyPartyMemberFilters(baseMembers, filters);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.fullName.toLowerCase().includes(q) ||
          m.mobile.includes(q) ||
          m.designation.toLowerCase().includes(q) ||
          m.ward.toLowerCase().includes(q) ||
          m.booth.toLowerCase().includes(q) ||
          m.area.toLowerCase().includes(q)
      );
    }
    if (sortColumn && sortDirection) {
      result = [...result].sort((a, b) => {
        const key = sortColumn as keyof PartyMemberWithPerson;
        const aVal = a[key] ?? "";
        const bVal = b[key] ?? "";
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [baseMembers, filters, search, sortColumn, sortDirection]);

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

  const columns: DataTableColumn<PartyMemberWithPerson>[] = [
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
      id: "name",
      header: "Name",
      sortable: true,
      cell: (row) => (
        <Link
          href={`/people/${row.personId}`}
          className="font-medium text-text-primary hover:text-accent-primary transition-colors"
        >
          {row.fullName}
        </Link>
      ),
    },
    {
      id: "designation",
      header: "Designation",
      accessorKey: "designation",
      sortable: true,
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
      hideOnMobile: true,
    },
    {
      id: "area",
      header: "Area",
      accessorKey: "area",
      hideOnMobile: true,
    },
    {
      id: "mobile",
      header: "Mobile",
      accessorKey: "mobile",
      hideOnMobile: true,
    },
    {
      id: "joiningDate",
      header: "Joining Date",
      sortable: true,
      hideOnMobile: true,
      cell: (row) => (
        <span className="text-text-secondary text-[13px]">
          {formatJoiningDate(row.joiningDate)}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      sortable: true,
      cell: (row) => (
        <StatusBadge
          label={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          status={getMemberStatusVariant(row.status)}
        />
      ),
    },
    {
      id: "actions",
      header: "",
      className: "w-40",
      cell: (row) => (
        <RowActions member={row} onTransfer={setTransferMember} />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Party Members", href: "/party-members" },
          ...(organizationType ? [{ label: orgLabel }] : []),
        ]}
        className="md:hidden"
      />

      <PageHeader
        title={title ?? orgLabel}
        description={
          description ??
          `Manage ${orgLabel.toLowerCase()} members across wards, booths, and designations.`
        }
        actions={
          <Link href={`/party-members/new${organizationType ? `?org=${organizationType}` : ""}`}>
            <Button>
              <Plus className="size-4" />
              <L>Add Member</L>
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
        searchPlaceholder="Search by name, mobile, designation, ward..."
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
            <Button variant="outline" size="sm" onClick={demoWhatsAppSent}><Send className="size-3.5" /> <L>WhatsApp</L></Button>
            <Button variant="outline" size="sm" onClick={() => demoSuccess("SMS sent successfully.")}><MessageSquare className="size-3.5" /> <L>SMS</L></Button>
            <Button variant="outline" size="sm" onClick={() => demoAssigned("Committee assignment")}><Users className="size-3.5" /> <L>Committee</L></Button>
            <Button variant="outline" size="sm" onClick={() => demoSuccess("Tags applied successfully.")}><Tag className="size-3.5" /> <L>Tags</L></Button>
            <Button variant="outline" size="sm" onClick={() => demoExported("Members list")}><Download className="size-3.5" /> <L>Export</L></Button>
            <Button variant="outline" size="sm" onClick={demoPrinted}><Printer className="size-3.5" /> <L>Print</L></Button>
            <Button variant="outline" size="sm" onClick={() => demoAssigned("Transfer")}><ArrowRightLeft className="size-3.5" /> <L>Transfer</L></Button>
            <Button variant="danger" size="sm" onClick={() => demoSuccess("Selected members removed successfully.")}><Trash2 className="size-3.5" /> <L>Remove</L></Button>
          </>
        }
        toolbarActions={
          <>
            <PartyMembersFiltersDrawer
              filters={filters}
              onFiltersChange={(f) => { setFilters(f); setPage(1); }}
              activeCount={activeFilterCount}
              open={filtersOpen}
              onOpenChange={setFiltersOpen}
              trigger={
                <Button variant="outline" size="sm">
                  <SlidersHorizontal className="size-4" />
                  <L>Filters</L>
                  {activeFilterCount > 0 && (
                    <span className="ml-1 rounded-full bg-accent-primary-muted px-1.5 text-xs text-accent-primary">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              }
            />
            <Button variant="outline" size="sm" onClick={() => demoExported("File")}>
              <Download className="size-4" />
              <span className="hidden sm:inline"><L>Export</L></span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => demoImported()}>
              <Upload className="size-4" />
              <span className="hidden sm:inline"><L>Import</L></span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setLoading(true);
                setTimeout(() => { setLoading(false); demoSuccess("Refreshed"); }, 600);
              }}
            >
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline"><L>Refresh</L></span>
            </Button>
          </>
        }
        cardRenderer={(row) => (
          <DataTableCard
            title={row.fullName}
            subtitle={`${row.designation} · ${row.ward}`}
            badge={
              <StatusBadge
                label={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                status={getMemberStatusVariant(row.status)}
              />
            }
            meta={<><span>{row.mobile}</span><span>{formatJoiningDate(row.joiningDate)}</span></>}
            selected={selectedIds.has(row.id)}
            onSelect={() => {
              const next = new Set(selectedIds);
              if (next.has(row.id)) next.delete(row.id);
              else next.add(row.id);
              setSelectedIds(next);
            }}
            actions={<RowActions member={row} onTransfer={setTransferMember} />}
          />
        )}
      />

      <TransferMemberDialog
        member={transferMember}
        open={!!transferMember}
        onOpenChange={(open) => !open && setTransferMember(null)}
      />
    </div>
  );
}
