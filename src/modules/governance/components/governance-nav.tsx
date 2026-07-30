"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MODULE_NAV } from "@/modules/governance/constants";

export function GovernanceNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
      {MODULE_NAV.map((item) => {
        const isActive =
          item.href === "/governance"
            ? pathname === "/governance"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "shrink-0 rounded-input px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-accent-primary-muted text-accent-primary"
                : "text-text-secondary hover:bg-background-muted hover:text-text-primary"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
