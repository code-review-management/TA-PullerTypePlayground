/*
/api/v1/{owner}/{repo}/pulls/{pull_number}/comments

Method: DELETE

*NOT TO BE POLLED*
*/

import { CommentSchema, Comment } from "@/types/github.types";
import { CommentDeleteRequestSchema } from "@/types/request.types";
import { getToken } from "next-auth/jwt";
import { Octokit, RequestError } from "octokit";

const secret = process.env.AUTH_SECRET;

export async function _delete(
  req: Request,
  { params }: { params: { owner: string; repo: string; pull_number: number } },
) {
  const { owner, repo, pull_number } = await params;
  const reqBody = await req.json();
  const reqArgs = CommentDeleteRequestSchema.safeParse(reqBody);
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

  const { comment_id } = reqArgs.data;

  const octokit: Octokit = new Octokit({ auth: token.accessToken });

  try {
    const { data: contents } = await octokit.rest.pulls.deleteReviewComment({
      owner: owner,
      repo: repo,
      comment_id: comment_id,
    });

    return new Response(JSON.stringify(contents, null, 2), {
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
