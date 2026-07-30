"use client";

import {
  Download,
  Printer,
  FileSpreadsheet,
  Users,
  MapPin,
  BarChart3,
  AlertCircle,
  ClipboardList,
  Megaphone,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { demoSuccess, demoExported, demoImported, demoPrinted, demoAssigned, demoWhatsAppSent, demoSaved, demoDeleted } from "@/lib/demo";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  voters,
  booths,
  wardAnalytics,
  citizenIssues,
  surveyCampaigns,
  campaigns,
  getOverallSurveyCompletion,
} from "@/modules/voter-intelligence/data/voter-data";

const reports = [
  { id: "distribution", title: "Voter Distribution", description: "Demographic and geographic voter distribution analysis.", icon: Users, count: voters.length },
  { id: "booth", title: "Booth Performance", description: "Coverage and survey metrics by polling booth.", icon: MapPin, count: booths.length },
  { id: "ward", title: "Ward Comparison", description: "Cross-ward comparison of voters, coverage, and issues.", icon: BarChart3, count: wardAnalytics.length },
  { id: "issues", title: "Issue Analysis", description: "Citizen grievances by category, ward, and resolution status.", icon: AlertCircle, count: citizenIssues.length },
  { id: "survey", title: "Survey Completion", description: "Survey campaign progress and response rates.", icon: ClipboardList, count: surveyCampaigns.length },
  { id: "campaign", title: "Campaign Performance", description: "Outreach campaign effectiveness and progress.", icon: Megaphone, count: campaigns.length },
];

export function VoterReports() {
  const surveyCompletion = getOverallSurveyCompletion();

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Voter Intelligence", href: "/voter-intelligence" }, { label: "Reports" }]} className="md:hidden" />
      <PageHeader
        title="Voter Intelligence Reports"
        description="Generate reports on voter distribution, booth performance, ward comparison, issues, surveys, and campaigns."
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
            <p className="text-2xl font-semibold text-text-primary">{voters.length.toLocaleString("en-IN")} voters · {booths.length} booths · {surveyCompletion}% surveyed</p>
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
