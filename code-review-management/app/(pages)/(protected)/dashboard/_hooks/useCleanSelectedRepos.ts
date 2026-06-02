import { useEffect } from "react";
import { useSelectedRepos } from "./useSelectedRepos";

export function useCleanSelectedRepos(repoNames: string[]) {
  const { selectedRepos, setSelectedRepos } = useSelectedRepos();

  useEffect(() => {
    console.log("useeffect runs");
    const repoNameSet = new Set(repoNames);
    const cleaned = selectedRepos.filter((repoName) =>
      repoNameSet.has(repoName),
    );
    if (repoNameSet.size !== cleaned.length) {
        setSelectedRepos(cleaned);
    }
  }, []);
}
