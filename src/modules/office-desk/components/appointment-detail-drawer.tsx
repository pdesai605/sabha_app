"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, Clock, User, Building2, Bell } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Separator } from "@/components/ui/separator";
import { AttachmentButton } from "@/components/shared/attachment-viewer-dialog";
import { demoSaved } from "@/lib/demo";
import { useLocaleText } from "@/lib/i18n/locale-text";
import { APPOINTMENT_STATUS_LABELS } from "@/modules/office-desk/constants";
import {
  formatOfficeDate,
  formatTime,
  getAppointmentStatusVariant,
  type AppointmentWithPerson,
} from "@/modules/office-desk/lib/utils";

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  const lt = useLocaleText();
  return (
    <div className="flex gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-input bg-background-muted text-text-muted">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-text-muted">{lt(label)}</p>
        <p className="text-sm text-text-primary mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export function AppointmentDetailDrawer({
  appointment,
  open,
  onOpenChange,
}: {
  appointment: AppointmentWithPerson | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const lt = useLocaleText();
  if (!appointment) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side="right" className="sm:max-w-lg">
        <DrawerHeader>
          <DrawerTitle>{appointment.appointmentNo}</DrawerTitle>
          <DrawerDescription>{appointment.purpose}</DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-6 space-y-5 pb-4">
          <StatusBadge
            label={lt(APPOINTMENT_STATUS_LABELS[appointment.status])}
            status={getAppointmentStatusVariant(appointment.status)}
          />

          <DetailRow
            icon={<User className="size-4" />}
            label="Visitor / Person"
            value={
              <Link href={`/people/${appointment.personId}`} className="text-accent-primary hover:underline">
                {appointment.fullName}
              </Link>
            }
          />
          <DetailRow icon={<Building2 className="size-4" />} label="Meeting With" value={appointment.meetingWith} />
          <DetailRow icon={<Calendar className="size-4" />} label="Date" value={formatOfficeDate(appointment.date)} />
          <DetailRow icon={<Clock className="size-4" />} label="Time" value={formatTime(appointment.time)} />

          {appointment.notes && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-1">{lt("Notes")}</h4>
                <p className="text-sm text-text-secondary">{appointment.notes}</p>
              </div>
            </>
          )}

          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Bell className="size-4" />
              {lt("Reminder enabled")}
            </div>
            <AttachmentButton fileName="appointment-brief.pdf" label="Attachments" />
          </div>
        </div>

        <DrawerFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{lt("Close")}</Button>
          <Button onClick={() => demoSaved("Appointment")}>{lt("Update Status")}</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
