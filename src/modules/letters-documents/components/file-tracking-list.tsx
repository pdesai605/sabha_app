"use client";

import * as React from "react";
import { useTranslation } from "@/lib/i18n/context";
import { getOfficeFiles } from "@/lib/i18n/localized-demo-data";
import { demoSuccess, demoExported, demoImported, demoPrinted, demoAssigned, demoWhatsAppSent, demoSaved, demoDeleted } from "@/lib/demo";
import Link from "next/link";
import { Plus, Clock, User } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { SearchBar } from "@/components/ui/search-bar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Timeline } from "@/components/ui/timeline";
import {
  formatLetterDate,
  getPriorityVariant,
  getFileStatusVariant,
} from "@/modules/letters-documents/lib/utils";
import { FILE_STATUS_LABELS } from "@/modules/letters-documents/constants";
import type { OfficeFile } from "@/modules/letters-documents/types";

export function FileTrackingList() {
  const { locale } = useTranslation();
  const officeFiles = React.useMemo(() => getOfficeFiles(locale), [locale]);
  const [selected, setSelected] = React.useState<OfficeFile | null>(null);
  const [search, setSearch] = React.useState("");

  const filtered = officeFiles.filter((f) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return f.fileNumber.toLowerCase().includes(q) || f.title.toLowerCase().includes(q) || f.currentHolder.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Letters & Documents", href: "/letters-documents" }, { label: "Files" }]} className="md:hidden" />
      <PageHeader
        title="File Tracking"
        description="Office file movement — current holder, movement history, timeline, and status tracking."
        actions={<Button onClick={() => demoSaved("Record")}><Plus className="size-4" />New File</Button>}
      />

      <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch("")} placeholder="Search files..." containerClassName="sm:max-w-md" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((file) => (
          <Card
            key={file.id}
            className="cursor-pointer hover:border-border-default transition-colors"
            onClick={() => setSelected(file)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-accent-primary">{file.fileNumber}</p>
                  <p className="text-sm font-medium text-text-primary mt-1 line-clamp-2">{file.title}</p>
                </div>
                <StatusBadge label={FILE_STATUS_LABELS[file.status]} status={getFileStatusVariant(file.status)} showDot={false} />
              </div>
              <div className="mt-3 space-y-1.5 text-xs text-text-muted">
                <p>{file.department}</p>
                <p className="flex items-center gap-1">
                  <User className="size-3" />
                  {file.holderPersonId ? (
                    <Link href={`/people/${file.holderPersonId}`} className="hover:text-accent-primary" onClick={(e) => e.stopPropagation()}>{file.currentHolder}</Link>
                  ) : file.currentHolder}
                </p>
                <p className="flex items-center gap-1"><Clock className="size-3" />Created {formatLetterDate(file.createdDate)}</p>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant={getPriorityVariant(file.priority)}>{file.priority}</Badge>
                <span className="text-xs text-text-muted">{file.movementHistory.length} movements</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.title}</DialogTitle>
                <DialogDescription>{selected.fileNumber} · {selected.department}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-xs text-text-muted">Current Holder</p><p className="font-medium">{selected.currentHolder}</p></div>
                  <div><p className="text-xs text-text-muted">Priority</p><Badge variant={getPriorityVariant(selected.priority)}>{selected.priority}</Badge></div>
                  <div><p className="text-xs text-text-muted">Created</p><p>{formatLetterDate(selected.createdDate)}</p></div>
                  <div><p className="text-xs text-text-muted">Status</p><StatusBadge label={FILE_STATUS_LABELS[selected.status]} status={getFileStatusVariant(selected.status)} showDot={false} /></div>
                </div>
                {selected.remarks && (
                  <div><p className="text-xs text-text-muted mb-1">Remarks</p><p className="text-sm text-text-secondary">{selected.remarks}</p></div>
                )}
                <div>
                  <p className="text-sm font-medium mb-3">Movement History</p>
                  <Timeline
                    items={selected.movementHistory.map((m, i) => ({
                      id: m.id,
                      title: `${m.from} → ${m.to}`,
                      description: m.remarks,
                      timestamp: formatLetterDate(m.date),
                      status: i === selected.movementHistory.length - 1 ? "current" : "completed",
                    }))}
                  />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
