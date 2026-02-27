/*
/api/v1/{owner}/{repo}/pulls/{pull_number}/comments
*/

import { get } from "./get";
import { post } from "./post";

export async function GET(
  req: Request,
  content: { params: { owner: string; repo: string; pull_number: number } },
) {
  return get(req, content);
}

export async function POST(
  req: Request,
  content: { params: { owner: string; repo: string; pull_number: number } },
) {
  return post(req, content);
}
