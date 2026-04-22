import Checkbox from "@/app/(pages)/_components/Checkbox/Checkbox";
import styles from "./CollapsibleRepoList.module.css";
import Image from "next/image";
import ChevronDownIcon from "@/public/icons/chevron_down.svg";
import ChevronRightIcon from "@/public/icons/chevron_right.svg";
import { useState } from "react";

/**
 * Collapsible checklist used for a section of list of repos in the repo filters section on the dashboard.
 * @param owner The username or organization name that this section is for.
 * @param mappedRepoList Mapping of owner name to array of repo names
 * @param onCheckboxChange Callback to pass into each checkbox in the the list.
 * @param selectedRepos Set of full names of selected repos. Determines if items in list should be checked
 */
export default function CollapsibleRepoList({
  owner,
  mappedRepoList,
  onCheckboxChange,
  selectedRepos,
}: {
  owner: string;
  mappedRepoList: Map<string, string[]>;
  onCheckboxChange: (name: string, isChecked: boolean) => void;
  selectedRepos: Set<string>;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={styles.repoListSection} key={owner}>
      <div
        className={styles.sectionHeader}
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <Image
          src={isExpanded ? ChevronDownIcon : ChevronRightIcon}
          alt={`Chevron icon pointing ${isExpanded ? "down" : "right"}`}
          className={styles.chevron}
        />
        <h5 className={styles.ownerName}>{owner}</h5>
      </div>
      <form
        className={`${styles.repoList} ${isExpanded && styles.repoListExpanded}`}
      >
        {mappedRepoList.get(owner)?.map((repoName) => (
          <div key={repoName} className={styles.repoListEntry}>
            <Checkbox
              id={`${owner}/${repoName}`}
              name={`${owner}/${repoName}`}
              onChange={onCheckboxChange}
              checked={selectedRepos.has(`${owner}/${repoName}`)}
            />
            <label htmlFor={`${owner}/${repoName}`} className={styles.repoName}>
              {repoName}
            </label>
          </div>
        ))}
      </form>
    </div>
  );
}
