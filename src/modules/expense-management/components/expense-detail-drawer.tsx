"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  Building2,
  CreditCard,
  User,
  FileText,
  MessageSquare,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Separator } from "@/components/ui/separator";
import { AttachmentButton } from "@/components/shared/attachment-viewer-dialog";
import { demoApproved, demoRejected, demoSaved } from "@/lib/demo";
import { useLocaleText } from "@/lib/i18n/locale-text";
import { EXPENSE_STATUS_LABELS } from "@/modules/expense-management/constants";
import {
  formatCurrency,
  formatExpenseDate,
  getExpenseStatusVariant,
} from "@/modules/expense-management/lib/utils";
import type { Expense } from "@/modules/expense-management/types";

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  const lt = useLocaleText();
  return (
    <div className="flex gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-input bg-background-muted text-text-muted">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-text-muted">{lt(label)}</p>
        <div className="text-sm text-text-primary mt-0.5">{value}</div>
      </div>
    </div>
  );
}

export function ExpenseDetailDrawer({
  expense,
  open,
  onOpenChange,
  showApprovalActions = false,
}: {
  expense: Expense | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showApprovalActions?: boolean;
}) {
  const lt = useLocaleText();
  if (!expense) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side="right" className="sm:max-w-lg">
        <DrawerHeader>
          <DrawerTitle>{expense.expenseId}</DrawerTitle>
          <DrawerDescription>{expense.description ?? expense.categoryName}</DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-6 space-y-5 pb-4">
          <div className="flex items-center justify-between">
            <StatusBadge
              label={lt(EXPENSE_STATUS_LABELS[expense.status])}
              status={getExpenseStatusVariant(expense.status)}
            />
            <span className="text-lg font-semibold">{formatCurrency(expense.amount)}</span>
          </div>

          <DetailRow icon={<Calendar className="size-4" />} label="Date" value={formatExpenseDate(expense.date)} />
          <DetailRow icon={<FileText className="size-4" />} label="Category" value={expense.categoryName} />
          <DetailRow icon={<Building2 className="size-4" />} label="Vendor" value={expense.vendorName} />
          <DetailRow icon={<CreditCard className="size-4" />} label="Payment Mode" value={expense.paymentMode} />
          <DetailRow icon={<Building2 className="size-4" />} label="Department" value={expense.department} />
          <DetailRow icon={<Building2 className="size-4" />} label="Ward" value={expense.ward} />

          <Separator />

          <DetailRow
            icon={<User className="size-4" />}
            label="Submitted By"
            value={
              <Link href={`/people/${expense.submittedById}`} className="text-accent-primary hover:underline">
                {expense.submittedByName}
              </Link>
            }
          />
          <DetailRow
            icon={<User className="size-4" />}
            label="Expense Owner"
            value={
              <Link href={`/people/${expense.expenseOwnerId}`} className="text-accent-primary hover:underline">
                {expense.expenseOwnerName}
              </Link>
            }
          />

          {expense.remarks && (
            <DetailRow
              icon={<MessageSquare className="size-4" />}
              label="Remarks"
              value={expense.remarks}
            />
          )}

          <AttachmentButton fileName={expense.attachment} label="Attachments" />
        </div>

        <DrawerFooter className="flex-row gap-2">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            {lt("Close")}
          </Button>
          {showApprovalActions && expense.status === "pending" ? (
            <>
              <Button variant="outline" className="flex-1" onClick={() => { demoRejected(); onOpenChange(false); }}>
                {lt("Reject")}
              </Button>
              <Button className="flex-1" onClick={() => { demoApproved(); onOpenChange(false); }}>
                {lt("Approve")}
              </Button>
            </>
          ) : (
            <Button className="flex-1" onClick={() => { demoSaved("Expense"); onOpenChange(false); }}>
              {lt("Save")}
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
