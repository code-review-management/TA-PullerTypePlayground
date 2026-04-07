/*
/api/v2/{owner}/{repo}/pulls/{pull_number}/comments

Method: GET
*/

import { getCookieName } from "@/app/api/_utils/cookie-utils";
import { CommentSchema, Comment } from "@/types/github.types";
import { CommentV2 } from "@/types/github.types.wrapper";
import { getToken } from "next-auth/jwt";
import { Octokit, RequestError } from "octokit";
import parse from "parse-link-header";

const secret = process.env.AUTH_SECRET;
const cookie = getCookieName();

export async function _get(
  req: Request,
  params: { owner: string; repo: string; pull_number: string },
) {
  const { owner, repo, pull_number } = params;
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

  // Get query parameters
  const { searchParams: qParams } = new URL(req.url);
  const page = Number(qParams.get("page"));

  // Validate query parameters
  if (isNaN(page) || page < 1) {
    return Response.json(
      { error: "Missing or invalid query parameters" },
      { status: 400 },
    );
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
    const data = await octokit.rest.pulls.listReviewComments({
      owner: owner,
      repo: repo,
      pull_number: Number(pull_number),
      sort: "created",
      direction: "asc",
      page: page,
      per_page: 100,
    });

    // Filter response
    const filteredResponse: Comment[] = data.data.map((item) =>
      CommentSchema.parse(item),
    );

    const linkHeaders = parse(data.headers.link);

    const wrappedResponse: CommentV2 = {
      data: filteredResponse,
      ...(linkHeaders && {
        ...(linkHeaders.prev && { prev: Number(linkHeaders.prev.page) }),
        ...(linkHeaders.next && { next: Number(linkHeaders.next.page) }),
        ...(linkHeaders.last && { last: Number(linkHeaders.last.page) }),
        ...(linkHeaders.first && { first: Number(linkHeaders.first.page) }),
      }),
    };

    return new Response(JSON.stringify(wrappedResponse, null, 2), {
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
