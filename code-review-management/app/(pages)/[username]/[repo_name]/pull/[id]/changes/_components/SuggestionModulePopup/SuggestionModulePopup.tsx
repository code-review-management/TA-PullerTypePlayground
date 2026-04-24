import React, { useState } from 'react';
import styles from './SuggestionModulePopup.module.css';
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

  // 1. LAZY INITIALIZATION: Calculate the regions once when the component mounts
  const [beforeCode, setBeforeCode] = useState(() => {
    const lines = fullFileCode.split('\n');
    let before = lines.slice(0, replaceStartLine - 1).join('\n');
    
    if (before.endsWith('\r\n')) {
      before = before.slice(0, -2);
    } else if (before.endsWith('\n')) {
      before = before.slice(0, -1);
    }
    return before;
  });

  const [afterCode, setAfterCode] = useState(() => {
    const lines = fullFileCode.split('\n');
    return lines.slice(replaceEndLine).join('\n');
  });

  // 2. Initialize the original/modified states with the incoming props
  const [originalCode, setOriginalCode] = useState(deletionContent);
  const [modifiedCode, setModifiedCode] = useState(additionContent);

  // 3. Unified callback for both typing AND expanding regions
  const handleEditorChange = (
    newBeforeCode: string, 
    newOriginalCode: string, 
    newModifiedCode: string, 
    newAfterCode: string
  ) => {
    // Check if the user has modified the core suggestion text
    if (newModifiedCode !== additionContent || newOriginalCode !== deletionContent) {
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
          // 4. IMPORTANT: Pass the STATE variables here, not the initial props!
          originalCode={originalCode}
          modifiedCode={modifiedCode}
          beforeCode={beforeCode}
          afterCode={afterCode}
          filename={filename}
          // Note: make sure this prop name matches what you exported in SuggestionDiffEditor.types.ts
          // (If you renamed it to onExpandRegion in the previous step, use onExpandRegion={handleEditorChange})
          onCodeChange={handleEditorChange} 
        />
      </div>
    </div>
  );
}