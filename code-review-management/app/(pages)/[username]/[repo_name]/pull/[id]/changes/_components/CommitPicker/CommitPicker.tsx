import { useParams, useRouter } from "next/navigation";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { PullParams } from "@/types/routing.types";
import { useCommitPickerContext } from "../../../_contexts/CommitPickerContext";
import { formatDate } from "../../../_utils/date-utils";
import MOCK_COMMITS from "@/mocks/commits.json";
import PopoverContent from "@components/PopoverContent/PopoverContent";
import SubmitButton from "@components/SubmitButton/SubmitButton";
import styles from "./CommitPicker.module.css";

export default function CommitPicker() {
  const router = useRouter();
  const { username, repo_name, id } = useParams<PullParams>();
  const { selectedSha, setSelectedSha } = useCommitPickerContext();

  const handleSubmit = () => {
    const BASE_ROUTE = `/${username}/${repo_name}/pull/${id}/changes`;
    if (selectedSha === null) router.push(BASE_ROUTE);
    else router.push(BASE_ROUTE + `?sha=${selectedSha}`);
  };

  return (
    <PopoverContent>
      <form
        className={styles.container}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <p className={styles.title}>
          Commits <span className={styles.count}>{MOCK_COMMITS.length}</span>
        </p>
        <div className={styles.list}>
          <CommitOption
            value={null}
            checked={selectedSha === null}
            onChange={setSelectedSha}
          >
            <span className={styles.message}>Show all changes</span>
          </CommitOption>
          {MOCK_COMMITS.map((commit) => (
            <CommitOption
              key={commit.sha}
              value={commit.sha}
              checked={selectedSha === commit.sha}
              onChange={setSelectedSha}
            >
              <span className={styles.info}>
                <span className={styles.message}>{commit.commit.message}</span>
                <span className={styles.meta}>
                  <span className={styles.sha}>{commit.sha.slice(0, 7)}</span>
                  <span>{commit.commit.author.name}</span>
                  <span>{formatDate(new Date(commit.commit.author.date))}</span>
                </span>
              </span>
            </CommitOption>
          ))}
        </div>
        <div className={styles.submit}>
          <SubmitButton label="View changes" isDisabled={false} />
        </div>
      </form>
    </PopoverContent>
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
