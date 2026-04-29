"use client";
import { usePullsQuery } from "@/lib/api/queries/usePullsQuery";
import IconTooltip from "../_components/IconTooltip/IconTooltip";
import DashboardGrid from "./_components/DashboardGrid/DashboardGrid";
import styles from "./page.module.css";
import LoadingSpinner from "../_components/LoadingSpinner/LoadingSpinner";
import { useState } from "react";
import DashboardSearchBar from "./_components/DashboardSearch/DashboardSearchBar";
import DashboardSidebar from "./_components/DashboardSidebar/DashboardSidebar";
import { sortPullsByUpdated } from "./_utils/pulls-utils";
import { useLocalStorage } from "usehooks-ts";
import { useAutoFetchAllPages } from "@/lib/api/hooks/useAutoFetchAllPages";
import TabFilters from "./_components/TabFilters/TabFilters";
import { Tab } from "./_utils/filter-utils";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const { data, fetchNextPage, hasNextPage, isFetching, isPending } =
    usePullsQuery();
  useAutoFetchAllPages(hasNextPage, isFetching, fetchNextPage);

  const [searchString, setSearchString] = useState("");
  const [appliedSearchString, setAppliedSearchString] = useState("");
  const [selectedRepos, setSelectedRepos] = useLocalStorage<string[]>(
    "selectedRepos",
    [],
  );
  const repoSet = new Set(Array.isArray(selectedRepos) ? selectedRepos : []);

  const pulls = data?.pages.flatMap((page) => page.data) ?? [];
  const sortedPulls = sortPullsByUpdated(pulls);

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
          <TabFilters activeTab={activeTab} setActiveTab={setActiveTab} />
          <DashboardSearchBar
            searchString={searchString}
            setSearchString={setSearchString}
            appliedSearchString={appliedSearchString}
            setAppliedSearchString={setAppliedSearchString}
          />
          <DashboardGrid
            pulls={sortedPulls}
            searchString={appliedSearchString}
            repoSet={repoSet}
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
