"use client";

import { SidebarProvider } from "@/hooks/use-sidebar";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/i18n/context";
import { DemoRoleProvider } from "@/contexts/demo-role-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
    <DemoRoleProvider>
    <SidebarProvider>
      <TooltipProvider delayDuration={300}>
        <div className="flex h-screen overflow-hidden bg-background-primary">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto">
              <div className="mx-auto w-full max-w-[1400px] px-4 py-6 lg:px-8 lg:py-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </TooltipProvider>
    </SidebarProvider>
    </DemoRoleProvider>
    </LanguageProvider>
  );
}
