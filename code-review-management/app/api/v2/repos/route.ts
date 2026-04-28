/*
/api/v2/repos
*/

import { Repo, RepoSchema } from "@/types/github.types";
import { RepoV2 } from "@/types/github.types.wrapper";
import { getCookieName } from "@/app/api/_utils/cookie-utils";
import { getToken } from "next-auth/jwt";
import { Octokit, RequestError } from "octokit";
import parse from "parse-link-header";

const secret = process.env.AUTH_SECRET;
const cookie = getCookieName()

export async function GET(req: Request) {
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

  const octokit: Octokit = new Octokit({ auth: token.accessToken });

  try {
    const data = await octokit.rest.repos.listForAuthenticatedUser({
      page: page,
      per_page: 100,
    });

    // Filter response
    const filteredResponse: Repo[] = data.data.map((item) =>
      RepoSchema.parse(item),
    );

    const linkHeaders = parse(data.headers.link);

    const wrappedResponse: RepoV2 = {
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
