/*
/api/v1/{owner}/{repo}/pulls/{pull_number}/comments

Method: POST

*NOT TO BE POLLED*
*/

import { getCookieName } from "@/app/api/_utils/cookie-utils";
import { CommentSchema, Comment } from "@/types/github.types";
import { CommentCreateRequestSchema } from "@/types/request.types";
import { getToken } from "next-auth/jwt";
import { Octokit, RequestError } from "octokit";

const secret = process.env.AUTH_SECRET;
const cookie = getCookieName();

export async function _post(
  req: Request,
  params: { owner: string; repo: string; pull_number: string },
) {
  const { owner, repo, pull_number } = params;
  const reqBody = await req.json();
  const reqArgs = CommentCreateRequestSchema.safeParse(reqBody);
  const token = await getToken({
    req: req,
    secret: secret,
    cookieName: cookie,
  });

  // Validate token
  if (token == null || token.accessToken == null || token.githubId == null) {
    console.log(`Unauthorized request at ${new Date()}`);
    return new Response(null, { status: 401 });
  }

  // Validate required parameters
  if (!owner || !repo || !pull_number || !reqArgs.success) {
    return Response.json(
      { error: "Issue with required parameters" },
      { status: 400 },
    );
  }

  const {
    body,
    commit_id,
    path,
    side,
    line,
    start_line,
    start_side,
    in_reply_to,
    subject_type,
  } = reqArgs.data;

  const octokit: Octokit = new Octokit({ auth: token.accessToken });

  try {
    const { data: contents } = await octokit.rest.pulls.createReviewComment({
      owner: owner,
      repo: repo,
      pull_number: Number(pull_number),
      body: body,
      commit_id: commit_id,
      path: path,
      side: side,
      line: line,
      start_line: start_line,
      start_side: start_side,
      in_reply_to: in_reply_to,
      subject_type: subject_type == "file" ? "file" : undefined,
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
