import "./_handlers/pull-request";
import "./_handlers/installation";
import "./_handlers/installation-repositories";
import "./_handlers/repository";

import { octokitApp } from "@/lib/github/octokit-app";

export async function POST(req: Request) {
  const payload = await req.text();

  const id = req.headers.get("x-github-delivery") ?? "";
  const name = req.headers.get("x-github-event") ?? "";
  const signature = req.headers.get("x-hub-signature-256") ?? "";

  octokitApp.webhooks.verifyAndReceive({
    id,
    name,
    payload,
    signature,
  });

  return new Response("Ok");
}
