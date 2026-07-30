"use client";

import * as React from "react";
import { demoSuccess, demoExported, demoImported, demoPrinted, demoAssigned, demoWhatsAppSent, demoSaved, demoDeleted } from "@/lib/demo";
import { Plus, ClipboardList, FileQuestion, BarChart3 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/data-table/data-table";
import { useTranslation } from "@/lib/i18n/context";
import { getSurveyCampaigns, getSurveyResponses } from "@/lib/i18n/localized-demo-data";
import { formatVIDate, getCoverageColor } from "@/modules/voter-intelligence/lib/utils";
import type { SurveyResponse } from "@/modules/voter-intelligence/types";
import { SurveyCreateDialog } from "@/modules/voter-intelligence/components/survey-create-dialog";
import { L } from "@/components/shared/localized";

export function SurveyManagement() {
  const { locale } = useTranslation();
  const surveyCampaigns = React.useMemo(() => getSurveyCampaigns(locale), [locale]);
  const surveyResponses = React.useMemo(() => getSurveyResponses(locale), [locale]);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);

  const filtered = surveyResponses.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.campaignTitle.toLowerCase().includes(q) ||
      r.volunteer.toLowerCase().includes(q) ||
      r.booth.toLowerCase().includes(q) ||
      r.ward.toLowerCase().includes(q)
    );
  });

  const paginated = filtered.slice((page - 1) * 10, page * 10);

  const columns: DataTableColumn<SurveyResponse>[] = [
    { id: "campaign", header: "Campaign", cell: (row) => <span className="font-medium">{row.campaignTitle}</span> },
    { id: "volunteer", header: "Volunteer", accessorKey: "volunteer" },
    { id: "booth", header: "Booth", accessorKey: "booth", hideOnMobile: true },
    { id: "ward", header: "Ward", accessorKey: "ward", hideOnMobile: true },
    { id: "date", header: "Date", hideOnMobile: true, cell: (row) => formatVIDate(row.date) },
    {
      id: "responses",
      header: "Responses",
      hideOnMobile: true,
      cell: (row) => `${row.responsesCount} / ${row.targetCount}`,
    },
    {
      id: "completion",
      header: "Completion %",
      cell: (row) => (
        <div className="flex items-center gap-2 min-w-[100px]">
          <div className="flex-1 h-2 rounded-full bg-background-muted overflow-hidden">
            <div className={`h-full rounded-full ${getCoverageColor(row.completionPercent)}`} style={{ width: `${row.completionPercent}%` }} />
          </div>
          <span className="text-xs text-text-muted w-8">{row.completionPercent}%</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Voter Intelligence", href: "/voter-intelligence" }, { label: "Surveys" }]} className="md:hidden" />
      <PageHeader
        title="Survey Management"
        description="Survey campaigns, questionnaires, responses, and completion tracking by volunteer and booth."
        actions={<Button onClick={() => setOpen(true)}><Plus className="size-4" /><L>New Survey</L></Button>}
      />

      <Tabs defaultValue="campaigns">
        <TabsList>
          <TabsTrigger value="campaigns"><ClipboardList className="size-4 mr-1.5" />Campaigns</TabsTrigger>
          <TabsTrigger value="responses"><BarChart3 className="size-4 mr-1.5" />Responses</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="mt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {surveyCampaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{campaign.title}</CardTitle>
                    <Badge variant={campaign.status === "active" ? "primary" : campaign.status === "completed" ? "success" : "default"}>{campaign.status}</Badge>
                  </div>
                  <CardDescription>{campaign.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-3 text-xs text-text-muted">
                    <span>{formatVIDate(campaign.startDate)} — {formatVIDate(campaign.endDate)}</span>
                    <span>·</span>
                    <span>{campaign.questions} questions</span>
                    <span>·</span>
                    <span>{campaign.targetBooths} booths</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-text-secondary">Completion</span>
                      <span>{campaign.completionPercent}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-background-muted overflow-hidden">
                      <div className={`h-full rounded-full ${getCoverageColor(campaign.completionPercent)}`} style={{ width: `${campaign.completionPercent}%` }} />
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => demoSuccess("Action completed successfully.")}>
                    <FileQuestion className="size-3.5" />View Questionnaire
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="responses" className="mt-4">
          <DataTable
            columns={columns}
            data={paginated}
            searchValue={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            searchPlaceholder="Search survey responses..."
            page={page}
            pageSize={10}
            totalItems={filtered.length}
            onPageChange={setPage}
          />
        </TabsContent>
      </Tabs>
      <SurveyCreateDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
