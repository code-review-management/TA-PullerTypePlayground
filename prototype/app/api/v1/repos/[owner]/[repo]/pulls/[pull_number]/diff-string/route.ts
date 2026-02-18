import { getToken } from "next-auth/jwt";
import { Octokit } from "octokit";

const secret = process.env.AUTH_SECRET;

export async function GET(req: Request, { params }: { params: { owner: string; repo: string; pull_number: number } }) {
  // https://stackoverflow.com/questions/79145063/params-should-be-awaited
  params = await params;

  const token = await getToken({ req, secret });
  if (token == null || token.accessToken == null || token.githubId == null) {
    return new Response(null, { status: 401 });
  }

  const octokit = new Octokit({ auth: token.accessToken });
  // https://github.com/octokit/request.js/issues/463
  const response = await octokit.request("GET /repos/{owner}/{repo}/pulls/{pull_number}", {
      owner: params.owner,
      repo: params.repo,
      pull_number: params.pull_number,
      mediaType: {
        format: "diff",
      },
    },
  );
  const diffString = response.data as unknown as string;

  return new Response(diffString, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
