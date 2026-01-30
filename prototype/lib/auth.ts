import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.login = profile.login;
        token.githubId = Number(profile.id); // Numeric GitHub ID unique per user
      }
      return token;
    },
  },
});
