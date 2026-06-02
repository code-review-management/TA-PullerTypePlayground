import { useLocalStorage } from "usehooks-ts";

export function useExpandedOwners() {
  const [expandedOwners, setExpandedOwners] = useLocalStorage<string[]>(
    "expandedOwners",
    [],
  );
  return { expandedOwners, setExpandedOwners };
}
