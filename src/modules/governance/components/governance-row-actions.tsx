"use client";

import {
  MoreHorizontal,
  Eye,
  Pencil,
  Clock,
  FileText,
  Paperclip,
  History,
  Printer,
} from "lucide-react";
import { demoPrinted } from "@/lib/demo";
import { Button } from "@/components/ui/button";
import { L } from "@/components/shared/localized";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { GovernanceDrawerTab } from "@/modules/governance/components/governance-record-drawer";

export function GovernanceRowActions({
  onAction,
}: {
  onAction: (tab: GovernanceDrawerTab) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onAction("view"); }}><Eye className="size-4" /><L>View</L></DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onAction("edit"); }}><Pencil className="size-4" /><L>Edit</L></DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onAction("history"); }}><History className="size-4" /><L>History</L></DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onAction("documents"); }}><FileText className="size-4" /><L>Documents</L></DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onAction("attachments"); }}><Paperclip className="size-4" /><L>Attachments</L></DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onAction("timeline"); }}><Clock className="size-4" /><L>Timeline</L></DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); demoPrinted(); }}><Printer className="size-4" /><L>Print</L></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
