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

const DEPARTMENTS = [
  "Revenue",
  "PMC — Engineering",
  "PMC — Health",
  "Police",
  "Electricity",
  "Water Supply",
  "General Administration",
];

export function InwardCreateDialog({
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
      title="Register New Inward"
      description="Register incoming government correspondence received at MLA office."
      saveLabel="Save"
      createdMessage="Inward letter"
      size="lg"
    >
      <FormLayout>
        <FormSection>
          <FormField label="Letter No" required>
            <Input defaultValue="INW/2026/1847" />
          </FormField>
          <FormField label="Department" required>
            <Select defaultValue={DEPARTMENTS[0]}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Sender" required>
            <Input defaultValue="District Collector, Pune" />
          </FormField>
          <FormField label="Received Date" required>
            <Input type="date" defaultValue="2026-07-25" />
          </FormField>
          <FormField label="Subject" required>
            <Input defaultValue="Regarding civic infrastructure development in Ward 1" />
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
          <FormField label="Attachments">
            <Input type="file" />
          </FormField>
          <FormField label="Notes">
            <Textarea rows={3} placeholder="Internal routing notes..." />
          </FormField>
        </FormSection>
      </FormLayout>
    </DemoFormDialog>
  );
}
