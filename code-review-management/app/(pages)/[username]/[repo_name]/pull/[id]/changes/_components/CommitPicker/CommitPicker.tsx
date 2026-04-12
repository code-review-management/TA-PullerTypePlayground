import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { formatDate } from "../../../_utils/date-utils";
import MOCK_COMMITS from "@/mocks/commits.json";
import PopoverContent from "@components/PopoverContent/PopoverContent";
import SubmitButton from "@components/SubmitButton/SubmitButton";
import styles from "./CommitPicker.module.css";

const ALL_CHANGES = "all-changes";

export default function CommitPicker() {
  const [selected, setSelected] = useState(ALL_CHANGES);

  return (
    <PopoverContent>
      <form
        className={styles.container}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <p className={styles.title}>
          Commits <span className={styles.count}>{MOCK_COMMITS.length}</span>
        </p>
        <div className={styles.list}>
          <CommitOption
            value={ALL_CHANGES}
            checked={selected === ALL_CHANGES}
            onChange={setSelected}
          >
            <span className={styles.message}>Show all changes</span>
          </CommitOption>
          {MOCK_COMMITS.map((commit) => (
            <CommitOption
              key={commit.sha}
              value={commit.sha}
              checked={selected === commit.sha}
              onChange={setSelected}
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
  value: string;
  checked: boolean;
  onChange: Dispatch<SetStateAction<string>>;
  children: ReactNode;
}) {
  return (
    <label className={`${styles.option} ${checked ? styles.checked : ""}`}>
      <input
        type="radio"
        name="commit"
        value={value}
        required
        checked={checked}
        onChange={() => onChange(value)}
        className={styles.radio}
      />
      {children}
    </label>
  );
}
