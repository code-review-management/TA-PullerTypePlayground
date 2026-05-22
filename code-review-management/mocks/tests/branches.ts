import { Branch } from "@/types/github.types";
import { getDefaultUser } from "./users";
import { getDefaultRepo } from "./repos";

export function getDefaultBranch(): Branch {
  return {
    label: "",
    ref: "",
    sha: "test-branch-sha",
    user: getDefaultUser(),
    repo: getDefaultRepo(),
  };
}
