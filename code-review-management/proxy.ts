export { auth as proxy } from "@/lib/auth";

/**
 * Docs:
 * 1. https://authjs.dev/getting-started/session-management/protecting?framework=Next.js
 * Handles redirecting the user if they are not signed in and attempt to
 * access the following pages.
 */
export const config = {
  matcher: ["/dashboard", "/:username/:repo_name/pull/:id*"],
};
