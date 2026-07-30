"use client";

import * as React from "react";
import { demoSuccess, demoExported, demoImported, demoPrinted, demoAssigned, demoWhatsAppSent, demoSaved, demoDeleted } from "@/lib/demo";
import { Plus, FileText, Download, MoreHorizontal, Eye } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/data-table/data-table";
import { pressNotes } from "@/modules/office-desk/data/office-data";
import { formatOfficeDate } from "@/modules/office-desk/lib/utils";
import type { PressNote } from "@/modules/office-desk/types";

const statusMap: Record<PressNote["status"], { label: string; status: "active" | "pending" | "inactive" }> = {
  published: { label: "Published", status: "active" },
  draft: { label: "Draft", status: "pending" },
  archived: { label: "Archived", status: "inactive" },
};

export function PressNotesList() {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);

  const filtered = pressNotes.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.createdBy.toLowerCase().includes(q);
  });

  const paginated = filtered.slice((page - 1) * 10, page * 10);

  const columns: DataTableColumn<PressNote>[] = [
    {
      id: "title",
      header: "Title",
      cell: (row) => <span className="font-medium text-text-primary">{row.title}</span>,
    },
    { id: "category", header: "Category", accessorKey: "category" },
    { id: "createdBy", header: "Created By", accessorKey: "createdBy", hideOnMobile: true },
    {
      id: "date",
      header: "Date",
      hideOnMobile: true,
      cell: (row) => <span className="text-text-secondary text-[13px]">{formatOfficeDate(row.date)}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <StatusBadge label={statusMap[row.status].label} status={statusMap[row.status].status} />
      ),
    },
    {
      id: "attachment",
      header: "Attachment",
      hideOnMobile: true,
      cell: (row) => row.attachment ? (
        <Badge variant="outline" className="gap-1"><FileText className="size-3" />{row.attachment}</Badge>
      ) : <span className="text-text-muted">—</span>,
    },
    {
      id: "actions",
      header: "",
      className: "w-12",
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm"><MoreHorizontal className="size-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => demoSuccess("Action completed successfully.")}><Eye className="size-4" />View</DropdownMenuItem>
            <DropdownMenuItem onClick={() => demoSuccess("Action completed successfully.")}><Download className="size-4" />Download</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Office Desk", href: "/office-desk" }, { label: "Press Notes" }]} className="md:hidden" />
      <PageHeader
        title="Press Notes"
        description="Repository of press releases, statements, media advisories, and official communications."
        actions={<Button onClick={() => demoSuccess("Action completed successfully.")}><Plus className="size-4" />New Press Note</Button>}
      />
      <DataTable
        columns={columns}
        data={paginated}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search press notes..."
        page={page}
        pageSize={10}
        totalItems={filtered.length}
        onPageChange={setPage}
        toolbarActions={
          <Button variant="outline" size="sm" onClick={() => demoExported("File")}><Download className="size-4" />Export</Button>
        }
      />
    </div>
  );
}
