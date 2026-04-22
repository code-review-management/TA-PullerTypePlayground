"use client";
import { usePullsQuery } from "@/lib/api/queries/usePullsQuery";
import IconTooltip from "../_components/IconTooltip/IconTooltip";
import DashboardGrid from "./_components/DashboardGrid/DashboardGrid";
import styles from "./page.module.css";
import LoadingSpinner from "../_components/LoadingSpinner/LoadingSpinner";
import { useEffect, useState } from "react";
import DashboardSearchBar from "./_components/DashboardSearch/DashboardSearchBar";
import DashboardSidebar from "./_components/DashboardSidebar/DashboardSidebar";
import { sortPullsByUpdated } from "./_utils/pulls-utils";
import { useLocalStorage } from 'usehooks-ts'

export default function Dashboard() {
  const { data, fetchNextPage, hasNextPage, isFetching, isPending } =
    usePullsQuery();
  const [searchString, setSearchString] = useState("");
  const [appliedSearchString, setAppliedSearchString] = useState("");
  const [selectedRepos, setSelectedRepos] = useLocalStorage<string[]>("selectedRepos", []);

  const pulls = data?.pages.flatMap((page) => page.data) ?? [];
  const sortedPulls = sortPullsByUpdated(pulls);

  // Auto fetch all remaining pulls if any filter is applied
  // TODO: Limit by # of returned pulls
  useEffect(() => {
    if (
      (appliedSearchString.length !== 0 || selectedRepos.length !== 0) &&
      hasNextPage &&
      !isFetching
    ) {
      console.log("fetch");
      fetchNextPage();
    }
  }, [
    appliedSearchString,
    selectedRepos,
    hasNextPage,
    isFetching,
    fetchNextPage,
  ]);

  return (
    <div className={styles.page}>
      <IconTooltip id="user-icon-tooltip" />
      <DashboardSidebar
        selectedRepos={selectedRepos}
        setSelectedRepos={setSelectedRepos}
      />
      {isPending ? (
        "Loading dashboard..."
      ) : (
        <div className={styles.pageBody}>
          <DashboardSearchBar
            searchString={searchString}
            setSearchString={setSearchString}
            appliedSearchString={appliedSearchString}
            setAppliedSearchString={setAppliedSearchString}
          />
          <DashboardGrid
            pulls={sortedPulls}
            searchString={appliedSearchString}
            selectedRepos={selectedRepos}
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
