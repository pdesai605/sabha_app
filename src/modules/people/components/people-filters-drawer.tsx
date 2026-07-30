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
import type { PeopleFilters, PersonGender, PersonStatus } from "@/modules/people/types";
import { defaultPeopleFilters } from "@/modules/people/types";
import { WARDS, BOOTHS, AREAS, PERSON_TAGS } from "@/modules/people/constants";
import { cn } from "@/lib/utils";

interface PeopleFiltersDrawerProps {
  filters: PeopleFilters;
  onFiltersChange: (filters: PeopleFilters) => void;
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
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-text-secondary">{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                isActive
                  ? "border-accent-primary/30 bg-accent-primary-muted text-accent-primary"
                  : "border-border-default bg-background-secondary text-text-secondary hover:bg-background-muted"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function PeopleFiltersDrawer({
  filters,
  onFiltersChange,
  activeCount,
  trigger,
  open,
  onOpenChange,
}: PeopleFiltersDrawerProps) {
  const [draft, setDraft] = React.useState(filters);

  React.useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  const apply = () => {
    onFiltersChange(draft);
    onOpenChange?.(false);
  };

  const reset = () => {
    setDraft(defaultPeopleFilters);
    onFiltersChange(defaultPeopleFilters);
    onOpenChange?.(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent side="right" className="max-w-md">
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <DrawerTitle>Filters</DrawerTitle>
            {activeCount > 0 && (
              <Badge variant="primary">{activeCount} active</Badge>
            )}
          </div>
          <DrawerDescription>
            Narrow down people by ward, booth, area, and more.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
          <FilterGroup
            label="Ward"
            options={WARDS}
            selected={draft.ward}
            onChange={(ward) => setDraft({ ...draft, ward })}
          />
          <Separator />
          <FilterGroup
            label="Booth"
            options={BOOTHS}
            selected={draft.booth}
            onChange={(booth) => setDraft({ ...draft, booth })}
          />
          <Separator />
          <FilterGroup
            label="Area"
            options={AREAS}
            selected={draft.area}
            onChange={(area) => setDraft({ ...draft, area })}
          />
          <Separator />
          <FilterGroup
            label="Gender"
            options={["male", "female", "other"]}
            selected={draft.gender}
            onChange={(gender) =>
              setDraft({ ...draft, gender: gender as PersonGender[] })
            }
          />
          <Separator />
          <FilterGroup
            label="Status"
            options={["active", "inactive", "archived"]}
            selected={draft.status}
            onChange={(status) =>
              setDraft({ ...draft, status: status as PersonStatus[] })
            }
          />
          <Separator />
          <FilterGroup
            label="Tags"
            options={PERSON_TAGS}
            selected={draft.tags}
            onChange={(tags) => setDraft({ ...draft, tags })}
          />
        </div>

        <DrawerFooter className="flex-row justify-between sm:justify-between">
          <Button variant="ghost" onClick={reset}>
            Clear all
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange?.(false)}>
              Cancel
            </Button>
            <Button onClick={apply}>Apply filters</Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function countActiveFilters(filters: PeopleFilters): number {
  return (
    filters.ward.length +
    filters.booth.length +
    filters.area.length +
    filters.gender.length +
    filters.status.length +
    filters.tags.length
  );
}

export function applyPeopleFilters<T extends {
  ward: string;
  booth: string;
  area: string;
  gender: string;
  status: string;
  tags: string[];
}>(
  items: T[],
  filters: PeopleFilters
): T[] {
  return items.filter((item) => {
    if (filters.ward.length && !filters.ward.includes(item.ward)) return false;
    if (filters.booth.length && !filters.booth.includes(item.booth)) return false;
    if (filters.area.length && !filters.area.includes(item.area)) return false;
    if (filters.gender.length && !filters.gender.includes(item.gender as PersonGender))
      return false;
    if (filters.status.length && !filters.status.includes(item.status as PersonStatus))
      return false;
    if (
      filters.tags.length &&
      !filters.tags.some((tag) => item.tags.includes(tag))
    )
      return false;
    return true;
  });
}
