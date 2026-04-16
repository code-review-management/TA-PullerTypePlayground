import { Branch, PullRequest, Repo, User } from "./github.types";

export function getDefaultUser() {
  return {
    login: "",
    id: 0,
    avatar_url: "",
  } as User;
}

export function getExampleUser1() {
  return {
    login: "exampleUser1",
    id: 1,
    avatar_url: "",
  } as User;
}

export function getExampleUser2() {
  return {
    login: "exampleUser2",
    id: 2,
    avatar_url: "",
  } as User;
}

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

export function getDefaultBranch() {
  return {
    label: "",
    ref: "",
    sha: "",
    user: getDefaultUser(),
    repo: getDefaultRepo(),
  } as Branch;
}

export function getDefaultPull() {
  return {
    url: "",
    id: 0,
    number: 0,
    state: "open",
    locked: false,
    title: "",
    user: getDefaultUser(),
    body: "",
    created_at: "",
    updated_at: "",
    closed_at: null,
    merged_at: null,
    assignees: [],
    requested_reviewers: [],
    head: getDefaultBranch(),
    base: getDefaultBranch(),
    author_association: "CONTRIBUTOR",
    draft: false,
    assignee: null,
  } as PullRequest;
}

export function getExamplePull1() {
  return {
    url: "",
    id: 0,
    number: 123,
    state: "open",
    locked: false,
    title: "1fjads02kd@^nb9",
    user: getExampleUser1(),
    body: "3490jfk$@#da90uqhfi!eii09ruqhef-093u",
    created_at: "",
    updated_at: "",
    closed_at: null,
    merged_at: null,
    assignees: [getExampleUser1()],
    requested_reviewers: [getExampleUser2()],
    head: {
      label: "",
      ref: "",
      sha: "",
      user: getExampleUser1(),
      repo: getExampleRepo1(),
    },
    base: {
      label: "",
      ref: "",
      sha: "",
      user: getExampleUser1(),
      repo: getExampleRepo1(),
    },
    author_association: "CONTRIBUTOR",
    draft: false,
    assignee: null,
    review_comments: 0,
    commits: 3,
    additions: 123,
    deletions: 5,
    changed_files: 4,
  } as PullRequest;
}
