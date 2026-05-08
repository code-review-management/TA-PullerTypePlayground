import { useState } from "react";
import styles from "./SuggestionModulePopup.module.css";
import { SuggestionDiffEditor } from "./_components/SuggestionDiffEditor";
import { SuggestionCommentUpdateRequest } from "@/types/request.types";
import { useUpdateGeminiSuggestionMutation } from "@/lib/api/mutations/useUpdateGeminiSuggestionMutation";
import { useParams } from "next/navigation";
import { PullParams } from "@/types/routing.types";
import { useCommitGeminiSuggestionMutation } from "@/lib/api/mutations/useCommitGeminiSuggestionMutation";

export interface SuggestionPopupProp {
  commentID: number;
  threadLine: number;
  fullFileCode: string;
  filename: string;
  replaceStartLine: number;
  replaceEndLine: number;
  deletionContent: string;
  additionContent: string;
  onXClicked: () => void;
}

export function SuggestionModuleContent({
  commentID,
  threadLine,
  fullFileCode,
  filename,
  replaceStartLine,
  replaceEndLine,
  deletionContent,
  additionContent,
  onXClicked,
}: SuggestionPopupProp) {
  const { username, repo_name, id } = useParams<PullParams>();
  const { mutate: updateMutation, isPending: isUpdatePending } =
    useUpdateGeminiSuggestionMutation(username, repo_name, id);
  const { mutate: commitMutation, isPending: isCommitPending } =
    useCommitGeminiSuggestionMutation(username, repo_name, id);

  const hasCarriageReturn: boolean = fullFileCode.indexOf("\r") !== -1;
  const joinToken: string = hasCarriageReturn ? "\r\n" : "\n";

  const [updateChanges, setUpdateChanges] = useState(false);
  const [beforeCode, setBeforeCode] = useState(() => {
    const lines = fullFileCode.split(/\r?\n/);
    const before = lines.slice(0, replaceStartLine).join(joinToken);
    return before;
  });

  const [afterCode, setAfterCode] = useState(() => {
    const lines = fullFileCode.split(/\r?\n/);
    return lines.slice(replaceEndLine).join(joinToken);
  });

  const [originalCode, setOriginalCode] = useState(deletionContent);
  const [modifiedCode, setModifiedCode] = useState(additionContent);

  /**
   *  This is the function we send to components to report back to this component
   *  if a change was made. It updates the code regions (bound changes also effect code)
   */
  const handleEditorChange = (
    newBeforeCode: string,
    newOriginalCode: string,
    newModifiedCode: string,
    newAfterCode: string,
  ) => {
    if (
      newModifiedCode !== additionContent ||
      newOriginalCode !== deletionContent
    ) {
      setUpdateChanges(true);
    } else {
      setUpdateChanges(false);
    }

    setBeforeCode(newBeforeCode);
    setOriginalCode(newOriginalCode);
    setModifiedCode(newModifiedCode);
    setAfterCode(newAfterCode);
  };

  /**
   *  Function call when update button is clicked
   *  For redundency, we handle the carriage return
   *  We then use a mutation to request our backend to update the comment
   */
  const onUpdateClicked = () => {
    if (!updateChanges) return;

    const beforeCodeLength: number = beforeCode.split("\n").length;
    const relativeLineLocation: number = beforeCodeLength + 1 - threadLine;

    const cleanedOriginalCode = hasCarriageReturn
      ? originalCode.replace(/\r?\n/g, "\r\n")
      : originalCode.replace(/\r/g, "");

    const cleanedModifiedCode = hasCarriageReturn
      ? modifiedCode.replace(/\r?\n/g, "\r\n")
      : modifiedCode.replace(/\r/g, "");

    const suggestionData: SuggestionCommentUpdateRequest = {
      githubCommentId: commentID,
      deletionContent: cleanedOriginalCode,
      additionContent: cleanedModifiedCode,
      relativeLineLocation: relativeLineLocation,
    };

    updateMutation(suggestionData);
  };

  /**
   * This function is called when commit button is clicked
   * It cleans the code and handles carriage return
   * It sends the combined regions to commit
   */
  const onCommitClicked = () => {
    const beforeCodeLength: number = beforeCode.split("\n").length;
    const relativeLineLocation: number = beforeCodeLength + 1 - threadLine;

    const cleanedOriginalCode = hasCarriageReturn
      ? originalCode.replace(/\r?\n/g, "\r\n")
      : originalCode.replace(/\r/g, "");

    const cleanedModifiedCode = hasCarriageReturn
      ? modifiedCode.replace(/\r?\n/g, "\r\n")
      : modifiedCode.replace(/\r/g, "");

    const cleanedBeforeCode = hasCarriageReturn
      ? beforeCode.replace(/\r?\n/g, "\r\n")
      : beforeCode.replace(/\r/g, "");

    const cleanedAfterCode = hasCarriageReturn
      ? afterCode.replace(/\r?\n/g, "\r\n")
      : afterCode.replace(/\r/g, "");

    const suggestionData: SuggestionCommentUpdateRequest = {
      githubCommentId: commentID,
      deletionContent: cleanedOriginalCode,
      additionContent: cleanedModifiedCode,
      relativeLineLocation: relativeLineLocation,
    };

    const fileContent =
      cleanedBeforeCode + cleanedModifiedCode + cleanedAfterCode;

    /**
     * Function applied after success in commit suggestion
     * It closes the window if the suggestion is taken
     */
    commitMutation(
      {
        filename,
        content: fileContent,
        suggestionData,
      },
      {
        onSuccess: () => onXClicked(),
      },
    );
  };

  return (
    <div className={styles.moduleContainer}>
      <div className={styles.popupHeader}>
        <div className={styles.popupLabel}>{"Suggestion on " + filename}</div>
        <div className={styles.buttonContainer}>
          <button
            className={
              updateChanges
                ? styles.updateButtonValid
                : styles.updateButtonInvalid
            }
            onClick={onUpdateClicked}
          >
            {isUpdatePending ? "Updating..." : "Update"}
          </button>
          <button className={styles.commitButton} onClick={onCommitClicked}>
            {isCommitPending ? "Committing..." : "Commit"}
          </button>
          <button
            className={styles.closeButton}
            onClick={onXClicked}
            aria-label="Close popup"
          >
            ✕
          </button>
        </div>
      </div>

      <div className={styles.editorContainer}>
        <SuggestionDiffEditor
          originalCode={originalCode}
          modifiedCode={modifiedCode}
          beforeCode={beforeCode}
          afterCode={afterCode}
          hasCarriageReturn={hasCarriageReturn}
          filename={filename}
          onCodeChange={handleEditorChange}
        />
      </div>
    </div>
  );
}
