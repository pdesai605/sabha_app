"use client";

import * as React from "react";
import {
  Download,
  Printer,
  FileSpreadsheet,
  MapPin,
  Target,
  Repeat,
  Calendar,
  BarChart3,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { getVisits } from "@/lib/i18n/localized-demo-data";
import { toast } from "@/components/ui/sonner";
import { demoSuccess, demoExported, demoImported, demoPrinted, demoAssigned, demoWhatsAppSent, demoSaved, demoDeleted } from "@/lib/demo";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VISIT_PURPOSES } from "@/modules/visitor-desk/constants";
import { WARDS, AREAS } from "@/modules/people/constants";
import { enrichVisits } from "@/modules/visitor-desk/lib/utils";

export function VisitorReports() {
  const { locale } = useTranslation();
  const visits = React.useMemo(() => getVisits(locale), [locale]);

  const reports = [
  {
    id: "by-ward",
    title: "Visitors by Ward",
    description: "Visit distribution across electoral wards.",
    icon: MapPin,
    getCount: () => WARDS.length,
    unit: "wards",
  },
  {
    id: "by-area",
    title: "Visitors by Area",
    description: "Geographic breakdown of office visitors.",
    icon: MapPin,
    getCount: () => AREAS.length,
    unit: "areas",
  },
  {
    id: "by-purpose",
    title: "Visitors by Purpose",
    description: "Complaints, requests, meetings, scheme applications, and more.",
    icon: Target,
    getCount: () => VISIT_PURPOSES.length,
    unit: "categories",
  },
  {
    id: "repeat",
    title: "Repeat Visitors",
    description: "Citizens who have visited the office multiple times.",
    icon: Repeat,
    getCount: () => {
      const counts = new Map<string, number>();
      visits.forEach((v) => counts.set(v.personId, (counts.get(v.personId) ?? 0) + 1));
      return [...counts.values()].filter((c) => c > 1).length;
    },
    unit: "people",
  },
  {
    id: "daily",
    title: "Daily Visits",
    description: "Day-by-day visit volume for the current month.",
    icon: Calendar,
    getCount: () => new Set(visits.map((v) => v.visitDate)).size,
    unit: "days",
  },
  {
    id: "monthly",
    title: "Monthly Visits",
    description: "Monthly visit trends and comparisons.",
    icon: BarChart3,
    getCount: () => new Set(visits.map((v) => v.visitDate.slice(0, 7))).size,
    unit: "months",
  },
  ];

  const enriched = enrichVisits(visits, locale);
  const purposeBreakdown = enriched.reduce<Record<string, number>>((acc, v) => {
    acc[v.purpose] = (acc[v.purpose] ?? 0) + 1;
    return acc;
  }, {});
  const purposeEntries = Object.entries(purposeBreakdown).map(([label, count]) => ({ label, count }));
  const maxPurpose = Math.max(...purposeEntries.map((p) => p.count), 0);

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Visitor Desk", href: "/visitor-desk" },
          { label: "Reports" },
        ]}
        className="md:hidden"
      />

      <PageHeader
        title="Visitor Reports"
        description="Analyze visit patterns, repeat visitors, and office footfall."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => demoExported("File")}>
              <Download className="size-4" /> PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => demoExported("File")}>
              <FileSpreadsheet className="size-4" /> Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => demoPrinted()}>
              <Printer className="size-4" /> Print
            </Button>
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
                <span className="text-2xl font-semibold text-text-primary">{report.getCount()}</span>
              </div>
              <CardTitle className="text-base mt-2">{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => demoSuccess("Action completed successfully.")}
              >
                <BarChart3 className="size-3.5" /> View Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Visits by Purpose</CardTitle>
          <CardDescription>Distribution across {visits.length} total visits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {purposeEntries.map((p) => (
            <div key={p.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">{p.label}</span>
                <span className="font-medium text-text-primary">{p.count}</span>
              </div>
              <div className="h-2 rounded-full bg-background-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent-primary"
                  style={{ width: `${maxPurpose > 0 ? (p.count / maxPurpose) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
