import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { FileData } from "react-diff-view";
import ChevronDownIcon from "@/public/icons/chevron_down.svg";
import ChevronRightIcon from "@/public/icons/chevron_right.svg";
import styles from "./FileDiffHeader.module.css";

export default function FileDiffHeader({
  diffType,
  oldPath,
  newPath,
  isExpanded,
  setIsExpanded,
}: {
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
    </div>
  );
}
