/*
/api/v2/{owner}/{repo}/pulls/{pull_number}/comments
*/

import { _get } from "./get";

type RouteContext = {
  params: Promise<{
    owner: string;
    repo: string;
    pull_number: string;
  }>;
};

export async function GET(req: Request, context: RouteContext) {
  const params = await context.params;
  return _get(req, params);
}
