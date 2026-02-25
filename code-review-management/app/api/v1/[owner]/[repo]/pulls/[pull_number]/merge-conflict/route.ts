/*
/api/v1/{owner}/{repo}/pulls/{pull_number}/merge-conflict

*NOT TO BE POLLED*

Polling can be enabled dependent on the status of the PR access tag
*/

import { getMergeConflict } from "@/lib/merge-conflict-finder/get-merge";
import { getToken } from "next-auth/jwt";
import { Octokit, RequestError } from "octokit";

const secret = process.env.AUTH_SECRET;

export async function GET(
  req: Request,
  { params }: { params: { owner: string; repo: string; targetBranch:string, featureBranch: string } },
) {
  const { owner, repo, targetBranch, featureBranch } = await params;
  const token = await getToken({ req, secret });

  // Validate token
  if (token == null || token.accessToken == null || token.githubId == null) {
    console.log("Unauthorized request at ${new Date()}");
    return new Response(null, { status: 401 });
  }

  // Validate required parameters
  if (!owner || !repo || !targetBranch || ! featureBranch) {
    return Response.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  const octokit = new Octokit({ auth: token.accessToken });

  try {
    const mergeConflictResponse = getMergeConflict(
      {
        owner: owner,
        repo: repo,
        targetBranch: targetBranch,
        featureBranch: featureBranch
      },
      octokit
    )

    return new Response(JSON.stringify(mergeConflictResponse, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
      return new Response("Server error", { status: 500 });
  }
}


