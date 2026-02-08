/*
/api/v1/pullRequest
*/

import { pullRequest } from "@/lib/github.types";
import { getToken } from "next-auth/jwt";
import { Octokit } from "octokit";

const secret = process.env.AUTH_SECRET;

export async function POST(req: Request) {
  const body = await req.json();
  const { owner, repo, pull_number } = body;

  const token = await getToken({ req, secret });

  // Validate token
  if (token == null || token.accessToken == null || token.githubId == null) {
    console.log("Unauthorized request at ${new Date()}");
    // Return non-authenticated request
    return new Response(null, { status: 401 })
  }

  // Validate required parameters
  if (!owner || !repo || !pull_number) {
    return Response.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  const octokit = new Octokit({ auth: token.accessToken });

  const contents = await octokit.rest.pulls.get({
    owner: owner,
    repo: repo,
    pull_number: pull_number
  });

  // Filter response
  const pr = contents.data
  const pullRequest: pullRequest = {
    url: pr.url,
    id: pr.id,
    diff_url: pr.diff_url,
    number: pr.number,
    state: pr.state,
    locked: pr.locked,
    title: pr.title,
    user: pr.user ? { login: pr.user.login, id: pr.user.id } : null
  };

  return new Response(JSON.stringify(pullRequest, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
