/*
/api/v1/{owner}/{repo}/pulls

*NOT TO BE POLLED*

Endpoint is for listing all PR's under a repo and cannot be tagged with a last 
access time due to lack of ownership. ALL requests are redirected to GitHub.
*/

import { PullRequest, PullRequestSchema } from "@/types/github.types";
import { getToken } from "next-auth/jwt";
import { Octokit, RequestError } from "octokit";

const secret = process.env.AUTH_SECRET;

export async function GET(req: Request, { params }: { params: { owner: string, repo: string } }) {
    params = await params;

    const token = await getToken({ req, secret });

    // Validate token
    if (token == null || token.accessToken == null || token.githubId == null) {
        console.log("Unauthorized request at ${new Date()}");
        // Return non-authenticated request
        return new Response(null, { status: 401 })
    }

    // Validate required parameters
    if (!params.owner || !params.repo) {
        return Response.json(
            { error: 'Missing required parameters' },
            { status: 400 }
        );
    }

    const octokit: Octokit = new Octokit({ auth: token.accessToken });

    try {
        const { data: contents } = await octokit.rest.pulls.list({
            owner: params.owner,
            repo: params.repo
        });
    
        const filteredResponse: PullRequest[] = contents.map((item: any) => (PullRequestSchema.parse(item)));
    
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
