import { notFound } from "next/navigation";
import { getPersonById } from "@/modules/people/data/people";
import { PersonDetail } from "@/modules/people/components/person-detail";

interface PersonPageProps {
  params: Promise<{ id: string }>;
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { id } = await params;
  if (!getPersonById(id)) {
    notFound();
  }

  return <PersonDetail personId={id} />;
}
