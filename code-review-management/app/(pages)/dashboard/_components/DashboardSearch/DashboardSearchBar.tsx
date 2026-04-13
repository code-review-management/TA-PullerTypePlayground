import { Dispatch, SetStateAction } from "react";
import styles from "./DashboardSearchBar.module.css";
import Image from "next/image";

export default function DashboardSearchBar({
  searchString,
  setSearchString,
  appliedSearchString,
  setAppliedSearchString,
}: {
  searchString: string;
  setSearchString: Dispatch<SetStateAction<string>>;
  appliedSearchString: string;
  setAppliedSearchString: Dispatch<SetStateAction<string>>;
}) {
  const clearSearch = () => {
    setSearchString("");
    setAppliedSearchString("");
  };

  return (
    <form
      className={styles.searchPullTitleWrapper}
      onSubmit={(e) => {
        e.preventDefault();
        setAppliedSearchString(searchString);
      }}
    >
      <input
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
        className={styles.searchPullTitle}
        placeholder="Search pull requests"
      />
      <div className={styles.searchButtons}>
        {(searchString || appliedSearchString) && (
          <button type="button" onClick={clearSearch}>
            <Image
              src="/icons/cancel_search.svg"
              alt="Cancel search"
              height={24}
              width={24}
            />
          </button>
        )}
        <div className={styles.searchButtonsDivider} />
        <button type="submit">
          <Image src="/icons/search.svg" alt="Search" height={24} width={24} />
        </button>
      </div>
    </form>
  );
}
