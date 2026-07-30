"use client";

import * as React from "react";
import { AttachmentButton } from "@/components/shared/attachment-viewer-dialog";
import { MessageSquare, CheckSquare } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/ui/status-badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { demoCreated, demoSuccess } from "@/lib/demo";
import { useLocaleText } from "@/lib/i18n/locale-text";
import { formatOfficeDate, getTaskPriorityVariant, getTaskStatusVariant } from "@/modules/office-desk/lib/utils";
import { TASK_STATUS_LABELS } from "@/modules/office-desk/constants";
import type { OfficeTask, TaskStatus } from "@/modules/office-desk/types";

const CHECKLIST = [
  "Review pending documents",
  "Coordinate with ward office",
  "Prepare summary for MLA",
  "Follow up with department",
];

export function TaskDetailDrawer({
  task,
  open,
  onOpenChange,
}: {
  task: OfficeTask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const lt = useLocaleText();
  const [status, setStatus] = React.useState<TaskStatus>("pending");
  const [comment, setComment] = React.useState("");

  React.useEffect(() => {
    if (task) setStatus(task.status);
  }, [task]);

  if (!task) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side="right" className="sm:max-w-lg">
        <DrawerHeader>
          <DrawerTitle>{task.title}</DrawerTitle>
          <DrawerDescription>
            {lt("Assigned To")}: {task.assignedStaff} · {lt("Due")} {formatOfficeDate(task.dueDate)}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-6 space-y-5 pb-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant={getTaskPriorityVariant(task.priority)}>{lt(task.priority)}</Badge>
            <StatusBadge
              label={lt(TASK_STATUS_LABELS[task.status] ?? task.status)}
              status={getTaskStatusVariant(task.status)}
              showDot={false}
              className={task.status === "on-hold" ? "bg-violet-100 text-violet-700" : undefined}
            />
          </div>

          <div>
            <h4 className="text-sm font-medium text-text-primary mb-1">{lt("Description")}</h4>
            <p className="text-sm text-text-secondary">{task.description ?? "Internal office task for daily operations and constituency coordination."}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-text-primary mb-2">{lt("Checklist")}</h4>
            <ul className="space-y-2">
              {CHECKLIST.map((item, i) => (
                <li key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                  <CheckSquare className="size-4 text-accent-primary shrink-0" />
                  {lt(item)}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-text-primary mb-2">{lt("Attachments")}</h4>
            <AttachmentButton label="Attachments" />
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium text-text-primary mb-2">{lt("Comments")} ({task.comments})</h4>
            <div className="rounded-input border border-border-default p-3 text-sm text-text-secondary mb-3">
              <p className="flex items-center gap-1.5"><MessageSquare className="size-3.5" />Office Manager · 24 Jul 2026</p>
              <p className="mt-1">Please prioritize this before the ward meeting.</p>
            </div>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              rows={2}
            />
            <Button size="sm" className="mt-2" variant="outline" onClick={() => { demoSuccess("Comment added successfully."); setComment(""); }}>
              {lt("Add Comment")}
            </Button>
          </div>

          <div>
            <h4 className="text-sm font-medium text-text-primary mb-2">{lt("Change Status")}</h4>
            <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(TASK_STATUS_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{lt(v)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <h4 className="text-sm font-medium text-text-primary mb-2">{lt("History")}</h4>
            <ul className="text-xs text-text-muted space-y-1.5">
              <li>25 Jul 2026 — Task created</li>
              <li>24 Jul 2026 — Assigned to {task.assignedStaff}</li>
            </ul>
          </div>
        </div>

        <DrawerFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{lt("Cancel")}</Button>
          <Button onClick={() => { demoCreated("Task update"); onOpenChange(false); }}>{lt("Save")}</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
