import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { VisitForm } from "@/modules/visitor-desk/components/visit-form";

export default function AddVisitPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Visitor Desk", href: "/visitor-desk" },
          { label: "Add Visitor" },
        ]}
        className="md:hidden"
      />
      <PageHeader
        title="Add Visitor"
        description="Search for an existing person, then register their office visit."
      />
      <Suspense>
        <VisitForm mode="create" />
      </Suspense>
    </div>
  );
}
