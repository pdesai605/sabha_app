import { PartyMembersList } from "@/modules/party-members/components/party-members-list";

export default function PanchayatPage() {
  return (
    <PartyMembersList
      organizationType="panchayat"
      title="Panchayat"
      description="Manage gram panchayat and rural organization members across villages."
    />
  );
}
