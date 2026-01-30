import { getUserRepositoriesLastSyncTime } from "@/lib/supabaseServer";
import { getToken } from "next-auth/jwt";
import { Octokit } from "octokit";

const secret = process.env.AUTH_SECRET;

export async function POST(req: Request) {
  const body = await req.json();
  const { owner, repo } = body;

  const token = await getToken({ req, secret });

  if (token == null || token.accessToken == null || token.githubId == null) {
    console.log("Token is null");
    // Return non-authenticated request
    return;
  }
  
  // const pullRequestLastAccessTime = req.headers.get("If-Modified-Since");
  // const lastWebhookEventTime = await getPullRequestLastSyncTime(
  //   token.githubId,
  // );

  // if (
  //   userLastAccessTime == null ||
  //   lastWebhookEventTime == null ||
  //   new Date(userLastAccessTime) < new Date(lastWebhookEventTime)
  // ) {

    const octokit = new Octokit({ auth: token.accessToken });

    const contents = await octokit.rest.pulls.list({
      owner: owner,
      repo: repo
    });
    
    if (!owner || !repo) {
      return Response.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    return new Response(JSON.stringify(contents, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // ...(lastWebhookEventTime && {
        //   "Last-Modified": lastWebhookEventTime,
        // }),
      },
    });
  // }

  return new Response(null, { status: 304 });
}
