/*
/api/v1/repos
*/

import { Repo, RepoSchema } from "@/types/github.types";
import { getToken } from "next-auth/jwt";
import { Octokit } from "octokit";

const secret = process.env.AUTH_SECRET;

export async function GET(req: Request) {
  const token = await getToken({ req, secret });

  // Validate token
  if (token == null || token.accessToken == null || token.githubId == null) {
    console.log("Unauthorized request at ${new Date()}");
    // Return non-authenticated request
    return new Response(null, { status: 401 })
  }

  // Verify last access requirement
//   const userLastAccessTime = req.headers.get("If-Modified-Since");
//   const lastWebhookEventTime = await getUserRepositoriesLastSyncTime(
//     token.githubId,
//   );

  // Return early if requested resource has no changes
//   if (
//     userLastAccessTime != null &&
//     lastWebhookEventTime != null &&
//     new Date(userLastAccessTime) >= new Date(lastWebhookEventTime)
//   ) {
//     return new Response(null, { status: 304 });
//   }

  const octokit: Octokit = new Octokit({ auth: token.accessToken });

  const { data: contents } = await octokit.rest.repos.listForAuthenticatedUser();

  // Filter response
  const repos: Repo[] = contents.map((repo: any) => (RepoSchema.parse(repo)));

  return new Response(JSON.stringify(repos, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    //   ...(lastWebhookEventTime && {
    //     "Last-Modified": lastWebhookEventTime,
    //   }),
    },
  });
}
