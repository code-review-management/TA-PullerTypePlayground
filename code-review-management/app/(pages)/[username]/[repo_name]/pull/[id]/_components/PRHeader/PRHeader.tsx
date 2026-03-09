import { useParams } from "next/navigation";
import PageHeader from "@/app/(pages)/_components/PageHeader/PageHeader";
import PRHeaderActionButtons from "../PRHeaderActionButtons/PRHeaderActionButtons";

/**
 * Header for PR view page.
 * TODO: Add callback as onClick to Merge button.
 */
export default function PRHeader() {
  const params = useParams();
  const { username, repo_name, id } = params;

  const rightChildren = (
    <PRHeaderActionButtons
      viewHref={`/${username}/${repo_name}/pull/${id}/changes`}
      viewLabel="View files"
    />
  );

  return <PageHeader rightChildren={rightChildren} />;
}
