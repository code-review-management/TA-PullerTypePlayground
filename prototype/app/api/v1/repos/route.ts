import { getUserRepositoriesLastSyncTime } from "@/lib/database/queries/repository";
import { getToken } from "next-auth/jwt";
import { Octokit } from "octokit";

const secret = process.env.AUTH_SECRET;

export async function GET(req: Request) {
  const token = await getToken({ req, secret });

  if (token == null || token.accessToken == null || token.githubId == null) {
    console.log("Token is null");
    // Return non-authenticated request
    return;
  }

  const octokit = new Octokit({ auth: token.accessToken });
  const userLastAccessTime = req.headers.get("If-Modified-Since");
  const lastWebhookEventTime = await getUserRepositoriesLastSyncTime(
    token.githubId,
  );

  if (
    userLastAccessTime == null ||
    lastWebhookEventTime == null ||
    new Date(userLastAccessTime) < new Date(lastWebhookEventTime)
  ) {
    const { data: contents } = await octokit.rest.repos.listForAuthenticatedUser();

    return new Response(JSON.stringify(contents, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...(lastWebhookEventTime && {
          "Last-Modified": lastWebhookEventTime,
        }),
      },
    });
  }

  return new Response(null, { status: 304 });
}
