import { notFound } from "next/navigation";
import { getVisitById } from "@/modules/visitor-desk/data/visits";
import { VisitDetail } from "@/modules/visitor-desk/components/visit-detail";

interface VisitPageProps {
  params: Promise<{ id: string }>;
}

export default async function VisitPage({ params }: VisitPageProps) {
  const { id } = await params;
  if (!getVisitById(id)) notFound();

  return <VisitDetail visitId={id} />;
}
