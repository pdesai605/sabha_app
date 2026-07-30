import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VisitNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h2 className="text-lg font-semibold text-text-primary">Visit not found</h2>
      <p className="text-sm text-text-secondary mt-2 max-w-sm">
        This visit record doesn&apos;t exist or may have been removed.
      </p>
      <Link href="/visitor-desk">
        <Button className="mt-6">Back to Visitor Desk</Button>
      </Link>
    </div>
  );
}
