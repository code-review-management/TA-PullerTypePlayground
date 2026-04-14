import styles from "./DashboardSidebar.module.css";
import MOCK_REPOS from "@/mocks/repos.json";
import { Repo } from "@/types/github.types";
import Checkbox from "@/app/(pages)/_components/Checkbox/Checkbox";
import { useState } from "react";

export default function DashboardSidebar() {
  const [selectedRepos, setSelectedRepos] = useState<Set<string>>(new Set());
  const repoList = MOCK_REPOS.data as Repo[];

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
        <form className={styles.repoList}>
          {repoList.map((repo) => (
            <div key={repo.id} className={styles.repoListEntry}>
              <Checkbox
                id={repo.id.toString()}
                name={repo.name}
                onChange={onCheckboxChange}
              />
              <label htmlFor={repo.id.toString()}>{repo.name}</label>
            </div>
          ))}
        </form>
      </div>
      <div className={styles.sideBorder} />
    </div>
  );
}
