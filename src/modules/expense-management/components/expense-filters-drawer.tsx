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
  DEFAULT_CATEGORIES,
  DEPARTMENTS,
  PAYMENT_MODES,
  EXPENSE_STATUS_LABELS,
} from "@/modules/expense-management/constants";
import { WARDS } from "@/modules/people/constants";
import { cn } from "@/lib/utils";
import type { ExpenseStatus, PaymentMode } from "@/modules/expense-management/types";

export interface ExpenseFilters {
  categories: string[];
  statuses: ExpenseStatus[];
  paymentModes: PaymentMode[];
  wards: string[];
  departments: string[];
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

interface ExpenseFiltersDrawerProps {
  filters: ExpenseFilters;
  onFiltersChange: (filters: ExpenseFilters) => void;
  activeCount: number;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ExpenseFiltersDrawer({
  filters,
  onFiltersChange,
  activeCount,
  trigger,
  open,
  onOpenChange,
}: ExpenseFiltersDrawerProps) {
  const [local, setLocal] = React.useState(filters);

  React.useEffect(() => {
    if (open) setLocal(filters);
  }, [open, filters]);

  const apply = () => {
    onFiltersChange(local);
    onOpenChange?.(false);
  };

  const reset = () => {
    const empty: ExpenseFilters = { categories: [], statuses: [], paymentModes: [], wards: [], departments: [] };
    setLocal(empty);
    onFiltersChange(empty);
    onOpenChange?.(false);
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <SlidersHorizontal className="size-4" />
      Filters
      {activeCount > 0 && <Badge variant="primary" className="ml-1 px-1.5 py-0 text-[10px]">{activeCount}</Badge>}
    </Button>
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {trigger !== undefined ? (
        trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      ) : (
        <DrawerTrigger asChild>{defaultTrigger}</DrawerTrigger>
      )}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter Expenses</DrawerTitle>
          <DrawerDescription>Narrow by category, status, payment mode, ward, or department.</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 space-y-6 max-h-[60vh]">
          <FilterGroup label="Category" options={DEFAULT_CATEGORIES} selected={local.categories} onChange={(v) => setLocal({ ...local, categories: v })} />
          <Separator />
          <FilterGroup label="Status" options={Object.values(EXPENSE_STATUS_LABELS)} selected={local.statuses.map((s) => EXPENSE_STATUS_LABELS[s])} onChange={(labels) => {
            const statuses = labels.map((l) => Object.entries(EXPENSE_STATUS_LABELS).find(([, v]) => v === l)?.[0]).filter(Boolean) as ExpenseStatus[];
            setLocal({ ...local, statuses });
          }} />
          <Separator />
          <FilterGroup label="Payment Mode" options={PAYMENT_MODES} selected={local.paymentModes} onChange={(v) => setLocal({ ...local, paymentModes: v as PaymentMode[] })} />
          <Separator />
          <FilterGroup label="Ward" options={WARDS} selected={local.wards} onChange={(v) => setLocal({ ...local, wards: v })} />
          <Separator />
          <FilterGroup label="Department" options={DEPARTMENTS} selected={local.departments} onChange={(v) => setLocal({ ...local, departments: v })} />
        </div>
        <DrawerFooter className="flex-row gap-2">
          <Button variant="outline" onClick={reset} className="flex-1">Reset</Button>
          <Button onClick={apply} className="flex-1">Apply Filters</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
