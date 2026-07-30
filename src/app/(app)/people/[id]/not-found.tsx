import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PersonNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h2 className="text-lg font-semibold text-text-primary">Person not found</h2>
      <p className="text-sm text-text-secondary mt-2 max-w-sm">
        The person you&apos;re looking for doesn&apos;t exist or may have been removed.
      </p>
      <Button asChild className="mt-6">
        <Link href="/people">Back to People</Link>
      </Button>
    </div>
  );
}
