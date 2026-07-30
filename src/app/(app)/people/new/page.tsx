import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PersonForm } from "@/modules/people/components/person-form";

export default function AddPersonPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "People", href: "/people" },
          { label: "Add Person" },
        ]}
        className="md:hidden"
      />

      <PageHeader
        title="Add Person"
        description="Create a new master profile. This person can be referenced across all Sabha modules."
      />

      <PersonForm mode="create" />
    </div>
  );
}
