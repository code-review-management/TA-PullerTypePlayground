import styles from "./DashboardSidebar.module.css";
import { useState } from "react";
import CollapsibleRepoList from "../CollapsibleRepoList/CollapsibleRepoList";
import { sortReposByOrg } from "../../_utils/repo-utils";
import { useReposQuery } from "@/lib/api/queries/useReposQuery";
import { useAutoFetchAllPages } from "@/lib/api/hooks/useAutoFetchAllPages";
import LoadingSpinner from "@components/LoadingSpinner/LoadingSpinner";

/**
 * Sidebar displayed on the left of the dashboard page with repo filter options.
 */
export default function DashboardSidebar() {
  const { data, fetchNextPage, hasNextPage, isFetching, isPending } =
    useReposQuery();
  useAutoFetchAllPages(hasNextPage, isFetching, fetchNextPage);

  const [selectedRepos, setSelectedRepos] = useState<Set<string>>(new Set());
  const mappedRepoList = sortReposByOrg(data || []);

  const onCheckboxChange = (name: string, isChecked: boolean) => {
    const newSelectedRepos = new Set(selectedRepos);
    if (isChecked) {
      newSelectedRepos.add(name);
    } else {
      newSelectedRepos.delete(name);
    }
    console.log(newSelectedRepos);
    setSelectedRepos(newSelectedRepos);
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
          />
        ))}
        {(isPending || (hasNextPage && isFetching)) && <LoadingSpinner />}
      </div>
      <div className={styles.sideBorder} />
    </div>
  );
}
