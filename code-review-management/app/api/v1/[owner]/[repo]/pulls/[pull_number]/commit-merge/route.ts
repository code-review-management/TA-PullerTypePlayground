/*
/api/v1/{owner}/{repo}/pulls/{pull_number}/commit-merge

*NOT TO BE POLLED*

Polling can be enabled dependent on the status of the PR access tag
*/

import { commitMergeChanges, MergeCommitInputData, MergeCommitContent } from "@/lib/merge-commiter/push-merge";
import { getToken } from "next-auth/jwt";
import { Octokit } from "octokit";

const secret = process.env.AUTH_SECRET;

export async function POST(
  req: Request,
  { params }: { params: 
    { mergeCommitData: MergeCommitInputData,
      mergeContent: MergeCommitContent[]
    }
 },
) {
  const { mergeCommitData, mergeContent } = await params;
  const token = await getToken({ req, secret });

  // Validate token
  if (token == null || token.accessToken == null || token.githubId == null) {
    console.log("Unauthorized request at ${new Date()}");
    return new Response(null, { status: 401 });
  }

  // Validate required parameters
  if (!mergeCommitData || !mergeCommitData.owner || !mergeCommitData.repo
     || !mergeCommitData.featureBranch || !mergeCommitData.targetBranch || !mergeCommitData.targetMergeSha || ! mergeContent) {
    return Response.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  const octokit = new Octokit({ auth: token.accessToken });

  try {
    const mergeConflictResponse: boolean = await commitMergeChanges(
        mergeCommitData,
        mergeContent,
        octokit
    )

    return new Response(JSON.stringify(mergeConflictResponse, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
      return new Response("Server error", { status: 500 });
  }
}


