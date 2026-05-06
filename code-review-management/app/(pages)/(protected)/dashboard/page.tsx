"use client";
import { usePullsQueries } from "@/lib/api/queries/usePullsQuery";
import IconTooltip from "@components/IconTooltip/IconTooltip";
import DashboardGrid from "./_components/DashboardGrid/DashboardGrid";
import styles from "./page.module.css";
import LoadingSpinner from "@components/LoadingSpinner/LoadingSpinner";
import { useState } from "react";
import DashboardSearchBar from "./_components/DashboardSearch/DashboardSearchBar";
import DashboardSidebar from "./_components/DashboardSidebar/DashboardSidebar";
import { processPulls } from "./_utils/pulls-utils";
import { useLocalStorage } from "usehooks-ts";
import { useAutoFetchAllPages } from "@/lib/api/hooks/useAutoFetchAllPages";
import TabFilterRow from "./_components/TabFilterRow/TabFilterRow";
import { getFilterObj, DashboardTabFilter } from "@/lib/filter-utils";

// Dashboard page at /dashboard
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTabFilter>(
    getFilterObj("all"),
  );

  const pullsQueries = usePullsQueries(activeTab.filter_name);

  // The query for the current tab filter (active tab) gets active query
  const activePullsQuery = pullsQueries.get(activeTab.filter_name);
  if (!activePullsQuery) {
    throw new Error(`Missing pulls query for tab: ${activeTab.filter_name}`);
  }

  // Fetch everything for the active tab
  const { data, fetchNextPage, hasNextPage, isFetching, isPending } =
    activePullsQuery;
  useAutoFetchAllPages(hasNextPage, isFetching, fetchNextPage);

  const [searchString, setSearchString] = useState("");
  const [appliedSearchString, setAppliedSearchString] = useState("");
  const [selectedRepos, setSelectedRepos] = useLocalStorage<string[]>(
    "selectedRepos",
    [],
  );
  const repoSet = new Set(Array.isArray(selectedRepos) ? selectedRepos : []);

  const pulls = data?.pages.flatMap((page) => page.data) ?? [];
  const processedPulls = processPulls(pulls, searchString, repoSet);

  return (
    <div className={styles.page}>
      <IconTooltip id="user-icon-tooltip" />
      <DashboardSidebar
        selectedRepos={selectedRepos}
        setSelectedRepos={setSelectedRepos}
      />
      <div className={styles.pageBody}>
        <TabFilterRow
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pullsQueries={pullsQueries}
        />
        <DashboardSearchBar
          searchString={searchString}
          setSearchString={setSearchString}
          appliedSearchString={appliedSearchString}
          setAppliedSearchString={setAppliedSearchString}
        />
        <DashboardGrid pulls={processedPulls} />
        {(isPending || hasNextPage) &&
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
    </div>
  );
}
