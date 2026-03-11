import { useMergeMutation } from "@/lib/api/mutations/useMergeMutation";
import { useMergeContext } from "../_contexts/MergeContext";

export function useSubmitMerge(
  owner: string,
  repo: string,
  pullNumber: string,
) {
  const { mergeMethod, commitTitle, commitDescription } = useMergeContext();
  const {
    mutate,
    isPending: isMergePending,
    isError: isMergeError,
  } = useMergeMutation(owner, repo, pullNumber);

  const handleSubmit = () => {
    mutate({
      merge_method: mergeMethod,
      commit_title: commitTitle ?? "",
      commit_message: commitDescription,
    });
  };

  return { handleSubmit, isMergePending, isMergeError };
}
