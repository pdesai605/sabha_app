import { VoterIntelligenceNav } from "@/modules/voter-intelligence/components/voter-intelligence-nav";

export default function VoterIntelligenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <VoterIntelligenceNav />
      {children}
    </div>
  );
}
