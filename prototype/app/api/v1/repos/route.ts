
import { getToken } from "next-auth/jwt";
import { Octokit, App } from "octokit";

const secret = process.env.AUTH_SECRET;
export async function GET(req: Request) {
    const token = await getToken({ req, secret});
    if (token == null) {
        console.log("Token is null");
        return;
    }
    // console.log(req);
    console.log(token);
    // console.log(token.accessToken);

    // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
    const octokit = new Octokit({ auth: token.accessToken });

    // Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
    // const { data: { login } } = await octokit.rest.users.getAuthenticated();
    const { data: contents } = await octokit.rest.repos.listForUser({ username: token.login });
    // console.log("Hello, %s", contents);
    // console.log(JSON.stringify(contents, null, 2))

    // octokit.rest


    // For example, fetch data from your DB here
    const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 0, name: 'Naomi'}
    ];
    return new Response(JSON.stringify(contents, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
    });
}