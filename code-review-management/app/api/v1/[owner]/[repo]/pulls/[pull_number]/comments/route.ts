/*
/api/v1/{owner}/{repo}/pulls/{pull_number}/comments
*/

import { _get } from "./get";
import { _post } from "./post";
import { _patch } from "./patch";
import { _delete } from "./delete";

export async function GET(
  req: Request,
  content: { params: { owner: string; repo: string; pull_number: number } },
) {
  return _get(req, content);
}

export async function POST(
  req: Request,
  content: { params: { owner: string; repo: string; pull_number: number } },
) {
  return _post(req, content);
}

export async function PATCH(
  req: Request,
  content: { params: { owner: string; repo: string; pull_number: number } },
) {
  return _patch(req, content);
}

export async function DELETE(
  req: Request,
  content: { params: { owner: string; repo: string; pull_number: number } },
) {
  return _delete(req, content);
}
