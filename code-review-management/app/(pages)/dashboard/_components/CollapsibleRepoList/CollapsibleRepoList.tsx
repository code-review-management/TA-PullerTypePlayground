import Checkbox from "@/app/(pages)/_components/Checkbox/Checkbox";
import styles from "./CollapsibleRepoList.module.css";

export default function CollapsibleRepoList({
  mappedRepoList,
  onCheckboxChange,
}: {
  mappedRepoList: Map<string, string[]>;
  onCheckboxChange: (name: string, isChecked: boolean) => void;
}) {
  return Array.from(mappedRepoList.keys()).map((owner: string) => (
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
  ));
}
