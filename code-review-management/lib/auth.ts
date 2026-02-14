import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

/**
 * Docs:
 * 1. https://authjs.dev/getting-started/authentication/oauth
 */

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  pages: {
    signIn: "/sign-in",
  },
});
