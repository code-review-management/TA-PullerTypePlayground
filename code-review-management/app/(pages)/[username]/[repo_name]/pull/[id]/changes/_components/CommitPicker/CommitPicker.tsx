import { formatDate } from "../../../_utils/date-utils";
import MOCK_COMMITS from "@/mocks/commits.json";
import PopoverContent from "@components/PopoverContent/PopoverContent";
import styles from "./CommitPicker.module.css";

export default function CommitPicker() {
  return (
    <PopoverContent>
      <div className={styles.container}>
        <p className={styles.title}>
          Commits <span className={styles.count}>{MOCK_COMMITS.length}</span>
        </p>
        <div>
          <label className={styles.option}>
            <CommitPickerRadio />
            <span className={styles.message}>Show all changes</span>
          </label>
          {MOCK_COMMITS.map((commit) => (
            <label key={commit.sha} className={styles.option}>
              <CommitPickerRadio />
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

function CommitPickerRadio() {
  return <input type="radio" name="commit" required className={styles.radio} />;
}
