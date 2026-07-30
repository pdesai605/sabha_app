"use client";

import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { L } from "@/components/shared/localized";
import { PersonProfileHeader } from "@/modules/people/components/person-profile-header";
import { PersonOverviewTab } from "@/modules/people/components/person-overview-tab";
import { PersonTimelineTab } from "@/modules/people/components/person-timeline-tab";
import { PersonDocumentsTab } from "@/modules/people/components/person-documents-tab";
import { PersonNotesTab } from "@/modules/people/components/person-notes-tab";
import { PersonActivityTab } from "@/modules/people/components/person-activity-tab";
import type { Person } from "@/modules/people/types";
import {
  getTimelineForPerson,
  getDocumentsForPerson,
  getNotesForPerson,
  getActivitiesForPerson,
} from "@/modules/people/data/people";

interface PersonDetailProps {
  person: Person;
}

export function PersonDetail({ person }: PersonDetailProps) {
  const timeline = getTimelineForPerson(person.id);
  const documents = getDocumentsForPerson(person.id);
  const notes = getNotesForPerson(person.id);
  const activities = getActivitiesForPerson(person.id);

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "People", href: "/people" },
          { label: person.fullName },
        ]}
        className="md:hidden"
      />

      <PersonProfileHeader person={person} />

      <Tabs defaultValue="overview">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview"><L>Overview</L></TabsTrigger>
          <TabsTrigger value="timeline">
            <L>Timeline</L>
            {timeline.length > 0 && (
              <span className="ml-1.5 text-xs text-text-muted">({timeline.length})</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="documents">
            <L>Documents</L>
            {documents.length > 0 && (
              <span className="ml-1.5 text-xs text-text-muted">({documents.length})</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="notes">
            <L>Notes</L>
            {notes.length > 0 && (
              <span className="ml-1.5 text-xs text-text-muted">({notes.length})</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="activity"><L>Activity</L></TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <PersonOverviewTab person={person} />
        </TabsContent>
        <TabsContent value="timeline">
          <PersonTimelineTab events={timeline} />
        </TabsContent>
        <TabsContent value="documents">
          <PersonDocumentsTab documents={documents} />
        </TabsContent>
        <TabsContent value="notes">
          <PersonNotesTab notes={notes} />
        </TabsContent>
        <TabsContent value="activity">
          <PersonActivityTab activities={activities} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
