import styles from "./DashboardSidebar.module.css";
import MOCK_REPOS from "@/mocks/repos.json";
import { Repo } from "@/types/github.types";
import Checkbox from "@/app/(pages)/_components/Checkbox/Checkbox";
import { useState } from "react";

function sortReposByOrg(repos: Repo[]) {
  const mappedRepos = new Map<string, string[]>();
  for (const repo of repos) {
    const [owner, name] = repo.full_name.split("/");
    if (mappedRepos.get(owner)) {
      mappedRepos.get(owner)!.push(name);
    } else {
      mappedRepos.set(owner, [name]);
    }
  }
  return mappedRepos;
}

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
          <div className={styles.repoListSection} key={owner}>
            <h5 className={styles.ownerName}>{owner}</h5>
            <form className={styles.repoList}>
              {mappedRepoList.get(owner)?.map((repoName) => (
                <div key={repoName} className={styles.repoListEntry}>
                  <Checkbox
                    id={repoName}
                    name={repoName}
                    onChange={onCheckboxChange}
                  />
                  <label htmlFor={repoName}>{repoName}</label>
                </div>
              ))}
            </form>
          </div>
        ))}
      </div>
      <div className={styles.sideBorder} />
    </div>
  );
}
