import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { AddPartyMemberForm } from "@/modules/party-members/components/add-party-member-form";

export default function AddPartyMemberPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Party Members", href: "/party-members" },
          { label: "Add Member" },
        ]}
        className="md:hidden"
      />
      <PageHeader
        title="Add Party Member"
        description="Search for an existing person and assign them to your political organization."
      />
      <Suspense>
        <AddPartyMemberForm />
      </Suspense>
    </div>
  );
}
