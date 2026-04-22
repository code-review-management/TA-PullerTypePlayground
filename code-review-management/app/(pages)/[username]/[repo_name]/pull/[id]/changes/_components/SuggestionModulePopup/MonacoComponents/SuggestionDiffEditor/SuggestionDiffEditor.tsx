import React, { useRef, useState } from 'react';
import { DiffEditor, DiffOnMount } from '@monaco-editor/react';
import styles from './SuggestionDiffEditor.module.css';
import { editor } from 'monaco-editor';

interface SuggestionDiffEditorProps {
  originalCode: string;
  modifiedCode: string;
  beforeCode: string;
  afterCode: string;
  filename: string;
  onCodeChange: (newCode: string) => void;
}

export function SuggestionDiffEditor({ 
  originalCode, 
  modifiedCode, 
  beforeCode,
  afterCode,
  filename,
  onCodeChange 
}: SuggestionDiffEditorProps) {
  const diffEditorRef = useRef<editor.IStandaloneDiffEditor>(null);

  // Helper to safely count lines
  const getLineCount = (str: string) => (str ? str.split('\n').length : 0);

  // Combine the pieces into full files for the Diff Engine
  const fullOriginal = [beforeCode, originalCode, afterCode].filter(Boolean).join('\n');
  const fullModified = [beforeCode, modifiedCode, afterCode].filter(Boolean).join('\n');

  const beforeLines = getLineCount(beforeCode);
  const afterLines = getLineCount(afterCode);
  
  // Calculate the 1-indexed start line for the editable region
  const editableStartLine = beforeLines > 0 ? beforeLines + 1 : 1;

  const handleEditorMount: DiffOnMount = (editorInstance, monaco) => {
    diffEditorRef.current = editorInstance;

    const originalEditor = editorInstance.getOriginalEditor();
    const modifiedEditor = editorInstance.getModifiedEditor();
    
    // Track the dynamically shifting end line of the editable block
    let currentEditableEndLine = editableStartLine + getLineCount(modifiedCode) - 1;
    
    // Create Decoration Collections to manage the greyed-out visual effect
    const modifiedDecorations = modifiedEditor.createDecorationsCollection();
    const originalDecorations = originalEditor.createDecorationsCollection();

    const updateDecorations = () => {
      const modifiedTotalLines = modifiedEditor.getModel()?.getLineCount() || 0;
      const originalTotalLines = originalEditor.getModel()?.getLineCount() || 0;

      const dimOptions = {
          isWholeLine: true,
          inlineClassName: 'readOnlyTextDim',
          className: 'readOnlyBackgroundDim',
      };

      const newModifiedDecorations = [];
      const newOriginalDecorations = [];
      
      const originalEndLine = editableStartLine + getLineCount(originalCode) - 1;

      // --- 1. APPLY DIMMING TO READ-ONLY ZONES ---
      
      if (editableStartLine > 1) {
        const topRange = new monaco.Range(1, 1, editableStartLine - 1, 1);
        newModifiedDecorations.push({ range: topRange, options: dimOptions });
        newOriginalDecorations.push({ range: topRange, options: dimOptions });
      }

      if (afterLines > 0) {
        newModifiedDecorations.push({ 
            range: new monaco.Range(currentEditableEndLine + 1, 1, modifiedTotalLines, 1), 
            options: dimOptions 
        });
        newOriginalDecorations.push({ 
            range: new monaco.Range(originalEndLine + 1, 1, originalTotalLines, 1), 
            options: dimOptions 
        });
      }

        // --- 2. APPLY COLORS & BORDERS TO EDITABLE ZONES ---

        // RIGHT SIDE (Modified / Light Green)
        if (currentEditableEndLine >= editableStartLine) {
            // Background and side borders
            newModifiedDecorations.push({
                range: new monaco.Range(editableStartLine, 1, currentEditableEndLine, 1),
                options: { isWholeLine: true, className: 'modifiedBlockBg' }
            });
            // Top border on first line
            newModifiedDecorations.push({
                range: new monaco.Range(editableStartLine, 1, editableStartLine, 1),
                options: { isWholeLine: true, className: 'modifiedBlockTop' }
            });
            // Bottom border on last line
            newModifiedDecorations.push({
                range: new monaco.Range(currentEditableEndLine, 1, currentEditableEndLine, 1),
                options: { isWholeLine: true, className: 'modifiedBlockBottom' }
            });
        }

        // LEFT SIDE (Original / Light Red)
        if (originalEndLine >= editableStartLine) {
             // Background and side borders
            newOriginalDecorations.push({
                range: new monaco.Range(editableStartLine, 1, originalEndLine, 1),
                options: { isWholeLine: true, className: 'originalBlockBg' }
            });
            // Top border on first line
            newOriginalDecorations.push({
                range: new monaco.Range(editableStartLine, 1, editableStartLine, 1),
                options: { isWholeLine: true, className: 'originalBlockTop' }
            });
            // Bottom border on last line
            newOriginalDecorations.push({
                range: new monaco.Range(originalEndLine, 1, originalEndLine, 1),
                options: { isWholeLine: true, className: 'originalBlockBottom' }
            });
        }

        modifiedDecorations.set(newModifiedDecorations);
        originalDecorations.set(newOriginalDecorations);
    };

    // Prevent deleting the boundaries from INSIDE the editable zone
    modifiedEditor.onKeyDown((e) => {
      const position = modifiedEditor.getPosition();
      if (!position) return;

      // Prevent Backspacing into the beforeCode
      if (
        e.keyCode === monaco.KeyCode.Backspace &&
        position.lineNumber === editableStartLine &&
        position.column === 1
      ) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Prevent Deleting into the afterCode
      if (
        e.keyCode === monaco.KeyCode.Delete &&
        position.lineNumber === currentEditableEndLine &&
        position.column === modifiedEditor.getModel()?.getLineMaxColumn(currentEditableEndLine)
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    // Lock/Unlock based on cursor position
    modifiedEditor.onDidChangeCursorPosition((e) => {
      const currentLine = e.position.lineNumber;
      // If cursor strays into the dimmed areas, instantly lock the editor
      if (currentLine < editableStartLine || currentLine > currentEditableEndLine) {
        modifiedEditor.updateOptions({ readOnly: true });
      } else {
        modifiedEditor.updateOptions({ readOnly: false });
      }
    });
    modifiedEditor.onDidChangeModelContent(() => {
      const totalLines = modifiedEditor.getModel()?.getLineCount() || 0;
      currentEditableEndLine = totalLines - afterLines;
      updateDecorations();
        if (onCodeChange) {
          const model = modifiedEditor.getModel();
          if (model) {
            // Handle edge case where user deletes the ENTIRE block
            if (currentEditableEndLine < editableStartLine) {
                onCodeChange("");
            } else {
                // Extract ONLY the modified portion to send back to React parent
                const endColumn = model.getLineMaxColumn(currentEditableEndLine);
                const extractedCode = model.getValueInRange(
                  new monaco.Range(editableStartLine, 1, currentEditableEndLine, endColumn)
                );
                onCodeChange(extractedCode);
            }
          }
        }
    });
    updateDecorations(); 
  };

  return (
    <div 
      className={styles.diffContainer} 
    >
      <DiffEditor
        height="100%"
        original={fullOriginal}
        modified={fullModified}
        originalModelPath={`original-${filename}`}
        modifiedModelPath={`modified-${filename}`}
        theme="light"
        onMount={handleEditorMount}
        options={{
          automaticLayout: true,
          lineHeight: 22,
          renderSideBySide: true,
          readOnly: false,         
          originalEditable: false, 
          wordWrap: 'on',
          minimap: { enabled: false },
          ignoreTrimWhitespace: false,
          scrollBeyondLastLine: false,
          renderOverviewRuler: false,
        }}
      />
    </div>
  );
}