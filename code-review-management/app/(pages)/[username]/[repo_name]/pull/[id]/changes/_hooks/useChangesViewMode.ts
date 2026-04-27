import { useSearchParams } from "next/navigation";

type ChangesViewMode = "pr" | "single-commit" | "cumulative-commit";

export function useChangesViewMode(): {
  sha: string | null;
  mode: ChangesViewMode;
} {
  const params = useSearchParams();
  const sha = params.get("sha");
  const cumulative = params.get("cumulative");

  if (sha === null) return { sha, mode: "pr" };
  if (cumulative !== null) return { sha, mode: "cumulative-commit" };
  return { sha, mode: "single-commit" };
}
