"use client";

import Link from "next/link";
import { Calendar, AlertCircle, Clock, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFollowUps, VISITOR_DESK_TODAY } from "@/modules/visitor-desk/data/visits";
import { formatVisitDate } from "@/modules/visitor-desk/lib/utils";

export function FollowUpCalendar() {
  const allFollowUps = getFollowUps();
  const today = allFollowUps.filter((f) => f.status === "today");
  const upcoming = allFollowUps.filter((f) => f.status === "upcoming");
  const missed = allFollowUps.filter((f) => f.status === "missed");

  function FollowUpList({ items }: { items: typeof allFollowUps }) {
    if (items.length === 0) {
      return <p className="text-sm text-text-muted text-center py-8">No follow-ups in this category.</p>;
    }
    return (
      <div className="space-y-2">
        {items.map((f) => (
          <Link
            key={f.id}
            href={`/visitor-desk/${f.visitId}`}
            className="flex items-center gap-3 rounded-input border border-border-default p-4 hover:bg-background-muted/50 transition-colors"
          >
            <div className={`flex size-9 shrink-0 items-center justify-center rounded-input ${
              f.status === "missed" ? "bg-semantic-danger-muted" :
              f.status === "today" ? "bg-semantic-warning-muted" : "bg-accent-primary-muted"
            }`}>
              {f.status === "missed" ? (
                <AlertCircle className="size-4 text-semantic-danger" />
              ) : f.status === "today" ? (
                <Clock className="size-4 text-semantic-warning" />
              ) : (
                <Calendar className="size-4 text-accent-primary" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-text-primary">{f.personName}</p>
              <p className="text-xs text-text-muted">{f.purpose} · {f.assignedStaff}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-medium text-text-primary">{formatVisitDate(f.followUpDate)}</p>
              <Badge
                variant={f.status === "missed" ? "danger" : f.status === "today" ? "warning" : "outline"}
                className="mt-1"
              >
                {f.status === "missed" ? "Missed" : f.status === "today" ? "Today" : "Upcoming"}
              </Badge>
            </div>
            <ChevronRight className="size-4 text-text-muted shrink-0" />
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Visitor Desk", href: "/visitor-desk" },
          { label: "Follow-ups" },
        ]}
        className="md:hidden"
      />

      <PageHeader
        title="Follow-up Calendar"
        description={`Track upcoming and overdue follow-ups. Today: ${VISITOR_DESK_TODAY}`}
      />

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-semibold text-semantic-warning">{today.length}</p>
            <p className="text-xs text-text-muted mt-1">Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-semibold text-accent-primary">{upcoming.length}</p>
            <p className="text-xs text-text-muted mt-1">Upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-semibold text-semantic-danger">{missed.length}</p>
            <p className="text-xs text-text-muted mt-1">Missed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today">
        <TabsList>
          <TabsTrigger value="today">Today ({today.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="missed">Missed ({missed.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="today"><Card><CardContent className="p-4"><FollowUpList items={today} /></CardContent></Card></TabsContent>
        <TabsContent value="upcoming"><Card><CardContent className="p-4"><FollowUpList items={upcoming} /></CardContent></Card></TabsContent>
        <TabsContent value="missed"><Card><CardContent className="p-4"><FollowUpList items={missed} /></CardContent></Card></TabsContent>
      </Tabs>
    </div>
  );
}
