"use client";

import { Pin, Plus } from "lucide-react";
import { demoSuccess, demoExported, demoImported, demoPrinted, demoAssigned, demoWhatsAppSent, demoSaved, demoDeleted } from "@/lib/demo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { PersonNote } from "@/modules/people/types";
import { formatPersonDateTime } from "@/modules/people/lib/utils";
import { toast } from "@/components/ui/sonner";

interface PersonNotesTabProps {
  notes: PersonNote[];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function PersonNotesTab({ notes }: PersonNotesTabProps) {
  const sorted = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <Textarea placeholder="Add an internal note..." className="min-h-[80px] mb-3" />
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() => demoSaved("Record")}
            >
              <Plus className="size-4" />
              Add Note
            </Button>
          </div>
        </CardContent>
      </Card>

      {sorted.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-text-muted">No notes yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sorted.map((note) => (
            <Card
              key={note.id}
              className={note.pinned ? "border-accent-primary/20 bg-accent-primary-muted/10" : ""}
            >
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar size="sm">
                    <AvatarFallback>{getInitials(note.author)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text-primary">
                          {note.author}
                        </span>
                        {note.pinned && (
                          <Pin className="size-3 text-accent-primary" />
                        )}
                      </div>
                      <time className="text-xs text-text-muted shrink-0">
                        {formatPersonDateTime(note.createdAt)}
                      </time>
                    </div>
                    <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                      {note.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
