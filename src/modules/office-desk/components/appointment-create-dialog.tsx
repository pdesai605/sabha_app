"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormLayout, FormSection, FormField } from "@/components/forms/form-layout";
import { DemoFormDialog } from "@/components/shared/demo-form-dialog";
import { AttachmentButton } from "@/components/shared/attachment-viewer-dialog";
import { getAllPeople } from "@/modules/people/data/people";
import { DEPARTMENTS } from "@/modules/expense-management/constants";
import { WARDS } from "@/modules/people/constants";

const DURATIONS = ["15 min", "30 min", "45 min", "1 hour", "1.5 hours", "2 hours"];
const PRIORITIES = ["Low", "Normal", "High", "Urgent"];

export function AppointmentCreateDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const people = getAllPeople().slice(0, 20);

  return (
    <DemoFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="New Appointment"
      description="Schedule a meeting with a citizen, party worker, or stakeholder."
      saveLabel="Save Appointment"
      successMessage="Appointment Created Successfully (Demo)"
      size="xl"
    >
      <FormLayout>
        <FormSection>
          <FormField label="Visitor / Person" required>
            <Select defaultValue={people[0]?.id}>
              <SelectTrigger><SelectValue placeholder="Select person" /></SelectTrigger>
              <SelectContent>
                {people.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.fullName} — {p.mobile}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Purpose" required>
            <Input defaultValue="Constituency grievance discussion" />
          </FormField>
          <FormField label="Department">
            <Select defaultValue={DEPARTMENTS[0]}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Meeting With" required>
            <Input defaultValue="Hon. MLA — Constituency Office" />
          </FormField>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Date" required>
              <Input type="date" defaultValue="2026-07-30" />
            </FormField>
            <FormField label="Time" required>
              <Input type="time" defaultValue="11:00" />
            </FormField>
            <FormField label="Duration">
              <Select defaultValue={DURATIONS[2]}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DURATIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormField>
          </div>
          <FormField label="Priority">
            <Select defaultValue={PRIORITIES[1]}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Notes">
            <Textarea rows={3} placeholder="Meeting agenda, reference letters, prior follow-ups..." />
          </FormField>
          <FormField label="Attachments">
            <AttachmentButton label="Add Attachment" />
          </FormField>
          <FormField label="Reminder">
            <div className="flex items-center gap-3">
              <Switch defaultChecked id="appt-reminder" />
              <label htmlFor="appt-reminder" className="text-sm text-text-secondary">
                Send SMS reminder 1 day before appointment
              </label>
            </div>
          </FormField>
        </FormSection>
      </FormLayout>
    </DemoFormDialog>
  );
}
