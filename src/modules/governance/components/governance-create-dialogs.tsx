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
import { COMPLAINT_CATEGORIES } from "@/modules/governance/constants";

export function ProjectCreateDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <DemoFormDialog open={open} onOpenChange={onOpenChange} title="New Development Project" description="Register a new constituency development project for tracking and reporting." saveLabel="Create Project" createdMessage="Project" size="xl">
      <FormLayout>
        <FormSection>
          <FormField label="Project Name" required><Input defaultValue="Ward 12 Road Widening" /></FormField>
          <FormField label="Category"><Select defaultValue="Infrastructure"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Infrastructure">Infrastructure</SelectItem><SelectItem value="Social">Social</SelectItem><SelectItem value="Water">Water</SelectItem></SelectContent></Select></FormField>
          <FormField label="Ward"><Select defaultValue={WARDS[0]}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{WARDS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent></Select></FormField>
          <FormField label="Department"><Input defaultValue="Public Works Department" /></FormField>
          <FormField label="Budget (₹)"><Input type="number" defaultValue="2500000" /></FormField>
          <FormField label="Contractor"><Input defaultValue="Shree Construction Pvt. Ltd." /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Date"><Input type="date" defaultValue="2026-08-01" /></FormField>
            <FormField label="End Date"><Input type="date" defaultValue="2026-12-31" /></FormField>
          </div>
          <FormField label="Description"><Textarea rows={3} placeholder="Project scope and objectives..." /></FormField>
          <FormField label="Attachments"><AttachmentButton label="Add Attachment" /></FormField>
        </FormSection>
      </FormLayout>
    </DemoFormDialog>
  );
}

export function SchemeCreateDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <DemoFormDialog open={open} onOpenChange={onOpenChange} title="Add Government Scheme" description="Register a central or state scheme for beneficiary tracking." saveLabel="Add Scheme" createdMessage="Scheme" size="lg">
      <FormLayout>
        <FormSection>
          <FormField label="Scheme Name" required><Input defaultValue="PM Awas Yojana — Urban" /></FormField>
          <FormField label="Department"><Input defaultValue="Housing & Urban Development" /></FormField>
          <FormField label="Ward"><Select defaultValue={WARDS[0]}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{WARDS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent></Select></FormField>
          <FormField label="Budget (₹)"><Input type="number" defaultValue="5000000" /></FormField>
          <FormField label="Target Beneficiaries"><Input type="number" defaultValue="500" /></FormField>
          <FormField label="Notes"><Textarea rows={2} /></FormField>
        </FormSection>
      </FormLayout>
    </DemoFormDialog>
  );
}

export function PublicWorkCreateDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <DemoFormDialog open={open} onOpenChange={onOpenChange} title="Add Public Work" description="Register ongoing or planned public work in the constituency." saveLabel="Add Work" createdMessage="Public work" size="lg">
      <FormLayout>
        <FormSection>
          <FormField label="Work Type" required><Select defaultValue="Road Repair"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Road Repair">Road Repair</SelectItem><SelectItem value="Drainage">Drainage</SelectItem><SelectItem value="Street Lights">Street Lights</SelectItem><SelectItem value="Water Pipeline">Water Pipeline</SelectItem></SelectContent></Select></FormField>
          <FormField label="Ward"><Select defaultValue={WARDS[0]}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{WARDS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent></Select></FormField>
          <FormField label="Area"><Input defaultValue="Shivaji Nagar" /></FormField>
          <FormField label="Department"><Input defaultValue="Municipal Corporation" /></FormField>
          <FormField label="Contractor"><Input defaultValue="City Infra Works" /></FormField>
          <FormField label="Budget (₹)"><Input type="number" defaultValue="850000" /></FormField>
        </FormSection>
      </FormLayout>
    </DemoFormDialog>
  );
}

export function ComplaintRegisterDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <DemoFormDialog open={open} onOpenChange={onOpenChange} title="Register Complaint" description="Log a citizen grievance for follow-up and resolution tracking." saveLabel="Register Complaint" createdMessage="Complaint" size="xl">
      <FormLayout>
        <FormSection>
          <FormField label="Citizen Name" required><Input defaultValue="Rajesh Patil" /></FormField>
          <FormField label="Mobile"><Input defaultValue="9876543210" /></FormField>
          <FormField label="Category"><Select defaultValue={COMPLAINT_CATEGORIES[0]}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{COMPLAINT_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></FormField>
          <FormField label="Ward"><Select defaultValue={WARDS[0]}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{WARDS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent></Select></FormField>
          <FormField label="Priority"><Select defaultValue="normal"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="normal">Normal</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="urgent">Urgent</SelectItem></SelectContent></Select></FormField>
          <FormField label="Assigned Officer"><Input defaultValue="Ward Officer — Ward 12" /></FormField>
          <FormField label="Description" required><Textarea rows={4} defaultValue="Water supply disruption for 3 days in the area." /></FormField>
          <FormField label="Attachments"><AttachmentButton label="Add Attachment" /></FormField>
        </FormSection>
      </FormLayout>
    </DemoFormDialog>
  );
}

export function InspectionScheduleDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <DemoFormDialog open={open} onOpenChange={onOpenChange} title="Schedule Inspection" description="Schedule a site inspection for a development project or public work." saveLabel="Schedule Inspection" createdMessage="Inspection" size="lg">
      <FormLayout>
        <FormSection>
          <FormField label="Project / Work" required><Input defaultValue="Ward 12 Road Widening" /></FormField>
          <FormField label="Inspecting Officer"><Input defaultValue="Executive Engineer — PWD" /></FormField>
          <FormField label="Ward"><Select defaultValue={WARDS[0]}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{WARDS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent></Select></FormField>
          <FormField label="Inspection Date"><Input type="date" defaultValue="2026-08-05" /></FormField>
          <FormField label="Time"><Input type="time" defaultValue="10:30" /></FormField>
          <FormField label="Remarks"><Textarea rows={2} placeholder="Inspection checklist, safety requirements..." /></FormField>
        </FormSection>
      </FormLayout>
    </DemoFormDialog>
  );
}

export function TenderPublishDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <DemoFormDialog open={open} onOpenChange={onOpenChange} title="Publish Tender" description="Publish a tender notice for procurement or contract work." saveLabel="Publish Tender" createdMessage="Tender" size="xl">
      <FormLayout>
        <FormSection>
          <FormField label="Tender Title" required><Input defaultValue="Supply of LED Street Lights — Ward 8-12" /></FormField>
          <FormField label="Department"><Input defaultValue="Electrical Department" /></FormField>
          <FormField label="Estimated Cost (₹)"><Input type="number" defaultValue="1200000" /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Publish Date"><Input type="date" defaultValue="2026-07-28" /></FormField>
            <FormField label="Closing Date"><Input type="date" defaultValue="2026-08-15" /></FormField>
          </div>
          <FormField label="Eligibility Criteria"><Textarea rows={3} defaultValue="Registered contractors with minimum 3 years experience." /></FormField>
          <FormField label="Tender Document"><AttachmentButton label="Upload Tender Document" /></FormField>
        </FormSection>
      </FormLayout>
    </DemoFormDialog>
  );
}
