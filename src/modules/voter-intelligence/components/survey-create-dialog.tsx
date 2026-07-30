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
import { WARDS, BOOTHS } from "@/modules/people/constants";
import { FIELD_VOLUNTEERS } from "@/modules/voter-intelligence/constants";

export function SurveyCreateDialog({
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
      title="Create New Survey"
      description="Define survey scope, volunteers, and timeline for field data collection."
      saveLabel="Save Survey"
      createdMessage="Survey"
      size="xl"
    >
      <FormLayout>
        <FormSection>
          <FormField label="Survey Name" required>
            <Input placeholder="Booth-level voter sentiment survey" defaultValue="Constituency Pulse Survey 2026" />
          </FormField>
          <FormField label="Description">
            <Textarea rows={3} defaultValue="Door-to-door survey to assess voter inclination and local issues across selected booths." />
          </FormField>
          <FormField label="Survey Type" required>
            <Select defaultValue="door-to-door">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="door-to-door">Door-to-Door</SelectItem>
                <SelectItem value="phone">Phone Survey</SelectItem>
                <SelectItem value="booth">Booth Survey</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Ward" required>
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
                {BOOTHS.slice(0, 8).map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Assigned Volunteers">
            <Select defaultValue={FIELD_VOLUNTEERS[0]}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {FIELD_VOLUNTEERS.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Questions">
            <Textarea rows={4} defaultValue={"1. Are you satisfied with local civic services?\n2. Which party do you intend to support?\n3. Any pending issues in your area?"} />
          </FormField>
          <FormField label="Start Date">
            <Input type="date" defaultValue="2026-07-25" />
          </FormField>
          <FormField label="End Date">
            <Input type="date" defaultValue="2026-08-15" />
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
          <FormField label="Priority">
            <Select defaultValue="high">
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
        </FormSection>
      </FormLayout>
    </DemoFormDialog>
  );
}
