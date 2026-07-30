"use client";

import * as React from "react";
import { useTranslation } from "@/lib/i18n/context";
import { getExpenseCategories } from "@/lib/i18n/localized-demo-data";
import { demoSuccess, demoExported, demoImported, demoPrinted, demoAssigned, demoWhatsAppSent, demoSaved, demoDeleted } from "@/lib/demo";
import { Plus, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/modules/expense-management/lib/utils";
import type { ExpenseCategory } from "@/modules/expense-management/types";

export function ExpenseCategoriesList() {
  const { locale } = useTranslation();
  const expenseCategories = React.useMemo(() => getExpenseCategories(locale), [locale]);
  const [categories, setCategories] = React.useState(expenseCategories);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ExpenseCategory | null>(null);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [budget, setBudget] = React.useState("");

  const openCreate = () => {
    setEditing(null);
    setName("");
    setDescription("");
    setBudget("");
    setDialogOpen(true);
  };

  const openEdit = (cat: ExpenseCategory) => {
    setEditing(cat);
    setName(cat.name);
    setDescription(cat.description ?? "");
    setBudget(String(cat.budgetAllocated));
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (editing) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editing.id
            ? { ...c, name, description, budgetAllocated: Number(budget) || c.budgetAllocated }
            : c
        )
      );
      demoSaved("Record");
    } else {
      setCategories((prev) => [
        ...prev,
        {
          id: `cat-${String(prev.length + 1).padStart(2, "0")}`,
          name,
          description,
          budgetAllocated: Number(budget) || 50000,
          isDefault: false,
        },
      ]);
      demoSaved("Record");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    demoSuccess("Removed successfully.");
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Expense Management", href: "/expense-management" }, { label: "Categories" }]} className="md:hidden" />
      <PageHeader
        title="Expense Categories"
        description="Manage expense classification and category-wise budget allocations."
        actions={<Button onClick={openCreate}><Plus className="size-4" />Add Category</Button>}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Card key={cat.id} className="group hover:border-border-default transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary">{cat.name}</p>
                  <p className="text-xs text-text-muted mt-1 line-clamp-2">{cat.description}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {cat.isDefault && <Badge variant="outline" className="text-[10px]">Default</Badge>}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100"><MoreHorizontal className="size-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(cat)}><Pencil className="size-4" />Edit</DropdownMenuItem>
                      {!cat.isDefault && (
                        <DropdownMenuItem onClick={() => handleDelete(cat.id)}><Trash2 className="size-4" />Delete</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <p className="text-sm font-medium text-accent-primary mt-3">Budget: {formatCurrency(cat.budgetAllocated)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Category" : "Add Category"}</DialogTitle>
            <DialogDescription>Define expense category and annual budget allocation.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Category Name</Label>
              <Input id="cat-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Office Supplies" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea id="cat-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description" rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-budget">Budget Allocated (₹)</Label>
              <Input id="cat-budget" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="50000" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Save Changes" : "Create Category"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
