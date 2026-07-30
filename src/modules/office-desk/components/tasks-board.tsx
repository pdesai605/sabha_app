"use client";

import * as React from "react";
import { useTranslation } from "@/lib/i18n/context";
import { getOfficeTasks } from "@/lib/i18n/localized-demo-data";
import { Plus, MessageSquare, LayoutGrid, List } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/status-badge";
import { L } from "@/components/shared/localized";
import { formatOfficeDate, getTaskStatusVariant, getTaskPriorityVariant } from "@/modules/office-desk/lib/utils";
import { TASK_STATUS_LABELS } from "@/modules/office-desk/constants";
import { TaskDetailDrawer } from "@/modules/office-desk/components/task-detail-drawer";
import { TaskCreateDialog } from "@/modules/office-desk/components/task-create-dialog";
import type { OfficeTask, TaskStatus } from "@/modules/office-desk/types";

type ViewMode = "board" | "list";

const boardColumns: { status: TaskStatus; label: string }[] = [
  { status: "pending", label: "Pending" },
  { status: "in-progress", label: "In Progress" },
  { status: "on-hold", label: "On Hold" },
  { status: "completed", label: "Completed" },
];

function TaskCard({ task, onOpen }: { task: OfficeTask; onOpen: (t: OfficeTask) => void }) {
  return (
    <Card className="cursor-pointer hover:border-border-default transition-colors" onClick={() => onOpen(task)}>
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-text-primary leading-snug">{task.title}</p>
          <Badge variant={getTaskPriorityVariant(task.priority)} className="text-[10px] shrink-0">{task.priority}</Badge>
        </div>
        <p className="text-xs text-text-muted">{task.assignedStaff}</p>
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>Due {formatOfficeDate(task.dueDate)}</span>
          {task.comments > 0 && (
            <span className="flex items-center gap-0.5"><MessageSquare className="size-3" />{task.comments}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function TasksBoard() {
  const { locale } = useTranslation();
  const officeTasks = React.useMemo(() => getOfficeTasks(locale), [locale]);
  const [view, setView] = React.useState<ViewMode>("board");
  const [statusFilter, setStatusFilter] = React.useState<TaskStatus | "all">("all");
  const [selectedTask, setSelectedTask] = React.useState<OfficeTask | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);

  const openTask = (task: OfficeTask) => {
    setSelectedTask(task);
    setDrawerOpen(true);
  };

  const filtered = statusFilter === "all" ? officeTasks : officeTasks.filter((t) => t.status === statusFilter);

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Office Desk", href: "/office-desk" }, { label: "Tasks" }]} className="md:hidden" />
      <PageHeader
        title="Tasks"
        description="Internal office task management — assignments, priorities, due dates, and progress tracking."
        actions={<Button onClick={() => setCreateOpen(true)}><Plus className="size-4" /><L>Add Task</L></Button>}
      />

      <div className="flex items-center justify-between">
        <Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
          <TabsList>
            <TabsTrigger value="board"><LayoutGrid className="size-4 mr-1.5" /><L>Board</L></TabsTrigger>
            <TabsTrigger value="list"><List className="size-4 mr-1.5" /><L>List</L></TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === "board" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {boardColumns.map((col) => {
            const items = officeTasks.filter((t) => t.status === col.status);
            return (
              <div key={col.status} className="rounded-card border border-border-default bg-background-muted/20 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-text-primary"><L>{col.label}</L></h3>
                  <Badge variant="outline">{items.length}</Badge>
                </div>
                <div className="space-y-2">
                  {items.slice(0, 8).map((t) => <TaskCard key={t.id} task={t} onOpen={openTask} />)}
                  {items.length > 8 && <p className="text-xs text-text-muted text-center pt-1">+{items.length - 8} more</p>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="flex gap-2 p-4 border-b border-border-subtle flex-wrap">
              <Button variant={statusFilter === "all" ? "secondary" : "ghost"} size="sm" onClick={() => setStatusFilter("all")}><L>All</L></Button>
              {boardColumns.map((col) => (
                <Button key={col.status} variant={statusFilter === col.status ? "secondary" : "ghost"} size="sm" onClick={() => setStatusFilter(col.status)}><L>{col.label}</L></Button>
              ))}
            </div>
            <ul className="divide-y divide-border-subtle">
              {filtered.map((t) => (
                <li key={t.id} className="flex items-center gap-4 px-6 py-4 hover:bg-background-muted/30 transition-colors cursor-pointer" onClick={() => openTask(t)}>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary">{t.title}</p>
                    <p className="text-xs text-text-muted mt-0.5">{t.assignedStaff} · Due {formatOfficeDate(t.dueDate)}</p>
                  </div>
                  <Badge variant={getTaskPriorityVariant(t.priority)}>{t.priority}</Badge>
                  <StatusBadge
                    label={TASK_STATUS_LABELS[t.status]}
                    status={getTaskStatusVariant(t.status)}
                    showDot={false}
                    className={t.status === "on-hold" ? "bg-violet-100 text-violet-700" : undefined}
                  />
                  {t.comments > 0 && (
                    <span className="flex items-center gap-1 text-xs text-text-muted"><MessageSquare className="size-3.5" />{t.comments}</span>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <TaskDetailDrawer task={selectedTask} open={drawerOpen} onOpenChange={setDrawerOpen} />
      <TaskCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
