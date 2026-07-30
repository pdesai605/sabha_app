"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { demoDeleted } from "@/lib/demo";
import { useLocaleText } from "@/lib/i18n/locale-text";
import { L } from "@/components/shared/localized";

export interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  itemLabel?: string;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  title = "Confirm Delete",
  description = "Are you sure you want to delete this record? This action cannot be undone.",
  itemLabel = "Record",
}: DeleteConfirmDialogProps) {
  const lt = useLocaleText();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{lt(title)}</DialogTitle>
          <DialogDescription>{lt(description)}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <L>Cancel</L>
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              demoDeleted(lt(itemLabel));
              onOpenChange(false);
            }}
          >
            <L>Delete</L>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
