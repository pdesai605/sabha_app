"use client";

import * as React from "react";
import { toast } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormLayout,
  FormSection,
  FormField,
} from "@/components/forms/form-layout";
import { BOOTH_DEFINITIONS, PARTY_INCLINATIONS } from "@/modules/voter-intelligence/constants";
import { WARDS } from "@/modules/people/constants";
import { demoSuccess } from "@/lib/demo";

export interface AddVoterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddVoterDialog({ open, onOpenChange }: AddVoterDialogProps) {
  const [name, setName] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [ward, setWard] = React.useState("");
  const [booth, setBooth] = React.useState("");
  const [inclination, setInclination] = React.useState("");
  const [voterId, setVoterId] = React.useState("");

  const boothOptions = ward
    ? BOOTH_DEFINITIONS.filter((b) => b.ward === ward)
    : BOOTH_DEFINITIONS;

  const handleSubmit = () => {
    if (!name || !ward || !booth) {
      toast.error("Please fill in required fields.");
      return;
    }
    demoSuccess(`${name} added to voter register successfully.`);
    onOpenChange(false);
    setName("");
    setMobile("");
    setWard("");
    setBooth("");
    setInclination("");
    setVoterId("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Voter</DialogTitle>
          <DialogDescription>Register a new voter in the constituency database.</DialogDescription>
        </DialogHeader>
        <FormLayout>
          <FormSection>
            <FormField label="Full Name" required>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Voter full name" />
            </FormField>
            <FormField label="Voter ID">
              <Input value={voterId} onChange={(e) => setVoterId(e.target.value)} placeholder="ABC1234567" />
            </FormField>
            <FormField label="Mobile">
              <Input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="10-digit mobile" />
            </FormField>
            <FormField label="Ward" required>
              <Select value={ward} onValueChange={(v) => { setWard(v); setBooth(""); }}>
                <SelectTrigger><SelectValue placeholder="Select ward" /></SelectTrigger>
                <SelectContent>
                  {WARDS.map((w) => (
                    <SelectItem key={w} value={w}>{w}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Booth" required>
              <Select value={booth} onValueChange={setBooth}>
                <SelectTrigger><SelectValue placeholder="Select booth" /></SelectTrigger>
                <SelectContent>
                  {boothOptions.map((b) => (
                    <SelectItem key={b.number} value={`Booth ${b.number}`}>Booth {b.number} — {b.area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Party Inclination">
              <Select value={inclination} onValueChange={setInclination}>
                <SelectTrigger><SelectValue placeholder="Select inclination" /></SelectTrigger>
                <SelectContent>
                  {PARTY_INCLINATIONS.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </FormSection>
        </FormLayout>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Voter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
