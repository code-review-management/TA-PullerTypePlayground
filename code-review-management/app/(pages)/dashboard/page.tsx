"use client";
import { usePullsQuery } from "@/lib/api/queries/usePullsQuery";
import IconTooltip from "../_components/IconTooltip/IconTooltip";
import DashboardGrid from "./_components/DashboardGrid/DashboardGrid";
import styles from "./page.module.css";
import LoadingSpinner from "../_components/LoadingSpinner/LoadingSpinner";
import { useState } from "react";

export default function Dashboard() {
  const { data, fetchNextPage, hasNextPage, isFetching, isPending } =
    usePullsQuery();
  const [searchString, setSearchString] = useState("");

  const pulls = data?.pages.flatMap((page) => page.data);

  return (
    <div className={styles.page}>
      <IconTooltip id="user-icon-tooltip" />
      <div className={styles.repoSideBar} />
      {isPending ? (
        <LoadingSpinner />
      ) : (
        <div className={styles.pageBody}>
          <input value={searchString} onChange={(e) => setSearchString(e.target.value)}></input>
          <DashboardGrid
            pulls={pulls}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
          />
          {hasNextPage &&
            (isFetching ? (
              <div className={styles.loadingSpinnerWrapper}>
                <LoadingSpinner />
              </div>
            ) : (
              <button
                onClick={() => fetchNextPage()}
                className={styles.moreButton}
              >
                Load more
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
