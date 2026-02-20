/*
/api/v1/{owner}/{repo}/pulls/{pull_number}/list-files

*NOT TO BE POLLED*
*/

import { FileDiff, FileDiffSchema } from "@/types/github.types";
import { getToken } from "next-auth/jwt";
import { Octokit, RequestError } from "octokit";

const secret = process.env.AUTH_SECRET;

export async function GET(req: Request, { params }: { params: { owner: string, repo: string, pull_number: number } }) {
    params = await params;

  const token = await getToken({ req, secret });

  // Validate token
  if (token == null || token.accessToken == null || token.githubId == null) {
    console.log("Unauthorized request at ${new Date()}");
    // Return non-authenticated request
    return new Response(null, { status: 401 })
  }

  // Validate required parameters
  if (!params.owner || !params.repo || !params.pull_number) {
    return Response.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  const octokit = new Octokit({ auth: token.accessToken });

    try {
        const { data: contents } = await octokit.rest.pulls.listFiles({
            owner: params.owner,
            repo: params.repo,
            pull_number: params.pull_number,
        });

        // Filter response
        const filteredResponse: FileDiff[] = contents.map((item: any) => (FileDiffSchema.parse(item)));

        return new Response(JSON.stringify(filteredResponse, null, 2), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        if (error instanceof RequestError && error.status) {
            return new Response(error.message, { status: error.status });
        } else {
            return new Response("Server error", { status: 500 });
        }
    }
}
