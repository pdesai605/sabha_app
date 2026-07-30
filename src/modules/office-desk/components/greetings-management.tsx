"use client";

import * as React from "react";
import { useTranslation } from "@/lib/i18n/context";
import { getGreetings } from "@/lib/i18n/localized-demo-data";
import Link from "next/link";
import { Gift, Plus, Calendar } from "lucide-react";
import { demoSaved } from "@/lib/demo";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GREETING_CATEGORIES, OFFICE_TODAY } from "@/modules/office-desk/constants";
import { formatOfficeDate } from "@/modules/office-desk/lib/utils";
import { GreetingComposer } from "@/modules/office-desk/components/greeting-composer";
import type { Greeting, GreetingCategory, GreetingStatus } from "@/modules/office-desk/types";

const statusVariant: Record<GreetingStatus, "default" | "primary" | "success"> = {
  draft: "default",
  scheduled: "primary",
  sent: "success",
};

function GreetingCard({
  greeting,
  onOpen,
}: {
  greeting: Greeting;
  onOpen: () => void;
}) {
  return (
    <Card className="cursor-pointer hover:border-border-default transition-colors" onClick={onOpen}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex size-9 items-center justify-center rounded-input bg-accent-primary-muted text-accent-primary">
            <Gift className="size-4" />
          </div>
          <Badge variant={statusVariant[greeting.status]}>{greeting.status}</Badge>
        </div>
        <p className="text-sm font-medium text-text-primary mt-3">
          {greeting.personId ? (
            <Link href={`/people/${greeting.personId}`} className="hover:text-accent-primary" onClick={(e) => e.stopPropagation()}>{greeting.recipientName}</Link>
          ) : greeting.recipientName}
        </p>
        <p className="text-xs text-text-secondary mt-0.5">{greeting.occasion}</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          <Badge variant="outline" className="text-[10px]">{greeting.category}</Badge>
          <span className="text-xs text-text-muted flex items-center gap-1"><Calendar className="size-3" />{formatOfficeDate(greeting.scheduledDate)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function GreetingsManagement() {
  const { locale } = useTranslation();
  const greetings = React.useMemo(() => getGreetings(locale), [locale]);
  const [category, setCategory] = React.useState<GreetingCategory | "all">("all");
  const [composerOpen, setComposerOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Greeting | null>(null);

  const upcoming = greetings.filter((g) => g.status === "scheduled" && g.scheduledDate >= OFFICE_TODAY);
  const sent = greetings.filter((g) => g.status === "sent");
  const drafts = greetings.filter((g) => g.status === "draft");

  const byCategory = (list: Greeting[]) =>
    category === "all" ? list : list.filter((g) => g.category === category);

  const openComposer = (greeting: Greeting) => {
    setSelected(greeting);
    setComposerOpen(true);
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Office Desk", href: "/office-desk" }, { label: "Greetings" }]} className="md:hidden" />
      <PageHeader
        title="Greetings"
        description="Manage birthday wishes, festival greetings, congratulations, and condolence messages."
        actions={
          <Button onClick={() => {
            setSelected({
              id: "new",
              recipientName: "New Recipient",
              category: "Birthday",
              occasion: "Birthday",
              scheduledDate: OFFICE_TODAY,
              status: "draft",
              personId: undefined,
              message: "",
            });
            setComposerOpen(true);
          }}>
            <Plus className="size-4" />Create Greeting
          </Button>
        }
      />

      <Tabs value={category} onValueChange={(v) => setCategory(v as GreetingCategory | "all")}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          {GREETING_CATEGORIES.map((cat) => (
            <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({byCategory(upcoming).length})</TabsTrigger>
          <TabsTrigger value="sent">Sent ({byCategory(sent).length})</TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({byCategory(drafts).length})</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {byCategory(upcoming).map((g) => <GreetingCard key={g.id} greeting={g} onOpen={() => openComposer(g)} />)}
          </div>
        </TabsContent>
        <TabsContent value="sent" className="mt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {byCategory(sent).map((g) => <GreetingCard key={g.id} greeting={g} onOpen={() => openComposer(g)} />)}
          </div>
        </TabsContent>
        <TabsContent value="drafts" className="mt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {byCategory(drafts).map((g) => <GreetingCard key={g.id} greeting={g} onOpen={() => openComposer(g)} />)}
          </div>
        </TabsContent>
      </Tabs>

      {selected && (
        <GreetingComposer
          open={composerOpen}
          onOpenChange={setComposerOpen}
          recipientName={selected.recipientName}
          category={selected.category}
          occasion={selected.occasion}
          personId={selected.personId}
        />
      )}
    </div>
  );
}
