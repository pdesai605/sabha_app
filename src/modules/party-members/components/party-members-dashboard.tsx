"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  Building2,
  Landmark,
  Megaphone,
  Layers,
  UserPlus,
  Cake,
  Heart,
  Clock,
  ArrowRightLeft,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { useTranslation } from "@/lib/i18n/context";
import { getPartyMembers } from "@/lib/i18n/localized-demo-data";
import {
  getDashboardStats,
  recentTransfers,
  recentRoleChanges,
} from "@/modules/party-members/data/members";
import { enrichMembers, formatJoiningDate, getMemberStatusVariant } from "@/modules/party-members/lib/utils";
import { formatPersonDateTime } from "@/modules/people/lib/utils";

export function PartyMembersDashboard() {
  const { locale } = useTranslation();
  const partyMembers = React.useMemo(() => getPartyMembers(locale), [locale]);
  const stats = getDashboardStats();
  const recentMembers = enrichMembers(
    [...partyMembers]
      .sort((a, b) => b.joiningDate.localeCompare(a.joiningDate))
      .slice(0, 6),
    locale
  );

  return (
    <div className="space-y-8">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Party Members" }]}
        className="md:hidden"
      />

      <PageHeader
        title="Party Members"
        description="Operational overview of your complete political organization — corporation, panchayat, party structure, morchas, and committees."
        actions={
          <Link href="/party-members/new">
            <Button>Add Member</Button>
          </Link>
        }
      />

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Members" value={stats.totalMembers} icon={<Users className="size-5" />} />
        <StatCard title="Active Members" value={stats.activeMembers} description={`${Math.round((stats.activeMembers / stats.totalMembers) * 100)}% of total`} icon={<UserCheck className="size-5" />} trend={{ value: "+8 this month", positive: true }} />
        <StatCard title="Corporation Members" value={stats.corporationMembers} icon={<Building2 className="size-5" />} />
        <StatCard title="Panchayat Members" value={stats.panchayatMembers} icon={<Landmark className="size-5" />} />
        <StatCard title="Morcha Members" value={stats.morchaMembers} icon={<Megaphone className="size-5" />} />
        <StatCard title="Committee Members" value={stats.committeeMembers} icon={<Layers className="size-5" />} />
        <StatCard title="Recent Joins" value={stats.recentJoins} description="Joined in 2026" icon={<UserPlus className="size-5" />} />
        <StatCard title="Birthday Today" value={stats.birthdayToday} icon={<Cake className="size-5" />} />
        <StatCard title="Anniversaries" value={stats.anniversaries} description="Membership anniversaries today" icon={<Heart className="size-5" />} />
      </div>

      {/* Activity sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Members */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Members</CardTitle>
            <Link href="/party-members/party">
              <Button variant="ghost" size="sm">View all<ChevronRight className="size-4" /></Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border-subtle">
              {recentMembers.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/people/${m.personId}`}
                    className="flex items-center gap-3 px-6 py-3.5 hover:bg-background-muted/50 transition-colors"
                  >
                    <Avatar size="sm">
                      <AvatarFallback>{m.initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text-primary truncate">{m.fullName}</p>
                      <p className="text-xs text-text-muted">{m.designation} · {m.ward}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <StatusBadge label={m.status} status={getMemberStatusVariant(m.status)} showDot={false} />
                      <p className="text-xs text-text-muted mt-1">{formatJoiningDate(m.joiningDate)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Pending Approvals</CardTitle>
            <Badge variant="warning">{partyMembers.filter((m) => m.status === "pending").length}</Badge>
          </CardHeader>
          <CardContent className="p-0">
            {partyMembers.filter((m) => m.status === "pending").length === 0 ? (
              <p className="px-6 py-8 text-sm text-text-muted text-center">No pending approvals</p>
            ) : (
              <ul className="divide-y divide-border-subtle">
                {enrichMembers(partyMembers.filter((m) => m.status === "pending").slice(0, 5), locale).map((m) => (
                  <li key={m.id} className="flex items-center gap-3 px-6 py-3.5">
                    <div className="flex size-8 items-center justify-center rounded-input bg-semantic-warning-muted">
                      <ShieldCheck className="size-4 text-semantic-warning" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text-primary">{m.fullName}</p>
                      <p className="text-xs text-text-muted">{m.designation} · {m.organizationType}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" variant="outline">Review</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Recent Transfers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ArrowRightLeft className="size-4 text-text-muted" />
              Recent Transfers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransfers.map((t) => (
              <div key={t.id} className="rounded-input border border-border-default p-4">
                <p className="text-sm font-medium text-text-primary">{t.memberName}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-text-secondary">
                  <span className="truncate">{t.fromWard}</span>
                  <ArrowRightLeft className="size-3 shrink-0 text-text-muted" />
                  <span className="truncate font-medium text-text-primary">{t.toWard}</span>
                </div>
                <p className="text-xs text-text-muted mt-2">{t.reason}</p>
                <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                  <Clock className="size-3" />
                  Effective {t.effectiveDate}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Role Changes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Role Changes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentRoleChanges.map((rc) => (
              <div key={rc.id} className="flex items-start gap-3 rounded-input border border-border-default p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary">{rc.memberName}</p>
                  <p className="text-xs text-text-secondary mt-1">
                    <span className="line-through text-text-muted">{rc.fromRole}</span>
                    {" → "}
                    <span className="font-medium text-accent-primary">{rc.toRole}</span>
                  </p>
                </div>
                <time className="text-xs text-text-muted shrink-0">
                  {formatPersonDateTime(rc.changedAt)}
                </time>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
