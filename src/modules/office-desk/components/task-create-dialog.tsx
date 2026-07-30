"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormLayout, FormSection, FormField } from "@/components/forms/form-layout";
import { DemoFormDialog } from "@/components/shared/demo-form-dialog";
import { STAFF_MEMBERS } from "@/modules/office-desk/constants";

export function TaskCreateDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <DemoFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add Task"
      description="Assign internal office task with priority and due date."
      saveLabel="Save Task"
      createdMessage="Task"
    >
      <FormLayout>
        <FormSection>
          <FormField label="Subject" required>
            <Input defaultValue="Follow up with PMC on pending files" />
          </FormField>
          <FormField label="Description">
            <Textarea rows={3} defaultValue="Coordinate with municipal officials and prepare status update." />
          </FormField>
          <FormField label="Assigned To">
            <Select defaultValue={STAFF_MEMBERS[0]}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STAFF_MEMBERS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Priority">
            <Select defaultValue="normal">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Status">
            <Select defaultValue="pending">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Due Date">
            <Input type="date" defaultValue="2026-07-28" />
          </FormField>
        </FormSection>
      </FormLayout>
    </DemoFormDialog>
  );
}
