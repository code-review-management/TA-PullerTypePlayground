/*
/api/v1/{owner}/{repo}/pulls/{pull_number}/merge

*NOT TO BE POLLED*

Polling can be enabled dependent on the status of the PR access tag
*/

import { getCookieName } from "@/app/api/_utils/cookie-utils";
import { PRMergeSchema } from "@/types/github.types";
import { PRMergeRequestSchema } from "@/types/request.types";
import { getToken } from "next-auth/jwt";
import { Octokit, RequestError } from "octokit";

type RouteContext = {
  params: Promise<{
    owner: string;
    repo: string;
    pull_number: string;
  }>;
};

const secret = process.env.AUTH_SECRET;
const cookie = getCookieName();

export async function POST(req: Request, context: RouteContext) {
  const { owner, repo, pull_number } = await context.params;
  const reqBody = await req.json();
  const reqArgs = PRMergeRequestSchema.safeParse(reqBody);
  const token = await getToken({
    req: req,
    secret: secret,
    cookieName: cookie,
  });

  // Validate token
  if (token == null || token.accessToken == null || token.githubId == null) {
    console.log("Unauthorized request at ${new Date()}");
    return new Response(null, { status: 401 });
  }

  // Validate required parameters
  if (!owner || !repo || !pull_number || !reqArgs.success) {
    return Response.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  const {
    commit_title: commit_title,
    commit_message: commit_message,
    sha: sha,
    merge_method: merge_method,
  } = reqArgs.data;

  const octokit = new Octokit({ auth: token.accessToken });

  try {
    const { data: contents } = await octokit.rest.pulls.merge({
      owner: owner,
      repo: repo,
      pull_number: Number(pull_number),
      commit_title: commit_title,
      commit_message: commit_message,
      sha: sha ?? undefined,
      merge_method: merge_method,
    });

    // Filter response
    const {
      data: filteredResponse,
      success: status,
      error: errorMsg,
    } = PRMergeSchema.safeParse(contents);
    if (!status) {
      throw new Error(errorMsg.message);
    }

    return new Response(JSON.stringify(filteredResponse, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    if (error instanceof RequestError && error.status) {
      // Octokit Http error
      return new Response(error.message, { status: error.status });
    } else {
      // Parsing/other error
      return new Response("Server error: " + error, { status: 500 });
    }
  }
}
