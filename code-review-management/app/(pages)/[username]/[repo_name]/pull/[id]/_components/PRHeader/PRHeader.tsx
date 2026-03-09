import { useParams } from "next/navigation";
import PageHeader from "@/app/(pages)/_components/PageHeader/PageHeader";
import PRHeaderActions from "../PRHeaderActions/PRHeaderActions";

/**
 * Header for PR view page.
 */
export default function PRHeader() {
  const params = useParams();
  const { username, repo_name, id } = params;

  const rightChildren = (
    <PRHeaderActions
      viewHref={`/${username}/${repo_name}/pull/${id}/changes`}
      viewLabel="View files"
    />
  );

  return <PageHeader rightChildren={rightChildren} />;
}
