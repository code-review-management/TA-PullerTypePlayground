import React, { useState, useMemo } from 'react';
import styles from './SuggestionModulePopup.module.css';
import { AutoResizingEditor } from './MonacoComponents/AutoResizingEditor/AutoResizingEditor';
import { SuggestionDiffEditor } from './MonacoComponents/SuggestionDiffEditor/SuggestionDiffEditor';

export interface SuggestionPopupProp {
    fullFileCode: string,
    filename: string,
    replaceStartLine: number,
    replaceEndLine: number,
    deletionContent: string,
    additionContent: string,
    onXClicked: () => void
}

export function SuggestionModuleContent({
  fullFileCode,
  filename,
  replaceStartLine, 
  replaceEndLine, 
  deletionContent,
  additionContent,
  onXClicked
} : SuggestionPopupProp) {
  const [updateChanges, setUpdateChanges] = useState(false);

  const { beforeCode, afterCode } = useMemo(() => {
    const lines = fullFileCode.split('\n');
    let before = lines.slice(0, replaceStartLine - 1).join('\n');

    // Check for Windows line endings first, then standard Unix line endings
    if (before.endsWith('\r\n')) {
      before = before.slice(0, -2); // Chops off both \r and \n
    } else if (before.endsWith('\n')) {
      before = before.slice(0, -1); // Chops off just \n
    }
    const after = lines.slice(replaceEndLine).join('\n');
    
    return { beforeCode: before, afterCode: after };
  }, [fullFileCode, replaceStartLine, replaceEndLine]);

  const fullDeletionContent = beforeCode + deletionContent + afterCode;
  const fullAdditionContent = beforeCode + additionContent + afterCode;
  const handleEditorChange = (newContent: string) => {
    if (newContent !== additionContent) {
      setUpdateChanges(true);
    } else {
      setUpdateChanges(false);
    }
  }

  return(
    <div className={styles.moduleContainer}>
      <div className={styles.popupHeader}>
          <div className={styles.popupLabel}>{"Suggestion on " + filename}</div>
          <div className={styles.buttonContainer}>
            <button className={updateChanges ? styles.updateButtonValid : styles.updateButtonInvalid}>
              Update
            </button>
            <button className={styles.commitButton}>
              Commit
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
        originalCode={deletionContent}
        modifiedCode={additionContent}
        beforeCode={beforeCode}
        afterCode={afterCode}
        filename={filename}
        onCodeChange={handleEditorChange}
      />
      </div>
    </div>
  );
}