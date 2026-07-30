"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { demoCreated, demoSuccess } from "@/lib/demo";
import { useLocaleText } from "@/lib/i18n/locale-text";

export interface DemoFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onSave?: () => void;
  saveLabel?: string;
  createdMessage?: string;
  successMessage?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClass = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
};

export function DemoFormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSave,
  saveLabel = "Save",
  createdMessage,
  successMessage,
  size = "lg",
}: DemoFormDialogProps) {
  const lt = useLocaleText();

  const handleSave = () => {
    onSave?.();
    if (successMessage) {
      demoSuccess(successMessage);
    } else {
      demoCreated(createdMessage);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${sizeClass[size]} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>{lt(title)}</DialogTitle>
          {description && <DialogDescription>{lt(description)}</DialogDescription>}
        </DialogHeader>
        {children}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{lt("Cancel")}</Button>
          <Button onClick={handleSave}>{lt(saveLabel)}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
