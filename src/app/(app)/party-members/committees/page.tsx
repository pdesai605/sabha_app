import { PartyMembersList } from "@/modules/party-members/components/party-members-list";

export default function CommitteesPage() {
  return (
    <PartyMembersList
      organizationType="committees"
      title="Committees"
      description="Internal committees — core, election, finance, campaign, and disciplinary bodies."
    />
  );
}
