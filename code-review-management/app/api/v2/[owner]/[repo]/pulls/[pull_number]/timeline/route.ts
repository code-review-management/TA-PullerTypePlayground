/*
/api/v2/{owner}/{repo}/pulls/{pull_number}/timeline
*/

import { getCookieName } from "@/app/api/_utils/cookie-utils";
import {
  TimelineEvent,
  TimelineEventSchema,
  ReviewedEvent,
  ReviewCommentSchema,
} from "@/types/github.types";
import { TimelineEventV2 } from "@/types/github.types.wrapper";
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

  const octokit = new Octokit({ auth: token.accessToken });

  try {
    const data = await octokit.rest.issues.listEventsForTimeline({
      owner: owner,
      repo: repo,
      issue_number: Number(pull_number),
      page: page,
      per_page: 100,
    });

    // Filter response
    const filteredResponse: TimelineEvent[] = await Promise.all(
      data.data
        .map(async (item) => {
          let { data: parsedItem, success: status } =
            TimelineEventSchema.safeParse(item);
          if (!status) {
            console.log("Error parsing\n" + item);
            return null;
          }

          if (
            parsedItem &&
            parsedItem.event &&
            "id" in parsedItem &&
            parsedItem.event == "reviewed"
          ) {
            // Inject review comments into object
            parsedItem = parsedItem as ReviewedEvent;

            const { data: reviewContents } =
              await octokit.rest.pulls.listCommentsForReview({
                owner: owner,
                repo: repo,
                pull_number: Number(pull_number),
                review_id: parsedItem.id,
              });

            // Filter comments in review
            parsedItem.comments = reviewContents
              .map((item) => {
                const parsedItem = ReviewCommentSchema.safeParse(item);
                if (!parsedItem.success) {
                  console.log("Review comment error: " + parsedItem.error);
                  return null;
                }

                return parsedItem.success ? parsedItem.data : null;
              })
              .filter((element) => element !== null);
          }

          return parsedItem ?? null;
        })
        .filter((element) => element !== null),
    );

    const linkHeaders = parse(data.headers.link);

    const wrappedResponse: TimelineEventV2 = {
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
