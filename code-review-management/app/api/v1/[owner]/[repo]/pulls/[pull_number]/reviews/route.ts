/*
/api/v1/{owner}/{repo}/pulls/{pull_number}/reviews

*NOT TO BE POLLED*

Polling can be enabled dependent on the status of the PR access tag
*/

import { getCookieName } from "@/app/api/_utils/cookie-utils";
import { ReviewSchema } from "@/types/github.types";
import { CreateReviewRequestSchema } from "@/types/request.types";
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
  const reqArgs = CreateReviewRequestSchema.safeParse(reqBody);
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
  if (!owner || !repo || !pull_number) {
    return Response.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  // Validate request parameters
  if (!reqArgs.success) {
    const error = JSON.parse(reqArgs.error.message);
    return Response.json({ error: error[0]["message"] }, { status: 400 });
  }

  const { body: body, event: event } = reqArgs.data;

  const octokit = new Octokit({ auth: token.accessToken });

  try {
    const { data: contents } = await octokit.rest.pulls.createReview({
      owner: owner,
      repo: repo,
      pull_number: Number(pull_number),
      body: body ?? undefined,
      event: event,
    });

    console.log(contents);

    // Filter response
    const {
      data: filteredResponse,
      success: status,
      error: errorMsg,
    } = ReviewSchema.safeParse(contents);
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
