"use client";

import * as React from "react";
import { demoSuccess, demoExported, demoImported, demoPrinted, demoAssigned, demoWhatsAppSent, demoSaved, demoDeleted } from "@/lib/demo";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { WARDS } from "@/modules/people/constants";
import type { PartyMemberWithPerson } from "@/modules/party-members/types";
import { ArrowDown } from "lucide-react";

interface TransferMemberDialogProps {
  member: PartyMemberWithPerson | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransferMemberDialog({
  member,
  open,
  onOpenChange,
}: TransferMemberDialogProps) {
  const [toWard, setToWard] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [effectiveDate, setEffectiveDate] = React.useState<Date>();

  React.useEffect(() => {
    if (member) {
      setToWard("");
      setReason("");
      setEffectiveDate(undefined);
    }
  }, [member]);

  const handleSave = () => {
    demoSaved("Record");
    onOpenChange(false);
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Transfer Member</DialogTitle>
          <DialogDescription>
            Transfer {member.fullName} to a different ward within the organization.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="rounded-input border border-border-default bg-background-muted/50 p-4 space-y-3">
            <div>
              <p className="text-xs text-text-muted">From Ward</p>
              <p className="text-sm font-medium text-text-primary mt-0.5">{member.ward}</p>
            </div>
            <div className="flex justify-center">
              <ArrowDown className="size-4 text-text-muted" />
            </div>
            <div className="space-y-2">
              <Label>To Ward</Label>
              <Select value={toWard} onValueChange={setToWard}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination ward" />
                </SelectTrigger>
                <SelectContent>
                  {WARDS.filter((w) => w !== member.ward).map((ward) => (
                    <SelectItem key={ward} value={ward}>{ward}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Reason</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for transfer..."
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Effective Date</Label>
            <DatePicker value={effectiveDate} onChange={setEffectiveDate} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!toWard}>Save Transfer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
