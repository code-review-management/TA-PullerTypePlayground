/*
/api/v1/{owner}/{repo}/pulls/{pull_number}/{target_branch}/{feature_branch}/merge-conflict

*NOT TO BE POLLED*

Polling can be enabled dependent on the status of the PR access tag
*/

import { getMergeConflict } from "@/lib/merge-conflict-finder/get-merge";
import { getToken } from "next-auth/jwt";
import { Octokit, RequestError } from "octokit";

const secret = process.env.AUTH_SECRET;

export async function GET(
  req: Request,
  { params }: { params: { owner: string; repo: string; pull_request: number, target_branch:string, feature_branch: string } },
) {
  const { owner, repo, target_branch, feature_branch } = await params;
  const token = await getToken({ req, secret });

  console.log("Received merge conflict request!")
  // Validate token
  if (token == null || token.accessToken == null || token.githubId == null) {
    console.log("Unauthorized request at ${new Date()}");
    return new Response(null, { status: 401 });
  }

  // Validate required parameters
  if (!owner || !repo || !target_branch || ! feature_branch) {
    console.log("Missing params!")
    return Response.json(
      { error: "Missing required parameters" },
      { status: 406 },
    );
  }

  const octokit = new Octokit({ auth: token.accessToken });

  try {
    const mergeConflictResponse = await getMergeConflict(
      {
        owner: owner,
        repo: repo,
        targetBranch: target_branch,
        featureBranch: feature_branch
      },
      octokit
    )

    console.log("Sending back success!")
    return new Response(JSON.stringify(mergeConflictResponse, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
      console.log("Error in merge conflict finder: " + error)
      return new Response("Server error", { status: 500 });
  }
}


