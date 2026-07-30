"use client";

import * as React from "react";
import { demoSuccess, demoExported, demoImported, demoPrinted, demoAssigned, demoWhatsAppSent, demoSaved, demoDeleted } from "@/lib/demo";
import { Plus, Phone, Mail, MapPin, Building, MoreHorizontal, Pencil } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SearchBar } from "@/components/ui/search-bar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { vendors } from "@/modules/expense-management/data/expense-data";

import { VendorCreateDialog } from "@/modules/expense-management/components/vendor-create-dialog";
import { L } from "@/components/shared/localized";

export function VendorsList() {
  const [createOpen, setCreateOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filtered = vendors.filter((v) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      v.name.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) ||
      (v.gst?.toLowerCase().includes(q) ?? false) ||
      v.phone.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Expense Management", href: "/expense-management" }, { label: "Vendors" }]} className="md:hidden" />
      <PageHeader
        title="Vendors"
        description="Registered suppliers and service providers — GST, contact, and bank details."
        actions={<Button onClick={() => setCreateOpen(true)}><Plus className="size-4" /><L>Add Vendor</L></Button>}
      />

      <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch("")} placeholder="Search vendors by name, GST, category..." containerClassName="sm:max-w-md" />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((vendor) => (
          <Card key={vendor.id} className="group hover:border-border-default transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary">{vendor.name}</p>
                  <Badge variant="outline" className="mt-1.5 text-[10px]">{vendor.category}</Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100"><MoreHorizontal className="size-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => demoSuccess("Action completed successfully.")}><Pencil className="size-4" />Edit</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-text-muted">
                {vendor.gst && <p className="font-mono text-text-secondary">GST: {vendor.gst}</p>}
                <p className="flex items-center gap-1.5"><Phone className="size-3" />{vendor.phone}</p>
                {vendor.email && <p className="flex items-center gap-1.5"><Mail className="size-3" />{vendor.email}</p>}
                <p className="flex items-start gap-1.5"><MapPin className="size-3 shrink-0 mt-0.5" />{vendor.address}</p>
              </div>

              {vendor.bankName && (
                <div className="mt-3 pt-3 border-t border-border-subtle space-y-1 text-xs">
                  <p className="flex items-center gap-1.5 text-text-secondary font-medium"><Building className="size-3" />Bank Details</p>
                  <p className="text-text-muted">{vendor.bankName}</p>
                  {vendor.accountNumber && <p className="font-mono text-text-muted">A/C: {vendor.accountNumber}</p>}
                  {vendor.ifsc && <p className="font-mono text-text-muted">IFSC: {vendor.ifsc}</p>}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <VendorCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
