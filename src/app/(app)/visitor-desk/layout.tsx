import { VisitorDeskNav } from "@/modules/visitor-desk/components/visitor-desk-nav";

export default function VisitorDeskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <VisitorDeskNav />
      {children}
    </div>
  );
}
