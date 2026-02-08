/*
/api/v1/pullRequestFiles

*NOT TO BE POLLED*
*/

import { getPRLastSyncTime } from "@/lib/database/queries/pull-request";
import { fileDiff, pullRequest } from "@/lib/github.types";
import { private_safeDarken } from "@mui/system";
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

  const contents = await octokit.rest.pulls.listFiles({
    owner: owner,
    repo: repo,
    pull_number: pull_number
  });

  // Filter response
  const fileDiffs: fileDiff[] = contents.data.map((file) => ({
    sha: file.sha,
    filename: file.filename,
    status: file.status,
    additions: file.additions,
    deletions: file.deletions,
    changes: file.changes,
    contents_url: file.contents_url,
    patch: file.patch
  }));

  return new Response(JSON.stringify(fileDiffs, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
