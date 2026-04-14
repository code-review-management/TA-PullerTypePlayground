/*
/api/v1/{owner}/{repo}/pulls/{pull_number}/commit-merge
*/

import { commitMergeChanges } from "../utils/merge-commiter/push-merge";
import { MergeCommitPayloadSchema } from "../utils/merge-github.types";
import { getToken } from "next-auth/jwt";
import { Octokit } from "octokit";

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

export async function POST(req: Request, context: RouteContext) {
  const token = await getToken({
    req: req,
    secret: secret,
    cookieName: cookieKey,
  });

  // Validate token
  if (token == null || token.accessToken == null || token.githubId == null) {
    console.log("Unauthorized request at ${new Date()}");
    return new Response(null, { status: 401 });
  }

  const body = await req.json();
  const result = MergeCommitPayloadSchema.safeParse(body);

  if (!result.success) {
    return Response.json(result.error.format(), { status: 400 });
  }

  const { mergeCommitData, mergeContent }= result.data;

  const octokit = new Octokit({ auth: token.accessToken });

  try {
    const mergeConflictResponse: boolean = await commitMergeChanges(
        mergeCommitData,
        mergeContent,
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


