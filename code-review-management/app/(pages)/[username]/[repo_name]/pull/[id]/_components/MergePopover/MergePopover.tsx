import { useEffect } from "react";
import { useMergeContext } from "../../_contexts/MergeContext";
import { PRMergeRequest } from "@/types/request.types";
import { PullRequest } from "@/types/github.types";
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

export default function MergePopover({ pull }: { pull: PullRequest }) {
  const {
    mergeMethod,
    setMergeMethod,
    commitMessage,
    setCommitMessage,
    commitDescription,
    setCommitDescription,
  } = useMergeContext();

  const handleSubmit = (formData: FormData) => {
    console.log(formData.get("merge-method"));
    console.log(formData.get("commit-message"));
    console.log(formData.get("commit-description"));
  };

  const mergeRadioOptions: RadioOption<PRMergeRequest["merge_method"]>[] =
    MERGE_METHOD_INPUTS.map(({ method, label }) => ({
      value: method,
      label,
    }));

  useEffect(() => {
    setCommitMessage((prev) =>
      prev === null ? `(#${pull.number}) ${pull.title}` : prev,
    );
  }, [setCommitMessage, pull.number, pull.title]);

  return (
    <PopoverContent>
      <form className={styles.form} action={handleSubmit}>
        <div className={styles.section}>
          <p className={styles.title}>Merge method</p>
          <RadioGroup
            name="merge-method"
            options={mergeRadioOptions}
            selected={mergeMethod}
            onChange={(method) => setMergeMethod(method)}
          />
        </div>

        <label className={styles.section}>
          <p className={styles.title}>Commit message</p>
          <PlainEditor
            name="commit-message"
            defaultValue={commitMessage ?? ""}
            onChange={(body) => setCommitMessage(body)}
            isSingleLine
          />
        </label>

        <label className={styles.section}>
          <p className={styles.title}>Commit description</p>
          <PlainEditor
            name="commit-description"
            defaultValue={commitDescription}
            onChange={(body) => setCommitDescription(body)}
          />
        </label>

        <div className={styles.submit}>
          <SubmitButton label="Confirm merge" isDisabled={false} />
        </div>
      </form>
    </PopoverContent>
  );
}
