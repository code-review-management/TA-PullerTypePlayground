import { Octokit } from "octokit";

export interface FileContext {
  diff: string | null;
  content: string | null;
}

/**
 * Fetches the diff and full contents of a specific file at a specific commit.
 * * @param octokit An authenticated Octokit instance
 * @param owner The repository owner (e.g., "octocat")
 * @param repo The repository name (e.g., "hello-world")
 * @param filePath The path to the file (e.g., "src/index.ts")
 * @param sha The commit SHA to fetch the data from
 */
export async function getFileDiffAndContent(
    octokit: Octokit,
    owner: string,
    repo: string,
    filePath: string,
    sha: string
): Promise<FileContext> {
    let diff: string | null = null;
    let content: string | null = null;

    try {
    const { data: commitData } = await octokit.rest.repos.getCommit({
        owner,
        repo,
        ref: sha,
    });

    const fileInCommit = commitData.files?.find((f) => f.filename === filePath);
    
    if (fileInCommit) {
        diff = fileInCommit.patch || null;
    } else {
        console.warn(`File ${filePath} was not modified in commit ${sha}`);
    }

    const { data: contentData } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: filePath,
        ref: sha,
    });

    if (!Array.isArray(contentData) && contentData.type === "file") {
        content = Buffer.from(contentData.content, "base64").toString("utf-8");
    }

    return { diff, content };

  } catch (error) {
    console.error(`Error fetching data for ${filePath} at ${sha}:`, error);
    throw error;
  }
}