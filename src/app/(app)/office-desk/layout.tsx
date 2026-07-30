import { OfficeDeskNav } from "@/modules/office-desk/components/office-desk-nav";

export default function OfficeDeskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <OfficeDeskNav />
      {children}
    </div>
  );
}
