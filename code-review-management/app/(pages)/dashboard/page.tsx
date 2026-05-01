"use client";
import { usePullsQueries } from "@/lib/api/queries/usePullsQuery";
import IconTooltip from "../_components/IconTooltip/IconTooltip";
import DashboardGrid from "./_components/DashboardGrid/DashboardGrid";
import styles from "./page.module.css";
import LoadingSpinner from "../_components/LoadingSpinner/LoadingSpinner";
import { useState } from "react";
import DashboardSearchBar from "./_components/DashboardSearch/DashboardSearchBar";
import DashboardSidebar from "./_components/DashboardSidebar/DashboardSidebar";
import { processPulls } from "./_utils/pulls-utils";
import { useLocalStorage } from "usehooks-ts";
import { useAutoFetchAllPages } from "@/lib/api/hooks/useAutoFetchAllPages";
import TabFilterRow from "./_components/TabFilterRow/TabFilterRow";
import {
  createDashboardTabFilter,
  DashboardTabFilter,
} from "./_utils/filter-utils";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTabFilter>(
    createDashboardTabFilter("all"),
  );

  const pullsQueries = usePullsQueries(activeTab.filter_name);

  const activePullsQuery = pullsQueries.get(activeTab.filter_name);
  if (!activePullsQuery) {
    throw new Error(`Missing pulls query for tab: ${activeTab.filter_name}`);
  }

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
