import { Dispatch, SetStateAction, useState } from "react";
import { formatDate } from "../../../_utils/date-utils";
import MOCK_COMMITS from "@/mocks/commits.json";
import PopoverContent from "@components/PopoverContent/PopoverContent";
import styles from "./CommitPicker.module.css";

const ALL_CHANGES = "all-changes";

export default function CommitPicker() {
  const [selected, setSelected] = useState(ALL_CHANGES);

  return (
    <PopoverContent>
      <div className={styles.container}>
        <p className={styles.title}>
          Commits <span className={styles.count}>{MOCK_COMMITS.length}</span>
        </p>
        <div>
          <label className={styles.option}>
            <CommitRadio
              value={ALL_CHANGES}
              checked={selected === ALL_CHANGES}
              onChange={setSelected}
            />
            <span className={styles.message}>Show all changes</span>
          </label>
          {MOCK_COMMITS.map((commit) => (
            <label key={commit.sha} className={styles.option}>
              <CommitRadio
                value={commit.sha}
                checked={selected === commit.sha}
                onChange={setSelected}
              />
              <span className={styles.info}>
                <span className={styles.message}>{commit.commit.message}</span>
                <span className={styles.meta}>
                  <span className={styles.sha}>{commit.sha.slice(0, 7)}</span>
                  <span>{commit.commit.author.name}</span>
                  <span>{formatDate(new Date(commit.commit.author.date))}</span>
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>
    </PopoverContent>
  );
}

function CommitRadio({
  value,
  checked,
  onChange,
}: {
  value: string;
  checked: boolean;
  onChange: Dispatch<SetStateAction<string>>;
}) {
  return (
    <input
      type="radio"
      name="commit"
      value={value}
      required
      checked={checked}
      onChange={() => onChange(value)}
      className={styles.radio}
    />
  );
}
