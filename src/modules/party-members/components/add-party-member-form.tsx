"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, UserPlus, User, Check } from "lucide-react";
import { CreatePersonDialog } from "@/modules/party-members/components/create-person-dialog";
import { demoSuccess } from "@/lib/demo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SearchBar } from "@/components/ui/search-bar";
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
  FormActions,
} from "@/components/forms/form-layout";
import { getAllPeople } from "@/modules/people/data/people";
import type { Person } from "@/modules/people/types";
import type { OrganizationType } from "@/modules/party-members/types";
import {
  ORGANIZATION_LABELS,
  getDesignationsForOrg,
  COMMITTEES,
  MORCHA_TYPES,
  PANCHAYAT_NAMES,
} from "@/modules/party-members/constants";
import { WARDS, BOOTHS } from "@/modules/people/constants";

export function AddPartyMemberForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultOrg = (searchParams.get("org") as OrganizationType) || "party";

  const [query, setQuery] = React.useState("");
  const [selectedPerson, setSelectedPerson] = React.useState<Person | null>(null);
  const [orgType, setOrgType] = React.useState<OrganizationType>(defaultOrg);
  const [designation, setDesignation] = React.useState("");
  const [ward, setWard] = React.useState("");
  const [booth, setBooth] = React.useState("");
  const [committee, setCommittee] = React.useState("");
  const [morchaType, setMorchaType] = React.useState("");
  const [panchayatName, setPanchayatName] = React.useState("");
  const [joiningDate, setJoiningDate] = React.useState<Date>();
  const [status, setStatus] = React.useState("active");
  const [createPersonOpen, setCreatePersonOpen] = React.useState(false);

  const allPeople = getAllPeople();

  const searchResults = React.useMemo(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return allPeople
      .filter(
        (p) =>
          p.fullName.toLowerCase().includes(q) ||
          p.mobile.includes(q)
      )
      .slice(0, 8);
  }, [query, allPeople]);

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setWard(person.ward);
    setBooth(person.booth);
    setQuery("");
  };

  const handleSave = () => {
    if (!selectedPerson) return;
    demoSuccess(`${selectedPerson.fullName} assigned as party member successfully.`);
    router.push("/party-members");
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Search Person */}
      <Card>
        <CardHeader>
          <CardTitle>Search Existing Person</CardTitle>
          <CardDescription>
            Party members are linked to existing people profiles. Search by name or mobile number.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!selectedPerson ? (
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
                        onClick={() => handleSelectPerson(person)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-background-muted transition-colors"
                      >
                        <Avatar size="sm">
                          <AvatarFallback>{person.initials}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-text-primary">{person.fullName}</p>
                          <p className="text-xs text-text-muted">{person.mobile} · {person.area}</p>
                        </div>
                        <Search className="size-4 text-text-muted shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {query.length >= 2 && searchResults.length === 0 && (
                <div className="rounded-input border border-dashed border-border-default bg-background-muted/30 p-8 text-center">
                  <User className="size-8 text-text-muted mx-auto mb-3" />
                  <p className="text-sm font-medium text-text-primary">No person found</p>
                  <p className="text-sm text-text-secondary mt-1 mb-4">
                    This person doesn&apos;t exist in the People directory yet.
                  </p>
                  <Button onClick={() => setCreatePersonOpen(true)}>
                    <UserPlus className="size-4" />
                    Create New Person
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-4 rounded-input border border-accent-primary/20 bg-accent-primary-muted/20 p-4">
              <Avatar>
                <AvatarFallback>{selectedPerson.initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-primary">{selectedPerson.fullName}</p>
                <p className="text-xs text-text-secondary">{selectedPerson.mobile} · {selectedPerson.area}</p>
              </div>
              <div className="flex items-center gap-1 text-accent-primary text-xs font-medium">
                <Check className="size-3.5" />
                Selected
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedPerson(null)}>
                Change
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 2: Assignment */}
      {selectedPerson && (
        <Card>
          <CardHeader>
            <CardTitle>Political Assignment</CardTitle>
            <CardDescription>
              Assign {selectedPerson.fullName} to an organization within your political structure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormLayout
              footer={
                <FormActions>
                  <Link href="/party-members">
                    <Button variant="outline" type="button">Cancel</Button>
                  </Link>
                  <Button onClick={handleSave} disabled={!designation || !ward}>
                    Save Assignment
                  </Button>
                </FormActions>
              }
            >
              <FormSection>
                <FormField label="Organization Type" required>
                  <Select
                    value={orgType}
                    onValueChange={(v) => {
                      setOrgType(v as OrganizationType);
                      setDesignation("");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(ORGANIZATION_LABELS) as OrganizationType[]).map((key) => (
                        <SelectItem key={key} value={key}>
                          {ORGANIZATION_LABELS[key]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Designation" required>
                  <Select value={designation} onValueChange={setDesignation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                    <SelectContent>
                      {getDesignationsForOrg(orgType).map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Ward" required>
                  <Select value={ward} onValueChange={setWard}>
                    <SelectTrigger><SelectValue placeholder="Select ward" /></SelectTrigger>
                    <SelectContent>
                      {WARDS.map((w) => (
                        <SelectItem key={w} value={w}>{w}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Booth">
                  <Select value={booth} onValueChange={setBooth}>
                    <SelectTrigger><SelectValue placeholder="Select booth" /></SelectTrigger>
                    <SelectContent>
                      {BOOTHS.map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                {orgType === "committees" && (
                  <FormField label="Committee">
                    <Select value={committee} onValueChange={setCommittee}>
                      <SelectTrigger><SelectValue placeholder="Select committee" /></SelectTrigger>
                      <SelectContent>
                        {COMMITTEES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                )}
                {orgType === "morcha" && (
                  <FormField label="Morcha Type">
                    <Select value={morchaType} onValueChange={setMorchaType}>
                      <SelectTrigger><SelectValue placeholder="Select morcha" /></SelectTrigger>
                      <SelectContent>
                        {MORCHA_TYPES.map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                )}
                {orgType === "panchayat" && (
                  <FormField label="Panchayat">
                    <Select value={panchayatName} onValueChange={setPanchayatName}>
                      <SelectTrigger><SelectValue placeholder="Select panchayat" /></SelectTrigger>
                      <SelectContent>
                        {PANCHAYAT_NAMES.map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                )}
                <FormField label="Joining Date">
                  <DatePicker value={joiningDate} onChange={setJoiningDate} />
                </FormField>
                <FormField label="Status">
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending Approval</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </FormSection>
            </FormLayout>
          </CardContent>
        </Card>
      )}
      <CreatePersonDialog
        open={createPersonOpen}
        onOpenChange={setCreatePersonOpen}
        initialName={query}
        onCreated={(person) => {
          setSelectedPerson(person);
          setWard(person.ward);
          setBooth(person.booth);
          setQuery("");
        }}
      />
    </div>
  );
}
