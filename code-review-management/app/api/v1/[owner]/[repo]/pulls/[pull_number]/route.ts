/*
/api/v1/{owner}/{repo}/pulls/{pull_number}
*/

import { PullRequest, PullRequestSchema } from "@/types/github.types";
import { getToken } from "next-auth/jwt";
import { Octokit, RequestError } from "octokit";

const secret = process.env.AUTH_SECRET;

export async function GET(req: Request, { params }: { params: { owner: string, repo: string, pull_number: number } }) {
    params = await params;

  const token = await getToken({ req, secret });

  // Validate token
  if (token == null || token.accessToken == null || token.githubId == null) {
    console.log("Unauthorized request at ${new Date()}");
    // Return non-authenticated request
    return new Response(null, { status: 401 })
  }

  // Validate required parameters
  if (!params.owner || !params.repo || !params.pull_number) {
    return Response.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  // Verify last access requirement
//   const userLastAccessTime = req.headers.get("If-Modified-Since");
//   const lastWebhookEventTime = await getPRLastSyncTime(
//     pull_number
//   );

  // Return early if requested resource has no changes
//   if (
//     userLastAccessTime != null &&
//     lastWebhookEventTime != null &&
//     new Date(userLastAccessTime) >= new Date(lastWebhookEventTime)
//   ) {
//     return new Response(null, { status: 304 });
//   }

  const octokit = new Octokit({ auth: token.accessToken });

  try {
      const { data: contents } = await octokit.rest.pulls.get({
        owner: params.owner,
        repo: params.repo,
        pull_number: params.pull_number
      });
    
      // Filter response
      const filteredResponse: PullRequest = PullRequestSchema.parse(contents);
    
      return new Response(JSON.stringify(filteredResponse, null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        //   ...(lastWebhookEventTime && {
        //   "Last-Modified": lastWebhookEventTime,
        //   }),
        },
      });
    } catch (error) {
        if (error instanceof RequestError && error.status) {
            return new Response(error.message, { status: error.status });
        } else {
            return new Response("Server error", { status: 500 });
        }
    }
}
