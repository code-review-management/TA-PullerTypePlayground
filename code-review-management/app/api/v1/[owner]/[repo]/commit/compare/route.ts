/*
/api/v1/{owner}/{repo}/commit/compare
*/

import { getCookieName } from "@/app/api/_utils/cookie-utils";
import { PullRequest, PullRequestSchema } from "@/types/github.types";
import { getToken } from "next-auth/jwt";
import { Octokit, RequestError } from "octokit";

type RouteContext = {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
};

const secret = process.env.AUTH_SECRET;
const cookie = getCookieName();

export async function GET(req: Request, context: RouteContext) {
  const { owner, repo } = await context.params;
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
  if (!owner || !repo) {
    return Response.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  const octokit = new Octokit({ auth: token.accessToken });

  try {
    const { data: contents } =
      await octokit.rest.repos.compareCommitsWithBasehead({
        owner: owner,
        repo: repo,
        basehead:
          "675b54bd4c0d104e0eb7b1b8edcce3cf8b95b354...85a53fd9bb1fdb7f41486e618b634d8ef4ad1248",
      });

    // Filter response
    // const filteredResponse: PullRequest = PullRequestSchema.parse(contents);

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
      console.log(error);
      return new Response("Server error", { status: 500 });
    }
  }
}
