import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useMergeContext } from "../../_contexts/MergeContext";
import { useMergeMutation } from "@/lib/api/mutations/useMergeMutation";
import { useMutationInFlight } from "@/lib/api/hooks/useMutationInFlight";
import { PRMergeRequest } from "@/types/request.types";
import { PullRequest } from "@/types/github.types";
import { PullParams } from "@/types/routing.types";
import LoadingSpinner from "@components/LoadingSpinner/LoadingSpinner";
import RadioGroup, { RadioOption } from "@components/RadioGroup/RadioGroup";
import PlainEditor from "@components/PlainEditor/PlainEditor";
import PopoverContent from "@components/PopoverContent/PopoverContent";
import SubmitButton from "@components/SubmitButton/SubmitButton";
import styles from "./MergePopover.module.css";

const MERGE_METHOD_INPUTS: {
  method: PRMergeRequest["merge_method"];
  label: string;
}[] = [
  { method: "merge", label: "Create a merge commit" },
  { method: "squash", label: "Squash and merge" },
  { method: "rebase", label: "Rebase and merge" },
];

/**
 * Popover to merge a pull request.
 */
export default function MergePopover({ pull }: { pull: PullRequest }) {
  const { username, repo_name, id } = useParams<PullParams>();
  const { mutate } = useMergeMutation(username, repo_name, id);
  const {
    mergeMethod,
    setMergeMethod,
    commitTitle,
    setCommitTitle,
    commitDescription,
    setCommitDescription,
  } = useMergeContext();

  const handleSubmit = () => {
    mutate({
      merge_method: mergeMethod,
      commit_title: commitTitle ?? "",
      commit_message: commitDescription,
    });
  };

  // If the user confirms merge and immediately closes the popover and reopens
  // it, check if there is already an existing merge mutation occurring.
  const isMergePending = useMutationInFlight({
    mutationKey: ["merge", username, repo_name, id],
  });

  const mergeRadioOptions: RadioOption<PRMergeRequest["merge_method"]>[] =
    MERGE_METHOD_INPUTS.map(({ method, label }) => ({
      value: method,
      label,
      disabled: method === "rebase" && !pull.rebaseable,
    }));

  useEffect(() => {
    setCommitTitle((prev) =>
      prev === null
        ? `Merge pull request #${pull.number} from ${pull.base.repo.full_name}`
        : prev,
    );
  }, [setCommitTitle, pull.number, pull.base.repo.full_name]);

  return (
    <PopoverContent>
      <form
        className={styles.form}
        data-method={mergeMethod}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className={styles.section}>
          <p className={styles.title}>Merge method</p>
          <RadioGroup
            name="merge-method"
            options={mergeRadioOptions}
            selected={mergeMethod}
            onChange={(method) => setMergeMethod(method)}
          />
        </div>

        {mergeMethod !== "rebase" && (
          <>
            <label className={styles.section}>
              <p className={styles.title}>Commit title</p>
              <PlainEditor
                name="commit-title"
                value={commitTitle ?? ""}
                onChange={(body) => setCommitTitle(body)}
                isSingleLine
              />
            </label>

            <label className={styles.section}>
              <p className={styles.title}>Commit description</p>
              <PlainEditor
                name="commit-description"
                value={commitDescription}
                onChange={(body) => setCommitDescription(body)}
              />
            </label>
          </>
        )}
        <div className={styles.submit}>
          {isMergePending ? (
            <LoadingSpinner />
          ) : (
            <SubmitButton label="Confirm merge" isDisabled={false} />
          )}
        </div>
      </form>
    </PopoverContent>
  );
}
