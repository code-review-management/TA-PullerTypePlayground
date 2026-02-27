/*
/api/v1/{owner}/{repo}/pulls/{pull_number}/comments

Method: PATCH

*NOT TO BE POLLED*
*/

import { CommentSchema, Comment } from "@/types/github.types";
import { CommentPatchRequestSchema } from "@/types/request.types";
import { getToken } from "next-auth/jwt";
import { Octokit, RequestError } from "octokit";

const secret = process.env.AUTH_SECRET;

export async function _patch(
  req: Request,
  { params }: { params: { owner: string; repo: string; pull_number: number } },
) {
  const { owner, repo, pull_number } = await params;
  const reqBody = await req.json();
  const reqArgs = CommentPatchRequestSchema.safeParse(reqBody);
  const token = await getToken({ req, secret });

  // Validate token
  if (token == null || token.accessToken == null || token.githubId == null) {
    console.log("Unauthorized request at ${new Date()}");
    return new Response(null, { status: 401 });
  }

  // Validate required parameters
  if (!owner || !repo || !pull_number || !reqArgs.success) {
    return Response.json(
      { error: "Issue with required parameters" },
      { status: 400 },
    );
  }

  const { comment_id, body } = reqArgs.data;

  const octokit: Octokit = new Octokit({ auth: token.accessToken });

  try {
    const { data: contents } = await octokit.rest.pulls.updateReviewComment({
      owner: owner,
      repo: repo,
      comment_id: comment_id,
      body: body,
    });

    // Filter response
    const filteredResponse: Comment = CommentSchema.parse(contents);

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
