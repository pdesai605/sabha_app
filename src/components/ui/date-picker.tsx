"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start font-normal",
            !value && "text-text-muted",
            className
          )}
        >
          <CalendarIcon className="size-4 text-text-muted" />
          {value ? format(value, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <DayPicker
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange?.(date);
            setOpen(false);
          }}
          className="p-3"
          classNames={{
            months: "flex flex-col sm:flex-row gap-2",
            month: "flex flex-col gap-4",
            month_caption: "flex justify-center pt-1 relative items-center w-full",
            caption_label: "text-sm font-medium text-text-primary",
            nav: "flex items-center gap-1",
            button_previous:
              "absolute left-1 size-7 inline-flex items-center justify-center rounded-md hover:bg-background-muted transition-colors",
            button_next:
              "absolute right-1 size-7 inline-flex items-center justify-center rounded-md hover:bg-background-muted transition-colors",
            month_grid: "w-full border-collapse",
            weekdays: "flex",
            weekday:
              "text-text-muted rounded-md w-9 font-normal text-[0.8rem]",
            week: "flex w-full mt-2",
            day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
            day_button:
              "size-9 p-0 font-normal rounded-md hover:bg-background-muted transition-colors aria-selected:opacity-100",
            selected:
              "bg-accent-primary text-white hover:bg-accent-primary hover:text-white focus:bg-accent-primary focus:text-white rounded-md",
            today: "bg-accent-primary-muted text-accent-primary rounded-md",
            outside: "text-text-muted opacity-50",
            disabled: "text-text-muted opacity-50",
            hidden: "invisible",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
