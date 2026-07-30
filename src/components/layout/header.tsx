"use client";

import { Bell, Building2, Menu, Search, Shield } from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import { useTranslation } from "@/lib/i18n/context";
import { useDemoRole } from "@/contexts/demo-role-context";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/types";

function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="flex items-center rounded-input border border-border-default bg-background-secondary text-xs font-medium">
      {(["en", "mr"] as Locale[]).map((loc, i) => (
        <button
          key={loc}
          type="button"
          onClick={() => setLocale(loc)}
          className={cn(
            "px-2.5 py-1.5 transition-colors",
            i === 0 && "rounded-l-input",
            i === 1 && "rounded-r-input border-l border-border-default",
            locale === loc
              ? "bg-accent-primary-muted text-accent-primary"
              : "text-text-muted hover:text-text-primary"
          )}
        >
          {loc === "en" ? "EN" : "मराठी"}
        </button>
      ))}
    </div>
  );
}

function DemoRoleSwitcher() {
  const { role, setRole } = useDemoRole();
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="hidden lg:inline-flex gap-2">
          <Shield className="size-4 shrink-0 text-text-muted" />
          <span className="truncate">{t("common.demoRole")}: {role === "mla" ? t("common.roleMla") : t("common.roleStaff")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{t("common.demoRole")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setRole("mla")}>{t("common.roleMla")}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setRole("staff")}>{t("common.roleStaff")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  const { toggleMobile } = useSidebar();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b border-border-default bg-background-secondary/80 backdrop-blur-md px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon-sm"
        className="lg:hidden"
        onClick={toggleMobile}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </Button>

      <div className="hidden md:block min-w-0 flex-1">
        <Breadcrumb />
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 md:gap-3">
        <div className="hidden sm:block w-full max-w-xs lg:max-w-sm">
          <SearchBar placeholder={t("common.search")} size="sm" />
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          className="sm:hidden"
          aria-label="Search"
        >
          <Search className="size-[18px]" />
        </Button>

        <LanguageSwitcher />
        <DemoRoleSwitcher />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="hidden md:inline-flex gap-2 max-w-[180px]"
            >
              <Building2 className="size-4 shrink-0 text-text-muted" />
              <span className="truncate">{t("common.mainOffice")}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{t("common.switchOffice")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t("common.mainOffice")}</DropdownMenuItem>
            <DropdownMenuItem>{t("common.constituencyOffice")}</DropdownMenuItem>
            <DropdownMenuItem>{t("common.fieldOffice")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon-sm" className="relative" aria-label={t("common.notifications")}>
          <Bell className="size-[18px]" />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-accent-primary" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-input p-1 transition-colors hover:bg-background-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/20"
            >
              <Avatar size="sm">
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <span className="hidden lg:block text-sm font-medium text-text-primary">
                {t("common.admin")}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>Admin User</span>
                <span className="text-xs font-normal text-text-muted">
                  admin@office.in
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t("common.profile")}</DropdownMenuItem>
            <DropdownMenuItem>{t("common.preferences")}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-semantic-danger">
              {t("common.signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
