import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  Calendar,
  FileText,
  Users,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your office operations and key metrics."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Active Tasks"
          value="—"
          description="Awaiting module integration"
          icon={<Activity className="size-5" />}
        />
        <StatCard
          title="Scheduled Events"
          value="—"
          description="Awaiting module integration"
          icon={<Calendar className="size-5" />}
        />
        <StatCard
          title="Documents"
          value="—"
          description="Awaiting module integration"
          icon={<FileText className="size-5" />}
        />
        <StatCard
          title="Team Members"
          value="—"
          description="Awaiting module integration"
          icon={<Users className="size-5" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome to Sabha</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
            Your application shell and design system are ready. Future modules
            will plug into this layout while maintaining visual consistency
            across every screen.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
