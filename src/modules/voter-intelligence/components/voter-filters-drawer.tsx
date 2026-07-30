"use client";

import * as React from "react";
import { SlidersHorizontal } from "lucide-react";
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
import {
  PARTY_INCLINATIONS,
  SURVEY_STATUSES,
} from "@/modules/voter-intelligence/constants";
import { WARDS, BOOTHS, AREAS } from "@/modules/people/constants";
import { cn } from "@/lib/utils";
import type { PartyInclination, SurveyStatus } from "@/modules/voter-intelligence/types";

export interface VoterFilters {
  wards: string[];
  booths: string[];
  areas: string[];
  genders: string[];
  partyInclinations: PartyInclination[];
  surveyStatuses: SurveyStatus[];
  ageGroups: string[];
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
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
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

const AGE_GROUPS = ["18-21", "22-35", "36-59", "60+"];

interface VoterFiltersDrawerProps {
  filters: VoterFilters;
  onFiltersChange: (filters: VoterFilters) => void;
  activeCount: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function VoterFiltersDrawer({
  filters,
  onFiltersChange,
  activeCount,
  open,
  onOpenChange,
}: VoterFiltersDrawerProps) {
  const [local, setLocal] = React.useState(filters);

  React.useEffect(() => {
    if (open) setLocal(filters);
  }, [open, filters]);

  const apply = () => {
    onFiltersChange(local);
    onOpenChange?.(false);
  };

  const reset = () => {
    const empty: VoterFilters = { wards: [], booths: [], areas: [], genders: [], partyInclinations: [], surveyStatuses: [], ageGroups: [] };
    setLocal(empty);
    onFiltersChange(empty);
    onOpenChange?.(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="size-4" />
          Filters
          {activeCount > 0 && <Badge variant="primary" className="ml-1 px-1.5 py-0 text-[10px]">{activeCount}</Badge>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Advanced Filters</DrawerTitle>
          <DrawerDescription>Filter voters by ward, booth, inclination, survey status, and demographics.</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 space-y-6 max-h-[60vh]">
          <FilterGroup label="Ward" options={WARDS} selected={local.wards} onChange={(v) => setLocal({ ...local, wards: v })} />
          <Separator />
          <FilterGroup label="Booth" options={BOOTHS} selected={local.booths} onChange={(v) => setLocal({ ...local, booths: v })} />
          <Separator />
          <FilterGroup label="Area" options={AREAS} selected={local.areas} onChange={(v) => setLocal({ ...local, areas: v })} />
          <Separator />
          <FilterGroup label="Gender" options={["male", "female", "other"]} selected={local.genders} onChange={(v) => setLocal({ ...local, genders: v })} />
          <Separator />
          <FilterGroup label="Age Group" options={AGE_GROUPS} selected={local.ageGroups} onChange={(v) => setLocal({ ...local, ageGroups: v })} />
          <Separator />
          <FilterGroup label="Party Inclination" options={PARTY_INCLINATIONS} selected={local.partyInclinations} onChange={(v) => setLocal({ ...local, partyInclinations: v as PartyInclination[] })} />
          <Separator />
          <FilterGroup label="Survey Status" options={SURVEY_STATUSES} selected={local.surveyStatuses} onChange={(v) => setLocal({ ...local, surveyStatuses: v as SurveyStatus[] })} />
        </div>
        <DrawerFooter className="flex-row gap-2">
          <Button variant="outline" onClick={reset} className="flex-1">Reset</Button>
          <Button onClick={apply} className="flex-1">Apply Filters</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function matchesAgeGroup(age: number, group: string): boolean {
  switch (group) {
    case "18-21": return age >= 18 && age <= 21;
    case "22-35": return age >= 22 && age <= 35;
    case "36-59": return age >= 36 && age <= 59;
    case "60+": return age >= 60;
    default: return true;
  }
}

export function applyVoterFilters<T extends { ward: string; booth: string; area: string; gender: string; partyInclination: PartyInclination; surveyStatus: SurveyStatus; age: number }>(
  list: T[],
  filters: VoterFilters
): T[] {
  return list.filter((v) => {
    if (filters.wards.length && !filters.wards.includes(v.ward)) return false;
    if (filters.booths.length && !filters.booths.includes(v.booth)) return false;
    if (filters.areas.length && !filters.areas.includes(v.area)) return false;
    if (filters.genders.length && !filters.genders.includes(v.gender)) return false;
    if (filters.partyInclinations.length && !filters.partyInclinations.includes(v.partyInclination)) return false;
    if (filters.surveyStatuses.length && !filters.surveyStatuses.includes(v.surveyStatus)) return false;
    if (filters.ageGroups.length && !filters.ageGroups.some((g) => matchesAgeGroup(v.age, g))) return false;
    return true;
  });
}
