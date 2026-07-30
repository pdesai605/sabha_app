"use client";

import * as React from "react";
import { Clock, FileText, History, Paperclip, Pencil, Eye } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Timeline } from "@/components/ui/timeline";
import { AttachmentButton } from "@/components/shared/attachment-viewer-dialog";
import { demoSaved } from "@/lib/demo";
import { useLocaleText } from "@/lib/i18n/locale-text";

export type GovernanceDrawerTab = "view" | "edit" | "history" | "documents" | "attachments" | "timeline";

export interface GovernanceRecordField {
  label: string;
  value: string | number;
}

export interface GovernanceRecordDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  fields: GovernanceRecordField[];
  initialTab?: GovernanceDrawerTab;
  documentName?: string;
}

const DEMO_HISTORY = [
  { date: "28 Jul 2026", user: "Office Staff", action: "Record updated" },
  { date: "15 Jul 2026", user: "Hon. MLA", action: "Status reviewed" },
  { date: "01 Jul 2026", user: "System", action: "Record created" },
];

const DEMO_TIMELINE = [
  { id: "1", title: "Initiated", description: "Record entered in Sabha governance module.", timestamp: "01 Jul 2026", status: "completed" as const },
  { id: "2", title: "Under Review", description: "Department verification in progress.", timestamp: "10 Jul 2026", status: "current" as const },
  { id: "3", title: "Completion", description: "Final approval and closure.", timestamp: "Pending", status: "upcoming" as const },
];

export function GovernanceRecordDrawer({
  open,
  onOpenChange,
  title,
  subtitle,
  fields,
  initialTab = "view",
  documentName = "governance-record.pdf",
}: GovernanceRecordDrawerProps) {
  const lt = useLocaleText();
  const [tab, setTab] = React.useState<GovernanceDrawerTab>(initialTab);

  React.useEffect(() => {
    if (open) setTab(initialTab);
  }, [open, initialTab]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side="right" className="sm:max-w-xl">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {subtitle && <DrawerDescription>{subtitle}</DrawerDescription>}
        </DrawerHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as GovernanceDrawerTab)} className="flex-1 flex flex-col min-h-0 px-6">
          <TabsList className="w-full justify-start overflow-x-auto shrink-0">
            <TabsTrigger value="view"><Eye className="size-3.5 mr-1" />{lt("View")}</TabsTrigger>
            <TabsTrigger value="edit"><Pencil className="size-3.5 mr-1" />{lt("Edit")}</TabsTrigger>
            <TabsTrigger value="history"><History className="size-3.5 mr-1" />{lt("History")}</TabsTrigger>
            <TabsTrigger value="documents"><FileText className="size-3.5 mr-1" />{lt("Documents")}</TabsTrigger>
            <TabsTrigger value="attachments"><Paperclip className="size-3.5 mr-1" />{lt("Attachments")}</TabsTrigger>
            <TabsTrigger value="timeline"><Clock className="size-3.5 mr-1" />{lt("Timeline")}</TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="flex-1 overflow-y-auto py-4 space-y-3">
            {fields.map((f) => (
              <div key={f.label} className="flex justify-between gap-4 py-2 border-b border-border-subtle last:border-0">
                <span className="text-sm text-text-muted shrink-0">{lt(f.label)}</span>
                <span className="text-sm text-text-primary text-right">{f.value}</span>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="edit" className="flex-1 overflow-y-auto py-4 space-y-4">
            {fields.map((f) => (
              <div key={f.label} className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">{lt(f.label)}</label>
                {String(f.value).length > 60 ? (
                  <Textarea defaultValue={String(f.value)} rows={3} />
                ) : (
                  <Input defaultValue={String(f.value)} />
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="history" className="flex-1 overflow-y-auto py-4">
            <div className="space-y-3">
              {DEMO_HISTORY.map((h, i) => (
                <div key={i} className="rounded-input border border-border-subtle p-3">
                  <p className="text-sm font-medium text-text-primary">{h.action}</p>
                  <p className="text-xs text-text-muted mt-1">{h.date} · {h.user}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="flex-1 overflow-y-auto py-4 space-y-3">
            <div className="rounded-input border border-border-subtle p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-accent-primary" />
                <div>
                  <p className="text-sm font-medium">{documentName}</p>
                  <p className="text-xs text-text-muted">PDF · 245 KB</p>
                </div>
              </div>
              <AttachmentButton fileName={documentName} label="Preview" size="sm" />
            </div>
            <AttachmentButton label="Upload Document" />
          </TabsContent>

          <TabsContent value="attachments" className="flex-1 overflow-y-auto py-4">
            <AttachmentButton fileName={documentName} label="View Attachments" />
          </TabsContent>

          <TabsContent value="timeline" className="flex-1 overflow-y-auto py-4">
            <Timeline items={DEMO_TIMELINE} />
          </TabsContent>
        </Tabs>

        <DrawerFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{lt("Close")}</Button>
          {tab === "edit" && (
            <Button onClick={() => { demoSaved("Record"); onOpenChange(false); }}>{lt("Save")}</Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function useGovernanceDrawer() {
  const [open, setOpen] = React.useState(false);
  const [config, setConfig] = React.useState<Omit<GovernanceRecordDrawerProps, "open" | "onOpenChange"> | null>(null);

  const openDrawer = (cfg: Omit<GovernanceRecordDrawerProps, "open" | "onOpenChange">) => {
    setConfig(cfg);
    setOpen(true);
  };

  const drawer = config ? (
    <GovernanceRecordDrawer
      open={open}
      onOpenChange={setOpen}
      {...config}
    />
  ) : null;

  return { openDrawer, drawer };
}
