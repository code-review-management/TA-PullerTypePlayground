/*
/api/v2/{owner}/{repo}/{pull_number}/commits

*NOT TO BE POLLED*
*/

import { getCookieName } from "@/app/api/_utils/cookie-utils";
import {
  Commit,
  CommitSchema,
  TimelineEventSchema,
} from "@/types/github.types";
import { CommitV2 } from "@/types/github.types.wrapper";
import { getToken } from "next-auth/jwt";
import { Octokit, RequestError } from "octokit";
import parse from "parse-link-header";

type RouteContext = {
  params: Promise<{
    owner: string;
    repo: string;
    pull_number: string;
  }>;
};

const secret = process.env.AUTH_SECRET;
const cookie = getCookieName();

export async function GET(req: Request, context: RouteContext) {
  const { owner, repo, pull_number } = await context.params;
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
  const branch = qParams.get("branch");
  const time = qParams.get("since");

  // Validate query parameters
  if (isNaN(page) || page < 1 || !branch) {
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

  const octokit = new Octokit({ auth: token.accessToken });
  let since: string = "";

  // Get the first relevant commit time if not provided
  if (!time) {
    try {
      const { data: contents } =
        await octokit.rest.issues.listEventsForTimeline({
          owner: owner,
          repo: repo,
          issue_number: Number(pull_number),
        });

      contents.some((item) => {
        const parsedItem = TimelineEventSchema.parse(item);
        if (parsedItem?.event == "committed") {
          since = parsedItem.author.date;
          console.log(since);
          return true;
        }
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

  // Get list of commits on the timeline
  try {
    const data = await octokit.rest.repos.listCommits({
      owner: owner,
      repo: repo,
      sha: branch ?? undefined,
      page: page,
      per_page: 100,
      since: time ?? since,
    });

    // Filter response
    const filteredResponse: Commit[] = data.data.map((item) =>
      CommitSchema.parse(item),
    );

    const linkHeaders = parse(data.headers.link);

    const wrappedResponse: CommitV2 = {
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
