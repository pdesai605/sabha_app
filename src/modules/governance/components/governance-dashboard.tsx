"use client";

import * as React from "react";
import Link from "next/link";
import {
  FolderKanban,
  CheckCircle2,
  Landmark,
  AlertCircle,
  CheckSquare,
  ClipboardCheck,
  FileText,
  PieChart,
  ChevronRight,
  Activity,
  MapPin,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { L } from "@/components/shared/localized";
import { useTranslation } from "@/lib/i18n/context";
import {
  getUpcomingInspections,
  getLatestProjects,
  getPublicComplaints,
  getGovernmentSchemes,
  getWardProjectSummaries,
  getGovRecentActivities,
} from "@/lib/i18n/localized-demo-data";
import { getDashboardStats } from "@/modules/governance/data/governance-data";
import {
  formatGovDate,
  formatGovDateTime,
  formatCurrencyCompact,
  getProjectStatusVariant,
  getComplaintStatusVariant,
  getProgressColor,
} from "@/modules/governance/lib/utils";
import { PROJECT_STATUS_LABELS, COMPLAINT_STATUS_LABELS } from "@/modules/governance/constants";

const quickActions = [
  { label: "New Project", href: "/governance/projects", icon: FolderKanban },
  { label: "Register Complaint", href: "/governance/complaints", icon: AlertCircle },
  { label: "Schedule Inspection", href: "/governance/inspections", icon: ClipboardCheck },
  { label: "Publish Tender", href: "/governance/tenders", icon: FileText },
  { label: "View Schemes", href: "/governance/schemes", icon: Landmark },
];

export function GovernanceDashboard() {
  const { locale } = useTranslation();
  const stats = getDashboardStats();
  const upcomingInspections = React.useMemo(() => getUpcomingInspections(undefined, locale), [locale]);
  const latestProjects = React.useMemo(() => getLatestProjects(undefined, locale), [locale]);
  const publicComplaints = React.useMemo(() => getPublicComplaints(locale), [locale]);
  const governmentSchemes = React.useMemo(() => getGovernmentSchemes(locale), [locale]);
  const wardProjectSummaries = React.useMemo(() => getWardProjectSummaries(locale), [locale]);
  const recentActivities = React.useMemo(() => getGovRecentActivities(locale), [locale]);
  const recentComplaints = publicComplaints.slice(0, 6);
  const topSchemes = governmentSchemes.filter((s) => s.status === "active").slice(0, 5);

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Governance" }]} className="md:hidden" />
      <PageHeader
        title="Governance"
        description="Constituency development — projects, schemes, public works, complaints, inspections, and tenders."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Active Projects" value={stats.activeProjects} icon={<FolderKanban className="size-5" />} />
        <StatCard title="Completed Projects" value={stats.completedProjects} icon={<CheckCircle2 className="size-5" />} />
        <StatCard title="Government Schemes" value={stats.governmentSchemes} icon={<Landmark className="size-5" />} />
        <StatCard title="Pending Complaints" value={stats.pendingComplaints} icon={<AlertCircle className="size-5" />} />
        <StatCard title="Resolved Complaints" value={stats.resolvedComplaints} icon={<CheckSquare className="size-5" />} />
        <StatCard title="Inspections This Month" value={stats.inspectionsThisMonth} icon={<ClipboardCheck className="size-5" />} />
        <StatCard title="Running Tenders" value={stats.runningTenders} icon={<FileText className="size-5" />} />
        <StatCard title="Budget Utilization" value={`${stats.budgetUtilization}%`} icon={<PieChart className="size-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base"><L>Recent Complaints</L></CardTitle>
            <Link href="/governance/complaints"><Button variant="ghost" size="sm"><L>All</L><ChevronRight className="size-4" /></Button></Link>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border-subtle">
              {recentComplaints.map((c) => (
                <li key={c.id} className="flex items-center gap-3 px-6 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary truncate">{c.description}</p>
                    <p className="text-xs text-text-muted">{c.complaintId} · {c.citizenName} · {c.category}</p>
                  </div>
                  <StatusBadge label={COMPLAINT_STATUS_LABELS[c.status]} status={getComplaintStatusVariant(c.status)} showDot={false} />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base"><L>Quick Actions</L></CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action) => (
              <Link key={action.href + action.label} href={action.href}>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <action.icon className="size-4 text-text-muted" />
                  <L>{action.label}</L>
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base"><L>Upcoming Inspections</L></CardTitle>
            <Link href="/governance/inspections"><Button variant="ghost" size="sm"><L>All</L><ChevronRight className="size-4" /></Button></Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingInspections.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-4"><L>No upcoming inspections</L></p>
            ) : upcomingInspections.map((insp) => (
              <div key={insp.id} className="rounded-input border border-border-default p-3">
                <p className="text-sm font-medium text-text-primary truncate">{insp.projectName}</p>
                <p className="text-xs text-text-muted mt-1">{insp.inspectionId} · {formatGovDate(insp.inspectionDate)}</p>
                <p className="text-xs text-text-secondary mt-0.5">{insp.officerName}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base"><L>Latest Projects</L></CardTitle>
            <Link href="/governance/projects"><Button variant="ghost" size="sm"><L>All</L><ChevronRight className="size-4" /></Button></Link>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border-subtle">
              {latestProjects.map((p) => (
                <li key={p.id} className="px-6 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-text-primary truncate">{p.projectName}</p>
                    <Badge variant="primary">{p.progress}%</Badge>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-background-muted overflow-hidden">
                    <div className={`h-full rounded-full ${getProgressColor(p.progress)}`} style={{ width: `${p.progress}%` }} />
                  </div>
                  <p className="text-xs text-text-muted mt-1">{p.projectId} · {formatCurrencyCompact(p.budget)}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base"><L>Scheme Progress</L></CardTitle>
            <Link href="/governance/schemes"><Button variant="ghost" size="sm"><L>All</L><ChevronRight className="size-4" /></Button></Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {topSchemes.map((s) => (
              <div key={s.id}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-text-secondary truncate pr-2">{s.schemeName}</span>
                  <span className="text-text-muted shrink-0">{s.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-background-muted overflow-hidden">
                  <div className={`h-full rounded-full ${getProgressColor(s.progress)}`} style={{ width: `${s.progress}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><MapPin className="size-4" /><L>Ward-wise Project Status</L></CardTitle>
            <Link href="/governance/projects"><Button variant="ghost" size="sm"><L>Projects</L><ChevronRight className="size-4" /></Button></Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {wardProjectSummaries.map((w) => (
                <div key={w.ward} className="rounded-input border border-border-subtle p-3">
                  <p className="text-sm font-medium text-text-primary">{w.ward}</p>
                  <div className="flex gap-3 mt-2 text-xs text-text-muted">
                    <span>{w.active} <L>active</L></span>
                    <span>{w.completed} <L>completed</L></span>
                    <span>{formatCurrencyCompact(w.totalBudget)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Activity className="size-4" /><L>Recent Activities</L></CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((a) => (
              <div key={a.id} className="text-sm">
                <p className="text-text-primary"><span className="font-medium">{a.user}</span> — {a.action}</p>
                <p className="text-xs text-text-muted mt-0.5">{a.detail}</p>
                <p className="text-xs text-text-muted">{formatGovDateTime(a.timestamp)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
