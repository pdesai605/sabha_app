"use client";

import * as React from "react";
import { Users, MapPin, ClipboardList, AlertCircle, UserCheck, BarChart3 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { getWardAnalytics } from "@/lib/i18n/localized-demo-data";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCoverageColor } from "@/modules/voter-intelligence/lib/utils";

export function WardAnalyticsView() {
  const { locale } = useTranslation();
  const wardAnalytics = React.useMemo(() => getWardAnalytics(locale), [locale]);
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Voter Intelligence", href: "/voter-intelligence" }, { label: "Wards" }]} className="md:hidden" />
      <PageHeader
        title="Ward Analytics"
        description="Population, voter registration, booth coverage, survey progress, and issue tracking by ward."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {wardAnalytics.map((ward) => (
          <Card key={ward.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">{ward.ward}</CardTitle>
                <Badge variant="primary">{ward.coverage}% coverage</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-input border border-border-subtle p-3">
                  <p className="text-xs text-text-muted flex items-center gap-1"><Users className="size-3" />Population</p>
                  <p className="text-lg font-semibold mt-1">{ward.population.toLocaleString("en-IN")}</p>
                </div>
                <div className="rounded-input border border-border-subtle p-3">
                  <p className="text-xs text-text-muted flex items-center gap-1"><UserCheck className="size-3" />Registered</p>
                  <p className="text-lg font-semibold mt-1">{ward.registeredVoters.toLocaleString("en-IN")}</p>
                </div>
                <div className="rounded-input border border-border-subtle p-3">
                  <p className="text-xs text-text-muted flex items-center gap-1"><MapPin className="size-3" />Booths</p>
                  <p className="text-lg font-semibold mt-1">{ward.booths}</p>
                </div>
                <div className="rounded-input border border-border-subtle p-3">
                  <p className="text-xs text-text-muted flex items-center gap-1"><ClipboardList className="size-3" />Survey %</p>
                  <p className="text-lg font-semibold mt-1">{ward.surveyPercent}%</p>
                </div>
                <div className="rounded-input border border-border-subtle p-3">
                  <p className="text-xs text-text-muted flex items-center gap-1"><AlertCircle className="size-3" />Issues</p>
                  <p className="text-lg font-semibold mt-1">{ward.openIssues}</p>
                </div>
                <div className="rounded-input border border-border-subtle p-3">
                  <p className="text-xs text-text-muted flex items-center gap-1"><BarChart3 className="size-3" />Workers</p>
                  <p className="text-lg font-semibold mt-1">{ward.partyWorkers}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-text-secondary">Coverage Progress</span>
                  <span className="text-text-muted">{ward.coverage}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-background-muted overflow-hidden">
                  <div className={`h-full rounded-full ${getCoverageColor(ward.coverage)}`} style={{ width: `${ward.coverage}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-text-secondary">Survey Completion</span>
                  <span className="text-text-muted">{ward.surveyPercent}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-background-muted overflow-hidden">
                  <div className="h-full rounded-full bg-accent-primary" style={{ width: `${ward.surveyPercent}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
