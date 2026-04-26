import { useParams, useRouter } from "next/navigation";
import { PullParams } from "@/types/routing.types";
import { useChangesViewMode } from "../../_hooks/useChangesViewMode";
import { useCommitPickerContext } from "../../../_contexts/CommitPickerContext";
import Image from "next/image";
import InfoIcon from "@/public/icons/info.svg";
import styles from "./CommitViewBanner.module.css";

export default function CommitViewBanner({ sha }: { sha: string }) {
  const router = useRouter();
  const { username, repo_name, id } = useParams<PullParams>();
  const { setSelectedSha } = useCommitPickerContext();
  const { mode } = useChangesViewMode();

  const message =
    mode === "cumulative-commit"
      ? `showing all changes up to`
      : `viewing commit`;

  return (
    <div className={styles.banner} data-testid="commit-view-banner">
      <Image src={InfoIcon} alt="Info" className={styles.infoIcon} />
      Commenting disabled &mdash; {message}
      <span className={styles.sha}>{sha.slice(0, 7)}</span>
      <button
        className={styles.backButton}
        onClick={() => {
          setSelectedSha(null);
          router.push(`/${username}/${repo_name}/pull/${id}/changes`);
        }}
      >
        Back to all changes
      </button>
    </div>
  );
}
