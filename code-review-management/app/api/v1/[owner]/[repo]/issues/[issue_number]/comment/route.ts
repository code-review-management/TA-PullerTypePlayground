/*
/api/v1/{owner}/{repo}/issues/{issue_number}/comment

*NOT TO BE POLLED*
*/

import { getCookieName } from "@/app/api/_utils/cookie-utils";
import { IssueCommentSchema, IssueComment } from "@/types/github.types";
import { CreateIssueCommentRequestSchema } from "@/types/request.types";
import { getToken } from "next-auth/jwt";
import { Octokit, RequestError } from "octokit";

type RouteContext = {
  params: Promise<{
    owner: string;
    repo: string;
    issue_number: string;
  }>;
};

const secret = process.env.AUTH_SECRET;
const cookie = getCookieName();

export async function POST(req: Request, context: RouteContext) {
  const { owner, repo, issue_number } = await context.params;
  const reqBody = await req.json();
  const reqArgs = CreateIssueCommentRequestSchema.safeParse(reqBody);
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
  if (!owner || !repo || !issue_number || !reqArgs.success) {
    return Response.json(
      { error: "Issue with required parameters" },
      { status: 400 },
    );
  }

  const { body } = reqArgs.data;

  const octokit: Octokit = new Octokit({ auth: token.accessToken });

  try {
    const { data: contents } = await octokit.rest.issues.createComment({
      owner: owner,
      repo: repo,
      issue_number: Number(issue_number),
      body: body,
    });

    // Filter response
    const filteredResponse: IssueComment = IssueCommentSchema.parse(contents);

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
      console.log(error);
      return new Response("Server error", { status: 500 });
    }
  }
}
