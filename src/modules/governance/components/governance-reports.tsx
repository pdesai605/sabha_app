"use client";

import {
  Download,
  Printer,
  FileSpreadsheet,
  MapPin,
  Building2,
  AlertCircle,
  Landmark,
  PieChart,
  FileText,
  ClipboardCheck,
  BarChart3,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { demoSuccess, demoExported, demoImported, demoPrinted, demoAssigned, demoWhatsAppSent, demoSaved, demoDeleted } from "@/lib/demo";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  developmentProjects,
  publicComplaints,
  governmentSchemes,
  tenders,
  inspections,
  getDashboardStats,
} from "@/modules/governance/data/governance-data";

const reports = [
  { id: "ward", title: "Projects by Ward", description: "Development project distribution and status by ward.", icon: MapPin, count: 8 },
  { id: "department", title: "Projects by Department", description: "Project allocation across government departments.", icon: Building2, count: 8 },
  { id: "complaints", title: "Complaint Analysis", description: "Citizen grievances by category, ward, and resolution.", icon: AlertCircle, count: publicComplaints.length },
  { id: "schemes", title: "Scheme Progress", description: "Government scheme application and approval rates.", icon: Landmark, count: governmentSchemes.length },
  { id: "budget", title: "Budget Utilization", description: "Budget vs spent across all development projects.", icon: PieChart, count: developmentProjects.length },
  { id: "tenders", title: "Tender Summary", description: "Published, closed, and awarded tender overview.", icon: FileText, count: tenders.length },
  { id: "inspections", title: "Inspection Summary", description: "Inspection results and compliance tracking.", icon: ClipboardCheck, count: inspections.length },
];

export function GovernanceReports() {
  const stats = getDashboardStats();

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Governance", href: "/governance" }, { label: "Reports" }]} className="md:hidden" />
      <PageHeader
        title="Governance Reports"
        description="Generate reports on projects, complaints, schemes, budget, tenders, and inspections."
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
            <p className="text-sm text-text-muted">Constituency Overview</p>
            <p className="text-2xl font-semibold text-text-primary">
              {stats.activeProjects} active · {stats.completedProjects} completed · {stats.budgetUtilization}% budget used
            </p>
          </div>
          <p className="text-xs text-text-muted">Pune Constituency · Jul 2026</p>
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
