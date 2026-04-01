export { auth as proxy } from "@/lib/auth";

/**
 * Docs:
 * 1. https://authjs.dev/getting-started/session-management/protecting?framework=Next.js
 * Referenced Next.js Proxy section to protect a set of pages using a proxy file.
 */
export const config = {
  matcher: ["/dashboard", "/:username/:repo_name/pull/:id*"],
};
