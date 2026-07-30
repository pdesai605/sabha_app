"use client";

import * as React from "react";
import { demoSuccess, demoSaved } from "@/lib/demo";
import { Plus, LayoutGrid, List, Copy, Eye, Pencil, Archive } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/data-table/data-table";
import { DocumentEditorDialog } from "@/components/documents/document-editor-dialog";
import { letterTemplates } from "@/modules/letters-documents/data/letters-data";
import { formatLetterDate } from "@/modules/letters-documents/lib/utils";
import { TEMPLATE_CATEGORIES } from "@/modules/letters-documents/constants";
import type { LetterTemplate, TemplateCategory } from "@/modules/letters-documents/types";

type ViewMode = "cards" | "table";

export function LetterTemplatesList() {
  const [view, setView] = React.useState<ViewMode>("cards");
  const [category, setCategory] = React.useState<TemplateCategory | "all">("all");
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editorTitle, setEditorTitle] = React.useState("Document Editor");
  const [editorMode, setEditorMode] = React.useState<"template" | "draft">("draft");

  const openEditor = (name: string, mode: "template" | "draft" = "draft") => {
    setEditorTitle(name);
    setEditorMode(mode);
    setEditorOpen(true);
  };

  const filtered = letterTemplates.filter((t) => {
    if (t.isArchived) return false;
    if (category !== "all" && t.category !== category) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
  });

  const paginated = filtered.slice((page - 1) * 10, page * 10);

  const columns: DataTableColumn<LetterTemplate>[] = [
    { id: "name", header: "Template Name", cell: (row) => <span className="font-medium">{row.name}</span> },
    { id: "category", header: "Category", cell: (row) => <Badge variant="outline">{row.category}</Badge> },
    { id: "description", header: "Description", accessorKey: "description", hideOnMobile: true },
    { id: "usageCount", header: "Usage", cell: (row) => row.usageCount },
    { id: "lastUsed", header: "Last Used", hideOnMobile: true, cell: (row) => row.lastUsed ? formatLetterDate(row.lastUsed) : <span className="text-text-muted">—</span> },
    {
      id: "actions",
      header: "",
      cell: (row) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => openEditor(row.name)}><Eye className="size-4" /></Button>
          <Button variant="ghost" size="icon-sm" onClick={() => { openEditor(`${row.name} (Copy)`); demoSuccess("Template duplicated successfully."); }}><Copy className="size-4" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Letters & Documents", href: "/letters-documents" }, { label: "Templates" }]} className="md:hidden" />
      <PageHeader
        title="Letter Templates"
        description="Standard letter formats — official letters, acknowledgements, approvals, invitations, and more."
        actions={<Button onClick={() => openEditor("New Template", "template")}><Plus className="size-4" />Create Template</Button>}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
          <TabsList>
            <TabsTrigger value="cards"><LayoutGrid className="size-4 mr-1.5" />Cards</TabsTrigger>
            <TabsTrigger value="table"><List className="size-4 mr-1.5" />Table</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-wrap gap-2">
          <Button variant={category === "all" ? "secondary" : "ghost"} size="sm" onClick={() => setCategory("all")}>All</Button>
          {TEMPLATE_CATEGORIES.map((cat) => (
            <Button key={cat} variant={category === cat ? "secondary" : "ghost"} size="sm" onClick={() => setCategory(cat)}>{cat}</Button>
          ))}
        </div>
      </div>

      {view === "cards" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((t) => (
            <Card key={t.id} className="group hover:border-border-default transition-colors cursor-pointer" onClick={() => openEditor(t.name)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Badge variant="outline" className="text-[10px]">{t.category}</Badge>
                    <p className="text-sm font-medium text-text-primary mt-2">{t.name}</p>
                    <p className="text-xs text-text-muted mt-1">{t.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-text-muted">
                  <span>Used {t.usageCount} times</span>
                  {t.lastUsed && <span>Last: {formatLetterDate(t.lastUsed)}</span>}
                </div>
                <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                  <Button variant="outline" size="sm" onClick={() => openEditor(t.name)}><Eye className="size-3.5" />Preview</Button>
                  <Button variant="outline" size="sm" onClick={() => { openEditor(`${t.name} (Copy)`); demoSuccess("Template duplicated successfully."); }}><Copy className="size-3.5" />Duplicate</Button>
                  <Button variant="outline" size="sm" onClick={() => openEditor(t.name, "template")}><Pencil className="size-3.5" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => demoSaved("Archive")}><Archive className="size-3.5" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={paginated}
          searchValue={search}
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          searchPlaceholder="Search templates..."
          page={page}
          pageSize={10}
          totalItems={filtered.length}
          onPageChange={setPage}
        />
      )}

      <DocumentEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        title={editorTitle}
        mode={editorMode}
      />
    </div>
  );
}
