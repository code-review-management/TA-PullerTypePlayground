"use client";
import { usePullsQuery } from "@/lib/api/queries/usePullsQuery";
import IconTooltip from "../_components/IconTooltip/IconTooltip";
import DashboardGrid from "./_components/DashboardGrid/DashboardGrid";
import styles from "./page.module.css";
import LoadingSpinner from "../_components/LoadingSpinner/LoadingSpinner";
import { PullRequestV2 } from "@/types/github.types.wrapper";
import { useEffect } from "react";

export default function Dashboard() {
  const {
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    ...result
  } = usePullsQuery();

  const { data, isPending, isError } = result;

  useEffect(() => {
    console.log('hi')
    if (hasNextPage) {
      console.log("fetch")
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, result])

  const pulls = data?.pages.flatMap((page) => page.data);
  console.log(data, pulls);

  return (
    <div className={styles.page}>
      <IconTooltip id="user-icon-tooltip" />
      <div className={styles.repoSideBar} />
      <div className={styles.pageBody}>
        {isPending ? <LoadingSpinner /> : <DashboardGrid pulls={pulls} />}
      </div>
    </div>
  );
}
