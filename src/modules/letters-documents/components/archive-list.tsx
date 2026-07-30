"use client";

import * as React from "react";
import { useTranslation } from "@/lib/i18n/context";
import { getArchivedDocuments } from "@/lib/i18n/localized-demo-data";
import { demoSuccess, demoExported, demoImported, demoPrinted, demoAssigned, demoWhatsAppSent, demoSaved, demoDeleted } from "@/lib/demo";
import { LayoutGrid, List, Download } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchBar } from "@/components/ui/search-bar";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/data-table/data-table";
import { formatLetterDate } from "@/modules/letters-documents/lib/utils";
import { GOVT_DEPARTMENTS } from "@/modules/letters-documents/constants";
import type { ArchivedDocument } from "@/modules/letters-documents/types";

type ViewMode = "cards" | "table";

const YEARS = [2026, 2025, 2024, 2023, 2022];

export function ArchiveList() {
  const { locale } = useTranslation();
  const archivedDocuments = React.useMemo(() => getArchivedDocuments(locale), [locale]);
  const [view, setView] = React.useState<ViewMode>("cards");
  const [search, setSearch] = React.useState("");
  const [year, setYear] = React.useState<number | "all">("all");
  const [department, setDepartment] = React.useState<string | "all">("all");
  const [page, setPage] = React.useState(1);

  const filtered = archivedDocuments.filter((d) => {
    if (year !== "all" && d.year !== year) return false;
    if (department !== "all" && d.department !== department) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return d.documentId.toLowerCase().includes(q) || d.title.toLowerCase().includes(q) || d.category.toLowerCase().includes(q);
  });

  const paginated = filtered.slice((page - 1) * 10, page * 10);

  const columns: DataTableColumn<ArchivedDocument>[] = [
    { id: "documentId", header: "Document ID", cell: (row) => <span className="font-mono text-xs text-accent-primary">{row.documentId}</span> },
    { id: "title", header: "Title", cell: (row) => <span className="font-medium truncate max-w-[250px] block">{row.title}</span> },
    { id: "department", header: "Department", accessorKey: "department", hideOnMobile: true },
    { id: "category", header: "Category", cell: (row) => <Badge variant="outline">{row.category}</Badge> },
    { id: "year", header: "Year", cell: (row) => row.year },
    { id: "archivedDate", header: "Archived", hideOnMobile: true, cell: (row) => formatLetterDate(row.archivedDate) },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Badge variant={row.status === "active" ? "success" : row.status === "restricted" ? "warning" : "default"}>{row.status}</Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Letters & Documents", href: "/letters-documents" }, { label: "Archive" }]} className="md:hidden" />
      <PageHeader
        title="Archive"
        description="Searchable document repository — archived letters, files, and official records."
        actions={<Button variant="outline" onClick={() => demoExported("File")}><Download className="size-4" />Export</Button>}
      />

      <SearchBar value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} onClear={() => setSearch("")} placeholder="Search archived documents..." containerClassName="sm:max-w-md" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
          <TabsList>
            <TabsTrigger value="cards"><LayoutGrid className="size-4 mr-1.5" />Cards</TabsTrigger>
            <TabsTrigger value="table"><List className="size-4 mr-1.5" />Table</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-wrap gap-2">
          <Button variant={year === "all" ? "secondary" : "ghost"} size="sm" onClick={() => { setYear("all"); setPage(1); }}>All Years</Button>
          {YEARS.map((y) => (
            <Button key={y} variant={year === y ? "secondary" : "ghost"} size="sm" onClick={() => { setYear(y); setPage(1); }}>{y}</Button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant={department === "all" ? "secondary" : "ghost"} size="sm" onClick={() => { setDepartment("all"); setPage(1); }}>All Departments</Button>
        {GOVT_DEPARTMENTS.slice(0, 6).map((dept) => (
          <Button key={dept} variant={department === dept ? "secondary" : "ghost"} size="sm" onClick={() => { setDepartment(dept); setPage(1); }} className="text-xs">{dept.split("—")[0]?.trim()}</Button>
        ))}
      </div>

      {view === "cards" ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.slice(0, 60).map((d) => (
            <Card key={d.id} className="cursor-pointer hover:border-border-default transition-colors" onClick={() => demoSuccess("Action completed successfully.")}>
              <CardContent className="p-4">
                <p className="font-mono text-xs text-accent-primary">{d.documentId}</p>
                <p className="text-sm font-medium text-text-primary mt-1 line-clamp-2">{d.title}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="text-[10px]">{d.category}</Badge>
                  <Badge variant="outline" className="text-[10px]">{d.year}</Badge>
                  <Badge variant={d.status === "active" ? "success" : d.status === "restricted" ? "warning" : "default"} className="text-[10px]">{d.status}</Badge>
                </div>
                <p className="text-xs text-text-muted mt-2">{d.department.split("—")[0]?.trim()} · Archived {formatLetterDate(d.archivedDate)}</p>
              </CardContent>
            </Card>
          ))}
          {filtered.length > 60 && <p className="text-sm text-text-muted col-span-full text-center py-4">Showing 60 of {filtered.length} — switch to table view for full list</p>}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={paginated}
          page={page}
          pageSize={10}
          totalItems={filtered.length}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
