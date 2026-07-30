import { ExpenseNav } from "@/modules/expense-management/components/expense-nav";

export default function ExpenseManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <ExpenseNav />
      {children}
    </div>
  );
}
