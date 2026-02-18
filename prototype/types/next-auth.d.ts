import { DefaultJWT } from "next-auth/jwt";

/**
 * Documentation:
 * 1. https://github.com/nextauthjs/next-auth/discussions/4920
 */

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    githubId?: number;
  }
}
