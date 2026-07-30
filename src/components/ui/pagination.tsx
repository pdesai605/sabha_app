"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocaleText } from "@/lib/i18n/locale-text";
import { formatNumberForLocale } from "@/lib/i18n/numerals";
import { useTranslation } from "@/lib/i18n/context";

export interface PaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function Pagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className,
}: PaginationProps) {
  const lt = useLocaleText();
  const { locale } = useTranslation();
  const fn = (n: number | string) => formatNumberForLocale(n, locale);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <span>
          {fn(start)}–{fn(end)} {lt("of")} {fn(totalItems)}
        </span>
        {onPageSizeChange && (
          <>
            <span className="text-text-muted">·</span>
            <div className="flex items-center gap-2">
              <span className="text-text-muted">{lt("Rows")}</span>
              <Select
                value={String(pageSize)}
                onValueChange={(v) => onPageSizeChange(Number(v))}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {fn(size)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          aria-label={lt("First page")}
        >
          <ChevronsLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label={lt("Previous page")}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="px-3 text-sm text-text-secondary">
          {lt("Page")} {fn(page)} {lt("of")} {fn(totalPages)}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label={lt("Next page")}
        >
          <ChevronRight className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
          aria-label={lt("Last page")}
        >
          <ChevronsRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
