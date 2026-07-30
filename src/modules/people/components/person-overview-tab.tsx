"use client";

import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  Hash,
  Building2,
  Vote,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LBadge } from "@/components/shared/localized-badge";
import { useLocaleText } from "@/lib/i18n/locale-text";
import type { Person } from "@/modules/people/types";
import { formatPersonDate } from "@/modules/people/lib/utils";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  const lt = useLocaleText();
  return (
    <div className="flex gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-input bg-background-muted text-text-muted">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-text-muted">{lt(label)}</p>
        <p className="text-sm text-text-primary mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}

interface PersonOverviewTabProps {
  person: Person;
}

export function PersonOverviewTab({ person }: PersonOverviewTabProps) {
  const lt = useLocaleText();
  const fullAddress = [
    person.address.line1,
    person.address.line2,
    `${person.address.city}, ${person.address.district}`,
    `${person.address.state} — ${person.address.pincode}`,
  ]
    .filter(Boolean)
    .join(", ");

  const socialEntries = [
    { label: "Facebook", value: person.socialMedia?.facebook },
    { label: "Twitter", value: person.socialMedia?.twitter },
    { label: "Instagram", value: person.socialMedia?.instagram },
    { label: "LinkedIn", value: person.socialMedia?.linkedin },
  ].filter((s) => s.value);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{lt("Contact Details")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InfoItem
            icon={<Phone className="size-4" />}
            label="Primary Mobile"
            value={person.mobile}
          />
          {person.alternateMobile && (
            <InfoItem
              icon={<Phone className="size-4" />}
              label="Alternate Mobile"
              value={person.alternateMobile}
            />
          )}
          {person.email && (
            <InfoItem
              icon={<Mail className="size-4" />}
              label="Email"
              value={person.email}
            />
          )}
          {person.dateOfBirth && (
            <InfoItem
              icon={<Calendar className="size-4" />}
              label="Date of Birth"
              value={formatPersonDate(person.dateOfBirth)}
            />
          )}
          <InfoItem
            icon={<Hash className="size-4" />}
            label="Gender"
            value={person.gender.charAt(0).toUpperCase() + person.gender.slice(1)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{lt("Electoral Geography")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InfoItem
            icon={<MapPin className="size-4" />}
            label="Area"
            value={person.area}
          />
          <InfoItem
            icon={<Building2 className="size-4" />}
            label="Ward"
            value={person.ward}
          />
          <InfoItem
            icon={<Vote className="size-4" />}
            label="Booth"
            value={person.booth}
          />
          <InfoItem
            icon={<MapPin className="size-4" />}
            label="Full Address"
            value={fullAddress}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{lt("Political Information")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {person.politicalDesignation && (
            <InfoItem
              icon={<Building2 className="size-4" />}
              label="Designation"
              value={person.politicalDesignation}
            />
          )}
          {person.partyAffiliation && (
            <InfoItem
              icon={<Vote className="size-4" />}
              label="Party Affiliation"
              value={person.partyAffiliation}
            />
          )}
          {person.voterId && (
            <InfoItem
              icon={<Hash className="size-4" />}
              label="Voter ID"
              value={person.voterId}
            />
          )}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {person.tags.map((tag) => (
              <LBadge key={tag} variant="primary">
                {tag}
              </LBadge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{lt("Social Media & Meta")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {socialEntries.length > 0 ? (
            socialEntries.map((s) => (
              <InfoItem
                key={s.label}
                icon={<Globe className="size-4" />}
                label={s.label}
                value={s.value}
              />
            ))
          ) : (
            <p className="text-sm text-text-muted">{lt("No social profiles linked.")}</p>
          )}
          <div className="pt-2 border-t border-border-subtle space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Created</span>
              <span className="text-text-secondary">
                {formatPersonDate(person.createdAt)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Last updated</span>
              <span className="text-text-secondary">
                {formatPersonDate(person.updatedAt)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {person.notes && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">{lt("Profile Notes")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary leading-relaxed">
              {person.notes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
