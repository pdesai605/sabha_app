import { LettersNav } from "@/modules/letters-documents/components/letters-nav";

export default function LettersDocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <LettersNav />
      {children}
    </div>
  );
}
