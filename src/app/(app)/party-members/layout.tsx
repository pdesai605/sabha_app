import { PartyMembersNav } from "@/modules/party-members/components/party-members-nav";

export default function PartyMembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <PartyMembersNav />
      {children}
    </div>
  );
}
