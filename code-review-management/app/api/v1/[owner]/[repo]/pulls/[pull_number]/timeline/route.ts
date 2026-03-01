/*
/api/v1/{owner}/{repo}/pulls/{pull_number}/timeline

*NOT TO BE POLLED*

Polling can be enabled dependent on the status of the PR access tag
*/

import { FileDiff, FileDiffSchema } from "@/types/github.types";
import { getToken } from "next-auth/jwt";
import { Octokit, RequestError } from "octokit";

const secret = process.env.AUTH_SECRET;

export async function GET(
  req: Request,
  { params }: { params: { owner: string; repo: string; pull_number: number } },
) {
  const { owner, repo, pull_number } = await params;
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

  const octokit = new Octokit({ auth: token.accessToken });

  try {
    const { data: contents } = await octokit.rest.issues.listEventsForTimeline({
      owner: owner,
      repo: repo,
      issue_number: pull_number,
    });

    // Filter response
    // const filteredResponse: FileDiff[] = contents.map((item) =>
    //   FileDiffSchema.parse(item),
    // );

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
