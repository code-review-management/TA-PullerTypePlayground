import { useParams, useRouter } from "next/navigation";
import { Dispatch, ReactNode, SetStateAction, SubmitEvent } from "react";
import { PullParams } from "@/types/routing.types";
import { Commit, PullRequest } from "@/types/github.types";
import { useAutoFetchAllPages } from "@/lib/api/hooks/useAutoFetchAllPages";
import { useListCommitsQuery } from "@/lib/api/queries/useListCommitsQuery";
import { useCommitPickerContext } from "../../../_contexts/CommitPickerContext";
import { useDraftRepliesContext } from "../../_contexts/DraftRepliesContext";
import { useDraftThreadsContext } from "../../_contexts/DraftThreadsContext";
import { clearDrafts } from "../../_utils/comment-utils";
import { formatDate } from "../../../_utils/date-utils";
import PopoverContent from "@components/PopoverContent/PopoverContent";
import SubmitButton from "@components/SubmitButton/SubmitButton";
import styles from "./CommitPicker.module.css";

export default function CommitPicker({ pull }: { pull: PullRequest }) {
  const router = useRouter();
  const { username, repo_name, id } = useParams<PullParams>();
  const { selectedSha, setSelectedSha } = useCommitPickerContext();
  const { setDraftThreads } = useDraftThreadsContext();
  const { setDraftReplies } = useDraftRepliesContext();

  const {
    data: commits,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isPending,
  } = useListCommitsQuery(username, repo_name, id, pull.head?.sha ?? "");
  useAutoFetchAllPages(hasNextPage, isFetching, fetchNextPage);
  // TODO: Handle error.

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const base = `/${username}/${repo_name}/pull/${id}/changes`;
    router.push(selectedSha ? `${base}?sha=${selectedSha}` : base);
    clearDrafts(setDraftThreads, setDraftReplies);
  };

  return (
    <PopoverContent>
      <form className={styles.container} onSubmit={handleSubmit}>
        {isPending ? (
          <div>Loading commits...</div>
        ) : (
          <>
            <p className={styles.title}>
              Commits{" "}
              <span className={styles.count}>{commits?.length ?? ""}</span>
            </p>
            <div className={styles.list}>
              <CommitOption
                value={null}
                checked={selectedSha === null}
                onChange={setSelectedSha}
              >
                <span className={styles.message}>Show all changes</span>
              </CommitOption>
              {commits?.map((commit) => (
                <CommitOption
                  key={commit.sha}
                  value={commit.sha}
                  checked={selectedSha === commit.sha}
                  onChange={setSelectedSha}
                >
                  <CommitDetails commit={commit} />
                </CommitOption>
              ))}
            </div>
            <div className={styles.submit}>
              <SubmitButton label="View changes" isDisabled={false} />
            </div>
          </>
        )}
      </form>
    </PopoverContent>
  );
}

function CommitDetails({ commit }: { commit: Commit }) {
  return (
    <span className={styles.info}>
      <span className={styles.message}>{commit.commit.message}</span>
      <span className={styles.meta}>
        <span className={styles.sha}>{commit.sha.slice(0, 7)}</span>
        <span>{commit.commit.author.name}</span>
        <span>{formatDate(new Date(commit.commit.author.date))}</span>
      </span>
    </span>
  );
}

function CommitOption({
  value,
  checked,
  onChange,
  children,
}: {
  value: string | null;
  checked: boolean;
  onChange: Dispatch<SetStateAction<string | null>>;
  children: ReactNode;
}) {
  return (
    <label className={`${styles.option} ${checked ? styles.checked : ""}`}>
      <input
        type="radio"
        name="commit"
        value={value ?? ""}
        required
        checked={checked}
        onChange={() => onChange(value)}
        className={styles.radio}
      />
      {children}
    </label>
  );
}
