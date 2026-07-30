"use client";

import * as React from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Columns3,
  Inbox,
  Loader2,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchBar } from "@/components/ui/search-bar";
import { FilterChips } from "@/components/ui/filter-chips";
import { Pagination } from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocaleText } from "@/lib/i18n/locale-text";

export type SortDirection = "asc" | "desc" | null;

export interface DataTableColumn<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  hideOnMobile?: boolean;
}

export interface DataTableFilter {
  id: string;
  label: string;
  active?: boolean;
}

export interface DataTableProps<T extends { id: string }> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: DataTableFilter[];
  onFilterToggle?: (id: string) => void;
  onFilterRemove?: (id: string) => void;
  sortColumn?: string;
  sortDirection?: SortDirection;
  onSort?: (columnId: string) => void;
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
  visibleColumns?: Set<string>;
  onVisibleColumnsChange?: (columns: Set<string>) => void;
  page?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  bulkActions?: React.ReactNode;
  toolbarActions?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  cardRenderer?: (row: T) => React.ReactNode;
  className?: string;
  onRowClick?: (row: T) => void;
}

function DataTableEmpty({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex size-12 items-center justify-center rounded-card bg-background-muted mb-4">
        <Inbox className="size-6 text-text-muted" />
      </div>
      <h3 className="text-sm font-medium text-text-primary">{title}</h3>
      <p className="text-sm text-text-secondary mt-1 text-center max-w-sm">
        {description}
      </p>
    </div>
  );
}

function DataTableLoading({ columns }: { columns: number }) {
  const lt = useLocaleText();
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="size-6 animate-spin text-text-muted" />
      <p className="text-sm text-text-secondary mt-3">{lt("Loading data...")}</p>
      <span className="sr-only">Loading table with {columns} columns</span>
    </div>
  );
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  loading = false,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  onFilterToggle,
  onFilterRemove,
  sortColumn,
  sortDirection,
  onSort,
  selectedIds = new Set(),
  onSelectionChange,
  visibleColumns,
  onVisibleColumnsChange,
  page = 1,
  pageSize = 10,
  totalItems,
  onPageChange,
  onPageSizeChange,
  bulkActions,
  toolbarActions,
  emptyTitle = "No results found",
  emptyDescription = "Try adjusting your search or filters to find what you're looking for.",
  cardRenderer,
  className,
  onRowClick,
}: DataTableProps<T>) {
  const isMobile = useIsMobile();
  const lt = useLocaleText();
  const allColumnIds = columns.map((c) => c.id);
  const visible =
    visibleColumns ?? new Set(allColumnIds);

  const displayColumns = columns.filter((c) => visible.has(c.id));
  const allSelected =
    data.length > 0 && data.every((row) => selectedIds.has(row.id));
  const someSelected =
    data.some((row) => selectedIds.has(row.id)) && !allSelected;

  const toggleAll = () => {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(data.map((row) => row.id)));
    }
  };

  const toggleRow = (id: string) => {
    if (!onSelectionChange) return;
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectionChange(next);
  };

  const toggleColumn = (columnId: string) => {
    if (!onVisibleColumnsChange) return;
    const next = new Set(visible);
    if (next.has(columnId)) next.delete(columnId);
    else next.add(columnId);
    onVisibleColumnsChange(next);
  };

  const getCellValue = (row: T, column: DataTableColumn<T>) => {
    if (column.cell) return column.cell(row);
    if (column.accessorKey) {
      const value = row[column.accessorKey];
      return value != null ? String(value) : "—";
    }
    return "—";
  };

  const SortIcon = ({ columnId }: { columnId: string }) => {
    if (sortColumn !== columnId) {
      return <ArrowUpDown className="size-3.5 text-text-muted" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="size-3.5 text-accent-primary" />
    ) : (
      <ArrowDown className="size-3.5 text-accent-primary" />
    );
  };

  const showCardView = isMobile && cardRenderer;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          {onSearchChange && (
            <SearchBar
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              onClear={() => onSearchChange("")}
              placeholder={lt(searchPlaceholder)}
              containerClassName="sm:max-w-xs"
            />
          )}
          {filters.length > 0 && (
            <FilterChips
              chips={filters}
              onToggle={onFilterToggle}
              onRemove={onFilterRemove}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          {onVisibleColumnsChange && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Columns3 className="size-4" />
                  {lt("Columns")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{lt("Toggle columns")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {columns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={visible.has(column.id)}
                    onCheckedChange={() => toggleColumn(column.id)}
                  >
                    {lt(column.header)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {filters.length > 0 && onFilterToggle && (
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="size-4" />
              {lt("Filters")}
            </Button>
          )}
          {toolbarActions}
        </div>
      </div>

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && bulkActions && (
        <div className="flex items-center gap-3 rounded-input border border-accent-primary/20 bg-accent-primary-muted/50 px-4 py-2">
          <span className="text-sm font-medium text-accent-primary">
            {selectedIds.size} {lt("selected")}
          </span>
          <div className="flex items-center gap-2">{bulkActions}</div>
        </div>
      )}

      {/* Table / Card view */}
      <div className="rounded-card border border-border-default bg-background-card overflow-hidden">
        {loading ? (
          <DataTableLoading columns={displayColumns.length} />
        ) : data.length === 0 ? (
          <DataTableEmpty title={lt(emptyTitle)} description={lt(emptyDescription)} />
        ) : showCardView ? (
          <div className="divide-y divide-border-subtle p-4 space-y-3">
            {data.map((row) => (
              <div key={row.id}>{cardRenderer(row)}</div>
            ))}
          </div>
        ) : (
          <div className="overflow-auto max-h-[calc(100vh-320px)]">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-background-muted/95 backdrop-blur-sm">
                <TableRow className="hover:bg-transparent border-border-default">
                  {onSelectionChange && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={allSelected}
                        indeterminate={someSelected}
                        onCheckedChange={toggleAll}
                        aria-label="Select all rows"
                      />
                    </TableHead>
                  )}
                  {displayColumns.map((column) => (
                    <TableHead
                      key={column.id}
                      className={cn(
                        column.className,
                        column.hideOnMobile && "hidden md:table-cell"
                      )}
                    >
                      {column.sortable && onSort ? (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 hover:text-text-primary transition-colors -ml-1 px-1 py-0.5 rounded"
                          onClick={() => onSort(column.id)}
                        >
                          {lt(column.header)}
                          <SortIcon columnId={column.id} />
                        </button>
                      ) : (
                        lt(column.header)
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={selectedIds.has(row.id) ? "selected" : undefined}
                    className={onRowClick ? "cursor-pointer" : undefined}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                  >
                    {onSelectionChange && (
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(row.id)}
                          onCheckedChange={() => toggleRow(row.id)}
                          aria-label={`Select row ${row.id}`}
                        />
                      </TableCell>
                    )}
                    {displayColumns.map((column) => (
                      <TableCell
                        key={column.id}
                        className={cn(
                          column.className,
                          column.hideOnMobile && "hidden md:table-cell"
                        )}
                      >
                        {getCellValue(row, column)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {onPageChange && totalItems !== undefined && data.length > 0 && (
          <div className="border-t border-border-default px-4 py-3">
            <Pagination
              page={page}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function DataTableCard({
  title,
  subtitle,
  badge,
  meta,
  actions,
  selected,
  onSelect,
  onClick,
  className,
}: {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  selected?: boolean;
  onSelect?: () => void;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "transition-colors",
        selected && "border-accent-primary/30 bg-accent-primary-muted/20",
        onClick && "cursor-pointer hover:border-border-default/80",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {onSelect && (
            <Checkbox
              checked={selected}
              onCheckedChange={onSelect}
              className="mt-0.5"
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-text-primary">{title}</p>
                {subtitle && (
                  <p className="text-xs text-text-secondary mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
              {badge}
            </div>
            {meta && (
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
                {meta}
              </div>
            )}
          </div>
          {actions}
        </div>
      </CardContent>
    </Card>
  );
}
