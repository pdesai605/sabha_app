import { VisitorRegister } from "@/modules/visitor-desk/components/visitor-register";

export default function TodaysVisitorsPage() {
  return (
    <VisitorRegister
      title="Today's Visitors"
      description="All citizen visits scheduled and received today at the office."
      filterToday
      breadcrumbExtra={{ label: "Today's Visitors" }}
    />
  );
}
