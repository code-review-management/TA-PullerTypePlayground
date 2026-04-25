import { Dispatch, SetStateAction, useRef } from "react";
import SearchIcon from "@/public/icons/search.svg";
import CancelSearchIcon from "@/public/icons/cancel_search.svg";
import Image from "next/image";
import styles from "./FileTreeSearchBar.module.css";

export default function FileTreeSearchBar({
  searchString,
  setSearchString,
}: {
  searchString: string;
  setSearchString: Dispatch<SetStateAction<string>>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchInputWrapper}>
        <Image
          className={styles.searchMagnifierIcon}
          src={SearchIcon}
          alt="Search"
          height={20}
          width={20}
          onClick={() => {
            // Without this, clicking on the magnifier does not focus on the input.
            if (inputRef.current) inputRef.current.focus();
          }}
        />
        <input
          className={styles.searchInput}
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          placeholder="Search files"
          spellCheck={false}
          ref={inputRef}
        />
        {searchString.length > 0 && (
          <button
            className={styles.searchCancelIcon}
            onClick={() => setSearchString("")}
          >
            <Image
              src={CancelSearchIcon}
              alt="Cancel search"
              height={20}
              width={20}
            />
          </button>
        )}
      </div>
    </div>
  );
}
