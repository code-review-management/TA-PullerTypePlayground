import { useSearchParams } from "next/navigation";

type ChangesViewMode = "pr" | "commit" | "cumulative";

export function useChangesViewMode(): {
  sha: string | null;
  mode: ChangesViewMode;
} {
  const params = useSearchParams();
  const sha = params.get("sha");
  const cumulative = params.get("cumulative");

  if (sha === null) return { sha, mode: "pr" };
  if (cumulative !== null) return { sha, mode: "cumulative" };
  return { sha, mode: "commit" };
}
