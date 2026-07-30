"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  mainNavigation,
  bottomNavigation,
  type NavItem,
} from "@/config/navigation";
import { useTranslation } from "@/lib/i18n/context";
import type { TranslationKey } from "@/lib/i18n/context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

const navLabelKeys: Record<string, TranslationKey> = {
  dashboard: "nav.dashboard",
  people: "nav.people",
  "party-members": "nav.partyMembers",
  "voter-intelligence": "nav.voterIntelligence",
  "visitor-desk": "nav.visitorDesk",
  "office-desk": "nav.officeDesk",
  "letters-documents": "nav.lettersDocuments",
  governance: "nav.governance",
  "expense-management": "nav.expenseManagement",
  settings: "nav.settings",
};

function NavLink({
  item,
  collapsed,
  onNavigate,
  label,
}: {
  item: NavItem;
  collapsed: boolean;
  onNavigate?: () => void;
  label: string;
}) {
  const pathname = usePathname();
  const isActive =
    item.href === "/"
      ? pathname === "/"
      : pathname.startsWith(item.href);

  const linkContent = (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-3 rounded-input px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-accent-primary-muted text-accent-primary"
          : "text-text-secondary hover:bg-background-muted hover:text-text-primary",
        collapsed && "justify-center px-2"
      )}
    >
      <item.icon
        className={cn(
          "size-[18px] shrink-0",
          isActive ? "text-accent-primary" : "text-text-muted group-hover:text-text-secondary"
        )}
        strokeWidth={1.75}
      />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}

export function Sidebar() {
  const { isCollapsed, isMobileOpen, toggleCollapsed, setMobileOpen } =
    useSidebar();
  const isMobile = useIsMobile();
  const collapsed = !isMobile && isCollapsed;
  const { t } = useTranslation();

  const getLabel = (item: NavItem) =>
    navLabelKeys[item.id] ? t(navLabelKeys[item.id]) : item.label;

  const sidebarContent = (
    <TooltipProvider>
      <aside
        className={cn(
          "flex h-full flex-col border-r border-border-default bg-background-sidebar transition-all duration-300 ease-out",
          collapsed ? "w-[var(--sidebar-width-collapsed)]" : "w-[var(--sidebar-width)]"
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex h-14 items-center border-b border-border-default px-4",
            collapsed && "justify-center px-2"
          )}
        >
          <Link
            href="/"
            className="flex items-center gap-2.5 min-w-0"
            onClick={() => isMobile && setMobileOpen(false)}
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-input bg-accent-primary">
              <span className="text-sm font-bold text-white">S</span>
            </div>
            {!collapsed && (
              <span className="text-base font-semibold tracking-tight text-text-primary truncate">
                Sabha
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {mainNavigation.map((item) => (
              <NavLink
                key={item.id}
                item={item}
                label={getLabel(item)}
                collapsed={collapsed}
                onNavigate={() => isMobile && setMobileOpen(false)}
              />
            ))}
          </nav>
        </ScrollArea>

        {/* Bottom nav */}
        <div className="border-t border-border-default px-3 py-4 space-y-1">
          {bottomNavigation.map((item) => (
            <NavLink
              key={item.id}
              item={item}
              label={getLabel(item)}
              collapsed={collapsed}
              onNavigate={() => isMobile && setMobileOpen(false)}
            />
          ))}

          {!isMobile && (
            <button
              type="button"
              onClick={toggleCollapsed}
              className={cn(
                "flex w-full items-center gap-3 rounded-input px-3 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-background-muted hover:text-text-secondary",
                collapsed && "justify-center px-2"
              )}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="size-[18px]" strokeWidth={1.75} />
              ) : (
                <>
                  <ChevronLeft className="size-[18px]" strokeWidth={1.75} />
                  <span>Collapse</span>
                </>
              )}
            </button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );

  if (isMobile) {
    return (
      <>
        {isMobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/20 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-out lg:hidden",
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  return sidebarContent;
}
