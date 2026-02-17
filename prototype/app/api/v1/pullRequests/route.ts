/*
/api/v1/pullRequests

*NOT TO BE POLLED*

Endpoint is for listing all PR's under a repo and cannot be tagged with a last 
access time due to lack of ownership. ALL requests are redirected to GitHub.
*/

import { getPRLastSyncTime } from "@/lib/database/queries/pull-request";
import { pullRequest } from "@/lib/github.types";
import { private_safeDarken } from "@mui/system";
import { getToken } from "next-auth/jwt";
import { Octokit } from "octokit";

const secret = process.env.AUTH_SECRET;

export async function POST(req: Request) {
  const body = await req.json();
  const { owner, repo } = body;

  const token = await getToken({ req, secret });

  // Validate token
  if (token == null || token.accessToken == null || token.githubId == null) {
    console.log("Unauthorized request at ${new Date()}");
    // Return non-authenticated request
    return new Response(null, { status: 401 })
  }

  // Validate required parameters
  if (!owner || !repo) {
    return Response.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  const octokit = new Octokit({ auth: token.accessToken });

  const contents = await octokit.rest.pulls.list({
    owner: owner,
    repo: repo
  });

  // Filter response
  const pullRequests: pullRequest[] = contents.data.map((pr) => ({
    url: pr.url,
    id: pr.id,
    diff_url: pr.diff_url,
    number: pr.number,
    state: pr.state,
    locked: pr.locked,
    title: pr.title,
    user: pr.user ? { login: pr.user.login, id: pr.user.id } : null
  }));

  return new Response(JSON.stringify(pullRequests, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
