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
import { WARDS, BOOTHS } from "@/modules/people/constants";
import { CAMPAIGN_TYPES } from "@/modules/voter-intelligence/constants";

export function CampaignCreateDialog({
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
      title="Plan New Campaign"
      description="Plan outreach activities with team assignment, budget, and schedule."
      saveLabel="Save Campaign"
      createdMessage="Campaign"
      size="xl"
    >
      <FormLayout>
        <FormSection>
          <FormField label="Campaign Name" required>
            <Input defaultValue="Ward 1 Door-to-Door Outreach" />
          </FormField>
          <FormField label="Objective" required>
            <Textarea rows={2} defaultValue="Increase voter contact and communicate MLA office development initiatives." />
          </FormField>
          <FormField label="Category">
            <Select defaultValue={CAMPAIGN_TYPES[0]}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CAMPAIGN_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Target Area">
            <Input defaultValue="Shivajinagar, Deccan" />
          </FormField>
          <FormField label="Ward">
            <Select defaultValue={WARDS[0]}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {WARDS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Booths">
            <Select defaultValue={BOOTHS[0]}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {BOOTHS.slice(0, 6).map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Team">
            <Input defaultValue="Youth Wing + Booth Agents" />
          </FormField>
          <FormField label="Budget">
            <Input defaultValue="₹ 75,000" />
          </FormField>
          <FormField label="Schedule">
            <Input defaultValue="25 Jul – 10 Aug 2026" />
          </FormField>
          <FormField label="Description">
            <Textarea rows={3} defaultValue="Coordinated field campaign with daily reporting from booth teams." />
          </FormField>
          <FormField label="Poster Upload">
            <Input type="file" accept="image/*" />
          </FormField>
          <FormField label="Status">
            <Select defaultValue="planned">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </FormSection>
      </FormLayout>
    </DemoFormDialog>
  );
}
