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
import { CONTACT_CATEGORIES } from "@/modules/office-desk/constants";

export function ContactCreateDialog({
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
      title="Add New Contact"
      description="Add government, municipal, or institutional contact for office coordination."
      saveLabel="Save Contact"
      createdMessage="Contact"
    >
      <FormLayout>
        <FormSection>
          <FormField label="Name" required>
            <Input placeholder="Full name" />
          </FormField>
          <FormField label="Designation">
            <Input placeholder="Deputy Commissioner" />
          </FormField>
          <FormField label="Department">
            <Input placeholder="Revenue Department" />
          </FormField>
          <FormField label="Office">
            <Input placeholder="Collector Office, Pune" />
          </FormField>
          <FormField label="Category">
            <Select defaultValue={CONTACT_CATEGORIES[0]}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CONTACT_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Phone" required>
            <Input placeholder="10-digit mobile" />
          </FormField>
          <FormField label="Email">
            <Input type="email" placeholder="name@office.gov.in" />
          </FormField>
          <FormField label="Address">
            <Textarea rows={2} placeholder="Office address" />
          </FormField>
          <FormField label="Notes">
            <Textarea rows={2} placeholder="Additional notes..." />
          </FormField>
        </FormSection>
      </FormLayout>
    </DemoFormDialog>
  );
}
