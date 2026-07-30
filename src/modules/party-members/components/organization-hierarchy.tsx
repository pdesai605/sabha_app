"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, Users, User } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { organizationHierarchy } from "@/modules/party-members/data/members";
import type { HierarchyNode } from "@/modules/party-members/types";
import { cn } from "@/lib/utils";

const typeColors: Record<HierarchyNode["type"], string> = {
  root: "bg-accent-primary text-white",
  ward: "bg-accent-primary-muted text-accent-primary",
  corporator: "bg-semantic-info-muted text-semantic-info",
  shakti: "bg-semantic-info-muted text-semantic-info",
  booth: "bg-background-muted text-text-secondary",
  president: "bg-semantic-warning-muted text-semantic-warning",
  workers: "bg-semantic-success-muted text-semantic-success",
  member: "bg-background-muted text-text-muted",
};

const typeLabels: Record<HierarchyNode["type"], string> = {
  root: "MLA",
  ward: "Ward",
  corporator: "Corporator",
  shakti: "Shakti Kendra",
  booth: "Booth",
  president: "Booth President",
  workers: "Booth Workers",
  member: "Member",
};

function HierarchyTreeNode({
  node,
  depth = 0,
  defaultExpanded = depth < 2,
}: {
  node: HierarchyNode;
  depth?: number;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const hasChildren = node.children && node.children.length > 0;
  const hasMembers = node.members && node.members.length > 0;
  const canExpand = hasChildren || hasMembers;

  return (
    <div className={cn(depth > 0 && "ml-6 border-l border-border-default pl-4")}>
      <button
        type="button"
        onClick={() => canExpand && setExpanded(!expanded)}
        className={cn(
          "flex w-full items-center gap-3 rounded-input px-3 py-2.5 text-left transition-colors mb-1",
          canExpand && "hover:bg-background-muted cursor-pointer",
          !canExpand && "cursor-default"
        )}
      >
        {canExpand ? (
          expanded ? (
            <ChevronDown className="size-4 shrink-0 text-text-muted" />
          ) : (
            <ChevronRight className="size-4 shrink-0 text-text-muted" />
          )
        ) : (
          <span className="size-4 shrink-0" />
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={cn("text-[10px] font-medium border-0", typeColors[node.type])}>
              {typeLabels[node.type]}
            </Badge>
            {node.type === "member" && node.id.startsWith("mem-") ? (
              <Link
                href={`/people/${node.id.replace("mem-", "pm-").replace(/^mem-pm-/, "")}`}
                className="text-sm font-medium text-text-primary hover:text-accent-primary"
                onClick={(e) => e.stopPropagation()}
              >
                {node.label}
              </Link>
            ) : (
              <span className="text-sm font-medium text-text-primary">{node.label}</span>
            )}
          </div>
          {node.subtitle && (
            <p className="text-xs text-text-muted mt-0.5">{node.subtitle}</p>
          )}
        </div>

        {node.memberCount !== undefined && (
          <div className="flex items-center gap-1 shrink-0 text-xs text-text-muted">
            <Users className="size-3.5" />
            {node.memberCount}
          </div>
        )}
      </button>

      {expanded && hasMembers && (
        <div className="ml-10 space-y-1 mb-2">
          {node.members!.map((m) => (
            <Link
              key={m.id}
              href={`/people/${m.personId}`}
              className="flex items-center gap-2 rounded-input px-3 py-2 text-sm hover:bg-background-muted transition-colors"
            >
              <User className="size-3.5 text-text-muted" />
              <span className="font-medium text-text-primary">{m.name}</span>
              {m.designation && (
                <span className="text-xs text-text-muted">· {m.designation}</span>
              )}
            </Link>
          ))}
        </div>
      )}

      {hasChildren && expanded && (
        <div className="space-y-0">
          {node.children!.map((child) => (
            <HierarchyTreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              defaultExpanded={depth < 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function OrganizationHierarchy() {
  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Party Members", href: "/party-members" },
          { label: "Hierarchy" },
        ]}
        className="md:hidden"
      />

      <PageHeader
        title="Organization Hierarchy"
        description="Political organization structure — MLA to ward, corporator, shakti kendra, booth teams, and members."
      />

      <Card>
        <CardContent className="p-6">
          <HierarchyTreeNode node={organizationHierarchy} defaultExpanded={true} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {(Object.entries(typeLabels) as [HierarchyNode["type"], string][]).map(([type, label]) => (
          <div key={type} className="flex items-center gap-2 rounded-input border border-border-default px-3 py-2">
            <Badge className={cn("text-[10px] border-0", typeColors[type])}>{label}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
