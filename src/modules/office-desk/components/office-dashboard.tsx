"use client";

import Link from "next/link";
import {
  Calendar,
  MapPin,
  CheckSquare,
  CheckCircle2,
  Gift,
  FileText,
  Contact,
  Activity,
  Plus,
  ChevronRight,
  Clock,
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
import {
  getDashboardStats,
  getTodayAppointments,
  officeEvents,
  officeTasks,
  recentActivities,
} from "@/modules/office-desk/data/office-data";
import { enrichAppointments, formatTime, formatOfficeDateTime, getAppointmentStatusVariant, getTaskStatusVariant } from "@/modules/office-desk/lib/utils";
import { APPOINTMENT_STATUS_LABELS, TASK_STATUS_LABELS, OFFICE_TODAY } from "@/modules/office-desk/constants";

const quickActions = [
  { label: "New Appointment", href: "/office-desk/appointments", icon: Calendar },
  { label: "Add Task", href: "/office-desk/tasks", icon: CheckSquare },
  { label: "Schedule Event", href: "/office-desk/events", icon: MapPin },
  { label: "Send Greeting", href: "/office-desk/greetings", icon: Gift },
  { label: "Draft Press Note", href: "/office-desk/press-notes", icon: FileText },
];

export function OfficeDashboard() {
  const stats = getDashboardStats();
  const todaySchedule = enrichAppointments(getTodayAppointments()).sort((a, b) => a.time.localeCompare(b.time));
  const upcomingEvents = officeEvents.filter((e) => e.date >= OFFICE_TODAY && e.status !== "completed").slice(0, 5);
  const recentTasks = officeTasks.filter((t) => t.status !== "completed").slice(0, 6);

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Office Desk" }]} className="md:hidden" />

      <PageHeader
        title="Office Desk"
        description="Daily operational workspace — appointments, events, tasks, contacts, and communications."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Today's Appointments" value={stats.todayAppointments} icon={<Calendar className="size-5" />} />
        <StatCard title="Upcoming Events" value={stats.upcomingEvents} icon={<MapPin className="size-5" />} />
        <StatCard title="Pending Tasks" value={stats.pendingTasks} icon={<CheckSquare className="size-5" />} />
        <StatCard title="Completed Tasks" value={stats.completedTasks} icon={<CheckCircle2 className="size-5" />} />
        <StatCard title="Today's Greetings" value={stats.todayGreetings} icon={<Gift className="size-5" />} />
        <StatCard title="Press Notes Draft" value={stats.pressNotesDraft} icon={<FileText className="size-5" />} />
        <StatCard title="Office Contacts" value={stats.officeContacts} icon={<Contact className="size-5" />} />
        <StatCard title="Recent Activities" value={recentActivities.length} icon={<Activity className="size-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base"><L>Today&apos;s Schedule</L></CardTitle>
            <Link href="/office-desk/appointments"><Button variant="ghost" size="sm"><L>All</L><ChevronRight className="size-4" /></Button></Link>
          </CardHeader>
          <CardContent className="p-0">
            {todaySchedule.length === 0 ? (
              <p className="px-6 py-8 text-sm text-text-muted text-center"><L>No appointments today</L></p>
            ) : (
              <ul className="divide-y divide-border-subtle">
                {todaySchedule.map((a) => (
                  <li key={a.id}>
                    <Link href={`/people/${a.personId}`} className="flex items-center gap-3 px-6 py-3.5 hover:bg-background-muted/50 transition-colors">
                      <span className="text-xs font-mono text-text-muted w-16 shrink-0">{formatTime(a.time)}</span>
                      <Avatar size="sm"><AvatarFallback>{a.initials}</AvatarFallback></Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text-primary truncate">{a.fullName}</p>
                        <p className="text-xs text-text-muted">{a.purpose} · {a.meetingWith}</p>
                      </div>
                      <StatusBadge label={APPOINTMENT_STATUS_LABELS[a.status]} status={getAppointmentStatusVariant(a.status)} showDot={false} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
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
            <CardTitle className="text-base"><L>Upcoming Events</L></CardTitle>
            <Link href="/office-desk/events"><Button variant="ghost" size="sm"><L>View</L><ChevronRight className="size-4" /></Button></Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.map((e) => (
              <div key={e.id} className="rounded-input border border-border-default p-3">
                <p className="text-sm font-medium text-text-primary">{e.title}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                  <Calendar className="size-3" />{e.date}
                  <Clock className="size-3 ml-1" />{formatTime(e.startTime)}
                </div>
                <Badge variant="outline" className="mt-2 text-[10px]">{e.type}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base"><L>Recent Tasks</L></CardTitle>
            <Link href="/office-desk/tasks"><Button variant="ghost" size="sm"><L>Board</L><ChevronRight className="size-4" /></Button></Link>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border-subtle">
              {recentTasks.map((t) => (
                <li key={t.id} className="flex items-center gap-3 px-6 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-text-primary truncate">{t.title}</p>
                    <p className="text-xs text-text-muted">{t.assignedStaff}</p>
                  </div>
                  <StatusBadge label={TASK_STATUS_LABELS[t.status]} status={getTaskStatusVariant(t.status)} showDot={false} />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base"><L>Recent Activities</L></CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((a) => (
              <div key={a.id} className="text-sm">
                <p className="text-text-primary"><span className="font-medium">{a.user}</span> — {a.action}</p>
                <p className="text-xs text-text-muted mt-0.5">{a.detail}</p>
                <p className="text-xs text-text-muted">{formatOfficeDateTime(a.timestamp)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
