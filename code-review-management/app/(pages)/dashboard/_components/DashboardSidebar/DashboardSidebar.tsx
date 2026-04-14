import styles from "./DashboardSidebar.module.css";
import MOCK_REPOS from "@/mocks/repos.json";
import { Repo } from "@/types/github.types";
import Checkbox from "@/app/(pages)/_components/Checkbox/Checkbox";

export default function DashboardSidebar() {
  const repoList = MOCK_REPOS.data as Repo[];

  return (
    <div className={styles.dashboardSidebar}>
      <div className={styles.sidebarContent}>
        <h4 className={styles.sidebarHeader}>REPOSITORIES</h4>
        <form className={styles.repoList}>
          {repoList.map((repo) => (
            <div key={repo.id} className={styles.repoListEntry}>
              <Checkbox id={repo.id.toString()} name={repo.name} />
              <label htmlFor={repo.id.toString()}>{repo.name}</label>
            </div>
          ))}
        </form>
      </div>
      <div className={styles.sideBorder} />
    </div>
  );
}
