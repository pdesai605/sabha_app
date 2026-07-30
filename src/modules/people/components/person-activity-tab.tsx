import { Card, CardContent } from "@/components/ui/card";
import type { PersonActivity } from "@/modules/people/types";
import { formatPersonDateTime } from "@/modules/people/lib/utils";

interface PersonActivityTabProps {
  activities: PersonActivity[];
}

export function PersonActivityTab({ activities }: PersonActivityTabProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-sm text-text-muted">No activity recorded yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <ul className="divide-y divide-border-subtle">
          {activities.map((activity) => (
            <li key={activity.id} className="px-5 py-4 hover:bg-background-muted/30 transition-colors">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm text-text-primary">
                    <span className="font-medium">{activity.user}</span>{" "}
                    <span className="text-text-secondary">{activity.action.toLowerCase()}</span>
                    {activity.field && (
                      <>
                        {" "}
                        <span className="text-text-muted">{activity.field}</span>
                      </>
                    )}
                  </p>
                  {(activity.oldValue || activity.newValue) && (
                    <p className="text-xs text-text-muted mt-1">
                      {activity.oldValue && (
                        <span className="line-through">{activity.oldValue}</span>
                      )}
                      {activity.oldValue && activity.newValue && " → "}
                      {activity.newValue && (
                        <span className="text-text-secondary">{activity.newValue}</span>
                      )}
                    </p>
                  )}
                </div>
                <time className="text-xs text-text-muted shrink-0 mt-1 sm:mt-0">
                  {formatPersonDateTime(activity.timestamp)}
                </time>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
