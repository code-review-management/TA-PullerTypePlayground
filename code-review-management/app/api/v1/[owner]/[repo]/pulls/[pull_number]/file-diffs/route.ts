/*
/api/v1/{owner}/{repo}/pulls/{pull_number}/file-diffs

*NOT TO BE POLLED*

Polling can be enabled dependent on the status of the PR access tag
*/

import { getToken } from "next-auth/jwt";
import { Octokit, RequestError } from "octokit";

const secret = process.env.AUTH_SECRET;

export async function GET(
  req: Request,
  { params }: { params: { owner: string; repo: string; pull_number: number } },
) {
  params = await params;

  const token = await getToken({ req, secret });

  // Validate token
  if (token == null || token.accessToken == null || token.githubId == null) {
    console.log("Unauthorized request at ${new Date()}");
    return new Response(null, { status: 401 });
  }

  // Validate required parameters
  if (!params.owner || !params.repo || !params.pull_number) {
    return Response.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  const octokit = new Octokit({ auth: token.accessToken });

  try {
    const { data: contents } = await octokit.rest.pulls.get({
      owner: params.owner,
      repo: params.repo,
      pull_number: params.pull_number,
      mediaType: {
        format: "diff",
      },
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
