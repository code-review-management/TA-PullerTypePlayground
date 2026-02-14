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
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token; // GitHub personal access token
        token.githubId = profile.id; // GitHub user ID
        token.githubLogin = profile.login; // GitHub username
      }
      return token;
    },
  },
});
