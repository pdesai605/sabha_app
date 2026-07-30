"use client";

import * as React from "react";
import { demoSuccess, demoExported, demoImported, demoPrinted, demoAssigned, demoWhatsAppSent, demoSaved, demoDeleted } from "@/lib/demo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, UserPlus, User, Check } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SearchBar } from "@/components/ui/search-bar";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import {
  FormLayout,
  FormSection,
  FormField,
  FormRow,
  FormActions,
} from "@/components/forms/form-layout";
import { getAllPeople } from "@/modules/people/data/people";
import type { Person } from "@/modules/people/types";
import {
  VISIT_PURPOSES,
  VISITOR_TYPES,
  VISIT_STATUSES,
  VISIT_PRIORITIES,
  STAFF_MEMBERS,
  MEETING_WITH,
  VISITOR_TYPE_LABELS,
} from "@/modules/visitor-desk/constants";

interface VisitFormProps {
  mode: "create" | "edit";
  initialData?: ReturnType<typeof import("@/modules/visitor-desk/lib/utils").visitToFormDefaults>;
  visitId?: string;
  personId?: string;
}

export function VisitForm({ mode, initialData, visitId, personId }: VisitFormProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [selectedPerson, setSelectedPerson] = React.useState<Person | null>(
    personId ? getAllPeople().find((p) => p.id === personId) ?? null : null
  );
  const [letterSubmitted, setLetterSubmitted] = React.useState(initialData?.letterSubmitted ?? false);
  const [letterFiles, setLetterFiles] = React.useState<File[]>([]);
  const [attachments, setAttachments] = React.useState<File[]>([]);
  const [visitDate, setVisitDate] = React.useState<Date | undefined>(
    initialData?.visitDate ? new Date(initialData.visitDate) : new Date("2026-07-25")
  );

  const allPeople = getAllPeople();

  const searchResults = React.useMemo(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return allPeople
      .filter((p) => p.fullName.toLowerCase().includes(q) || p.mobile.includes(q))
      .slice(0, 8);
  }, [query, allPeople]);

  const showPersonSearch = mode === "create" && !selectedPerson;

  const handleSave = () => {
    demoSaved("Record");
    router.push(mode === "edit" && visitId ? `/visitor-desk/${visitId}` : "/visitor-desk");
  };

  return (
    <div className="space-y-6">
      {mode === "create" && (
        <Card>
          <CardHeader>
            <CardTitle>Search Existing Person</CardTitle>
            <CardDescription>
              Every visit belongs to a person in the People directory. Search by name or mobile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {showPersonSearch ? (
              <>
                <SearchBar
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onClear={() => setQuery("")}
                  placeholder="Search by name or mobile..."
                />
                {searchResults.length > 0 && (
                  <ul className="rounded-input border border-border-default divide-y divide-border-subtle overflow-hidden">
                    {searchResults.map((person) => (
                      <li key={person.id}>
                        <button
                          type="button"
                          onClick={() => { setSelectedPerson(person); setQuery(""); }}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-background-muted transition-colors"
                        >
                          <Avatar size="sm"><AvatarFallback>{person.initials}</AvatarFallback></Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-text-primary">{person.fullName}</p>
                            <p className="text-xs text-text-muted">{person.mobile} · {person.area}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {query.length >= 2 && searchResults.length === 0 && (
                  <div className="rounded-input border border-dashed border-border-default bg-background-muted/30 p-8 text-center">
                    <User className="size-8 text-text-muted mx-auto mb-3" />
                    <p className="text-sm font-medium text-text-primary">Person not found</p>
                    <p className="text-sm text-text-secondary mt-1 mb-4">
                      Create a new person profile first, then return to register the visit.
                    </p>
                    <Link href="/people/new?return=/visitor-desk/new">
                      <Button><UserPlus className="size-4" />Create New Person</Button>
                    </Link>
                  </div>
                )}
              </>
            ) : selectedPerson && (
              <div className="flex items-center gap-4 rounded-input border border-accent-primary/20 bg-accent-primary-muted/20 p-4">
                <Avatar><AvatarFallback>{selectedPerson.initials}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary">{selectedPerson.fullName}</p>
                  <p className="text-xs text-text-secondary">{selectedPerson.mobile} · {selectedPerson.area}</p>
                </div>
                <div className="flex items-center gap-1 text-accent-primary text-xs font-medium">
                  <Check className="size-3.5" /> Selected
                </div>
                {mode === "create" && (
                  <Button variant="ghost" size="sm" onClick={() => setSelectedPerson(null)}>Change</Button>
                )}
                <Link href={`/people/${selectedPerson.id}`}>
                  <Button variant="outline" size="sm">View Profile</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {(selectedPerson || mode === "edit") && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Visit Information</CardTitle>
              <CardDescription>Details about this office visit.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormSection>
                <FormField label="Visitor Type" required>
                  <Select defaultValue={initialData?.visitorType ?? "walk-in"}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {VISITOR_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>{VISITOR_TYPE_LABELS[t]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Purpose" required>
                  <Select defaultValue={initialData?.purpose ?? undefined}>
                    <SelectTrigger><SelectValue placeholder="Select purpose" /></SelectTrigger>
                    <SelectContent>
                      {VISIT_PURPOSES.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Priority">
                  <Select defaultValue={initialData?.priority ?? "normal"}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {VISIT_PRIORITIES.map((p) => (
                        <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Meeting With">
                  <Select defaultValue={initialData?.meetingWith ?? undefined}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {MEETING_WITH.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Assigned Staff" required>
                  <Select defaultValue={initialData?.assignedStaff ?? undefined}>
                    <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
                    <SelectContent>
                      {STAFF_MEMBERS.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Visit Date">
                  <DatePicker value={visitDate} onChange={setVisitDate} />
                </FormField>
                <FormField label="Visit Time" htmlFor="visitTime">
                  <Input id="visitTime" type="time" defaultValue={initialData?.visitTime ?? "10:00"} />
                </FormField>
                <FormField label="Status">
                  <Select defaultValue={initialData?.status ?? "waiting"}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {VISIT_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s === "in-progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </FormSection>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Letter</CardTitle>
              <CardDescription>Record if the visitor submitted a written letter or application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-input border border-border-default p-4">
                <div>
                  <Label htmlFor="letterSubmitted">Letter Submitted?</Label>
                  <p className="text-xs text-text-muted mt-0.5">Toggle if visitor handed over a letter</p>
                </div>
                <Switch
                  id="letterSubmitted"
                  checked={letterSubmitted}
                  onCheckedChange={setLetterSubmitted}
                />
              </div>
              {letterSubmitted && (
                <div className="space-y-4 pl-1">
                  <FormField label="Reference Number" htmlFor="letterRef">
                    <Input id="letterRef" defaultValue={initialData?.letterReference} placeholder="LTR/2026/00001" />
                  </FormField>
                  <FormField label="Upload Scanned Document">
                    <FileUpload
                      value={letterFiles}
                      onChange={setLetterFiles}
                      accept=".pdf,.jpg,.jpeg,.png"
                      hint="Upload PDF or image of the letter"
                    />
                  </FormField>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Internal Notes">
                <Textarea
                  defaultValue={initialData?.internalNotes}
                  placeholder="Office staff notes (not visible to citizen)..."
                  className="min-h-[100px]"
                />
              </FormField>
              <FormField label="Citizen Remarks">
                <Textarea
                  defaultValue={initialData?.citizenRemarks}
                  placeholder="Remarks shared by the visitor..."
                  className="min-h-[80px]"
                />
              </FormField>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
              <CardDescription>Supporting documents uploaded during the visit.</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                value={attachments}
                onChange={setAttachments}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                multiple
              />
            </CardContent>
          </Card>

          <div className="sticky bottom-0 z-10 -mx-0 border-t border-border-default bg-background-secondary/95 backdrop-blur-sm px-0 py-4">
            <FormActions>
              <Link href={mode === "edit" && visitId ? `/visitor-desk/${visitId}` : "/visitor-desk"}>
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
              <Button onClick={handleSave}>
                {mode === "create" ? "Register Visitor" : "Update Visit"}
              </Button>
            </FormActions>
          </div>
        </>
      )}
    </div>
  );
}
