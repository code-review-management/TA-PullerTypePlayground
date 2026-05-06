"use client";

import { signIn, useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";

/**
 * If the user's GitHub personal access token is expired or their session is
 * unauthenticated, force a re-authentication. Wrapped around pages that should
 * be protected.
 *
 * Docs:
 * 1. https://authjs.dev/guides/refresh-token-rotation#error-handling
 * Followed this technique in the Auth.js docs.
 */
export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (
      session?.error === "AccessTokenExpired" ||
      status === "unauthenticated"
    ) {
      signIn();
    }
  }, [session?.error, status]);

  return children;
}
