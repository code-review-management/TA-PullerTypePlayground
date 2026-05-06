"use client";
import Divider from "@/app/(pages)/_components/Divider/Divider";
import PullBodyDescription from "./_components/PullBodyDescription/PullBodyDescription";
import PullBodyHeader from "./_components/PullBodyHeader/PullBodyHeader";
import styles from "./page.module.css";
import StatusSection from "./_components/StatusSection/StatusSection";
import Reviewers from "./_components/Reviewers/Reviewers";
import Assignees from "./_components/Assignees/Assignees";
import PRHeader from "./_components/PRHeader/PRHeader";
import { useParams } from "next/navigation";
import { PullParams } from "@/types/routing.types";
import { usePullQuery } from "@/lib/api/queries/usePullQuery";
import PRViewTimeline from "./_components/PRViewTimeline/PRViewTimeline";
// Pull Request View page.
export default function Pull() {
  const params = useParams<PullParams>();
  const { username, repo_name, id } = params;
  const { data, isPending, isError } = usePullQuery(username, repo_name, id);

  // TODO: Replace with proper loading/error UI.
  if (isPending) return <div>Loading pull request...</div>;
  if (isError) return <div>Failed to load pull request.</div>;

  return (
    <div className={styles.page}>
      <PRHeader pull={data} />
      <div className={styles.pageBody}>
        <div className={styles.bodyMain}>
          <PullBodyHeader pullData={data} />
          <Divider />
          <PullBodyDescription
            username={data.user?.login || ""}
            createdAt={data.created_at}
            description={data.body || ""}
            avatarUrl={data.user?.avatar_url || ""}
          />
          <PRViewTimeline username={username} repoName={repo_name} id={id} />
        </div>
        <div className={styles.infoColumn}>
          <StatusSection pullData={data} />
          <Divider />
          <Reviewers requested_reviewers={data.requested_reviewers || []} />
          <Divider />
          <Assignees assignees={data.assignees || []} />
          <Divider />
        </div>
      </div>
    </div>
  );
}
