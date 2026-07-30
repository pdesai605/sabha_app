import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { getMemberById } from "@/modules/party-members/data/members";
import { getPersonById } from "@/modules/people/data/people";
import { EditPartyMemberForm } from "@/modules/party-members/components/edit-party-member-form";

interface EditPartyMemberPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPartyMemberPage({ params }: EditPartyMemberPageProps) {
  const { id } = await params;
  const member = getMemberById(id);

  if (!member) notFound();

  const person = getPersonById(member.personId);
  if (!person) notFound();

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Party Members", href: "/party-members" },
          { label: person.fullName, href: `/people/${person.id}` },
          { label: "Edit Assignment" },
        ]}
        className="md:hidden"
      />
      <PageHeader
        title="Edit Assignment"
        description={`Update political assignment for ${person.fullName}.`}
      />
      <EditPartyMemberForm member={member} />
    </div>
  );
}
