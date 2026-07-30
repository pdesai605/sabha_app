import { Suspense } from "react";
import { AppointmentsList } from "@/modules/office-desk/components/appointments-list";

export default function AppointmentsPage() {
  return (
    <Suspense fallback={null}>
      <AppointmentsList />
    </Suspense>
  );
}
