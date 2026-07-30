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
import { AttachmentButton } from "@/components/shared/attachment-viewer-dialog";
import { WARDS } from "@/modules/people/constants";
import { EVENT_TYPES } from "@/modules/office-desk/constants";

export function EventScheduleDialog({
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
      title="Schedule New Event"
      description="Schedule public meetings, ward visits, inaugurations, and office programs."
      saveLabel="Save Event"
      createdMessage="Event"
      size="xl"
    >
      <FormLayout>
        <FormSection>
          <FormField label="Event Name" required>
            <Input defaultValue="Ward Development Review Meeting" />
          </FormField>
          <FormField label="Category">
            <Select defaultValue={EVENT_TYPES[0]}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Venue">
            <Input defaultValue="Ward Office, Shivajinagar" />
          </FormField>
          <FormField label="Ward">
            <Select defaultValue={WARDS[0]}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {WARDS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormField>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Date">
              <Input type="date" defaultValue="2026-07-30" />
            </FormField>
            <FormField label="Time">
              <Input type="time" defaultValue="11:00" />
            </FormField>
          </div>
          <FormField label="Guests">
            <Input defaultValue="Ward Councillors, Booth Agents, PMC Officials" />
          </FormField>
          <FormField label="Organizer">
            <Input defaultValue="Constituency Office — Program Coordinator" />
          </FormField>
          <FormField label="Notes">
            <Textarea rows={3} defaultValue="Monthly coordination meeting with ward stakeholders." />
          </FormField>
          <FormField label="Attachments">
            <AttachmentButton label="Add Attachment" />
          </FormField>
        </FormSection>
      </FormLayout>
    </DemoFormDialog>
  );
}
