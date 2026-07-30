"use client";

import * as React from "react";
import {
  Download,
  Printer,
  FileSpreadsheet,
  MapPin,
  Vote,
  Building2,
  Award,
  UserPlus,
  UserX,
  BarChart3,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { demoSuccess, demoExported, demoImported, demoPrinted, demoAssigned, demoWhatsAppSent, demoSaved, demoDeleted } from "@/lib/demo";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/context";
import { getPartyMembers, getMembersByOrg } from "@/lib/i18n/localized-demo-data";
import { WARDS } from "@/modules/people/constants";
import { ORGANIZATION_LABELS } from "@/modules/party-members/constants";
import type { OrganizationType } from "@/modules/party-members/types";

export function PartyReports() {
  const { locale } = useTranslation();
  const partyMembers = React.useMemo(() => getPartyMembers(locale), [locale]);

  const reports = React.useMemo(() => [
    {
      id: "by-ward",
      title: "Members by Ward",
      description: "Distribution of members across all wards in the constituency.",
      icon: MapPin,
      count: WARDS.length,
      unit: "wards",
    },
    {
      id: "by-booth",
      title: "Members by Booth",
      description: "Booth-level member coverage and gaps analysis.",
      icon: Vote,
      count: 10,
      unit: "booths",
    },
    {
      id: "by-org",
      title: "Members by Organization",
      description: "Breakdown across corporation, panchayat, party, morcha, and committees.",
      icon: Building2,
      count: 5,
      unit: "organizations",
    },
    {
      id: "by-designation",
      title: "Members by Designation",
      description: "Role distribution across the political hierarchy.",
      icon: Award,
      count: new Set(partyMembers.map((m) => m.designation)).size,
      unit: "designations",
    },
    {
      id: "new-members",
      title: "New Members",
      description: "Members who joined in the current calendar year.",
      icon: UserPlus,
      count: partyMembers.filter((m) => m.joiningDate.startsWith("2026")).length,
      unit: "members",
    },
    {
      id: "inactive",
      title: "Inactive Members",
      description: "Members with inactive or pending status requiring attention.",
      icon: UserX,
      count: partyMembers.filter((m) => m.status !== "active").length,
      unit: "members",
    },
  ], [partyMembers]);

  const orgBreakdown = React.useMemo(() =>
    (Object.keys(ORGANIZATION_LABELS) as OrganizationType[]).map((org) => ({
      label: ORGANIZATION_LABELS[org],
      count: getMembersByOrg(org, locale).length,
      active: getMembersByOrg(org, locale).filter((m) => m.status === "active").length,
    })),
  [locale]);
  const maxCount = Math.max(...orgBreakdown.map((o) => o.count));

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Party Members", href: "/party-members" },
          { label: "Reports" },
        ]}
        className="md:hidden"
      />

      <PageHeader
        title="Reports"
        description="Generate and export organizational reports for meetings, reviews, and campaign planning."
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
          <Card key={report.id} className="group hover:border-border-default transition-colors">
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
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => demoSuccess("Action completed successfully.")}
                >
                  <BarChart3 className="size-3.5" />
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => demoExported("File")}
                >
                  <Download className="size-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Organization breakdown chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Organization Overview</CardTitle>
          <CardDescription>Active members by organization type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {orgBreakdown.map((org) => (
            <div key={org.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">{org.label}</span>
                <span className="font-medium text-text-primary">
                  {org.active} / {org.count}
                </span>
              </div>
              <div className="h-2 rounded-full bg-background-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent-primary transition-all"
                  style={{ width: `${maxCount > 0 ? (org.count / maxCount) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
