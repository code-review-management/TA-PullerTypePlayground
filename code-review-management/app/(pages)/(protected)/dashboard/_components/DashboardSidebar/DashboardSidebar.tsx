import styles from "./DashboardSidebar.module.css";
import { Dispatch, SetStateAction } from "react";
import CollapsibleRepoList from "../CollapsibleRepoList/CollapsibleRepoList";
import { sortReposByOrg } from "../../_utils/repo-utils";
import { useReposQuery } from "@/lib/api/queries/useReposQuery";
import { useAutoFetchAllPages } from "@/lib/api/hooks/useAutoFetchAllPages";
import LoadingSpinner from "@components/LoadingSpinner/LoadingSpinner";
import { useLocalStorage } from "usehooks-ts";

/**
 * Sidebar displayed on the left of the dashboard page with repo filter options.
 * @param selectedRepos List of full names of selected repos
 * @param setSelectedRepos Setter for list of full names of selected repos
 */
export default function DashboardSidebar({
  selectedRepos,
  setSelectedRepos,
}: {
  selectedRepos: string[];
  setSelectedRepos: Dispatch<SetStateAction<string[]>>;
}) {
  const { data, fetchNextPage, hasNextPage, isFetching, isPending } =
    useReposQuery();
  useAutoFetchAllPages(hasNextPage, isFetching, fetchNextPage);

  const [expandedOwners, setExpandedOwners] = useLocalStorage<string[]>(
    "expandedOwners",
    [],
  );

  const mappedRepoList = sortReposByOrg(data || []);
  const repoSet = new Set(Array.isArray(selectedRepos) ? selectedRepos : []);
  const expandedSet = new Set(
    Array.isArray(expandedOwners) ? expandedOwners : [],
  );

  const onCheckboxChange = (name: string, isChecked: boolean) => {
    if (isChecked && !repoSet.has(name)) {
      const newSelectedRepos = [...selectedRepos];
      newSelectedRepos.push(name);
      setSelectedRepos(newSelectedRepos);
    } else if (!isChecked && repoSet.has(name)) {
      setSelectedRepos(selectedRepos.filter((repoName) => repoName !== name));
    }
  };

  const onExpandedChange = (owner: string, isCollapsed: boolean) => {
    if (isCollapsed && !expandedSet.has(owner)) {
      const newCollapsedOwners = [...expandedOwners];
      newCollapsedOwners.push(owner);
      setExpandedOwners(newCollapsedOwners);
    } else if (!isCollapsed && expandedSet.has(owner)) {
      setExpandedOwners(expandedOwners.filter((item) => item !== owner));
    }
  };

  return (
    <div className={styles.dashboardSidebar}>
      <div className={styles.sidebarContent}>
        <h4 className={styles.sidebarHeader}>REPOSITORIES</h4>
        {Array.from(mappedRepoList.keys()).map((owner: string) => (
          <CollapsibleRepoList
            key={owner}
            owner={owner}
            mappedRepoList={mappedRepoList}
            onCheckboxChange={onCheckboxChange}
            selectedRepos={repoSet}
            isExpanded={expandedSet.has(owner)}
            onExpandedChange={onExpandedChange}
          />
        ))}
        {(isPending || (hasNextPage && isFetching)) && <LoadingSpinner />}
      </div>
      <div className={styles.sideBorder} />
    </div>
  );
}
