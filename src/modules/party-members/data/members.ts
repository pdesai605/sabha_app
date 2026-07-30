import type {
  PartyMember,
  MemberTransfer,
  RoleChange,
  PendingApproval,
  HierarchyNode,
  OrganizationType,
} from "@/modules/party-members/types";
import {
  CORPORATION_DESIGNATIONS,
  PANCHAYAT_DESIGNATIONS,
  PARTY_DESIGNATIONS,
  MORCHA_DESIGNATIONS,
  COMMITTEE_DESIGNATIONS,
  MORCHA_TYPES,
  COMMITTEES,
  PANCHAYAT_NAMES,
} from "@/modules/party-members/constants";
import { WARDS, BOOTHS, AREAS } from "@/modules/people/constants";
import { enrichMembers } from "@/modules/party-members/lib/utils";

function pick<T>(arr: readonly T[], i: number): T {
  return arr[i % arr.length];
}

function generateMembers(): PartyMember[] {
  const members: PartyMember[] = [];
  const orgDistribution: { org: OrganizationType; count: number }[] = [
    { org: "corporation", count: 25 },
    { org: "panchayat", count: 20 },
    { org: "party", count: 25 },
    { org: "morcha", count: 15 },
    { org: "committees", count: 15 },
  ];

  let personIndex = 1;
  let memberIndex = 1;

  for (const { org, count } of orgDistribution) {
    for (let j = 0; j < count; j++) {
      const i = memberIndex - 1;
      const ward = pick(WARDS, i + j);
      const booth = pick(BOOTHS, i + j + 2);
      const area = pick(AREAS, i + j + 1);
      const joiningMonth = (i % 12) + 1;
      const joiningYear = i % 3 === 0 ? 2024 : i % 3 === 1 ? 2025 : 2026;

      let designation: string;
      let committee: string | undefined;
      let morchaType: string | undefined;
      let panchayatName: string | undefined;

      switch (org) {
        case "corporation":
          designation = pick(CORPORATION_DESIGNATIONS, i);
          break;
        case "panchayat":
          designation = pick(PANCHAYAT_DESIGNATIONS, i);
          panchayatName = pick(PANCHAYAT_NAMES, i);
          break;
        case "party":
          designation = pick(PARTY_DESIGNATIONS, i);
          break;
        case "morcha":
          designation = pick(MORCHA_DESIGNATIONS, i);
          morchaType = pick(MORCHA_TYPES, i);
          break;
        case "committees":
          designation = pick(COMMITTEE_DESIGNATIONS, i);
          committee = pick(COMMITTEES, i);
          break;
      }

      const status =
        i % 13 === 0 ? "pending" : i % 9 === 0 ? "inactive" : "active";

      members.push({
        id: `pm-${String(memberIndex).padStart(3, "0")}`,
        personId: `p-${String(personIndex).padStart(3, "0")}`,
        organizationType: org,
        designation,
        ward,
        booth,
        area,
        committee,
        morchaType,
        panchayatName,
        joiningDate: `${joiningYear}-${String(joiningMonth).padStart(2, "0")}-${String((i % 25) + 1).padStart(2, "0")}`,
        status,
      });

      personIndex++;
      memberIndex++;
    }
  }

  return members;
}

export const partyMembers = generateMembers();

export function getMemberById(id: string): PartyMember | undefined {
  return partyMembers.find((m) => m.id === id);
}

export function getMembersByOrg(org: OrganizationType): PartyMember[] {
  return partyMembers.filter((m) => m.organizationType === org);
}

export const recentTransfers: MemberTransfer[] = [
  {
    id: "tr-001",
    memberId: "pm-003",
    memberName: "Suresh Ram Kulkarni",
    fromWard: "Ward 3 — Hadapsar",
    toWard: "Ward 1 — Shivajinagar",
    reason: "Organizational restructuring",
    effectiveDate: "2026-08-01",
    transferredAt: "2026-07-22T10:00:00",
  },
  {
    id: "tr-002",
    memberId: "pm-018",
    memberName: "Swati Hemant Bhandari",
    fromWard: "Ward 7 — Wagholi",
    toWard: "Ward 5 — Aundh",
    reason: "Requested transfer due to relocation",
    effectiveDate: "2026-07-15",
    transferredAt: "2026-07-10T14:30:00",
  },
  {
    id: "tr-003",
    memberId: "pm-042",
    memberName: "Ajinkya S. Kale",
    fromWard: "Ward 2 — Kothrud",
    toWard: "Ward 6 — Baner",
    reason: "Promoted to area coordinator role",
    effectiveDate: "2026-07-01",
    transferredAt: "2026-06-28T09:00:00",
  },
];

export const recentRoleChanges: RoleChange[] = [
  {
    id: "rc-001",
    memberId: "pm-001",
    memberName: "Rajesh Vijay Patil",
    fromRole: "Booth Agent",
    toRole: "Ward President",
    changedAt: "2026-07-20T11:00:00",
  },
  {
    id: "rc-002",
    memberId: "pm-055",
    memberName: "Tejas M. Reddy",
    fromRole: "Party Worker",
    toRole: "Ward Councillor",
    changedAt: "2026-07-18T16:00:00",
  },
  {
    id: "rc-003",
    memberId: "pm-078",
    memberName: "Shruti K. Iyer",
    fromRole: "Morcha Member",
    toRole: "Morcha Secretary",
    changedAt: "2026-07-15T09:30:00",
  },
];

export const pendingApprovals: PendingApproval[] = partyMembers
  .filter((m) => m.status === "pending")
  .slice(0, 5)
  .map((m, i) => ({
    id: `pa-${i + 1}`,
    memberName: `Member ${m.id}`,
    organizationType: m.organizationType,
    designation: m.designation,
    submittedAt: "2026-07-24T08:00:00",
  }));

export const organizationHierarchy: HierarchyNode = (() => {
  const enriched = enrichMembers(partyMembers.filter((m) => m.organizationType === "party" || m.organizationType === "corporation"));

  function membersForBooth(booth: string, count = 5): NonNullable<HierarchyNode["members"]> {
    return enriched
      .filter((m) => m.booth === booth)
      .slice(0, count)
      .map((m) => ({
        id: m.id,
        personId: m.personId,
        name: m.fullName,
        designation: m.designation,
      }));
  }

  return {
    id: "root",
    label: "Hon. MLA — Pune Central",
    subtitle: "Constituency Office",
    type: "root",
    memberCount: enriched.length,
    children: WARDS.slice(0, 3).map((ward, wi) => {
      const wardMembers = enriched.filter((m) => m.ward === ward);
      const corporator = wardMembers.find((m) => m.designation.toLowerCase().includes("councillor") || m.designation.toLowerCase().includes("corporator"))
        ?? wardMembers[0];

      return {
        id: `ward-${wi}`,
        label: ward,
        type: "ward" as const,
        memberCount: wardMembers.length,
        children: [
          {
            id: `corp-${wi}`,
            label: corporator?.fullName ?? `Corporator — ${ward.split("—")[1]?.trim()}`,
            subtitle: corporator?.designation ?? "Ward Corporator",
            type: "corporator" as const,
            memberCount: 1,
            children: [
              {
                id: `shakti-${wi}`,
                label: `Shakti Kendra ${wi + 1}`,
                type: "shakti" as const,
                memberCount: 12,
                children: BOOTHS.slice(wi * 2, wi * 2 + 1).map((booth, bi) => {
                  const boothMembers = membersForBooth(booth, 6);
                  const president = boothMembers[0];
                  const workers = boothMembers.slice(1);

                  return {
                    id: `booth-${wi}-${bi}`,
                    label: booth,
                    type: "booth" as const,
                    memberCount: boothMembers.length,
                    children: [
                      {
                        id: `pres-${wi}-${bi}`,
                        label: president?.name ?? "Booth President",
                        subtitle: president?.designation ?? "Booth President",
                        type: "president" as const,
                        memberCount: 1,
                        children: [
                          {
                            id: `workers-${wi}-${bi}`,
                            label: "Booth Workers",
                            subtitle: `${workers.length} active workers`,
                            type: "workers" as const,
                            memberCount: workers.length,
                            members: workers,
                          },
                        ],
                      },
                    ],
                  };
                }),
              },
            ],
          },
        ],
      };
    }),
  };
})();

export function getDashboardStats() {
  const active = partyMembers.filter((m) => m.status === "active").length;
  return {
    totalMembers: partyMembers.length,
    activeMembers: active,
    corporationMembers: getMembersByOrg("corporation").length,
    panchayatMembers: getMembersByOrg("panchayat").length,
    morchaMembers: getMembersByOrg("morcha").length,
    committeeMembers: getMembersByOrg("committees").length,
    recentJoins: partyMembers.filter((m) => m.joiningDate.startsWith("2026")).length,
    birthdayToday: 3,
    anniversaries: 2,
  };
}
