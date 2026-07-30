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
import { DocumentEditorDialog } from "@/components/documents/document-editor-dialog";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useLocaleText } from "@/lib/i18n/locale-text";

const DEPARTMENTS = [
  "Revenue",
  "PMC — Engineering",
  "PMC — Health",
  "Police",
  "General Administration",
];

export function OutwardCreateDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const lt = useLocaleText();
  const [editorOpen, setEditorOpen] = React.useState(false);

  return (
    <>
      <DemoFormDialog
        open={open}
        onOpenChange={onOpenChange}
        title="Create New Outward"
        description="Prepare official outward correspondence from MLA office."
        saveLabel="Save"
        createdMessage="Outward letter"
        size="lg"
      >
        <FormLayout>
          <FormSection>
            <FormField label="Recipient" required>
              <Input defaultValue="Hon. District Collector, Pune" />
            </FormField>
            <FormField label="Department">
              <Select defaultValue={DEPARTMENTS[0]}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Reference">
              <Input defaultValue="Ref: MLA/PC/2026/1847" />
            </FormField>
            <FormField label="Subject" required>
              <Input defaultValue="Request for urgent intervention — road repair" />
            </FormField>
            <FormField label="Draft Letter">
              <Button type="button" variant="outline" className="w-full justify-start" onClick={() => setEditorOpen(true)}>
                <FileText className="size-4" />
                {lt("Open document editor")}
              </Button>
            </FormField>
            <FormField label="Attachments">
              <Input type="file" />
            </FormField>
          </FormSection>
        </FormLayout>
      </DemoFormDialog>
      <DocumentEditorDialog open={editorOpen} onOpenChange={setEditorOpen} title="Outward Letter Draft" />
    </>
  );
}
