"use client";

import * as React from "react";
import { demoSuccess, demoExported, demoImported, demoPrinted, demoAssigned, demoWhatsAppSent, demoSaved, demoDeleted } from "@/lib/demo";
import { Phone, Mail, MapPin, MoreHorizontal, Plus, Download } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchBar } from "@/components/ui/search-bar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { officeContacts } from "@/modules/office-desk/data/office-data";
import { CONTACT_CATEGORIES } from "@/modules/office-desk/constants";
import type { ContactCategory } from "@/modules/office-desk/types";

import { ContactCreateDialog } from "@/modules/office-desk/components/contact-create-dialog";
import { L } from "@/components/shared/localized";

export function OfficeContactsList() {
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState<ContactCategory | "all">("all");
  const [createOpen, setCreateOpen] = React.useState(false);

  const filtered = officeContacts.filter((c) => {
    if (category !== "all" && c.category !== category) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.organization.toLowerCase().includes(q) ||
      c.designation.toLowerCase().includes(q) ||
      c.phone.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Office Desk", href: "/office-desk" }, { label: "Office Contacts" }]} className="md:hidden" />
      <PageHeader
        title="Office Contacts"
        description="Government, municipal, media, and institutional contacts for daily office coordination."
        actions={<Button onClick={() => setCreateOpen(true)}><Plus className="size-4" /><L>Add Contact</L></Button>}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch("")} placeholder="Search contacts..." containerClassName="sm:max-w-sm" />
        <Button variant="outline" size="sm" onClick={() => demoExported("File")}><Download className="size-4" />Export</Button>
      </div>

      <Tabs value={category} onValueChange={(v) => setCategory(v as ContactCategory | "all")}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="all">All ({officeContacts.length})</TabsTrigger>
          {CONTACT_CATEGORIES.map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {cat} ({officeContacts.filter((c) => c.category === cat).length})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={category} className="mt-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((contact) => (
              <Card key={contact.id} className="group hover:border-border-default/80 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary">{contact.name}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{contact.designation}</p>
                      <p className="text-xs text-text-muted mt-1">{contact.organization}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-[10px]">{contact.category}</Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100"><MoreHorizontal className="size-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => demoSuccess("Action completed successfully.")}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => demoSuccess("Removed successfully.")}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1.5 text-xs text-text-muted">
                    <p className="flex items-center gap-1.5"><Phone className="size-3" />{contact.phone}</p>
                    {contact.email && <p className="flex items-center gap-1.5"><Mail className="size-3" />{contact.email}</p>}
                    {contact.address && <p className="flex items-center gap-1.5"><MapPin className="size-3" />{contact.address}</p>}
                    {contact.department && <p className="text-text-secondary">Dept: {contact.department}</p>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      <ContactCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
