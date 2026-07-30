"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormLayout, FormSection, FormField } from "@/components/forms/form-layout";
import { DemoFormDialog } from "@/components/shared/demo-form-dialog";

export function DispatchCreateDialog({
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
      title="Record New Dispatch"
      description="Record courier, speed post, or hand delivery dispatch details."
      saveLabel="Save"
      createdMessage="Dispatch record"
    >
      <FormLayout>
        <FormSection>
          <FormField label="Delivery Method" required>
            <Select defaultValue="speed-post">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="courier">Courier</SelectItem>
                <SelectItem value="speed-post">Speed Post</SelectItem>
                <SelectItem value="hand">Hand Delivery</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Courier">
            <Input defaultValue="India Post — Speed Post" />
          </FormField>
          <FormField label="Tracking Number">
            <Input defaultValue="SP202607251847IN" />
          </FormField>
          <FormField label="Recipient" required>
            <Input defaultValue="District Collector Office, Pune" />
          </FormField>
          <FormField label="Dispatch Date" required>
            <Input type="date" defaultValue="2026-07-25" />
          </FormField>
          <FormField label="Reference">
            <Input defaultValue="OUT/2026/0892" />
          </FormField>
        </FormSection>
      </FormLayout>
    </DemoFormDialog>
  );
}
