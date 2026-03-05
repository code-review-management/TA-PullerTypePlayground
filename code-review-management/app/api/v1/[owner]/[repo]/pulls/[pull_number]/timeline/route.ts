/*
/api/v1/{owner}/{repo}/pulls/{pull_number}/timeline

*NOT TO BE POLLED*

Polling can be enabled dependent on the status of the PR access tag
*/

import { getCookieName } from "@/app/api/_utils/cookie-utils";
import { TimelineEvent, TimelineEventSchema } from "@/types/github.types";
import { getToken } from "next-auth/jwt";
import { Octokit, RequestError } from "octokit";

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
      issue_number: Number(pull_number),
    });

    // Filter response
    const filteredResponse: TimelineEvent[] = contents
      .map((item) => {
        // console.log(item)

        let parsedItem = TimelineEventSchema.safeParse(item);
        if (!parsedItem.success) {
          console.log("Error parsing\n" + item);
        }
        return parsedItem.success ? parsedItem.data : null;
      })
      .filter((element) => element !== null);

    return new Response(JSON.stringify(filteredResponse, null, 2), {
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
