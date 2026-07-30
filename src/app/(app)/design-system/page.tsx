"use client";

import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { SearchBar } from "@/components/ui/search-bar";
import { FilterChips } from "@/components/ui/filter-chips";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { DatePicker } from "@/components/ui/date-picker";
import { FileUpload } from "@/components/ui/file-upload";
import { Timeline } from "@/components/ui/timeline";
import { toast } from "@/components/ui/sonner";
import {
  DataTable,
  DataTableCard,
  type DataTableColumn,
} from "@/components/data-table/data-table";
import {
  FormLayout,
  FormSection,
  FormField,
  FormRow,
  FormActions,
} from "@/components/forms/form-layout";
import { TrendingUp, CircleDot } from "lucide-react";

/* ─── Demo table types (generic, no political data) ─── */
interface DemoRow {
  id: string;
  name: string;
  category: string;
  status: "active" | "pending" | "inactive";
  updated: string;
}

const demoColumns: DataTableColumn<DemoRow>[] = [
  { id: "name", header: "Name", accessorKey: "name", sortable: true },
  { id: "category", header: "Category", accessorKey: "category", sortable: true, hideOnMobile: true },
  {
    id: "status",
    header: "Status",
    cell: (row) => (
      <StatusBadge
        label={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        status={row.status === "active" ? "active" : row.status === "pending" ? "pending" : "inactive"}
      />
    ),
  },
  { id: "updated", header: "Updated", accessorKey: "updated", hideOnMobile: true },
];

const demoData: DemoRow[] = Array.from({ length: 8 }, (_, i) => ({
  id: `row-${i + 1}`,
  name: `Record ${String(i + 1).padStart(3, "0")}`,
  category: ["Category A", "Category B", "Category C"][i % 3],
  status: (["active", "pending", "inactive"] as const)[i % 3],
  updated: "Jul 25, 2026",
}));

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        {description && (
          <p className="text-sm text-text-secondary mt-1">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  const [search, setSearch] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(["name", "category", "status", "updated"])
  );
  const [sortColumn, setSortColumn] = React.useState<string | undefined>();
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc" | null>(null);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const [filters, setFilters] = React.useState([
    { id: "f1", label: "Active", active: true },
    { id: "f2", label: "Recent", active: false },
  ]);
  const [date, setDate] = React.useState<Date>();
  const [files, setFiles] = React.useState<File[]>([]);
  const [tableLoading, setTableLoading] = React.useState(false);

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"));
      if (sortDirection === "desc") setSortColumn(undefined);
    } else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  const filteredData = demoData.filter(
    (row) =>
      !search ||
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.category.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="space-y-12 pb-12">
      <PageHeader
        title="Design System"
        description="Reusable components and patterns for building Sabha modules."
      />

      {/* Typography & Colors */}
      <Section title="Typography" description="Inter type scale with vertical rhythm.">
        <Card>
          <CardContent className="p-6 space-y-4">
            <p className="text-4xl font-bold text-text-primary">Heading 4xl</p>
            <p className="text-3xl font-semibold text-text-primary">Heading 3xl</p>
            <p className="text-2xl font-semibold text-text-primary">Heading 2xl</p>
            <p className="text-xl font-medium text-text-primary">Heading xl</p>
            <p className="text-lg text-text-primary">Body lg — Primary text</p>
            <p className="text-base text-text-primary">Body md — Primary text</p>
            <p className="text-sm text-text-secondary">Body sm — Secondary text</p>
            <p className="text-xs text-text-muted">Body xs — Muted text</p>
          </CardContent>
        </Card>
      </Section>

      <Section title="Color Palette">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { name: "Primary BG", class: "bg-background-primary border" },
            { name: "Secondary BG", class: "bg-background-secondary border" },
            { name: "Accent", class: "bg-accent-primary" },
            { name: "Success", class: "bg-semantic-success" },
            { name: "Warning", class: "bg-semantic-warning" },
            { name: "Danger", class: "bg-semantic-danger" },
          ].map((c) => (
            <div key={c.name} className="space-y-2">
              <div className={`h-12 rounded-input ${c.class}`} />
              <p className="text-xs text-text-secondary">{c.name}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Buttons */}
      <Section title="Buttons">
        <Card>
          <CardContent className="p-6 flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </CardContent>
        </Card>
      </Section>

      {/* Badges */}
      <Section title="Badges & Status">
        <Card>
          <CardContent className="p-6 flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info">Info</Badge>
            <StatusBadge label="Active" status="active" />
            <StatusBadge label="Pending" status="pending" />
            <StatusBadge label="Inactive" status="inactive" />
          </CardContent>
        </Card>
      </Section>

      {/* Form Controls */}
      <Section title="Form Controls">
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="demo-input">Text Input</Label>
                <Input id="demo-input" placeholder="Enter value..." />
              </div>
              <div className="space-y-2">
                <Label>Select</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">Option A</SelectItem>
                    <SelectItem value="b">Option B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Combobox</Label>
                <Combobox
                  options={[
                    { value: "1", label: "Option One" },
                    { value: "2", label: "Option Two", description: "With description" },
                  ]}
                />
              </div>
              <div className="space-y-2">
                <Label>Date Picker</Label>
                <DatePicker value={date} onChange={setDate} />
              </div>
              <div className="space-y-2">
                <Label>Search Bar</Label>
                <SearchBar placeholder="Search items..." />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Textarea</Label>
                <Textarea placeholder="Enter description..." />
              </div>
            </div>
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-2">
                <Checkbox id="cb" />
                <Label htmlFor="cb">Checkbox</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="sw" />
                <Label htmlFor="sw">Switch</Label>
              </div>
              <RadioGroup defaultValue="a" className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="a" id="r1" />
                  <Label htmlFor="r1">Radio A</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="b" id="r2" />
                  <Label htmlFor="r2">Radio B</Label>
                </div>
              </RadioGroup>
            </div>
            <FilterChips
              chips={filters}
              onToggle={(id) =>
                setFilters((f) =>
                  f.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
                )
              }
              onRemove={(id) => setFilters((f) => f.filter((c) => c.id !== id))}
            />
          </CardContent>
        </Card>
      </Section>

      {/* Cards & Stats */}
      <Section title="Cards">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Standard Card</CardTitle>
              <CardDescription>20px border radius with subtle elevation.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary">Card content area with generous padding.</p>
            </CardContent>
          </Card>
          <StatCard
            title="Stat Metric"
            value="2,847"
            description="Compared to last period"
            trend={{ value: "+12.5%", positive: true }}
            icon={<TrendingUp className="size-5" />}
          />
        </div>
      </Section>

      {/* Tabs */}
      <Section title="Tabs">
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Overview</TabsTrigger>
            <TabsTrigger value="tab2">Details</TabsTrigger>
            <TabsTrigger value="tab3">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <Card><CardContent className="p-6 text-sm text-text-secondary">Overview tab content.</CardContent></Card>
          </TabsContent>
          <TabsContent value="tab2">
            <Card><CardContent className="p-6 text-sm text-text-secondary">Details tab content.</CardContent></Card>
          </TabsContent>
          <TabsContent value="tab3">
            <Card><CardContent className="p-6 text-sm text-text-secondary">Activity tab content.</CardContent></Card>
          </TabsContent>
        </Tabs>
      </Section>

      {/* Dialog & Drawer */}
      <Section title="Overlays">
        <div className="flex flex-wrap gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>24px border radius with soft elevation.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">Open Drawer</Button>
            </DrawerTrigger>
            <DrawerContent side="right">
              <DrawerHeader>
                <DrawerTitle>Drawer Panel</DrawerTitle>
                <DrawerDescription>Slide-in panel for detail views.</DrawerDescription>
              </DrawerHeader>
              <div className="flex-1 p-6">
                <p className="text-sm text-text-secondary">Drawer content area.</p>
              </div>
              <DrawerFooter>
                <Button>Save</Button>
                <Button variant="outline">Cancel</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          <Button
            variant="outline"
            onClick={() => toast.success("Action completed successfully")}
          >
            Show Toast
          </Button>
        </div>
      </Section>

      {/* File Upload & Timeline */}
      <Section title="File Upload & Timeline">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle>File Upload</CardTitle></CardHeader>
            <CardContent>
              <FileUpload value={files} onChange={setFiles} accept=".pdf,.doc,.docx" multiple />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
            <CardContent>
              <Timeline
                items={[
                  { id: "1", title: "Step completed", description: "Initial review finished.", timestamp: "10:30 AM", status: "completed" },
                  { id: "2", title: "In progress", description: "Currently being processed.", timestamp: "11:00 AM", status: "current", icon: <CircleDot className="size-3.5" /> },
                  { id: "3", title: "Upcoming", description: "Awaiting approval.", timestamp: "—", status: "upcoming" },
                ]}
              />
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Data Table */}
      <Section title="Enterprise Data Table" description="Sticky header, sorting, selection, pagination, column visibility, filters, and mobile card view.">
        <div className="flex gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setTableLoading(true);
              setTimeout(() => setTableLoading(false), 1500);
            }}
          >
            Simulate Loading
          </Button>
        </div>
        <DataTable
          columns={demoColumns}
          data={paginatedData}
          loading={tableLoading}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search records..."
          filters={filters}
          onFilterToggle={(id) =>
            setFilters((f) =>
              f.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
            )
          }
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          visibleColumns={visibleColumns}
          onVisibleColumnsChange={setVisibleColumns}
          page={page}
          pageSize={pageSize}
          totalItems={filteredData.length}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          bulkActions={
            <>
              <Button variant="outline" size="sm">Export</Button>
              <Button variant="danger" size="sm">Delete</Button>
            </>
          }
          cardRenderer={(row) => (
            <DataTableCard
              title={row.name}
              subtitle={row.category}
              badge={
                <StatusBadge
                  label={row.status}
                  status={row.status === "active" ? "active" : row.status === "pending" ? "pending" : "inactive"}
                />
              }
              meta={<span>Updated {row.updated}</span>}
              selected={selectedIds.has(row.id)}
              onSelect={() => {
                const next = new Set(selectedIds);
                if (next.has(row.id)) next.delete(row.id);
                else next.add(row.id);
                setSelectedIds(next);
              }}
            />
          )}
        />
      </Section>

      {/* Form Layout */}
      <Section title="Form Layout" description="Two-column layout with sticky footer actions.">
        <Card>
          <CardContent className="p-6">
            <FormLayout
              footer={
                <FormActions>
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </FormActions>
              }
            >
              <FormSection
                title="Basic Information"
                description="Enter the primary details below."
              >
                <FormField label="Field One" required>
                  <Input placeholder="Enter value" />
                </FormField>
                <FormField label="Field Two">
                  <Input placeholder="Enter value" />
                </FormField>
                <FormField label="Category">
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">Option A</SelectItem>
                      <SelectItem value="b">Option B</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Status">
                  <Combobox
                    options={[
                      { value: "active", label: "Active" },
                      { value: "inactive", label: "Inactive" },
                    ]}
                  />
                </FormField>
                <FormRow>
                  <FormField label="Description">
                    <Textarea placeholder="Enter a detailed description..." />
                  </FormField>
                </FormRow>
              </FormSection>
            </FormLayout>
          </CardContent>
        </Card>
      </Section>

      {/* Avatar */}
      <Section title="Avatar">
        <div className="flex items-center gap-4">
          <Avatar size="sm"><AvatarFallback>S</AvatarFallback></Avatar>
          <Avatar size="md"><AvatarFallback>MD</AvatarFallback></Avatar>
          <Avatar size="lg"><AvatarFallback>LG</AvatarFallback></Avatar>
        </div>
      </Section>
    </div>
  );
}
