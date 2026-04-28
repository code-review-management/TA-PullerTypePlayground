/*
/api/v2/{owner}/{repo}/commit/{ref}

*NOT TO BE POLLED*
*/

import { getCookieName } from "@/app/api/_utils/cookie-utils";
import { Commit, CommitSchema } from "@/types/github.types";
import { CommitV2 } from "@/types/github.types.wrapper";
import { getToken } from "next-auth/jwt";
import { Octokit, RequestError } from "octokit";
import parse from "parse-link-header";

type RouteContext = {
  params: Promise<{
    owner: string;
    repo: string;
    ref: string;
  }>;
};

const secret = process.env.AUTH_SECRET;
const cookie = getCookieName();

export async function GET(req: Request, context: RouteContext) {
  const { owner, repo, ref } = await context.params;
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
  if (!owner || !repo || !ref) {
    return Response.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  const octokit = new Octokit({ auth: token.accessToken });

  try {
    const data = await octokit.rest.repos.getCommit({
      owner: owner,
      repo: repo,
      ref: ref,
      page: page,
      per_page: 100,
    });

    const linkHeaders = parse(data.headers.link);

    const filteredResponse: Commit = CommitSchema.parse(data.data);
    const wrappedResponse: CommitV2 = {
      data: [filteredResponse],
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
      return new Response("Server error", { status: 500 });
    }
  }
}
