// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { DefaultSession } from "next-auth";

/**
 * Docs:
 * 1. https://stackoverflow.com/questions/74008428/next-auth-extending-user-schema-to-include-new-fields
 */

declare module "next-auth" {
  interface Session {
    user: {
      githubId?: string | null;
      githubLogin: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    githubId?: string | null;
    githubLogin: string;
  }
}
