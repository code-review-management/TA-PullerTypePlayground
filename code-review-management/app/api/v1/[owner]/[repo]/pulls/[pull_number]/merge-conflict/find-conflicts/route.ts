/*
/api/v1/{owner}/{repo}/pulls/{pull_number}/{target_branch}/{feature_branch}/merge-conflict

*NOT TO BE POLLED*

Polling can be enabled dependent on the status of the PR access tag
*/

import { getMergeConflict } from "../utils/merge-conflict-finder/get-merge";
import { MergeQueryParamsSchema } from "../utils/merge-github.types";
import { getToken } from "next-auth/jwt";
import { Octokit } from "octokit";
import { AllowanceError } from "../utils/merge-conflict-finder/detect-modified";

type RouteContext = {
  params: Promise<{
    owner: string;
    repo: string;
    pull_number: string;
  }>;
};

const secret = process.env.AUTH_SECRET;
const cookieKey =
  process.env.NODE_ENV === "production"
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

export async function GET(req: Request, context: RouteContext) {
  const { owner, repo } = await context.params;

  const { searchParams } = new URL(req.url);
  const queryResult = MergeQueryParamsSchema.safeParse(Object.fromEntries(searchParams));
  if (!queryResult.success) {
    return Response.json(queryResult.error.format(), { status: 400 });
  }

  const { target_branch, feature_branch } = queryResult.data;

  const token = await getToken({
    req: req,
    secret: secret,
    cookieName: cookieKey,
  });

  console.log("Received merge conflict request!")
  if (token == null || token.accessToken == null || token.githubId == null) {
    console.log("Unauthorized request at ${new Date()}");
    return new Response(null, { status: 401 });
  }

  // Validate required parameters
  if (!owner || !repo) {
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
  } catch (error: unknown) {
      console.log("Error in merge conflict finder: " + error)

      if (error instanceof AllowanceError){
        return new Response("Not enough tokens", { status: 403})
      } else {
        return new Response("Server error", { status: 500 });
      }
  }
}


