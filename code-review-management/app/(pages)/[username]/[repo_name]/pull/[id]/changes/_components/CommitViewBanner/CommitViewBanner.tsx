import { useParams, useRouter } from "next/navigation";
import { PullParams } from "@/types/routing.types";
import { useCommitPickerContext } from "../../../_contexts/CommitPickerContext";
import Image from "next/image";
import InfoIcon from "@/public/icons/info.svg";
import styles from "./CommitViewBanner.module.css";

export default function CommitViewBanner({ sha }: { sha: string }) {
  const router = useRouter();
  const { setSelectedSha } = useCommitPickerContext();
  const { username, repo_name, id } = useParams<PullParams>();

  return (
    <div className={styles.banner} data-testid="commit-view-banner">
      <Image src={InfoIcon} alt="Info" className={styles.infoIcon} />
      Commenting is disabled while viewing commit{" "}
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
