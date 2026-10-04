import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { AccountButton } from "@/components/auth/account-button";
import { Button } from "@/components/ui/button";

export function AdminAccessMessage({
  unavailable = false,
}: {
  unavailable?: boolean;
}) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6 text-center">
      <div className="absolute left-4 top-4 z-50">
        <AccountButton />
      </div>
      <div className="max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">
          {unavailable
            ? "Admin is temporarily unavailable"
            : "Admin access required"}
        </h1>
        <p className="text-muted-foreground">
          {unavailable
            ? "We can’t open the admin area right now. Please try again later."
            : "You’re signed in, but this account doesn’t have admin access. If you believe this is a mistake, contact the site owner or sign out and use your admin account."}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/map">Back to map</Link>
          </Button>
          {!unavailable && (
            <SignOutButton redirectUrl="/map">
              <Button variant="outline">Sign out</Button>
            </SignOutButton>
          )}
        </div>
      </div>
    </main>
  );
}
