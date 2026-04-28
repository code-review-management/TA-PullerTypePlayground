/*
/api/v2/pulls

*NOT TO BE POLLED*
*/

import { getCookieName } from "@/app/api/_utils/cookie-utils";
import { PullRequest, PullRequestSchema } from "@/types/github.types";
import { PullRequestV2 } from "@/types/github.types.wrapper";
import { getToken } from "next-auth/jwt";
import { Octokit, RequestError } from "octokit";
import parse from "parse-link-header";

const secret = process.env.AUTH_SECRET;
const cookie = getCookieName();

const qParams = {
  open: ["state:open", "state:closed"],
  draft: ["draft:true", "draft:false"],
  merged: ["is:merged", "is:unmerged"],
  needs_review: ["user-review-requested:@me"],
  ready_for_review: ["draft:false review:required"],
  approved: ["review:approved"],
  opened: ["author:@me"],
  assigned: ["assignee:@me"],
  reviewed: ["reviewed-by:@me"],
} as const;

export async function GET(req: Request) {
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
  const { searchParams: params } = new URL(req.url);
  const page = Number(params.get("page"));

  // Validate parameters
  if (isNaN(page) || page < 1) {
    return Response.json(
      { error: "Missing or invalid query parameters" },
      { status: 400 },
    );
  }

  const octokit = new Octokit({ auth: token.accessToken });

  // Assemble query string
  let query = "is:pr involves:@me ";
  Object.entries(qParams).forEach(([key, value]) => {
    const param = params.get(key);
    const index = Number(param);
    if (param == null || isNaN(index) || index < 0 || index >= value.length)
      return;

    query += value[index] + " ";
  });
  query = query.slice(0, -1);

  try {
    const data = await octokit.request("GET /search/issues", {
      q: query,
      page: page,
      per_page: 100,
    });

    // Filter response
    const filteredResponse: PullRequest[] = data.data.items.map((item) => {
      const rv: PullRequest = PullRequestSchema.parse(item);

      if (rv.repository_url) {
        // Populate repo name
        const repoUrlArray = rv.repository_url.split("/");
        const index = repoUrlArray.findIndex((element) => element == "repos");
        rv.repository_name = repoUrlArray.slice(index + 2).join("/");

        // Populate repo owner
        rv.repository_owner = repoUrlArray[index + 1];
      }

      return rv;
    });

    const linkHeaders = parse(data.headers.link);

    const wrappedResponse: PullRequestV2 = {
      data: filteredResponse,
      totalCount: data.data.total_count,
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
