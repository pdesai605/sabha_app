"use client";

import {
  Download,
  Printer,
  FileSpreadsheet,
  Inbox,
  Send,
  Building2,
  FolderOpen,
  Truck,
  Archive,
  BarChart3,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { demoSuccess, demoExported, demoImported, demoPrinted, demoAssigned, demoWhatsAppSent, demoSaved, demoDeleted } from "@/lib/demo";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  inwardLetters,
  outwardLetters,
  officeFiles,
  dispatchRecords,
  archivedDocuments,
  getDashboardStats,
} from "@/modules/letters-documents/data/letters-data";

const reports = [
  { id: "inward", title: "Inward Summary", description: "Incoming correspondence by department, category, and status.", icon: Inbox, count: inwardLetters.length },
  { id: "outward", title: "Outward Summary", description: "Outgoing letters by recipient, delivery method, and status.", icon: Send, count: outwardLetters.length },
  { id: "department", title: "Department Wise Letters", description: "Letter volume breakdown by government department.", icon: Building2, count: 14 },
  { id: "files", title: "Pending Files", description: "Open and in-movement file status report.", icon: FolderOpen, count: officeFiles.filter((f) => f.status !== "closed" && f.status !== "archived").length },
  { id: "dispatch", title: "Dispatch Analysis", description: "Delivery performance and courier tracking summary.", icon: Truck, count: dispatchRecords.length },
  { id: "archive", title: "Archive Statistics", description: "Archived document counts by year and category.", icon: Archive, count: archivedDocuments.length },
];

export function LettersReports() {
  const stats = getDashboardStats();

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Letters & Documents", href: "/letters-documents" }, { label: "Reports" }]} className="md:hidden" />
      <PageHeader
        title="Letters & Documents Reports"
        description="Generate reports on inward/outward correspondence, files, dispatch, and archive."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => demoSuccess("Action completed successfully.")}><Download className="size-4" />PDF</Button>
            <Button variant="outline" size="sm" onClick={() => demoSuccess("Action completed successfully.")}><FileSpreadsheet className="size-4" />Excel</Button>
            <Button variant="outline" size="sm" onClick={() => demoPrinted()}><Printer className="size-4" />Print</Button>
          </div>
        }
      />

      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted">Correspondence Overview</p>
            <p className="text-2xl font-semibold text-text-primary">
              {inwardLetters.length} inward · {outwardLetters.length} outward · {stats.monthLetters} this month
            </p>
          </div>
          <p className="text-xs text-text-muted">Jul 2026</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.id} className="hover:border-border-default transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="flex size-10 items-center justify-center rounded-input bg-accent-primary-muted text-accent-primary">
                  <report.icon className="size-5" />
                </div>
                <span className="text-2xl font-semibold text-text-primary">{report.count}</span>
              </div>
              <CardTitle className="text-base mt-2">{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full" onClick={() => demoSuccess("Action completed successfully.")}>
                <BarChart3 className="size-3.5" />View Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
