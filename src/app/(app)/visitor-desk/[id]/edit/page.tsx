import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { getVisitById } from "@/modules/visitor-desk/data/visits";
import { VisitForm } from "@/modules/visitor-desk/components/visit-form";

interface EditVisitPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditVisitPage({ params }: EditVisitPageProps) {
  const { id } = await params;
  const visit = getVisitById(id);
  if (!visit) notFound();

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Visitor Desk", href: "/visitor-desk" },
          { label: visit.token, href: `/visitor-desk/${visit.id}` },
          { label: "Edit" },
        ]}
        className="md:hidden"
      />
      <PageHeader
        title="Edit Visit"
        description={`Update visit ${visit.token}.`}
      />
      <VisitForm mode="edit" visitId={visit.id} personId={visit.personId} />
    </div>
  );
}
