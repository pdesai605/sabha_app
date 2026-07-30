"use client";

import * as React from "react";
import { MapPin, Users, ClipboardList, Activity, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { booths } from "@/modules/voter-intelligence/data/voter-data";
import { getCoverageColor } from "@/modules/voter-intelligence/lib/utils";
import type { Booth } from "@/modules/voter-intelligence/types";

export function BoothsManagement() {
  const [selected, setSelected] = React.useState<Booth | null>(null);

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Voter Intelligence", href: "/voter-intelligence" }, { label: "Booths" }]} className="md:hidden" />
      <PageHeader
        title="Booth Management"
        description="Polling booth coverage, volunteer assignments, and survey progress across 24 booths."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {booths.map((booth) => (
          <Card
            key={booth.id}
            className="cursor-pointer hover:border-border-default transition-colors"
            onClick={() => setSelected(booth)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-lg font-semibold text-text-primary">{booth.name}</p>
                  <p className="text-xs text-text-muted mt-0.5">{booth.ward}</p>
                </div>
                <Badge variant="primary">{booth.coveragePercent}%</Badge>
              </div>

              <div className="mt-3 h-2 rounded-full bg-background-muted overflow-hidden">
                <div className={`h-full rounded-full ${getCoverageColor(booth.coveragePercent)}`} style={{ width: `${booth.coveragePercent}%` }} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-text-muted">
                  <Users className="size-3.5" />
                  <span>{booth.totalVoters.toLocaleString("en-IN")} voters</span>
                </div>
                <div className="flex items-center gap-1.5 text-text-muted">
                  <ClipboardList className="size-3.5" />
                  <span>{booth.pendingSurveys} pending</span>
                </div>
                <div className="flex items-center gap-1.5 text-text-muted col-span-2">
                  <MapPin className="size-3.5" />
                  <span>{booth.area}</span>
                </div>
              </div>

              <p className="text-xs text-text-secondary mt-3 line-clamp-2 flex items-start gap-1">
                <Activity className="size-3 shrink-0 mt-0.5" />
                {booth.recentActivity}
              </p>

              <Button variant="ghost" size="sm" className="w-full mt-3 gap-1">
                View Details<ChevronRight className="size-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
                <DialogDescription>{selected.ward} · {selected.area}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-text-muted">Total Voters</p><p className="text-lg font-semibold">{selected.totalVoters.toLocaleString("en-IN")}</p></div>
                  <div><p className="text-xs text-text-muted">Coverage</p><p className="text-lg font-semibold">{selected.coveragePercent}%</p></div>
                  <div><p className="text-xs text-text-muted">Survey Completion</p><p className="text-lg font-semibold">{selected.surveyCompletion}%</p></div>
                  <div><p className="text-xs text-text-muted">Pending Surveys</p><p className="text-lg font-semibold">{selected.pendingSurveys}</p></div>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-2">Volunteers</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.volunteers.map((v) => <Badge key={v} variant="outline">{v}</Badge>)}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Recent Activity</p>
                  <p className="text-sm text-text-secondary">{selected.recentActivity}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
