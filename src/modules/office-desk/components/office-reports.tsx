"use client";

import {
  Download,
  Printer,
  FileSpreadsheet,
  Calendar,
  MapPin,
  CheckSquare,
  Gift,
  Contact,
  BarChart3,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { demoSuccess, demoExported, demoImported, demoPrinted, demoAssigned, demoWhatsAppSent, demoSaved, demoDeleted } from "@/lib/demo";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  appointments,
  officeEvents,
  officeTasks,
  greetings,
  officeContacts,
} from "@/modules/office-desk/data/office-data";

const reports = [
  { id: "appointments", title: "Appointments Report", description: "Scheduled and completed appointments summary.", icon: Calendar, count: appointments.length },
  { id: "events", title: "Events Report", description: "Events and programs conducted and upcoming.", icon: MapPin, count: officeEvents.length },
  { id: "tasks", title: "Tasks Report", description: "Task completion rates and pending items.", icon: CheckSquare, count: officeTasks.length },
  { id: "greetings", title: "Greetings Report", description: "Sent, scheduled, and draft greetings.", icon: Gift, count: greetings.length },
  { id: "contacts", title: "Contacts Directory", description: "Complete office contacts listing.", icon: Contact, count: officeContacts.length },
];

export function OfficeReports() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Office Desk", href: "/office-desk" }, { label: "Reports" }]} className="md:hidden" />
      <PageHeader
        title="Office Reports"
        description="Generate operational reports for appointments, events, tasks, greetings, and contacts."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => demoSuccess("Action completed successfully.")}><Download className="size-4" />PDF</Button>
            <Button variant="outline" size="sm" onClick={() => demoSuccess("Action completed successfully.")}><FileSpreadsheet className="size-4" />Excel</Button>
            <Button variant="outline" size="sm" onClick={() => demoPrinted()}><Printer className="size-4" />Print</Button>
          </div>
        }
      />

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
