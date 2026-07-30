import {
  Phone,
  FileText,
  StickyNote,
  RefreshCw,
  Users,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PersonTimelineEvent } from "@/modules/people/types";
import { formatPersonDateTime } from "@/modules/people/lib/utils";
import { cn } from "@/lib/utils";

const typeConfig: Record<
  PersonTimelineEvent["type"],
  { icon: React.ReactNode; color: string; label: string }
> = {
  visit: { icon: <MapPin className="size-4" />, color: "bg-semantic-info-muted text-semantic-info", label: "Visit" },
  call: { icon: <Phone className="size-4" />, color: "bg-semantic-success-muted text-semantic-success", label: "Call" },
  document: { icon: <FileText className="size-4" />, color: "bg-accent-primary-muted text-accent-primary", label: "Document" },
  note: { icon: <StickyNote className="size-4" />, color: "bg-semantic-warning-muted text-semantic-warning", label: "Note" },
  update: { icon: <RefreshCw className="size-4" />, color: "bg-background-muted text-text-secondary", label: "Update" },
  meeting: { icon: <Users className="size-4" />, color: "bg-semantic-info-muted text-semantic-info", label: "Meeting" },
};

interface PersonTimelineTabProps {
  events: PersonTimelineEvent[];
}

export function PersonTimelineTab({ events }: PersonTimelineTabProps) {
  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-sm text-text-muted">No timeline events yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event, index) => {
        const config = typeConfig[event.type];
        const isLast = index === events.length - 1;

        return (
          <Card key={event.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex gap-0">
                <div className="flex flex-col items-center px-4 py-5">
                  <div
                    className={cn(
                      "flex size-9 items-center justify-center rounded-input",
                      config.color
                    )}
                  >
                    {config.icon}
                  </div>
                  {!isLast && (
                    <div className="mt-2 w-px flex-1 bg-border-default min-h-[24px]" />
                  )}
                </div>
                <div className="flex-1 py-5 pr-5 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-text-primary">
                          {event.title}
                        </h4>
                        <Badge variant="outline" className="text-[10px]">
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                    <time className="shrink-0 text-xs text-text-muted">
                      {formatPersonDateTime(event.timestamp)}
                    </time>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
