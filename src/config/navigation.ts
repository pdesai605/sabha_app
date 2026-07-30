import {
  LayoutDashboard,
  Users,
  Contact,
  Brain,
  UserCheck,
  Briefcase,
  FileText,
  Landmark,
  Wallet,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

export const mainNavigation: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    id: "people",
    label: "People",
    href: "/people",
    icon: Contact,
  },
  {
    id: "party-members",
    label: "Party Members",
    href: "/party-members",
    icon: Users,
  },
  {
    id: "voter-intelligence",
    label: "Voter Intelligence",
    href: "/voter-intelligence",
    icon: Brain,
  },
  {
    id: "visitor-desk",
    label: "Visitor Desk",
    href: "/visitor-desk",
    icon: UserCheck,
  },
  {
    id: "office-desk",
    label: "Office Desk",
    href: "/office-desk",
    icon: Briefcase,
  },
  {
    id: "letters-documents",
    label: "Letters & Documents",
    href: "/letters-documents",
    icon: FileText,
  },
  {
    id: "governance",
    label: "Governance",
    href: "/governance",
    icon: Landmark,
  },
  {
    id: "expense-management",
    label: "Expense Management",
    href: "/expense-management",
    icon: Wallet,
  },
];

export const bottomNavigation: NavItem[] = [
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];
