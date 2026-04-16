import { Repo } from "@/types/github.types";
import { getDefaultUser, getExampleUser1 } from "./users";

export function getDefaultRepo() {
  return {
    id: 0,
    name: "",
    full_name: "",
    owner: getDefaultUser(),
    html_url: "",
    description: "",
    created_at: "",
    updated_at: "",
    pushed_at: "",
    stargazers_count: 0,
    watchers_count: 0,
    open_issues_count: 0,
    has_pull_requests: true,
    visibility: "public",
  } as Repo;
}

export function getExampleRepo1() {
  return {
    id: 0,
    name: "example-repo-1",
    full_name: `${getExampleUser1().login}/example-repo-1`,
    owner: getExampleUser1(),
    html_url: "",
    description: "repo description 1",
    created_at: "",
    updated_at: "",
    pushed_at: "",
    stargazers_count: 0,
    watchers_count: 0,
    open_issues_count: 1,
    has_pull_requests: true,
    visibility: "public",
  } as Repo;
}
