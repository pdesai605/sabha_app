"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { L } from "@/components/shared/localized";
import { useTranslation } from "@/lib/i18n/context";
import {
  getPersonById,
  getTimelineForPerson,
  getDocumentsForPerson,
  getNotesForPerson,
  getActivitiesForPerson,
} from "@/lib/i18n/localized-demo-data";
import { PersonProfileHeader } from "@/modules/people/components/person-profile-header";
import { PersonOverviewTab } from "@/modules/people/components/person-overview-tab";
import { PersonTimelineTab } from "@/modules/people/components/person-timeline-tab";
import { PersonDocumentsTab } from "@/modules/people/components/person-documents-tab";
import { PersonNotesTab } from "@/modules/people/components/person-notes-tab";
import { PersonActivityTab } from "@/modules/people/components/person-activity-tab";

interface PersonDetailProps {
  personId: string;
}

export function PersonDetail({ personId }: PersonDetailProps) {
  const { locale } = useTranslation();
  const person = React.useMemo(() => getPersonById(personId, locale), [personId, locale]);
  const timeline = React.useMemo(() => getTimelineForPerson(personId, locale), [personId, locale]);
  const documents = React.useMemo(() => getDocumentsForPerson(personId, locale), [personId, locale]);
  const notes = React.useMemo(() => getNotesForPerson(personId, locale), [personId, locale]);
  const activities = React.useMemo(() => getActivitiesForPerson(personId, locale), [personId, locale]);

  if (!person) notFound();

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
