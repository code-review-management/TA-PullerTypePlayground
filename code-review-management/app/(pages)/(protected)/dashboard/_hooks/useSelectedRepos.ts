import { useLocalStorage } from "usehooks-ts";

export function useSelectedRepos() {
  const [selectedRepos, setSelectedRepos] = useLocalStorage<string[]>(
    "selectedRepos",
    [],
  );

  return { selectedRepos, setSelectedRepos };
}
