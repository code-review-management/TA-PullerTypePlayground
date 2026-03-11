import { useMergeMutation } from "@/lib/api/mutations/useMergeMutation";
import { useMergeContext } from "../_contexts/MergeContext";
import toast from "react-hot-toast";

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
    mutate(
      {
        merge_method: mergeMethod,
        commit_title: commitTitle ?? "",
        commit_message: commitDescription,
      },
      {
        onSuccess: () => {
          toast.success("Pull request successfully merged.");
        },
      },
    );
  };

  return { handleSubmit, isMergePending, isMergeError };
}
