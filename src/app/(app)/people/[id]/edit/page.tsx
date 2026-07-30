import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { getPersonById } from "@/modules/people/data/people";
import { PersonForm } from "@/modules/people/components/person-form";
import { personToFormDefaults } from "@/modules/people/lib/utils";

interface EditPersonPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPersonPage({ params }: EditPersonPageProps) {
  const { id } = await params;
  const person = getPersonById(id);

  if (!person) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "People", href: "/people" },
          { label: person.fullName, href: `/people/${person.id}` },
          { label: "Edit" },
        ]}
        className="md:hidden"
      />

      <PageHeader
        title="Edit Person"
        description={`Update profile for ${person.fullName}.`}
      />

      <PersonForm
        mode="edit"
        personId={person.id}
        initialData={personToFormDefaults(person)}
      />
    </div>
  );
}
