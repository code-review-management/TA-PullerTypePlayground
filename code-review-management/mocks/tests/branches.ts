import { Branch } from "@/types/github.types";
import { getDefaultUser } from "./users";
import { getDefaultRepo } from "./repos";

export function getDefaultBranch() {
  return {
    label: "",
    ref: "",
    sha: "",
    user: getDefaultUser(),
    repo: getDefaultRepo(),
  } as Branch;
}
