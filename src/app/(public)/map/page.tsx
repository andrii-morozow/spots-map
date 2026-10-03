"use client";

import type { ComponentProps } from "react";
import NextImage from "next/image";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import kindergarten from "@/assets/дитсад.jpg";
import { AccountButton } from "@/components/auth/account-button";

function CrabButton({
  action,
  signedOut,
  ...props
}: ComponentProps<"button"> & {
  action: "sign-in" | "sign-up";
  signedOut: boolean;
}) {
  const button = <button {...props} disabled={!signedOut} />;

  if (!signedOut) return button;

  const AuthButton = action === "sign-in" ? SignInButton : SignUpButton;
  return <AuthButton mode="modal">{button}</AuthButton>;
}

export const PublicMap = () => {
  const { isLoaded, isSignedIn } = useUser();
  const signedOut = isLoaded && !isSignedIn;
  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-12 text-center">
      {isLoaded && isSignedIn && (
        <div className="absolute left-4 top-4 z-50">
          <AccountButton />
        </div>
      )}
      <div className="flex w-full flex-1 flex-col items-center justify-center py-16">
        <div className="relative mb-16 w-full max-w-[600px]">
          <NextImage
            src={kindergarten}
            alt="дитсад"
            width={600}
            className="h-auto max-w-full"
          />
          <div className="pointer-events-none absolute inset-0 select-none text-4xl leading-none sm:text-5xl">
            <span
              aria-hidden="true"
              className="absolute -top-12 left-[19%] rotate-[165deg] text-[0.7em]"
            >
              🦀
              <span className="absolute top-[-12px] right-[9px] rotate-[20deg] text-[0.45em]">
                🔨
              </span>
            </span>
            <span
              aria-hidden="true"
              className="absolute top-[23%] -left-10 rotate-[75deg] text-[1.1em]"
            >
              🦀
              <span className="absolute top-[-19px] left-[12px] rotate-[12deg] text-[0.45em]">
                🔨
              </span>
            </span>
            <CrabButton
              action="sign-in"
              signedOut={signedOut}
              type="button"
              aria-label="Sign in with the small tool crab"
              title="Sign in"
              className="pointer-events-auto absolute bottom-[-15%] right-[12%] min-h-11 min-w-11 -rotate-[60deg] enabled:cursor-pointer disabled:cursor-default rounded-full text-[0.7em] transition-transform enabled:hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <span aria-hidden="true">
                🦀
                <span className="absolute top-[-8px] left-[8px] rotate-[32deg] text-[0.45em]">
                  🔧
                </span>
              </span>
            </CrabButton>
            <CrabButton
              action="sign-up"
              signedOut={signedOut}
              type="button"
              aria-label="Sign up with the map crab"
              title="Sign up"
              className="pointer-events-auto absolute -bottom-12 right-[24%] min-h-11 min-w-11 -rotate-[15deg] enabled:cursor-pointer disabled:cursor-default rounded-full text-[1.3em] transition-transform enabled:hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <span aria-hidden="true">
                🦀
                <span className="absolute -top-[22px] right-[16px] rotate-[2deg] text-[0.5em]">
                  🗺️
                </span>
              </span>
            </CrabButton>
          </div>
        </div>
        <h1>Welcome to the Spots Map</h1>
        {signedOut && (
          <>
            <p>App is under construction. Come back soon.</p>
            <div className="mt-2 text-xs text-muted-foreground">
              <p>
                If you want to help with development - click the crab with map
                to sign up.
              </p>
              <p>
                If you already get claws dirty - click the small crab with a
                tool to sign in.
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default PublicMap;
