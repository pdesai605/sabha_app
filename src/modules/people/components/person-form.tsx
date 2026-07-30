"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import {
  FormLayout,
  FormSection,
  FormField,
  FormRow,
  FormActions,
} from "@/components/forms/form-layout";
import {
  WARDS,
  BOOTHS,
  AREAS,
  PERSON_TAGS,
  PARTY_AFFILIATIONS,
  POLITICAL_DESIGNATIONS,
} from "@/modules/people/constants";
import type { PersonFormValues } from "@/modules/people/lib/utils";
import { cn } from "@/lib/utils";

const emptyDefaults: PersonFormValues = {
  firstName: "",
  lastName: "",
  gender: "male",
  dateOfBirth: "",
  mobile: "",
  alternateMobile: "",
  email: "",
  whatsapp: "",
  line1: "",
  line2: "",
  city: "Pune",
  district: "Pune",
  state: "Maharashtra",
  pincode: "",
  area: "",
  ward: "",
  booth: "",
  politicalDesignation: "",
  partyAffiliation: "",
  voterId: "",
  facebook: "",
  twitter: "",
  instagram: "",
  linkedin: "",
  tags: [],
  status: "active",
  notes: "",
};

interface PersonFormProps {
  mode: "create" | "edit";
  initialData?: PersonFormValues;
  personId?: string;
}

export function PersonForm({ mode, initialData, personId }: PersonFormProps) {
  const router = useRouter();
  const [files, setFiles] = React.useState<File[]>([]);
  const [selectedTags, setSelectedTags] = React.useState<string[]>(
    initialData?.tags ?? []
  );

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = (draft = false) => {
    toast.success(
      draft
        ? "Draft saved successfully"
        : mode === "create"
          ? "Person created successfully"
          : "Person updated successfully"
    );
    if (!draft) {
      router.push(mode === "edit" && personId ? `/people/${personId}` : "/people");
    }
  };

  return (
    <FormLayout
      footer={
        <FormActions>
          <Link
            href={
              mode === "edit" && personId ? `/people/${personId}` : "/people"
            }
          >
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button variant="secondary" onClick={() => handleSave(true)}>
            Save Draft
          </Button>
          <Button onClick={() => handleSave(false)}>
            {mode === "create" ? "Save Person" : "Update Person"}
          </Button>
        </FormActions>
      }
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Primary identity and personal details.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormSection>
              <FormField label="First Name" required htmlFor="firstName">
                <Input
                  id="firstName"
                  defaultValue={initialData?.firstName}
                  placeholder="Enter first name"
                />
              </FormField>
              <FormField label="Last Name" required htmlFor="lastName">
                <Input
                  id="lastName"
                  defaultValue={initialData?.lastName}
                  placeholder="Enter last name"
                />
              </FormField>
              <FormField label="Gender">
                <Select defaultValue={initialData?.gender ?? "male"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Date of Birth" htmlFor="dob">
                <Input
                  id="dob"
                  type="date"
                  defaultValue={initialData?.dateOfBirth}
                />
              </FormField>
              <FormField label="Status">
                <Select defaultValue={initialData?.status ?? "active"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </FormSection>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Phone numbers and email for communication.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormSection>
              <FormField label="Primary Mobile" required htmlFor="mobile">
                <Input
                  id="mobile"
                  defaultValue={initialData?.mobile}
                  placeholder="10-digit mobile number"
                />
              </FormField>
              <FormField label="Alternate Mobile" htmlFor="altMobile">
                <Input
                  id="altMobile"
                  defaultValue={initialData?.alternateMobile}
                  placeholder="Optional alternate number"
                />
              </FormField>
              <FormField label="WhatsApp Number" htmlFor="whatsapp">
                <Input
                  id="whatsapp"
                  defaultValue={initialData?.whatsapp}
                  placeholder="WhatsApp number"
                />
              </FormField>
              <FormField label="Email" htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  defaultValue={initialData?.email}
                  placeholder="email@example.com"
                />
              </FormField>
            </FormSection>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
            <CardDescription>Residential address and electoral geography.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormSection>
              <FormRow>
                <FormField label="Address Line 1" required htmlFor="line1">
                  <Input
                    id="line1"
                    defaultValue={initialData?.line1}
                    placeholder="Street address"
                  />
                </FormField>
              </FormRow>
              <FormRow>
                <FormField label="Address Line 2" htmlFor="line2">
                  <Input
                    id="line2"
                    defaultValue={initialData?.line2}
                    placeholder="Apartment, landmark, etc."
                  />
                </FormField>
              </FormRow>
              <FormField label="City" htmlFor="city">
                <Input id="city" defaultValue={initialData?.city ?? "Pune"} />
              </FormField>
              <FormField label="District" htmlFor="district">
                <Input id="district" defaultValue={initialData?.district ?? "Pune"} />
              </FormField>
              <FormField label="State" htmlFor="state">
                <Input id="state" defaultValue={initialData?.state ?? "Maharashtra"} />
              </FormField>
              <FormField label="Pincode" htmlFor="pincode">
                <Input id="pincode" defaultValue={initialData?.pincode} placeholder="411001" />
              </FormField>
              <FormField label="Area">
                <Select defaultValue={initialData?.area || undefined}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    {AREAS.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Ward">
                <Select defaultValue={initialData?.ward || undefined}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ward" />
                  </SelectTrigger>
                  <SelectContent>
                    {WARDS.map((ward) => (
                      <SelectItem key={ward} value={ward}>
                        {ward}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Booth">
                <Select defaultValue={initialData?.booth || undefined}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select booth" />
                  </SelectTrigger>
                  <SelectContent>
                    {BOOTHS.map((booth) => (
                      <SelectItem key={booth} value={booth}>
                        {booth}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </FormSection>
          </CardContent>
        </Card>

        {/* Political Information */}
        <Card>
          <CardHeader>
            <CardTitle>Political Information</CardTitle>
            <CardDescription>Designation, affiliation, and voter details.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormSection>
              <FormField label="Political Designation">
                <Select defaultValue={initialData?.politicalDesignation || undefined}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    {POLITICAL_DESIGNATIONS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Party Affiliation">
                <Select defaultValue={initialData?.partyAffiliation || undefined}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select party" />
                  </SelectTrigger>
                  <SelectContent>
                    {PARTY_AFFILIATIONS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormRow>
                <FormField label="Voter ID" htmlFor="voterId">
                  <Input
                    id="voterId"
                    defaultValue={initialData?.voterId}
                    placeholder="MH/XX/XXX/XXXXXX"
                  />
                </FormField>
              </FormRow>
            </FormSection>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>Social profiles and online presence.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormSection>
              <FormField label="Facebook" htmlFor="facebook">
                <Input id="facebook" defaultValue={initialData?.facebook} placeholder="Username or URL" />
              </FormField>
              <FormField label="Twitter / X" htmlFor="twitter">
                <Input id="twitter" defaultValue={initialData?.twitter} placeholder="@handle" />
              </FormField>
              <FormField label="Instagram" htmlFor="instagram">
                <Input id="instagram" defaultValue={initialData?.instagram} placeholder="@handle" />
              </FormField>
              <FormField label="LinkedIn" htmlFor="linkedin">
                <Input id="linkedin" defaultValue={initialData?.linkedin} placeholder="Profile URL" />
              </FormField>
            </FormSection>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>Categorize this person for easy filtering.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {PERSON_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      isSelected
                        ? "border-accent-primary/30 bg-accent-primary-muted text-accent-primary"
                        : "border-border-default bg-background-secondary text-text-secondary hover:bg-background-muted"
                    )}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
            {selectedTags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="primary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Internal office notes about this person.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              defaultValue={initialData?.notes}
              placeholder="Add internal notes..."
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card>
          <CardHeader>
            <CardTitle>Attachments</CardTitle>
            <CardDescription>Upload documents, ID proofs, and related files.</CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload
              value={files}
              onChange={setFiles}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              multiple
            />
          </CardContent>
        </Card>
      </div>
    </FormLayout>
  );
}

export { emptyDefaults as emptyPersonFormDefaults };
