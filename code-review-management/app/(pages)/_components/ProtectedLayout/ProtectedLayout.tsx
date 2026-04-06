"use client";

import { signIn, useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";

/**
 * If the user's GitHub personal access token is expired, force a
 * re-authentication. Wrapped around pages that should be protected.
 *
 * Docs:
 * 1. https://authjs.dev/guides/refresh-token-rotation#error-handling
 */
export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "AccessTokenExpired") {
      signIn();
    }
  }, [session?.error]);

  return children;
}
