import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

/**
 * Docs:
 * 1. https://authjs.dev/getting-started/authentication/oauth
 * 2. https://authjs.dev/guides/extending-the-session#with-jwt
 */

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub({
    issuer: "https://github.com/login/oauth"
  })],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token; // GitHub personal access token
        token.githubId = profile.id; // GitHub user ID
        token.githubLogin = String(profile.login); // GitHub username
      }
      return token;
    },
    session({ session, token }) {
      session.user.githubId = token.githubId;
      session.user.githubLogin = token.githubLogin;
      return session;
    },
  },
});
