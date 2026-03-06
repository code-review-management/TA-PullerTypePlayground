import { useParams } from "next/navigation";
import HeaderButton from "@/app/(pages)/_components/HeaderButton/HeaderButton";
import PageHeader from "@/app/(pages)/_components/PageHeader/PageHeader";

export default function PRChangesHeader() {
  const params = useParams();
  const { username, repo_name, id } = params;

  const rightChildren = (
    <>
      <HeaderButton
        href={`/${username}/${repo_name}/pull/${id}`}
        variant="secondary"
      >
        View pull request
      </HeaderButton>
      <HeaderButton
        href={`/${username}/${repo_name}/pull/${id}/changes`}
        variant="secondary"
      >
        Add review
      </HeaderButton>
      <HeaderButton>Merge</HeaderButton>
    </>
  );

  return <PageHeader rightChildren={rightChildren} />;
}
