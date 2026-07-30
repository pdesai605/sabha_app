import { GovernanceNav } from "@/modules/governance/components/governance-nav";

export default function GovernanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <GovernanceNav />
      {children}
    </div>
  );
}
