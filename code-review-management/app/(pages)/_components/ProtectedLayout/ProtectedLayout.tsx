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
    // If another tab signs out, then this tab will see "unauthenticated". Wait
    // for two seconds before directing the user to the sign-in page. The
    // debouncer is just in case there is a temporary "unauthenticated" state
    // that is quickly resolved to "authenticated" (e.g., solving runtime
    // errors).
    else if (status === "unauthenticated") {
      const signInTimeout = setTimeout(signIn, 2000);
      return () => clearTimeout(signInTimeout);
    }
  }, [session?.error, status]);

  return children;
}
