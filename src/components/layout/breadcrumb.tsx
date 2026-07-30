"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNavigation, bottomNavigation } from "@/config/navigation";
import { useLocaleText } from "@/lib/i18n/locale-text";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const allNav = [...mainNavigation, ...bottomNavigation];
  const match = allNav.find(
    (item) =>
      item.href === pathname ||
      (item.href !== "/" && pathname.startsWith(item.href))
  );

  if (pathname === "/") {
    return [{ label: "Dashboard" }];
  }

  if (match) {
    return [{ label: "Home", href: "/" }, { label: match.label }];
  }

  const segments = pathname.split("/").filter(Boolean);
  return [
    { label: "Home", href: "/" },
    ...segments.map((seg, i) => ({
      label: seg
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      href: i < segments.length - 1 ? `/${segments.slice(0, i + 1).join("/")}` : undefined,
    })),
  ];
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const pathname = usePathname();
  const lt = useLocaleText();
  const crumbs = items ?? getBreadcrumbs(pathname);

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center", className)}>
      <ol className="flex items-center gap-1 text-sm">
        <li>
          <Link
            href="/"
            className="flex items-center text-text-muted hover:text-text-secondary transition-colors"
            aria-label="Home"
          >
            <Home className="size-3.5" />
          </Link>
        </li>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-1">
              <ChevronRight className="size-3.5 text-text-muted" />
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  {lt(crumb.label)}
                </Link>
              ) : (
                <span
                  className={cn(
                    isLast ? "text-text-primary font-medium" : "text-text-secondary"
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {lt(crumb.label)}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
