"use client";

import { useParams } from "next/navigation";
import { usePullQuery } from "@/lib/api/queries/usePullQuery";
import { PullParams } from "@/types/routing.types";
import { useDraftThreads } from "./_hooks/useDraftThreads";
import { usePublishedThreads } from "./_hooks/usePublishedThreads";
import DiffListView from "./_components/DiffListView/DiffListView";
import styles from "./page.module.css";

export default function Changes() {
  const { username, repo_name, id } = useParams<PullParams>();
  const { draftThreads, setDraftThreads } = useDraftThreads();
  const { publishedThreads } = usePublishedThreads();

  const {
    data: pull,
    isPending,
    isError,
  } = usePullQuery(username, repo_name, id);

  /**
   * TODO: Replace with proper loading/error UI. Move to affected sections
   * instead of returning at the page-level. Remove `!publishedThreads` check
   * once we query from the comments API.
   */
  if (isPending || !publishedThreads) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{pull.title}</h1>
      <DiffListView
        publishedThreads={publishedThreads}
        draftThreads={draftThreads}
        setDraftThreads={setDraftThreads}
      />
    </div>
  );
}
