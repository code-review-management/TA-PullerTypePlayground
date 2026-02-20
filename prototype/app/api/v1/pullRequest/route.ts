/*
/api/v1/pullRequest
*/

import { setPullRequest, getPRLastSyncTime } from "@/lib/database/queries/pull-request";
import { getConflictMarkers } from "./conflictFinder"
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

  // Verify last access requirement
  const userLastAccessTime = req.headers.get("If-Modified-Since");
  const lastWebhookEventTime = await getPRLastSyncTime(
    pull_number
  );

  // Return early if requested resource has no changes
  if (
    userLastAccessTime != null &&
    lastWebhookEventTime != null &&
    new Date(userLastAccessTime) >= new Date(lastWebhookEventTime)
  ) {
    return new Response(null, { status: 304 });
  }

  const octokit = new Octokit({ auth: token.accessToken });

  const { data: pr } = await octokit.rest.pulls.get({
    owner: owner,
    repo: repo,
    pull_number: pull_number
  });

  getConflictMarkers(pr, token)

  if (userLastAccessTime == null){
    console.log("Lazy filling in pr: " + pr.id)
    setPullRequest({
      pr_id: pr.id,
      owner_id: pr.user.id,
      owner_repo_id: pr.base.repo.id,
      number: pr.number
    })
  }

  // Filter response
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
      ...(lastWebhookEventTime && {
      "Last-Modified": lastWebhookEventTime,
      }),
    },
  });
}
