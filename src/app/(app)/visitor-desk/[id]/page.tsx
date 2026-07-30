import { notFound } from "next/navigation";
import { getVisitById } from "@/modules/visitor-desk/data/visits";
import { enrichVisit } from "@/modules/visitor-desk/lib/utils";
import { VisitDetail } from "@/modules/visitor-desk/components/visit-detail";

interface VisitPageProps {
  params: Promise<{ id: string }>;
}

export default async function VisitPage({ params }: VisitPageProps) {
  const { id } = await params;
  const visit = getVisitById(id);
  if (!visit) notFound();

  const enriched = enrichVisit(visit);
  if (!enriched) notFound();

  return <VisitDetail visit={enriched} />;
}
