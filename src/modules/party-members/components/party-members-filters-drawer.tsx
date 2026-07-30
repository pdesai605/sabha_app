"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import type {
  PartyMembersFilters,
  MemberStatus,
  OrganizationType,
  PartyMemberWithPerson,
} from "@/modules/party-members/types";
import { defaultPartyMembersFilters } from "@/modules/party-members/types";
import {
  AGE_GROUPS,
  COMMITTEES,
  CORPORATION_DESIGNATIONS,
  PANCHAYAT_DESIGNATIONS,
  PARTY_DESIGNATIONS,
  MORCHA_DESIGNATIONS,
  COMMITTEE_DESIGNATIONS,
} from "@/modules/party-members/constants";
import { WARDS, BOOTHS, AREAS } from "@/modules/people/constants";
import { getAgeGroup } from "@/modules/party-members/lib/utils";
import { cn } from "@/lib/utils";

const ALL_DESIGNATIONS = [
  ...CORPORATION_DESIGNATIONS,
  ...PANCHAYAT_DESIGNATIONS,
  ...PARTY_DESIGNATIONS,
  ...MORCHA_DESIGNATIONS,
  ...COMMITTEE_DESIGNATIONS,
];

interface PartyMembersFiltersDrawerProps {
  filters: PartyMembersFilters;
  onFiltersChange: (filters: PartyMembersFilters) => void;
  activeCount: number;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function FilterGroup({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  };

  return (
    <div className="space-y-3">
      <Label className="text-text-secondary">{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              selected.includes(option)
                ? "border-accent-primary/30 bg-accent-primary-muted text-accent-primary"
                : "border-border-default bg-background-secondary text-text-secondary hover:bg-background-muted"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PartyMembersFiltersDrawer({
  filters,
  onFiltersChange,
  activeCount,
  trigger,
  open,
  onOpenChange,
}: PartyMembersFiltersDrawerProps) {
  const [draft, setDraft] = React.useState(filters);

  React.useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent side="right" className="max-w-md">
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <DrawerTitle>Filters</DrawerTitle>
            {activeCount > 0 && <Badge variant="primary">{activeCount} active</Badge>}
          </div>
          <DrawerDescription>Filter party members across your organization.</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
          <FilterGroup label="Ward" options={WARDS} selected={draft.ward} onChange={(ward) => setDraft({ ...draft, ward })} />
          <Separator />
          <FilterGroup label="Booth" options={BOOTHS} selected={draft.booth} onChange={(booth) => setDraft({ ...draft, booth })} />
          <Separator />
          <FilterGroup label="Area" options={AREAS} selected={draft.area} onChange={(area) => setDraft({ ...draft, area })} />
          <Separator />
          <FilterGroup
            label="Organization"
            options={["Corporation", "Panchayat", "Party", "Morcha", "Committees"]}
            selected={draft.organization.map((o) => o.charAt(0).toUpperCase() + o.slice(1))}
            onChange={(vals) =>
              setDraft({
                ...draft,
                organization: vals.map((v) => v.toLowerCase()) as OrganizationType[],
              })
            }
          />
          <Separator />
          <FilterGroup label="Designation" options={ALL_DESIGNATIONS.slice(0, 12)} selected={draft.designation} onChange={(designation) => setDraft({ ...draft, designation })} />
          <Separator />
          <FilterGroup label="Committee" options={COMMITTEES} selected={draft.committee} onChange={(committee) => setDraft({ ...draft, committee })} />
          <Separator />
          <FilterGroup label="Gender" options={["male", "female", "other"]} selected={draft.gender} onChange={(gender) => setDraft({ ...draft, gender })} />
          <Separator />
          <FilterGroup label="Age Group" options={AGE_GROUPS} selected={draft.ageGroup} onChange={(ageGroup) => setDraft({ ...draft, ageGroup })} />
          <Separator />
          <FilterGroup label="Status" options={["active", "inactive", "pending"]} selected={draft.status} onChange={(status) => setDraft({ ...draft, status: status as MemberStatus[] })} />
          <Separator />
          <FilterGroup label="Joining Year" options={["2024", "2025", "2026"]} selected={draft.joiningYear} onChange={(joiningYear) => setDraft({ ...draft, joiningYear })} />
        </div>
        <DrawerFooter className="flex-row justify-between sm:justify-between">
          <Button
            variant="ghost"
            onClick={() => {
              setDraft(defaultPartyMembersFilters);
              onFiltersChange(defaultPartyMembersFilters);
              onOpenChange?.(false);
            }}
          >
            Clear all
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange?.(false)}>Cancel</Button>
            <Button
              onClick={() => {
                onFiltersChange(draft);
                onOpenChange?.(false);
              }}
            >
              Apply filters
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function countPartyMemberFilters(filters: PartyMembersFilters): number {
  return Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);
}

export function applyPartyMemberFilters(
  members: PartyMemberWithPerson[],
  filters: PartyMembersFilters
) {
  return members.filter((m) => {
    if (filters.ward.length && !filters.ward.includes(m.ward)) return false;
    if (filters.booth.length && !filters.booth.includes(m.booth)) return false;
    if (filters.area.length && !filters.area.includes(m.area)) return false;
    if (filters.organization.length && !filters.organization.includes(m.organizationType)) return false;
    if (filters.designation.length && !filters.designation.includes(m.designation)) return false;
    if (filters.committee.length && (!m.committee || !filters.committee.includes(m.committee))) return false;
    if (filters.gender.length && !filters.gender.includes(m.gender)) return false;
    if (filters.status.length && !filters.status.includes(m.status)) return false;
    if (filters.joiningYear.length && !filters.joiningYear.some((y) => m.joiningDate.startsWith(y))) return false;
    if (filters.ageGroup.length && !filters.ageGroup.includes(getAgeGroup(m.dateOfBirth))) return false;
    return true;
  });
}
