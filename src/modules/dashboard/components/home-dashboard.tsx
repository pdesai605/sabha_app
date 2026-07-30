"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  AlertCircle,
  FolderKanban,
  Wallet,
  Contact,
  ChevronRight,
  Bell,
  Clock,
  TrendingUp,
  UserPlus,
  UserCheck,
  FileText,
  Landmark,
  ClipboardCheck,
  Receipt,
  Gavel,
  MessageCircle,
  MapPin,
  Briefcase,
  Brain,
  Activity,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { L } from "@/components/shared/localized";
import { WhatsAppDialog } from "@/components/shared/whatsapp-dialog";
import { useTranslation } from "@/lib/i18n/context";
import { useLocaleText } from "@/lib/i18n/locale-text";
import { formatNumberForLocale } from "@/lib/i18n/numerals";
import { buildDashboardData } from "@/modules/dashboard/lib/dashboard-data";
import { getProgressColor } from "@/modules/governance/lib/utils";
import { cn } from "@/lib/utils";

function LinkedStatCard({
  href,
  ...props
}: React.ComponentProps<typeof StatCard> & { href: string }) {
  return (
    <Link href={href} className="block transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-card">
      <StatCard {...props} className={cn("h-full cursor-pointer", props.className)} />
    </Link>
  );
}

const activityIcons = {
  visitor: UserCheck,
  governance: Landmark,
  expense: Wallet,
  letters: FileText,
  office: Briefcase,
  people: Contact,
} as const;

const quickActions = [
  { label: "Add Person", href: "/people/new", icon: UserPlus },
  { label: "Register Visitor", href: "/visitor-desk/new", icon: UserCheck },
  { label: "New Appointment", href: "/office-desk/appointments", icon: Calendar },
  { label: "Create Letter", href: "/letters-documents/outward", icon: FileText },
  { label: "Register Complaint", href: "/governance/complaints", icon: AlertCircle },
  { label: "Record Expense", href: "/expense-management/expenses", icon: Receipt },
  { label: "Schedule Inspection", href: "/governance/inspections", icon: ClipboardCheck },
  { label: "New Project", href: "/governance/projects", icon: FolderKanban },
  { label: "Publish Tender", href: "/governance/tenders", icon: Gavel },
  { label: "Add Beneficiary", href: "/governance/schemes", icon: Landmark },
];

function BirthdayRow({
  item,
  onWhatsApp,
}: {
  item: ReturnType<typeof buildDashboardData>["upcomingBirthdays"][0];
  onWhatsApp: () => void;
}) {
  return (
    <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <Link href={item.href}>
        <Avatar className="size-9">
          <AvatarFallback className="text-xs">{item.initials}</AvatarFallback>
        </Avatar>
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={item.href} className="text-sm font-medium text-text-primary hover:text-accent-primary truncate block">
          {item.name}
        </Link>
        <p className="text-xs text-text-muted truncate">{item.designation}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-text-secondary hidden sm:inline">
          {item.date.slice(5).replace("-", "/")}
        </span>
        {item.mobile && (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="WhatsApp"
            className="text-[#25D366] hover:text-[#20BD5A] hover:bg-[#25D366]/10"
            onClick={onWhatsApp}
          >
            <MessageCircle className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function HomeDashboard() {
  const { locale } = useTranslation();
  const lt = useLocaleText();
  const data = React.useMemo(() => buildDashboardData(locale), [locale]);
  const [waOpen, setWaOpen] = React.useState(false);
  const [waTarget, setWaTarget] = React.useState<{ name: string; mobile: string } | null>(null);

  const openWhatsApp = (name: string, mobile?: string) => {
    if (!mobile) return;
    setWaTarget({ name, mobile });
    setWaOpen(true);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Today's constituency overview and office operations."
      />

      {/* Smart Summary */}
      <Card className="border-accent-primary/20 bg-gradient-to-br from-accent-primary-muted/40 to-background-secondary">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <p className="text-lg font-semibold text-text-primary">
                <L>Good Morning MLA</L> 👋
              </p>
              <p className="text-sm font-medium text-text-secondary">
                <L>Today's Summary</L>
              </p>
            </div>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-input bg-accent-primary-muted text-accent-primary">
              <Activity className="size-5" />
            </div>
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {data.summaryBullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent-primary" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Row 1 — Office Snapshot */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <LinkedStatCard
          href={data.kpis.todayVisitors.href}
          title="Today's Visitors"
          value={data.kpis.todayVisitors.value}
          trend={{ value: data.kpis.todayVisitors.trend, positive: data.kpis.todayVisitors.positive }}
          icon={<Users className="size-5" />}
        />
        <LinkedStatCard
          href={data.kpis.todayMeetings.href}
          title="Today's Meetings"
          value={data.kpis.todayMeetings.value}
          icon={<Calendar className="size-5" />}
        />
        <LinkedStatCard
          href={data.kpis.pendingComplaints.href}
          title="Pending Complaints"
          value={data.kpis.pendingComplaints.value}
          icon={<AlertCircle className="size-5" />}
        />
        <LinkedStatCard
          href={data.kpis.activeProjects.href}
          title="Active Development Projects"
          value={data.kpis.activeProjects.value}
          icon={<FolderKanban className="size-5" />}
        />
        <LinkedStatCard
          href={data.kpis.pendingExpenseApprovals.href}
          title="Pending Expense Approvals"
          value={data.kpis.pendingExpenseApprovals.value}
          icon={<Wallet className="size-5" />}
        />
        <LinkedStatCard
          href={data.kpis.peopleConnected.href}
          title="People Connected"
          value={data.kpis.peopleConnected.value}
          icon={<Contact className="size-5" />}
        />
      </div>

      {/* Row 2 — Schedule + Notifications */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="size-4 text-text-muted" />
              <L>Today's Schedule</L>
            </CardTitle>
            <Link href="/office-desk/appointments">
              <Button variant="ghost" size="sm">
                <L>All</L>
                <ChevronRight className="size-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-0">
            {data.todaySchedule.map((item, index) => (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-start gap-4 py-4 transition-colors hover:bg-background-muted/50 -mx-2 px-2 rounded-input",
                  index < data.todaySchedule.length - 1 && "border-b border-border-subtle"
                )}
              >
                <time className="w-12 shrink-0 text-sm font-medium text-accent-primary tabular-nums">
                  {item.time}
                </time>
                <div className="relative flex-1 min-w-0 pl-4 border-l-2 border-accent-primary/30">
                  <p className="text-sm font-medium text-text-primary">{item.title}</p>
                </div>
                <ChevronRight className="size-4 shrink-0 text-text-muted mt-0.5" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="size-4 text-text-muted" />
              <L>Recent Notifications</L>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border-subtle">
              {data.notifications.map((n) => (
                <li key={n.id}>
                  <Link
                    href={n.href}
                    className="flex items-center justify-between gap-3 px-6 py-3.5 hover:bg-background-muted/50 transition-colors"
                  >
                    <span className="text-sm text-text-primary">{n.text}</span>
                    <ChevronRight className="size-4 shrink-0 text-text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Row 3 — Progress + Pending Work */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="size-4 text-text-muted" />
              <L>Constituency Progress</L>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {data.constituencyProgress.map((item) => (
              <Link key={item.id} href={item.href} className="block group">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium text-text-primary group-hover:text-accent-primary transition-colors">
                    {item.label}
                  </span>
                  <span className="text-text-muted tabular-nums">
                    {formatNumberForLocale(item.value, locale)}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-background-muted overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", getProgressColor(item.value))}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              <L>Pending Work</L>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.pendingWork.map((item) => (
              <Link key={item.id} href={item.href}>
                <div className="flex items-center justify-between gap-3 rounded-input border border-border-default px-4 py-3 hover:border-border-strong hover:bg-background-muted/30 transition-colors">
                  <span className="text-sm text-text-primary">
                    <span className="font-semibold tabular-nums mr-1.5">
                      {formatNumberForLocale(item.count, locale)}
                    </span>
                    {item.label}
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-text-muted" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Row 4 — Activity Timeline */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="size-4 text-text-muted" />
            <L>Recent Activity Timeline</L>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {data.activityFeed.map((item, index) => {
              const Icon = activityIcons[item.icon];
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "flex items-start gap-4 py-4 hover:bg-background-muted/30 -mx-2 px-2 rounded-input transition-colors",
                    index < data.activityFeed.length - 1 && "border-b border-border-subtle"
                  )}
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-primary-muted text-accent-primary">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <time className="text-xs font-medium text-text-muted tabular-nums">{item.time}</time>
                    <p className="text-sm text-text-primary mt-0.5">{item.text}</p>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-text-muted mt-1" />
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Row 5 — Birthdays + Events */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">
              <L>Upcoming Birthdays</L>
            </CardTitle>
            <span className="text-xs text-text-muted">
              <L>Next 7 days</L>
            </span>
          </CardHeader>
          <CardContent className="divide-y divide-border-subtle">
            {data.upcomingBirthdays.map((item) => (
              <BirthdayRow
                key={item.id}
                item={item}
                onWhatsApp={() => openWhatsApp(item.name, item.mobile)}
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="size-4 text-text-muted" />
              <L>Upcoming Public Events</L>
            </CardTitle>
            <Link href="/office-desk/events">
              <Button variant="ghost" size="sm">
                <L>All</L>
                <ChevronRight className="size-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border-subtle">
              {data.upcomingEvents.map((event) => (
                <li key={event.id}>
                  <Link
                    href={event.href}
                    className="flex items-center justify-between gap-3 px-6 py-3.5 hover:bg-background-muted/50 transition-colors"
                  >
                    <span className="text-sm font-medium text-text-primary">{event.title}</span>
                    <ChevronRight className="size-4 shrink-0 text-text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            <L>Quick Actions</L>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <Link key={action.href + action.label} href={action.href}>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <action.icon className="size-3.5 text-text-muted" />
                  <L>{action.label}</L>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {waTarget && (
        <WhatsAppDialog
          open={waOpen}
          onOpenChange={setWaOpen}
          recipient={waTarget.name}
          mobile={waTarget.mobile}
          defaultMessage={lt("Warm wishes on your special day!")}
        />
      )}
    </div>
  );
}
