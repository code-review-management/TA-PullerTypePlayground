import styles from "./DashboardSidebar.module.css";
import MOCK_REPOS from "@/mocks/repos.json";
import { Repo } from "@/types/github.types";
import { useState } from "react";
import CollapsibleRepoList from "../CollapsibleRepoList/CollapsibleRepoList";
import { sortReposByOrg } from "../../_utils/repo-utils";

/**
 * Sidebar displayed on the left of the dashboard page with repo filter options.
 */
export default function DashboardSidebar() {
  const [selectedRepos, setSelectedRepos] = useState<Set<string>>(new Set());
  const fullRepoList = MOCK_REPOS.data as Repo[];
  const mappedRepoList = sortReposByOrg(fullRepoList);

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
      </div>
      <div className={styles.sideBorder} />
    </div>
  );
}
