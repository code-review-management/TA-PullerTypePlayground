import crypto from "crypto";
import {UserData, RepoData, registerData, unregisterUser, unregisterRepos} from "../../../lib/supabaseServer"

type WebhookHandlers = {
  [K in string]: (payload: any) => Promise<void>;
};

const handlers: WebhookHandlers = {
  // Handle new installations
  "installation.created": async (payload) => {
    registerPayload(payload)
  },

  // Handle adding/removing repos from an existing installation
  "installation_repositories.added": async (payload) => {
    registerUserRepoChange(payload)
  },

    "installation_repositories.removed": async (payload) => {
    registerUserRepoChange(payload)
  },

  // Handle removing installations
  "installation.deleted": async (payload) => {
    const userId: number = payload.sender.id
    unregisterUser(userId)
  }
};

export async function POST(req: Request) {
  const body = await req.text();

  const signature = req.headers.get("x-hub-signature-256");
  const event = req.headers.get("x-github-event");

  let stringSig: string;
  if (signature == null){
    stringSig = "";
  } else {
    stringSig = signature
  }

  console.log("Something came in!")
  verifySignature(body, stringSig);

  const payload = JSON.parse(body);
  console.log(req)
  const action = payload.action ? `.${payload.action}` : "";
  const eventKey = `${event}${action}`; // e.g., "installation.created"

  if (handlers[eventKey]) {
    console.log("Invoking: " + eventKey)
    await handlers[eventKey](payload);
  } else {
    console.log(`No handler registered for: ${eventKey}`);
  }

  return new Response("ok");
}

function verifySignature(payload: string, signature: string) {
  const secret = process.env.WEBHOOK_SECRET!;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = `sha256=${hmac.update(payload).digest("hex")}`;

  if (
    !crypto.timingSafeEqual(
      Buffer.from(digest),
      Buffer.from(signature)
    )
  ) {
    throw new Error("Invalid signature");
  }
}

async function registerPayload(payload: any): Promise<void>{
    const parsedUser: UserData = convertToUserData(payload);
    const parsedRepos: RepoData[] = (payload.repositories ?? []).map(convertToRepoData);

    registerData(parsedUser, parsedRepos)
}

async function registerUserRepoChange(payload: any): Promise<void>{
  const parsedUser: UserData = convertToUserData(payload);
  const parsedRepos: RepoData[] = (payload.repositories_added ?? []).map(convertToRepoData);

  if (parsedRepos.length > 0){
    console.log("Registering!");
    await registerData(parsedUser, parsedRepos)
  }

  const parsedReposRemoved: RepoData[] = ((payload.repositories_removed ?? []).map(convertToRepoData));
  if (parsedReposRemoved.length > 0){
    console.log("unregistering!");
    unregisterRepos(parsedUser.user_id, parsedReposRemoved)
  } else {
    console.log("No repos to remove!")
  }
}


function convertToUserData(payload: any): UserData{
    return {
        user_id: payload.sender.id,
        login: payload.sender.login,
        installation_id: payload.installation.id
    }
}

function convertToRepoData(repoPayload: any): RepoData {
    return { 
        repo_id: repoPayload.id,
        name: repoPayload.name,
        full_name: repoPayload.full_name,
    }
}