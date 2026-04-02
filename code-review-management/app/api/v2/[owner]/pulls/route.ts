/*
/api/v1/{owner}/pulls

*NOT TO BE POLLED*

Polling can be enabled dependent on the status of the owner access tag
*/

import { getCookieName } from "@/app/api/_utils/cookie-utils";
import { PullRequest, PullRequestSchema } from "@/types/github.types";
import { PullRequestV2 } from "@/types/github.types.wrapper";
import { getToken } from "next-auth/jwt";
import { Octokit, RequestError } from "octokit";
import parse from "parse-link-header";

type RouteContext = {
  params: Promise<{
    owner: string;
  }>;
};

const secret = process.env.AUTH_SECRET;
const cookie = getCookieName();

export async function GET(req: Request, context: RouteContext) {
  const { owner } = await context.params;
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
  if (!owner) {
    return Response.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
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

  try {
    const data = await octokit.request("GET /search/issues", {
      q: "is:pr state:open involves:@me",
      page: page,
      per_page: 3,
    });

    // Filter response
    const filteredResponse: PullRequest[] = data.data.items.map((item) => {
      console.log(item)
      return PullRequestSchema.parse(item)
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
