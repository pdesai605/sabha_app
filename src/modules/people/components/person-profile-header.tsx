"use client";

import * as React from "react";
import Link from "next/link";
import { MessageCircle, Pencil, Phone, Archive, Trash2, Share2, Mail, MoreHorizontal } from "lucide-react";
import { demoSuccess, demoDeleted } from "@/lib/demo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { LBadge } from "@/components/shared/localized-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WhatsAppDialog } from "@/components/shared/whatsapp-dialog";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { L } from "@/components/shared/localized";
import type { Person } from "@/modules/people/types";
import { getStatusVariant } from "@/modules/people/lib/utils";

interface PersonProfileHeaderProps {
  person: Person;
}

export function PersonProfileHeader({ person }: PersonProfileHeaderProps) {
  const [waOpen, setWaOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <>
      <div className="rounded-card border border-border-default bg-background-card shadow-soft overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <Avatar size="lg" className="size-16 sm:size-20 text-lg">
              <AvatarFallback className="text-lg font-semibold">{person.initials}</AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 space-y-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-semibold tracking-tight text-text-primary">{person.fullName}</h1>
                    <StatusBadge
                      label={person.status.charAt(0).toUpperCase() + person.status.slice(1)}
                      status={getStatusVariant(person.status)}
                    />
                  </div>
                  {person.politicalDesignation && (
                    <p className="text-sm text-text-secondary">
                      {person.politicalDesignation}
                      {person.partyAffiliation && <span className="text-text-muted"> · {person.partyAffiliation}</span>}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {person.tags.map((tag) => (
                      <LBadge key={tag} variant="outline">{tag}</LBadge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <a href={`tel:+91${person.mobile}`} className="inline-flex">
                    <Button variant="outline" size="sm" type="button">
                      <Phone className="size-4" />
                      {person.mobile}
                    </Button>
                  </a>
                  <Button variant="outline" size="sm" type="button" onClick={() => setWaOpen(true)}>
                    <MessageCircle className="size-4" />
                    <L>WhatsApp</L>
                  </Button>
                  <Link href={`/people/${person.id}/edit`}>
                    <Button size="sm" type="button">
                      <Pencil className="size-4" />
                      <L>Edit</L>
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon-sm" type="button">
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">More actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {person.email && (
                        <DropdownMenuItem onClick={() => { window.location.href = `mailto:${person.email}`; }}>
                          <Mail className="size-4" />
                          <L>Send Email</L>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => demoSuccess("Profile link copied to clipboard.")}>
                        <Share2 className="size-4" />
                        <L>Share Profile</L>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => demoSuccess("Person archived successfully.")}>
                        <Archive className="size-4" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-semantic-danger focus:text-semantic-danger" onClick={() => setDeleteOpen(true)}>
                        <Trash2 className="size-4" />
                        <L>Delete</L>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WhatsAppDialog
        open={waOpen}
        onOpenChange={setWaOpen}
        recipient={person.fullName}
        mobile={person.mobile}
        defaultMessage={`Namaskar ${person.fullName.split(" ")[0]}, this is a message from the MLA Office.`}
      />
      <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} itemLabel={person.fullName} />
    </>
  );
}
