"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { demoSuccess, demoExported, demoImported, demoPrinted, demoAssigned, demoWhatsAppSent, demoSaved, demoDeleted } from "@/lib/demo";
import {
  Pencil,
  Printer,
  MessageCircle,
  ExternalLink,
  MoreHorizontal,
  FileText,
  MapPin,
  Phone,
  Clock,
  User,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { useTranslation } from "@/lib/i18n/context";
import { getVisitById, getTimelineForVisit } from "@/lib/i18n/localized-demo-data";
import { enrichVisit } from "@/modules/visitor-desk/lib/utils";
import {
  formatVisitDate,
  formatVisitTime,
  formatVisitDateTime,
  getWhatsAppUrl,
  getVisitStatusVariant,
  getPriorityVariant,
} from "@/modules/visitor-desk/lib/utils";
import {
  STATUS_LABELS,
  VISITOR_TYPE_LABELS,
} from "@/modules/visitor-desk/constants";
import { FileText as FileIcon, Image, Download } from "lucide-react";

interface VisitDetailProps {
  visitId: string;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4 py-3 border-b border-border-subtle last:border-0">
      <span className="text-sm text-text-muted shrink-0">{label}</span>
      <span className="text-sm text-text-primary text-right">{value}</span>
    </div>
  );
}

export function VisitDetail({ visitId }: VisitDetailProps) {
  const { locale } = useTranslation();
  const visit = React.useMemo(() => {
    const raw = getVisitById(visitId, locale);
    return raw ? enrichVisit(raw, locale) : null;
  }, [visitId, locale]);
  const timeline = React.useMemo(() => getTimelineForVisit(visitId, locale), [visitId, locale]);

  if (!visit) notFound();

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Visitor Desk", href: "/visitor-desk" },
          { label: visit.token },
        ]}
        className="md:hidden"
      />

      {/* Header */}
      <div className="rounded-card border border-border-default bg-background-card shadow-soft overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-4 min-w-0">
              <Avatar size="lg" className="size-14 shrink-0">
                <AvatarFallback className="text-lg">{visit.initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm text-accent-primary">{visit.token}</span>
                  <StatusBadge label={STATUS_LABELS[visit.status]} status={getVisitStatusVariant(visit.status)} />
                  <Badge variant={getPriorityVariant(visit.priority)}>
                    {visit.priority.charAt(0).toUpperCase() + visit.priority.slice(1)} Priority
                  </Badge>
                </div>
                <Link
                  href={`/people/${visit.personId}`}
                  className="text-xl font-semibold text-text-primary hover:text-accent-primary transition-colors"
                >
                  {visit.fullName}
                </Link>
                <p className="text-sm text-text-secondary">{visit.purpose}</p>
                <div className="flex flex-wrap gap-3 text-xs text-text-muted">
                  <span className="flex items-center gap-1"><Clock className="size-3.5" />{formatVisitDate(visit.visitDate)} · {formatVisitTime(visit.visitTime)}</span>
                  <span className="flex items-center gap-1"><User className="size-3.5" />{visit.assignedStaff}</span>
                  <span className="flex items-center gap-1"><MapPin className="size-3.5" />{visit.area}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <a href={`tel:+91${visit.mobile}`}>
                <Button variant="outline" size="sm">
                  <Phone className="size-4" />{visit.mobile}
                </Button>
              </a>
              <a href={getWhatsAppUrl(visit.whatsapp)} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <MessageCircle className="size-4" />WhatsApp
                </Button>
              </a>
              <Link href={`/visitor-desk/${visit.id}/edit`}>
                <Button size="sm"><Pencil className="size-4" />Edit</Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon-sm"><MoreHorizontal className="size-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => demoPrinted()}>
                    <Printer className="size-4" />Print Slip
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/people/${visit.personId}`}>
                      <ExternalLink className="size-4" />Open Person Profile
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="letter">Letter{visit.letterSubmitted && " ✓"}</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="documents">Documents{visit.attachments.length > 0 && ` (${visit.attachments.length})`}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Visit Details</CardTitle></CardHeader>
              <CardContent>
                <InfoRow label="Token" value={<span className="font-mono">{visit.token}</span>} />
                <InfoRow label="Purpose" value={visit.purpose} />
                <InfoRow label="Visitor Type" value={VISITOR_TYPE_LABELS[visit.visitorType]} />
                <InfoRow label="Meeting With" value={visit.meetingWith} />
                <InfoRow label="Assigned Staff" value={visit.assignedStaff} />
                <InfoRow label="Priority" value={visit.priority} />
                <InfoRow label="Status" value={STATUS_LABELS[visit.status]} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Visitor Information</CardTitle></CardHeader>
              <CardContent>
                <InfoRow label="Name" value={
                  <Link href={`/people/${visit.personId}`} className="text-accent-primary hover:underline">{visit.fullName}</Link>
                } />
                <InfoRow label="Mobile" value={visit.mobile} />
                <InfoRow label="Area" value={visit.area} />
                <InfoRow label="Ward" value={visit.ward} />
                {visit.followUpDate && (
                  <InfoRow label="Follow-up Date" value={formatVisitDate(visit.followUpDate)} />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="letter">
          {!visit.letterSubmitted || !visit.letter ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="size-8 text-text-muted mx-auto mb-3" />
                <p className="text-sm text-text-muted">No letter submitted for this visit.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex size-12 items-center justify-center rounded-input bg-accent-primary-muted text-accent-primary">
                    {visit.letter.fileType === "PDF" ? <FileIcon className="size-6" /> : <Image className="size-6" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary">{visit.letter.fileName}</p>
                    <p className="text-xs text-text-muted mt-1">
                      {visit.letter.fileType} · {visit.letter.fileSize}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      Reference: <span className="font-mono text-text-secondary">{visit.letter.referenceNumber}</span>
                    </p>
                    <p className="text-xs text-text-muted">
                      Uploaded {formatVisitDateTime(visit.letter.uploadedAt)}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => demoSuccess("Action completed successfully.")}>
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="notes">
          <div className="space-y-4">
            {visit.internalNotes && (
              <Card>
                <CardHeader><CardTitle className="text-base">Internal Notes</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-text-secondary leading-relaxed">{visit.internalNotes}</p>
                </CardContent>
              </Card>
            )}
            {visit.citizenRemarks && (
              <Card>
                <CardHeader><CardTitle className="text-base">Citizen Remarks</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-text-secondary leading-relaxed">{visit.citizenRemarks}</p>
                </CardContent>
              </Card>
            )}
            {!visit.internalNotes && !visit.citizenRemarks && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-sm text-text-muted">No notes recorded.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <div className="space-y-3">
            {timeline.map((event, i) => (
              <Card key={event.id}>
                <CardContent className="flex gap-4 p-4">
                  <div className="flex flex-col items-center">
                    <div className="size-2.5 rounded-full bg-accent-primary mt-1.5" />
                    {i < timeline.length - 1 && <div className="w-px flex-1 bg-border-default mt-2 min-h-[24px]" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-text-primary">{event.title}</p>
                      <time className="text-xs text-text-muted shrink-0">{formatVisitDateTime(event.timestamp)}</time>
                    </div>
                    {event.description && (
                      <p className="text-sm text-text-secondary mt-1">{event.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents">
          {visit.attachments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-sm text-text-muted">No attachments uploaded.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {visit.attachments.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="flex size-10 items-center justify-center rounded-input bg-accent-primary-muted text-accent-primary">
                      <FileIcon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-text-muted">{doc.type} · {doc.size}</p>
                    </div>
                    <Button variant="ghost" size="icon-sm" onClick={() => demoSuccess("Action completed successfully.")}>
                      <Download className="size-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
