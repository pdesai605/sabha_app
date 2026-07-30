"use client";

import * as React from "react";
import { demoSuccess, demoExported, demoImported, demoPrinted, demoAssigned, demoWhatsAppSent, demoSaved, demoDeleted } from "@/lib/demo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import {
  FormLayout,
  FormSection,
  FormField,
  FormActions,
} from "@/components/forms/form-layout";
import type { PartyMember } from "@/modules/party-members/types";
import { useTranslation } from "@/lib/i18n/context";
import { getPersonById } from "@/lib/i18n/localized-demo-data";
import {
  ORGANIZATION_LABELS,
  getDesignationsForOrg,
  COMMITTEES,
  MORCHA_TYPES,
  PANCHAYAT_NAMES,
} from "@/modules/party-members/constants";
import { WARDS, BOOTHS } from "@/modules/people/constants";

interface EditPartyMemberFormProps {
  member: PartyMember;
}

export function EditPartyMemberForm({ member }: EditPartyMemberFormProps) {
  const router = useRouter();
  const { locale } = useTranslation();
  const person = getPersonById(member.personId, locale);

  const [orgType, setOrgType] = React.useState(member.organizationType);
  const [joiningDate, setJoiningDate] = React.useState<Date | undefined>(
    member.joiningDate ? new Date(member.joiningDate) : undefined
  );

  const handleSave = () => {
    demoSaved("Record");
    router.push(`/people/${member.personId}`);
  };

  if (!person) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Linked Person</CardTitle>
          <CardDescription>
            Personal information is managed in the People module. Edit assignment details below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 rounded-input border border-border-default bg-background-muted/30 p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{person.initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-text-primary">{person.fullName}</p>
                <p className="text-xs text-text-secondary">{person.mobile} · {person.area}</p>
              </div>
            </div>
            <Link href={`/people/${person.id}`}>
              <Button variant="outline" size="sm">
                <ExternalLink className="size-4" />
                Open Person Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit Assignment</CardTitle>
          <CardDescription>Update political organization assignment only.</CardDescription>
        </CardHeader>
        <CardContent>
          <FormLayout
            footer={
              <FormActions>
                <Link href={`/people/${member.personId}`}>
                  <Button variant="outline" type="button">Cancel</Button>
                </Link>
                <Button onClick={handleSave}>Update Assignment</Button>
              </FormActions>
            }
          >
            <FormSection>
              <FormField label="Organization Type">
                <Select
                  value={orgType}
                  onValueChange={(v) => setOrgType(v as typeof orgType)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(ORGANIZATION_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Designation">
                <Select defaultValue={member.designation}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {getDesignationsForOrg(orgType).map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Ward">
                <Select defaultValue={member.ward}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {WARDS.map((w) => (
                      <SelectItem key={w} value={w}>{w}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Booth">
                <Select defaultValue={member.booth}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {BOOTHS.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              {member.committee && (
                <FormField label="Committee">
                  <Select defaultValue={member.committee}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {COMMITTEES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              )}
              {member.morchaType && (
                <FormField label="Morcha Type">
                  <Select defaultValue={member.morchaType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MORCHA_TYPES.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              )}
              {member.panchayatName && (
                <FormField label="Panchayat">
                  <Select defaultValue={member.panchayatName}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PANCHAYAT_NAMES.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              )}
              <FormField label="Joining Date">
                <DatePicker value={joiningDate} onChange={setJoiningDate} />
              </FormField>
              <FormField label="Status">
                <Select defaultValue={member.status}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending Approval</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </FormSection>
          </FormLayout>
        </CardContent>
      </Card>
    </div>
  );
}
