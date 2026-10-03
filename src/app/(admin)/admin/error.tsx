"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">
          We couldn’t open the admin page
        </h1>
        <p className="text-muted-foreground">
          Something went wrong. Try again, or return to the map.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button asChild variant="outline">
            <Link href="/map">Back to map</Link>
          </Button>
        </div>
        {error.digest && (
          <p className="text-xs text-muted-foreground">
            Error reference: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
