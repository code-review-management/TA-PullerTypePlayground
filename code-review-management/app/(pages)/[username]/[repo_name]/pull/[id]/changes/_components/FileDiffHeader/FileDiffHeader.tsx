import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { FileData } from "react-diff-view";
import { FileDiff } from "@/types/github.types";
import ChevronDownIcon from "@/public/icons/chevron_down.svg";
import ChevronRightIcon from "@/public/icons/chevron_right.svg";
import FileStatusChip from "../FileStatusChip/FileStatusChip";
import styles from "./FileDiffHeader.module.css";

export default function FileDiffHeader({
  fileMeta,
  diffType,
  oldPath,
  newPath,
  isExpanded,
  setIsExpanded,
}: {
  fileMeta?: FileDiff;
  diffType: FileData["type"];
  oldPath: string;
  newPath: string;
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div
      className={`${styles.fileDiffHeader} ${!isExpanded ? styles.collapsed : ""}`}
    >
      <Image
        src={isExpanded ? ChevronDownIcon : ChevronRightIcon}
        alt={`Chevron icon pointing ${isExpanded ? "down" : "right"}`}
        className={styles.chevron}
        onClick={() => setIsExpanded((prev) => !prev)}
        data-tooltip-id={`collapse-expand-diff-${oldPath}-${newPath}`}
        data-tooltip-content={isExpanded ? "Collapse" : "Expand"}
        data-tooltip-place="bottom"
        data-tooltip-delay-show={100}
      />
      <span className={styles.filename}>
        {diffType === "delete" ? oldPath : newPath}
      </span>
      {fileMeta && (
        <>
          <ChangeCount
            additions={fileMeta.additions}
            deletions={fileMeta.deletions}
          />
          <FileStatusChip status={fileMeta.status} />
        </>
      )}
    </div>
  );
}

function ChangeCount({
  additions,
  deletions,
}: {
  additions: number;
  deletions: number;
}) {
  if (additions < 1 && deletions < 1) return null;

  return (
    <div className={styles.lineNumbers}>
      {deletions > 0 && <p className={styles.deletions}>-{deletions}</p>}
      {additions > 0 && <p className={styles.additions}>+{additions}</p>}
    </div>
  );
}
