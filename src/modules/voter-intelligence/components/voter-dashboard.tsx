"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  User,
  UserCheck,
  Heart,
  Sparkles,
  UserPlus,
  MapPin,
  ClipboardList,
  Calendar,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { useTranslation } from "@/lib/i18n/context";
import { getTopBooths, getUpcomingCampaigns, getBooths } from "@/lib/i18n/localized-demo-data";
import {
  getDashboardStats,
  getOverallSurveyCompletion,
} from "@/modules/voter-intelligence/data/voter-data";
import {
  formatVIDate,
  getCampaignStatusVariant,
  getCoverageColor,
} from "@/modules/voter-intelligence/lib/utils";
import { CAMPAIGN_STATUS_LABELS } from "@/modules/voter-intelligence/constants";

export function VoterDashboard() {
  const { locale } = useTranslation();
  const stats = getDashboardStats();
  const topBooths = React.useMemo(() => getTopBooths(5, locale), [locale]);
  const upcomingCampaigns = React.useMemo(() => getUpcomingCampaigns(locale), [locale]);
  const surveyCompletion = getOverallSurveyCompletion();
  const booths = React.useMemo(() => getBooths(locale), [locale]);
  const maxCoverage = Math.max(...booths.map((b) => b.coveragePercent));

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Voter Intelligence" }]} className="md:hidden" />
      <PageHeader
        title="Voter Intelligence"
        description="Voter data, booth analytics, surveys, campaigns, and constituency reports for Pune."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Voters" value={stats.totalVoters.toLocaleString("en-IN")} icon={<Users className="size-5" />} />
        <StatCard title="Male" value={stats.male.toLocaleString("en-IN")} icon={<User className="size-5" />} />
        <StatCard title="Female" value={stats.female.toLocaleString("en-IN")} icon={<UserCheck className="size-5" />} />
        <StatCard title="Senior Citizens" value={stats.seniorCitizens.toLocaleString("en-IN")} icon={<Heart className="size-5" />} />
        <StatCard title="Youth" value={stats.youth.toLocaleString("en-IN")} icon={<Sparkles className="size-5" />} />
        <StatCard title="New Voters" value={stats.newVoters.toLocaleString("en-IN")} icon={<UserPlus className="size-5" />} />
        <StatCard title="Booths Covered" value={stats.boothsCovered} icon={<MapPin className="size-5" />} />
        <StatCard title="Pending Surveys" value={stats.pendingSurveys.toLocaleString("en-IN")} icon={<ClipboardList className="size-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Booth Performance</CardTitle>
            <Link href="/voter-intelligence/booths"><Button variant="ghost" size="sm">All<ChevronRight className="size-4" /></Button></Link>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border-subtle">
              {topBooths.map((b) => (
                <li key={b.id} className="flex items-center gap-4 px-6 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary">{b.name}</p>
                    <p className="text-xs text-text-muted">{b.ward} · {b.totalVoters.toLocaleString("en-IN")} voters</p>
                  </div>
                  <div className="w-24 hidden sm:block">
                    <div className="h-2 rounded-full bg-background-muted overflow-hidden">
                      <div className={`h-full rounded-full ${getCoverageColor(b.coveragePercent)}`} style={{ width: `${b.coveragePercent}%` }} />
                    </div>
                  </div>
                  <Badge variant="primary">{b.coveragePercent}%</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Survey Completion</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center py-4">
            <div className="relative size-32">
              <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-background-muted" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-accent-primary" strokeWidth="3" strokeDasharray={`${surveyCompletion} ${100 - surveyCompletion}`} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-2xl font-semibold text-text-primary">{surveyCompletion}%</span>
            </div>
            <p className="text-xs text-text-muted mt-3 text-center">Overall voter survey completion across constituency</p>
            <Link href="/voter-intelligence/surveys" className="mt-3"><Button variant="outline" size="sm">View Surveys</Button></Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Ward Heatmap</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {booths.slice(0, 24).map((b) => (
                <div
                  key={b.id}
                  title={`${b.name}: ${b.coveragePercent}%`}
                  className="aspect-square rounded-input flex items-center justify-center text-[10px] font-medium text-white"
                  style={{
                    backgroundColor: b.coveragePercent >= 85 ? "var(--semantic-success)" : b.coveragePercent >= 70 ? "var(--accent-primary)" : b.coveragePercent >= 55 ? "var(--semantic-warning)" : "var(--semantic-danger)",
                    opacity: 0.7 + (b.coveragePercent / maxCoverage) * 0.3,
                  }}
                >
                  {b.boothNumber}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-3 mt-4 text-[10px] text-text-muted">
              <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-semantic-danger" />Low</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-semantic-warning" />Medium</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-accent-primary" />Good</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-semantic-success" />High</span>
            </div>
            <p className="text-xs text-text-muted text-center mt-2">Coverage by booth — placeholder heatmap</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Ward Analytics</CardTitle>
            <Link href="/voter-intelligence/analytics"><Button variant="ghost" size="sm">View<ChevronRight className="size-4" /></Button></Link>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary">Compare voter coverage, survey completion, and booth performance across all wards.</p>
            <Link href="/voter-intelligence/analytics" className="mt-4 block">
              <Button variant="outline" size="sm" className="w-full">Open Analytics</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><Calendar className="size-4" />Upcoming Campaigns</CardTitle>
            <Link href="/voter-intelligence/campaigns"><Button variant="ghost" size="sm">All<ChevronRight className="size-4" /></Button></Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingCampaigns.map((c) => (
              <div key={c.id} className="rounded-input border border-border-default p-3">
                <p className="text-sm font-medium text-text-primary">{c.title}</p>
                <div className="flex flex-wrap gap-2 mt-1.5 text-xs text-text-muted">
                  <span>{c.type}</span>
                  <span>·</span>
                  <span>{formatVIDate(c.startDate)}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="outline" className="text-[10px]">{c.targetAudience}</Badge>
                  <StatusBadge label={CAMPAIGN_STATUS_LABELS[c.status]} status={getCampaignStatusVariant(c.status)} showDot={false} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="size-4" />Top Active Booths</CardTitle>
            <Link href="/voter-intelligence/booths"><Button variant="ghost" size="sm">View<ChevronRight className="size-4" /></Button></Link>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border-subtle">
              {topBooths.map((b, i) => (
                <li key={b.id} className="flex items-center gap-3 px-6 py-3">
                  <span className="text-sm font-medium text-text-muted w-5">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-text-primary">{b.name}</p>
                    <p className="text-xs text-text-muted">{b.volunteers.length} volunteers · {b.surveyCompletion}% surveys</p>
                  </div>
                  <Badge variant="success">{b.coveragePercent}%</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
