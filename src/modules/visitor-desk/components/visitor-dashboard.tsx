"use client";

import Link from "next/link";
import {
  Users,
  Clock,
  CheckCircle2,
  Calendar,
  Footprints,
  UserPlus,
  Repeat,
  Mail,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { L } from "@/components/shared/localized";
import { LBadge } from "@/components/shared/localized-badge";
import {
  getDashboardStats,
  getVisitsForToday,
  visits,
  getFollowUps,
  VISITOR_DESK_TODAY,
} from "@/modules/visitor-desk/data/visits";
import {
  enrichVisits,
  formatVisitTime,
  getVisitStatusVariant,
} from "@/modules/visitor-desk/lib/utils";
import { STATUS_LABELS } from "@/modules/visitor-desk/constants";

export function VisitorDashboard() {
  const stats = getDashboardStats();
  const todayQueue = enrichVisits(
    getVisitsForToday()
      .filter((v) => v.status === "waiting" || v.status === "in-progress")
      .sort((a, b) => a.visitTime.localeCompare(b.visitTime))
  );
  const upcoming = enrichVisits(
    visits
      .filter((v) => v.status === "scheduled" && v.visitDate >= VISITOR_DESK_TODAY)
      .slice(0, 5)
  );
  const recent = enrichVisits(
    [...visits]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 6)
  );
  const followUps = getFollowUps().filter((f) => f.status === "today" || f.status === "missed").slice(0, 5);

  return (
    <div className="space-y-8">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Visitor Desk" }]}
        className="md:hidden"
      />

      <PageHeader
        title="Visitor Desk"
        description="Manage citizen visits to your office — walk-ins, appointments, letters, and follow-ups."
        actions={
          <Link href="/visitor-desk/new">
            <Button><L>Register Visitor</L></Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Today's Visitors" value={stats.todayVisitors} icon={<Users className="size-5" />} />
        <StatCard title="Waiting" value={stats.waiting} description="In queue now" icon={<Clock className="size-5" />} />
        <StatCard title="Completed" value={stats.completed} icon={<CheckCircle2 className="size-5" />} />
        <StatCard title="Scheduled Appointments" value={stats.scheduledAppointments} icon={<Calendar className="size-5" />} />
        <StatCard title="Walk-ins" value={stats.walkIns} icon={<Footprints className="size-5" />} />
        <StatCard title="First Time Visitors" value={stats.firstTime} icon={<UserPlus className="size-5" />} />
        <StatCard title="Repeat Visitors" value={stats.repeat} icon={<Repeat className="size-5" />} />
        <StatCard title="Letters Received Today" value={stats.lettersToday} icon={<Mail className="size-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Today's Queue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base"><L>Today&apos;s Queue</L></CardTitle>
            <Link href="/visitor-desk/today">
              <Button variant="ghost" size="sm">
                <L>View all</L><ChevronRight className="size-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {todayQueue.length === 0 ? (
              <p className="px-6 py-8 text-sm text-text-muted text-center"><L>No visitors waiting</L></p>
            ) : (
              <ul className="divide-y divide-border-subtle">
                {todayQueue.map((v, i) => (
                  <li key={v.id}>
                    <Link
                      href={`/visitor-desk/${v.id}`}
                      className="flex items-center gap-3 px-6 py-3.5 hover:bg-background-muted/50 transition-colors"
                    >
                      <span className="flex size-6 items-center justify-center rounded-md bg-background-muted text-xs font-medium text-text-muted">
                        {i + 1}
                      </span>
                      <Avatar size="sm">
                        <AvatarFallback>{v.initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text-primary truncate">{v.fullName}</p>
                        <p className="text-xs text-text-muted">{v.purpose} · {formatVisitTime(v.visitTime)}</p>
                      </div>
                      <StatusBadge label={STATUS_LABELS[v.status]} status={getVisitStatusVariant(v.status)} showDot={false} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Visits */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base"><L>Upcoming Visits</L></CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-4"><L>No upcoming visits</L></p>
            ) : (
              upcoming.map((v) => (
                <Link
                  key={v.id}
                  href={`/visitor-desk/${v.id}`}
                  className="flex items-center gap-3 rounded-input border border-border-default p-3 hover:bg-background-muted/50 transition-colors"
                >
                  <Avatar size="sm">
                    <AvatarFallback>{v.initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary">{v.fullName}</p>
                    <p className="text-xs text-text-muted">{v.purpose} · {v.visitDate}</p>
                  </div>
                  <Badge variant="outline">{formatVisitTime(v.visitTime)}</Badge>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Visits */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base"><L>Recent Visits</L></CardTitle>
            <Link href="/visitor-desk/register">
              <Button variant="ghost" size="sm"><L>Register</L><ChevronRight className="size-4" /></Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border-subtle">
              {recent.map((v) => (
                <li key={v.id}>
                  <Link
                    href={`/visitor-desk/${v.id}`}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-background-muted/50 transition-colors"
                  >
                    <span className="font-mono text-xs text-accent-primary shrink-0">{v.token}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-text-primary truncate">{v.fullName}</p>
                      <p className="text-xs text-text-muted">{v.purpose}</p>
                    </div>
                    <StatusBadge label={STATUS_LABELS[v.status]} status={getVisitStatusVariant(v.status)} showDot={false} />
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Pending Follow-ups */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base"><L>Pending Follow-ups</L></CardTitle>
            <Link href="/visitor-desk/follow-ups">
              <Button variant="ghost" size="sm"><L>Calendar</L><ChevronRight className="size-4" /></Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {followUps.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-4"><L>No pending follow-ups</L></p>
            ) : (
              followUps.map((f) => (
                <Link
                  key={f.id}
                  href={`/visitor-desk/${f.visitId}`}
                  className="flex items-start gap-3 rounded-input border border-border-default p-3 hover:bg-background-muted/50 transition-colors"
                >
                  <div className={`flex size-8 shrink-0 items-center justify-center rounded-input ${f.status === "missed" ? "bg-semantic-danger-muted" : "bg-semantic-warning-muted"}`}>
                    <AlertCircle className={`size-4 ${f.status === "missed" ? "text-semantic-danger" : "text-semantic-warning"}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary">{f.personName}</p>
                    <p className="text-xs text-text-muted">{f.purpose} · {f.followUpDate}</p>
                    <p className="text-xs text-text-muted mt-0.5">{f.assignedStaff}</p>
                  </div>
                  <LBadge variant={f.status === "missed" ? "danger" : "warning"}>
                    {f.status === "missed" ? "Missed" : "Today"}
                  </LBadge>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
