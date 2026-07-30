"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { WARDS, BOOTHS } from "@/modules/people/constants";
import type { Person } from "@/modules/people/types";
import { demoSuccess } from "@/lib/demo";

export interface CreatePersonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialName?: string;
  onCreated: (person: Person) => void;
}

export function CreatePersonDialog({
  open,
  onOpenChange,
  initialName = "",
  onCreated,
}: CreatePersonDialogProps) {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [ward, setWard] = React.useState("");
  const [booth, setBooth] = React.useState("");

  React.useEffect(() => {
    if (open && initialName) {
      const parts = initialName.trim().split(" ");
      setFirstName(parts[0] ?? "");
      setLastName(parts.slice(1).join(" "));
    }
  }, [open, initialName]);

  const handleCreate = () => {
    const fullName = `${firstName} ${lastName}`.trim();
    if (!fullName || !mobile) return;

    const person: Person = {
      id: `p-new-${Date.now()}`,
      firstName,
      lastName,
      fullName,
      mobile,
      whatsapp: mobile,
      gender: "male",
      area: ward.split("—")[1]?.trim() ?? "Pune",
      ward,
      booth,
      address: { line1: "", city: "Pune", district: "Pune", state: "Maharashtra", pincode: "411001" },
      tags: [],
      status: "active",
      initials: `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase(),
      lastActivity: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    demoSuccess(`${fullName} created and linked to party member assignment.`);
    onCreated(person);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Person</DialogTitle>
          <DialogDescription>Add a new person profile and continue with party member assignment.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Mobile</Label>
            <Input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="10-digit mobile" />
          </div>
          <div className="space-y-2">
            <Label>Ward</Label>
            <Select value={ward} onValueChange={setWard}>
              <SelectTrigger><SelectValue placeholder="Select ward" /></SelectTrigger>
              <SelectContent>
                {WARDS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Booth</Label>
            <Select value={booth} onValueChange={setBooth}>
              <SelectTrigger><SelectValue placeholder="Select booth" /></SelectTrigger>
              <SelectContent>
                {BOOTHS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!firstName || !mobile}>Create & Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
