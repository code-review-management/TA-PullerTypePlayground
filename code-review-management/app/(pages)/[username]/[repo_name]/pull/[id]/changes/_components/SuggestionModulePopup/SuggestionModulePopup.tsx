import React, { useState } from "react";
import styles from "./SuggestionModulePopup.module.css";
import { SuggestionDiffEditor } from "./MonacoComponents/SuggestionDiffEditor/SuggestionDiffEditor";
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
  const {
    mutate: commitMutation,
    isPending: isCommitPending,
    isSuccess: isCommitSuccess,
  } = useCommitGeminiSuggestionMutation(username, repo_name, id);

  const [updateChanges, setUpdateChanges] = useState(false);
  const [beforeCode, setBeforeCode] = useState(() => {
    const lines = fullFileCode.split("\n");
    let before = lines.slice(0, replaceStartLine - 1).join("\n");
    return before;
  });

  const [afterCode, setAfterCode] = useState(() => {
    const lines = fullFileCode.split("\n");
    return lines.slice(replaceEndLine).join("\n");
  });

  // 2. Initialize the original/modified states with the incoming props
  const [originalCode, setOriginalCode] = useState(deletionContent);
  const [modifiedCode, setModifiedCode] = useState(additionContent);

  // 3. Unified callback for both typing AND expanding regions
  const handleEditorChange = (
    newBeforeCode: string,
    newOriginalCode: string,
    newModifiedCode: string,
    newAfterCode: string,
  ) => {
    // Check if the user has modified the core suggestion text
    if (
      newModifiedCode !== additionContent ||
      newOriginalCode !== deletionContent
    ) {
      setUpdateChanges(true);
    } else {
      setUpdateChanges(false);
    }

    // Update all 4 states so the editor re-renders with the new boundaries
    setBeforeCode(newBeforeCode);
    setOriginalCode(newOriginalCode);
    setModifiedCode(newModifiedCode);
    setAfterCode(newAfterCode);
  };

  const onUpdateClicked = () => {
    if (!updateChanges) return;

    const beforeCodeLength: number = beforeCode.split("\n").length;
    const relativeLineLocation: number = beforeCodeLength + 1 - threadLine;
    const suggestionData: SuggestionCommentUpdateRequest = {
      githubCommentId: commentID,
      deletionContent: originalCode,
      additionContent: modifiedCode,
      relativeLineLocation: relativeLineLocation,
    };

    updateMutation(suggestionData);
  };

  const onCommitClicked = () => {
    const beforeCodeLength: number = beforeCode.split("\n").length;
    const relativeLineLocation: number = beforeCodeLength + 1 - threadLine;
    const suggestionData: SuggestionCommentUpdateRequest = {
      githubCommentId: commentID,
      deletionContent: originalCode,
      additionContent: modifiedCode,
      relativeLineLocation: relativeLineLocation,
    };
    const fileContent = beforeCode + modifiedCode + afterCode;

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
          filename={filename}
          onCodeChange={handleEditorChange}
        />
      </div>
    </div>
  );
}
