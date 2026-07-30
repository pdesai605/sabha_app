import { PartyMembersList } from "@/modules/party-members/components/party-members-list";

export default function CorporationPage() {
  return (
    <PartyMembersList
      organizationType="corporation"
      title="Corporation"
      description="Manage municipal corporation members — corporators, ward councillors, and booth agents."
    />
  );
}
