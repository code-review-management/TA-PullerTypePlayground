/*
/api/v1/{owner}/{repo}/pulls/{pull_number}/comments

Method: GET

*NOT TO BE POLLED*

Polling can be enabled dependent on the status of the PR or comment access tag.
*/

import { CommentSchema, Comment } from "@/types/github.types";
import { getToken } from "next-auth/jwt";
import { Octokit, RequestError } from "octokit";

const secret = process.env.AUTH_SECRET;

export async function _get(
  req: Request,
  params: { owner: string; repo: string; pull_number: string },
) {
  const { owner, repo, pull_number } = params;
  const token = await getToken({ req, secret });

  // Validate token
  if (token == null || token.accessToken == null || token.githubId == null) {
    console.log("Unauthorized request at ${new Date()}");
    return new Response(null, { status: 401 });
  }

  // Validate required parameters
  if (!owner || !repo || !pull_number) {
    return Response.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  const octokit: Octokit = new Octokit({ auth: token.accessToken });

  try {
    const { data: contents } = await octokit.rest.pulls.listReviewComments({
      owner: owner,
      repo: repo,
      pull_number: Number(pull_number),
      sort: "created",
      direction: "asc",
    });

    // Filter response
    const filteredResponse: Comment[] = contents.map((item) =>
      CommentSchema.parse(item),
    );

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
      return new Response("Server error", { status: 500 });
    }
  }
}
