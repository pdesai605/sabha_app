"use client";

import * as React from "react";
import { useTranslation } from "@/lib/i18n/context";
import { getOfficeEvents } from "@/lib/i18n/localized-demo-data";
import { demoSuccess, demoExported, demoImported, demoPrinted, demoAssigned, demoWhatsAppSent, demoSaved, demoDeleted } from "@/lib/demo";
import { Calendar, MapPin, Clock, LayoutGrid, List, Plus } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatOfficeDate, formatTime } from "@/modules/office-desk/lib/utils";
import { cn } from "@/lib/utils";

type ViewMode = "calendar" | "list" | "card";

const statusColors: Record<string, string> = {
  upcoming: "bg-accent-primary-muted text-accent-primary",
  ongoing: "bg-semantic-success-muted text-semantic-success",
  completed: "bg-background-muted text-text-muted",
  cancelled: "bg-semantic-danger-muted text-semantic-danger",
};

import { EventScheduleDialog } from "@/modules/office-desk/components/event-schedule-dialog";
import { L } from "@/components/shared/localized";

export function EventsPrograms() {
  const { locale } = useTranslation();
  const officeEvents = React.useMemo(() => getOfficeEvents(locale), [locale]);
  const [view, setView] = React.useState<ViewMode>("list");
  const [createOpen, setCreateOpen] = React.useState(false);
  const sorted = [...officeEvents].sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Office Desk", href: "/office-desk" }, { label: "Events & Programs" }]} className="md:hidden" />
      <PageHeader
        title="Events & Programs"
        description="Public meetings, ward visits, inaugurations, press conferences, and government programs."
        actions={<Button onClick={() => setCreateOpen(true)}><Plus className="size-4" /><L>Schedule Event</L></Button>}
      />

      <div className="flex items-center justify-between">
        <Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
          <TabsList>
            <TabsTrigger value="calendar"><Calendar className="size-4 mr-1.5" />Calendar</TabsTrigger>
            <TabsTrigger value="list"><List className="size-4 mr-1.5" />List</TabsTrigger>
            <TabsTrigger value="card"><LayoutGrid className="size-4 mr-1.5" />Cards</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === "calendar" && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="text-center text-xs font-medium text-text-muted py-2">{d}</div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 3;
                const dateStr = day > 0 && day <= 31 ? `2026-07-${String(day).padStart(2, "0")}` : null;
                const dayEvents = dateStr ? sorted.filter((e) => e.date === dateStr) : [];
                return (
                  <div
                    key={i}
                    className={cn(
                      "min-h-[72px] rounded-input border border-border-subtle p-1.5 text-xs",
                      dateStr === "2026-07-25" && "border-accent-primary/30 bg-accent-primary-muted/20"
                    )}
                  >
                    {day > 0 && day <= 31 && <span className="text-text-secondary font-medium">{day}</span>}
                    {dayEvents.slice(0, 2).map((e) => (
                      <div key={e.id} className="mt-0.5 truncate rounded px-1 py-0.5 bg-accent-primary-muted text-accent-primary text-[10px]">{e.type.split(" ")[0]}</div>
                    ))}
                    {dayEvents.length > 2 && <span className="text-[10px] text-text-muted">+{dayEvents.length - 2}</span>}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {view === "list" && (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-border-subtle">
              {sorted.map((e) => (
                <li key={e.id} className="flex items-center gap-4 px-6 py-4 hover:bg-background-muted/30 transition-colors">
                  <div className="flex size-10 shrink-0 flex-col items-center justify-center rounded-input bg-accent-primary-muted text-accent-primary">
                    <span className="text-[10px] font-medium">{e.date.split("-")[2]}</span>
                    <span className="text-[9px]">Jul</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary">{e.title}</p>
                    <div className="flex flex-wrap gap-2 mt-1 text-xs text-text-muted">
                      <span className="flex items-center gap-1"><MapPin className="size-3" />{e.location}</span>
                      <span className="flex items-center gap-1"><Clock className="size-3" />{formatTime(e.startTime)}</span>
                    </div>
                  </div>
                  <Badge variant="outline">{e.type}</Badge>
                  <Badge className={cn("border-0", statusColors[e.status])}>{e.status}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {view === "card" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((e) => (
            <Card key={e.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="outline" className="text-[10px]">{e.type}</Badge>
                  <Badge className={cn("border-0 text-[10px]", statusColors[e.status])}>{e.status}</Badge>
                </div>
                <p className="text-sm font-medium text-text-primary mt-3">{e.title}</p>
                <div className="mt-3 space-y-1 text-xs text-text-muted">
                  <p className="flex items-center gap-1.5"><Calendar className="size-3" />{formatOfficeDate(e.date)}</p>
                  <p className="flex items-center gap-1.5"><Clock className="size-3" />{formatTime(e.startTime)}{e.endTime && ` – ${formatTime(e.endTime)}`}</p>
                  <p className="flex items-center gap-1.5"><MapPin className="size-3" />{e.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <EventScheduleDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
