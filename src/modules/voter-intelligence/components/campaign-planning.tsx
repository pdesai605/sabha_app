"use client";

import * as React from "react";
import { Plus, MapPin, Users, Target } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { campaigns } from "@/modules/voter-intelligence/data/voter-data";
import { formatVIDate, getCampaignStatusVariant, getCoverageColor } from "@/modules/voter-intelligence/lib/utils";
import { CAMPAIGN_STATUS_LABELS, CAMPAIGN_TYPES } from "@/modules/voter-intelligence/constants";
import type { CampaignStatus, CampaignType } from "@/modules/voter-intelligence/types";
import { CampaignCreateDialog } from "@/modules/voter-intelligence/components/campaign-create-dialog";
import { L } from "@/components/shared/localized";

function CampaignCard({ campaign }: { campaign: typeof campaigns[0] }) {
  return (
    <Card className="hover:border-border-default transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary">{campaign.title}</p>
            <Badge variant="outline" className="mt-1.5 text-[10px]">{campaign.type}</Badge>
          </div>
          <StatusBadge label={CAMPAIGN_STATUS_LABELS[campaign.status]} status={getCampaignStatusVariant(campaign.status)} showDot={false} />
        </div>
        <div className="mt-3 space-y-1.5 text-xs text-text-muted">
          <p className="flex items-center gap-1.5"><MapPin className="size-3" />{campaign.area} · {campaign.ward.split("—")[0]?.trim()}</p>
          <p className="flex items-center gap-1.5"><Users className="size-3" />{campaign.assignedTeam}</p>
          <p className="flex items-center gap-1.5"><Target className="size-3" />{campaign.targetAudience}</p>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {campaign.boothsCovered.map((b) => <Badge key={b} variant="outline" className="text-[10px]">{b}</Badge>)}
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-text-secondary">Progress</span>
            <span>{campaign.progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-background-muted overflow-hidden">
            <div className={`h-full rounded-full ${getCoverageColor(campaign.progress)}`} style={{ width: `${campaign.progress}%` }} />
          </div>
        </div>
        <p className="text-xs text-text-muted mt-2">{formatVIDate(campaign.startDate)}</p>
      </CardContent>
    </Card>
  );
}

export function CampaignPlanning() {
  const [createOpen, setCreateOpen] = React.useState(false);
  const [typeFilter, setTypeFilter] = React.useState<CampaignType | "all">("all");
  const [statusFilter, setStatusFilter] = React.useState<CampaignStatus | "all">("all");

  const filtered = campaigns.filter((c) => {
    if (typeFilter !== "all" && c.type !== typeFilter) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    return true;
  });

  const upcoming = filtered.filter((c) => c.status === "planned" || c.status === "ongoing");

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Voter Intelligence", href: "/voter-intelligence" }, { label: "Campaigns" }]} className="md:hidden" />
      <PageHeader
        title="Campaign Planning"
        description="Door-to-door, booth meetings, public meetings, WhatsApp, phone, and street campaigns."
        actions={<Button onClick={() => setCreateOpen(true)}><Plus className="size-4" /><L>Plan Campaign</L></Button>}
      />

      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as CampaignStatus | "all")}>
        <TabsList>
          <TabsTrigger value="all"><L>All</L> ({campaigns.length})</TabsTrigger>
          <TabsTrigger value="planned">Planned ({campaigns.filter((c) => c.status === "planned").length})</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing ({campaigns.filter((c) => c.status === "ongoing").length})</TabsTrigger>
          <TabsTrigger value="completed"><L>Completed</L> ({campaigns.filter((c) => c.status === "completed").length})</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap gap-2">
        <Button variant={typeFilter === "all" ? "secondary" : "ghost"} size="sm" onClick={() => setTypeFilter("all")}><L>All</L></Button>
        {CAMPAIGN_TYPES.map((t) => (
          <Button key={t} variant={typeFilter === t ? "secondary" : "ghost"} size="sm" onClick={() => setTypeFilter(t)}>{t}</Button>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-medium text-text-primary mb-3">Upcoming & Active Campaigns</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((c) => <CampaignCard key={c.id} campaign={c} />)}
        </div>
      </div>

      {(statusFilter === "all" || statusFilter === "completed") && (
        <div>
          <h3 className="text-sm font-medium text-text-primary mb-3"><L>All</L> Campaigns</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => <CampaignCard key={c.id} campaign={c} />)}
          </div>
        </div>
      )}

      <CampaignCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
