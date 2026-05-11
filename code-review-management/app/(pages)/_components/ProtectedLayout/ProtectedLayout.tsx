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
    if (session?.error === "AccessTokenExpired") {
      signIn();
    }

    // If status is unauthenticated for 2 second, then sign-out. Used by other
    // open tabs when a sign-out is initiated in one tab.
    if (status === "unauthenticated") {
      const signInTimeout = setTimeout(() => {
        signIn();
      }, 2000);
      return () => clearTimeout(signInTimeout);
    }
  }, [session?.error, status]);

  return children;
}
