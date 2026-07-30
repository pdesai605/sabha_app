"use client";

import * as React from "react";
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
import { useTranslation } from "@/lib/i18n/context";
import { getExpenseCategories, getVendors } from "@/lib/i18n/localized-demo-data";
import { WARDS } from "@/modules/people/constants";
import { PAYMENT_MODES, DEPARTMENTS } from "@/modules/expense-management/constants";

export function ExpenseCreateDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { locale } = useTranslation();
  const expenseCategories = React.useMemo(() => getExpenseCategories(locale), [locale]);
  const vendors = React.useMemo(() => getVendors(locale), [locale]);

  return (
    <DemoFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Record Expense"
      description="Record office expenditure with category, vendor, and payment details."
      saveLabel="Save"
      createdMessage="Expense"
      size="lg"
    >
      <FormLayout>
        <FormSection>
          <FormField label="Date" required>
            <Input type="date" defaultValue="2026-07-25" />
          </FormField>
          <FormField label="Category" required>
            <Select defaultValue={expenseCategories[0]?.id}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {expenseCategories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Vendor">
            <Select defaultValue={vendors[0]?.id}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {vendors.slice(0, 10).map((v) => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Amount" required>
            <Input defaultValue="5000" />
          </FormField>
          <FormField label="Payment Mode">
            <Select defaultValue={PAYMENT_MODES[0]}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PAYMENT_MODES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Ward">
            <Select defaultValue={WARDS[0]}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {WARDS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Department">
            <Select defaultValue={DEPARTMENTS[0]}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Description">
            <Textarea rows={2} placeholder="Expense description..." />
          </FormField>
          <FormField label="Attachments">
            <Input type="file" />
          </FormField>
        </FormSection>
      </FormLayout>
    </DemoFormDialog>
  );
}
