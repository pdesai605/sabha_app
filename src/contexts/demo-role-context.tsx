"use client";

import * as React from "react";
import { getAllPeople } from "@/modules/people/data/people";

export type DemoRole = "mla" | "staff";

interface DemoRoleContextValue {
  role: DemoRole;
  setRole: (role: DemoRole) => void;
  currentPersonId: string;
}

const DemoRoleContext = React.createContext<DemoRoleContextValue | null>(null);

/** Mock role for expense filtering demo — MLA sees all, staff sees own. */
export function DemoRoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = React.useState<DemoRole>("mla");
  const currentPersonId = getAllPeople()[0]?.id ?? "p-001";

  React.useEffect(() => {
    const stored = localStorage.getItem("sabha-demo-role") as DemoRole | null;
    if (stored === "mla" || stored === "staff") setRoleState(stored);
  }, []);

  const setRole = React.useCallback((next: DemoRole) => {
    setRoleState(next);
    localStorage.setItem("sabha-demo-role", next);
  }, []);

  return (
    <DemoRoleContext.Provider value={{ role, setRole, currentPersonId }}>
      {children}
    </DemoRoleContext.Provider>
  );
}

export function useDemoRole() {
  const ctx = React.useContext(DemoRoleContext);
  if (!ctx) throw new Error("useDemoRole must be used within DemoRoleProvider");
  return ctx;
}
