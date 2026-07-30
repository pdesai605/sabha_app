import { PartyMembersList } from "@/modules/party-members/components/party-members-list";

export default function PartyPage() {
  return (
    <PartyMembersList
      organizationType="party"
      title="Party Organization"
      description="Core party structure — district, block, ward presidents, shakti kendra, and karyakartas."
    />
  );
}
