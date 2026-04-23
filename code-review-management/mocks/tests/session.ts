import { Session } from "next-auth";

export function getDefaultAuthenticatedSession(): Session {
  return {
    expires: "example-expires",
    user: {
      name: "example-user-name",
      email: "example-user-email",
      image: "example-user-image",
      githubLogin: "example-user-github-login",
    },
  };
}
