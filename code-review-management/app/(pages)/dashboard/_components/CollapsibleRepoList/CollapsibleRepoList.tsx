import Checkbox from "@/app/(pages)/_components/Checkbox/Checkbox";
import styles from "./CollapsibleRepoList.module.css";
import Image from "next/image";
import ChevronDownIcon from "@/public/icons/chevron_down.svg";
import ChevronRightIcon from "@/public/icons/chevron_right.svg";
import { useState } from "react";
import IconTooltip from "@/app/(pages)/_components/IconTooltip/IconTooltip";

export default function CollapsibleRepoList({
  owner,
  mappedRepoList,
  onCheckboxChange,
}: {
  owner: string;
  mappedRepoList: Map<string, string[]>;
  onCheckboxChange: (name: string, isChecked: boolean) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={styles.repoListSection} key={owner}>
      <div className={styles.sectionHeader} onClick={() => setIsExpanded((prev) => !prev)}>
        <Image
          src={isExpanded ? ChevronDownIcon : ChevronRightIcon}
          alt={`Chevron icon pointing ${isExpanded ? "down" : "right"}`}
          className={styles.chevron}
        />
        <h5 className={styles.ownerName}>{owner}</h5>
      </div>
      {isExpanded && (
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
      )}
    </div>
  );
}
