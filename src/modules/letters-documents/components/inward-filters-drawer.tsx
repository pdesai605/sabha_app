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
  GOVT_DEPARTMENTS,
  INWARD_CATEGORIES,
  INWARD_STATUS_LABELS,
} from "@/modules/letters-documents/constants";
import { getAllPeople } from "@/modules/people/data/people";
import { cn } from "@/lib/utils";
import type { LetterPriority, InwardStatus } from "@/modules/letters-documents/types";

export interface InwardFilters {
  departments: string[];
  priorities: LetterPriority[];
  statuses: InwardStatus[];
  categories: string[];
  assignedUsers: string[];
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

const people = getAllPeople();
const assigneeNames = [...new Set(people.slice(0, 30).map((p) => p.fullName))];

interface InwardFiltersDrawerProps {
  filters: InwardFilters;
  onFiltersChange: (filters: InwardFilters) => void;
  activeCount: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function InwardFiltersDrawer({
  filters,
  onFiltersChange,
  activeCount,
  open,
  onOpenChange,
}: InwardFiltersDrawerProps) {
  const [local, setLocal] = React.useState(filters);

  React.useEffect(() => {
    if (open) setLocal(filters);
  }, [open, filters]);

  const apply = () => {
    onFiltersChange(local);
    onOpenChange?.(false);
  };

  const reset = () => {
    const empty: InwardFilters = { departments: [], priorities: [], statuses: [], categories: [], assignedUsers: [] };
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
          <DrawerTitle>Filter Inward Letters</DrawerTitle>
          <DrawerDescription>Filter by department, priority, status, category, or assigned user.</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 space-y-6 max-h-[60vh]">
          <FilterGroup label="Department" options={GOVT_DEPARTMENTS} selected={local.departments} onChange={(v) => setLocal({ ...local, departments: v })} />
          <Separator />
          <FilterGroup label="Priority" options={["low", "normal", "high", "urgent"]} selected={local.priorities} onChange={(v) => setLocal({ ...local, priorities: v as LetterPriority[] })} />
          <Separator />
          <FilterGroup label="Status" options={Object.values(INWARD_STATUS_LABELS)} selected={local.statuses.map((s) => INWARD_STATUS_LABELS[s])} onChange={(labels) => {
            const statuses = labels.map((l) => Object.entries(INWARD_STATUS_LABELS).find(([, v]) => v === l)?.[0]).filter(Boolean) as InwardStatus[];
            setLocal({ ...local, statuses });
          }} />
          <Separator />
          <FilterGroup label="Category" options={INWARD_CATEGORIES} selected={local.categories} onChange={(v) => setLocal({ ...local, categories: v })} />
          <Separator />
          <FilterGroup label="Assigned To" options={assigneeNames} selected={local.assignedUsers} onChange={(v) => setLocal({ ...local, assignedUsers: v })} />
        </div>
        <DrawerFooter className="flex-row gap-2">
          <Button variant="outline" onClick={reset} className="flex-1">Reset</Button>
          <Button onClick={apply} className="flex-1">Apply Filters</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function applyInwardFilters<T extends { senderDepartment: string; priority: LetterPriority; status: InwardStatus; category: string; assignedTo: string }>(
  list: T[],
  filters: InwardFilters
): T[] {
  return list.filter((l) => {
    if (filters.departments.length && !filters.departments.includes(l.senderDepartment)) return false;
    if (filters.priorities.length && !filters.priorities.includes(l.priority)) return false;
    if (filters.statuses.length && !filters.statuses.includes(l.status)) return false;
    if (filters.categories.length && !filters.categories.includes(l.category)) return false;
    if (filters.assignedUsers.length && !filters.assignedUsers.includes(l.assignedTo)) return false;
    return true;
  });
}
