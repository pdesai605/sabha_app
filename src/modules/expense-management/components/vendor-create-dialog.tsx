"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormLayout, FormSection, FormField } from "@/components/forms/form-layout";
import { DemoFormDialog } from "@/components/shared/demo-form-dialog";

export function VendorCreateDialog({
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
      title="Add Vendor"
      description="Register a new vendor or service provider for office expenses."
      saveLabel="Save"
      createdMessage="Vendor"
    >
      <FormLayout>
        <FormSection>
          <FormField label="Vendor Name" required>
            <Input placeholder="Business name" />
          </FormField>
          <FormField label="Category">
            <Input placeholder="Printing, Fuel, Events..." />
          </FormField>
          <FormField label="Phone" required>
            <Input placeholder="Contact number" />
          </FormField>
          <FormField label="Email">
            <Input type="email" placeholder="vendor@example.in" />
          </FormField>
          <FormField label="GST Number">
            <Input placeholder="27AABCU9603R1ZM" />
          </FormField>
          <FormField label="Address">
            <Textarea rows={2} />
          </FormField>
          <FormField label="Bank Name">
            <Input placeholder="State Bank of India" />
          </FormField>
          <FormField label="Account Number">
            <Input />
          </FormField>
          <FormField label="IFSC">
            <Input placeholder="SBIN0001234" />
          </FormField>
        </FormSection>
      </FormLayout>
    </DemoFormDialog>
  );
}
