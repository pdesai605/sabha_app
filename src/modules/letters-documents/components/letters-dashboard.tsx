"use client";

import * as React from "react";
import Link from "next/link";
import {
  Inbox,
  Send,
  FolderOpen,
  FolderCheck,
  Truck,
  Archive,
  FileText,
  Mail,
  ChevronRight,
  Clock,
  Activity,
  Plus,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { useTranslation } from "@/lib/i18n/context";
import {
  getRecentLetters,
  getPendingFileMovement,
  getRecentDispatch,
  getUpcomingDeadlines,
  getLetterRecentActivities,
} from "@/lib/i18n/localized-demo-data";
import { getDashboardStats } from "@/modules/letters-documents/data/letters-data";
import {
  formatLetterDate,
  formatLetterDateTime,
  getInwardStatusVariant,
  getOutwardStatusVariant,
  getDispatchStatusVariant,
  getFileStatusVariant,
} from "@/modules/letters-documents/lib/utils";
import { INWARD_STATUS_LABELS, OUTWARD_STATUS_LABELS, DISPATCH_STATUS_LABELS, FILE_STATUS_LABELS } from "@/modules/letters-documents/constants";

const quickActions = [
  { label: "Register Inward", href: "/letters-documents/inward", icon: Inbox },
  { label: "Create Outward", href: "/letters-documents/outward", icon: Send },
  { label: "New File", href: "/letters-documents/files", icon: FolderOpen },
  { label: "Use Template", href: "/letters-documents/templates", icon: FileText },
  { label: "Record Dispatch", href: "/letters-documents/dispatch", icon: Truck },
];

export function LettersDashboard() {
  const { locale } = useTranslation();
  const stats = getDashboardStats();
  const recentLetters = React.useMemo(() => getRecentLetters(undefined, locale), [locale]);
  const pendingFiles = React.useMemo(() => getPendingFileMovement(undefined, locale), [locale]);
  const recentDispatch = React.useMemo(() => getRecentDispatch(undefined, locale), [locale]);
  const deadlines = React.useMemo(() => getUpcomingDeadlines(undefined, locale), [locale]);
  const recentActivities = React.useMemo(() => getLetterRecentActivities(locale), [locale]);

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Letters & Documents" }]} className="md:hidden" />
      <PageHeader
        title="Letters & Documents"
        description="Inward and outward correspondence, file tracking, templates, dispatch, and document archive."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Today's Inward" value={stats.todayInward} icon={<Inbox className="size-5" />} />
        <StatCard title="Today's Outward" value={stats.todayOutward} icon={<Send className="size-5" />} />
        <StatCard title="Pending Files" value={stats.pendingFiles} icon={<FolderOpen className="size-5" />} />
        <StatCard title="Closed Files" value={stats.closedFiles} icon={<FolderCheck className="size-5" />} />
        <StatCard title="Pending Dispatch" value={stats.pendingDispatch} icon={<Truck className="size-5" />} />
        <StatCard title="Archived Documents" value={stats.archivedDocuments} icon={<Archive className="size-5" />} />
        <StatCard title="Templates" value={stats.templates} icon={<FileText className="size-5" />} />
        <StatCard title="This Month Letters" value={stats.monthLetters} icon={<Mail className="size-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Letters</CardTitle>
            <Link href="/letters-documents/inward"><Button variant="ghost" size="sm">All<ChevronRight className="size-4" /></Button></Link>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border-subtle">
              {recentLetters.map((l, i) => (
                <li key={l.id + i} className="flex items-center gap-3 px-6 py-3.5">
                  <Badge variant={l.type === "inward" ? "primary" : "outline"} className="shrink-0 text-[10px]">{l.type === "inward" ? "IN" : "OUT"}</Badge>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary truncate">{l.subject}</p>
                    <p className="text-xs text-text-muted">{l.id} · {formatLetterDate(l.date)}</p>
                  </div>
                  <StatusBadge
                    label={l.type === "inward" ? INWARD_STATUS_LABELS[l.status] : OUTWARD_STATUS_LABELS[l.status]}
                    status={l.type === "inward" ? getInwardStatusVariant(l.status as import("@/modules/letters-documents/types").InwardStatus) : getOutwardStatusVariant(l.status as import("@/modules/letters-documents/types").OutwardStatus)}
                    showDot={false}
                  />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action) => (
              <Link key={action.href + action.label} href={action.href}>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <action.icon className="size-4 text-text-muted" />
                  {action.label}
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Pending File Movement</CardTitle>
            <Link href="/letters-documents/files"><Button variant="ghost" size="sm">All<ChevronRight className="size-4" /></Button></Link>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border-subtle">
              {pendingFiles.map((f) => (
                <li key={f.id} className="px-6 py-3">
                  <p className="text-sm font-medium text-text-primary truncate">{f.title}</p>
                  <p className="text-xs text-text-muted">{f.fileNumber} · {f.currentHolder}</p>
                  <StatusBadge label={FILE_STATUS_LABELS[f.status]} status={getFileStatusVariant(f.status)} showDot={false} className="mt-1.5" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Dispatch</CardTitle>
            <Link href="/letters-documents/dispatch"><Button variant="ghost" size="sm">All<ChevronRight className="size-4" /></Button></Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentDispatch.map((d) => (
              <div key={d.id} className="rounded-input border border-border-default p-3">
                <p className="text-sm font-medium text-text-primary">{d.dispatchNumber}</p>
                <p className="text-xs text-text-muted mt-0.5">{d.recipient}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-text-muted">{d.deliveryMethod}</span>
                  <StatusBadge label={DISPATCH_STATUS_LABELS[d.status]} status={getDispatchStatusVariant(d.status)} showDot={false} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><Clock className="size-4" />Upcoming Deadlines</CardTitle>
            <Link href="/letters-documents/inward"><Button variant="ghost" size="sm">Inward<ChevronRight className="size-4" /></Button></Link>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border-subtle">
              {deadlines.map((l) => (
                <li key={l.id} className="px-6 py-3">
                  <p className="text-sm text-text-primary truncate">{l.subject}</p>
                  <p className="text-xs text-text-muted">{l.diaryNumber} · Due {l.deadline ? formatLetterDate(l.deadline) : "—"}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Activity className="size-4" />Recent Activities</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((a) => (
              <div key={a.id} className="text-sm">
                <p className="text-text-primary"><span className="font-medium">{a.user}</span> — {a.action}</p>
                <p className="text-xs text-text-muted mt-0.5">{a.detail}</p>
                <p className="text-xs text-text-muted">{formatLetterDateTime(a.timestamp)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
