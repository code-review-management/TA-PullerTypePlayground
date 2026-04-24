import { useRef, useEffect } from 'react';
import type { editor } from 'monaco-editor';
import { DiffOnMount } from '@monaco-editor/react';
import { SuggestionDiffEditorProps, RegionData } from './SuggestionDiffEditor';
import { getLineCount, calculateExpandedRegions, getLanguageIdFromFilename, vsCodeLightPlus } from './mountUtils';
import styles from './SuggestionDiffEditor.module.css';

export function useDiffEditorSetup(props: SuggestionDiffEditorProps) {
  const {
    beforeCode,
    originalCode,
    modifiedCode,
    afterCode,
    onCodeChange
  } = props;

  const diffEditorRef = useRef<editor.IStandaloneDiffEditor | null>(null);
  const hoveredLineRef = useRef<number | null>(null);
  const hoverDecorationsRef = useRef<editor.IEditorDecorationsCollection | null>(null);

  // 1. Store the updater function so React can trigger Monaco to redraw
  const updateDecorationsRef = useRef<(() => void) | null>(null);

  // 2. Track boundaries in a ref so event listeners always have the latest coordinates
  const boundariesRef = useRef({
    start: 1,
    end: 1,
    originalEnd: 1,
    afterLines: 0
  });

  const latestPropsRef = useRef<RegionData>({ beforeCode, originalCode, modifiedCode, afterCode });

  // 3. REACT TO PROP CHANGES: Update refs and force Monaco to redraw decorations
  useEffect(() => {
    latestPropsRef.current = { beforeCode, originalCode, modifiedCode, afterCode };

    const beforeLines = getLineCount(beforeCode);
    const afterLines = getLineCount(afterCode);
    const startLine = beforeLines > 0 ? beforeLines + 1 : 1;

    boundariesRef.current = {
      start: startLine,
      end: startLine + getLineCount(modifiedCode) - 1,
      originalEnd: startLine + getLineCount(originalCode) - 1,
      afterLines: afterLines
    };

    // If Monaco is mounted, immediately move the visual boundaries
    if (updateDecorationsRef.current) {
      updateDecorationsRef.current();
    }
  }, [beforeCode, originalCode, modifiedCode, afterCode]);

  const handleEditorMount: DiffOnMount = (editorInstance, monaco) => {
    monaco.editor.defineTheme('vs-light-plus', vsCodeLightPlus);
    monaco.editor.setTheme('vs-light-plus');

    diffEditorRef.current = editorInstance;

    const originalEditor = editorInstance.getOriginalEditor();
    const modifiedEditor = editorInstance.getModifiedEditor();

    const languageId = getLanguageIdFromFilename(props.filename, monaco);

    const originalModel = originalEditor.getModel();
    const modifiedModel = modifiedEditor.getModel();
    
    if (originalModel) {
      monaco.editor.setModelLanguage(originalModel, languageId);
      originalModel.setEOL(monaco.editor.EndOfLineSequence.LF); 
    }
    
    if (modifiedModel) {
      monaco.editor.setModelLanguage(modifiedModel, languageId);
      modifiedModel.setEOL(monaco.editor.EndOfLineSequence.LF);
    }

    const modifiedDecorations = modifiedEditor.createDecorationsCollection();
    const originalDecorations = originalEditor.createDecorationsCollection();
    hoverDecorationsRef.current = modifiedEditor.createDecorationsCollection([]);

    // 4. Update decorations using the DYNAMIC boundaries in the ref
    const updateDecorations = () => {
      const { start, end, originalEnd, afterLines } = boundariesRef.current;

      const modifiedTotalLines = modifiedEditor.getModel()?.getLineCount() || 0;
      const originalTotalLines = originalEditor.getModel()?.getLineCount() || 0;

      const dimOptions = {
        isWholeLine: true,
        inlineClassName: 'readOnlyTextDim',
        className: 'readOnlyBackgroundDim',
      };

      const newModifiedDecorations = [];
      const newOriginalDecorations = [];

      // DIMMING
      if (start > 1) {
        const topRange = new monaco.Range(1, 1, start - 1, 1);
        newModifiedDecorations.push({ range: topRange, options: dimOptions });
        newOriginalDecorations.push({ range: topRange, options: dimOptions });
      }

      if (afterLines > 0) {
        newModifiedDecorations.push({
          range: new monaco.Range(end + 1, 1, modifiedTotalLines, 1),
          options: dimOptions
        });
        newOriginalDecorations.push({
          range: new monaco.Range(originalEnd + 1, 1, originalTotalLines, 1),
          options: dimOptions
        });
      }

      // BORDERS - Modified (Right)
      if (end >= start) {
        newModifiedDecorations.push({
          range: new monaco.Range(start, 1, end, 1),
          options: { isWholeLine: true, className: 'modifiedBlockBg' }
        });
        newModifiedDecorations.push({
          range: new monaco.Range(start, 1, start, 1),
          options: { isWholeLine: true, className: 'modifiedBlockTop' }
        });
        newModifiedDecorations.push({
          range: new monaco.Range(end, 1, end, 1),
          options: { isWholeLine: true, className: 'modifiedBlockBottom' }
        });
      }

      // BORDERS - Original (Left)
      if (originalEnd >= start) {
        newOriginalDecorations.push({
          range: new monaco.Range(start, 1, originalEnd, 1),
          options: { isWholeLine: true, className: 'originalBlockBg' }
        });
        newOriginalDecorations.push({
          range: new monaco.Range(start, 1, start, 1),
          options: { isWholeLine: true, className: 'originalBlockTop' }
        });
        newOriginalDecorations.push({
          range: new monaco.Range(originalEnd, 1, originalEnd, 1),
          options: { isWholeLine: true, className: 'originalBlockBottom' }
        });
      }

      modifiedDecorations.set(newModifiedDecorations);
      originalDecorations.set(newOriginalDecorations);
    };

    // Save it to the ref so React can call it on prop updates
    updateDecorationsRef.current = updateDecorations;

    const handleExpandRegionClick = (clickedLine: number) => {
      const newRegions = calculateExpandedRegions(clickedLine, latestPropsRef.current);
      if (newRegions) {
        // Trigger React State Update (which will trigger the useEffect above)
        onCodeChange(
          newRegions.beforeCode,
          newRegions.originalCode,
          newRegions.modifiedCode,
          newRegions.afterCode
        );
      }
    };

    // --- CLICK LOGIC ---
    modifiedEditor.onMouseDown((e) => {
      if (e.target.type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS) {
        const clickedLine = e.target.position?.lineNumber;
        if (clickedLine && clickedLine === hoveredLineRef.current) {
          handleExpandRegionClick(clickedLine);
        }
      }
    });

    // 5. Use the REF for read-only boundary checks instead of static closures
    modifiedEditor.onKeyDown((e) => {
      const position = modifiedEditor.getPosition();
      if (!position) return;
      const { start, end } = boundariesRef.current;

      if (
        e.keyCode === monaco.KeyCode.Backspace &&
        position.lineNumber === start &&
        position.column === 1
      ) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (
        e.keyCode === monaco.KeyCode.Delete &&
        position.lineNumber === end &&
        position.column === modifiedEditor.getModel()?.getLineMaxColumn(end)
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    modifiedEditor.onDidChangeCursorPosition((e) => {
      const currentLine = e.position.lineNumber;
      const { start, end } = boundariesRef.current;

      if (currentLine < start || currentLine > end) {
        modifiedEditor.updateOptions({ readOnly: true });
      } else {
        modifiedEditor.updateOptions({ readOnly: false });
      }
    });

    // --- HOVER LOGIC ---
    modifiedEditor.onMouseMove((e) => {
      const target = e.target;
      const position = target.position;

      // Ensure we are hovering over the gutter line numbers specifically
      if (!position || target.type !== monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS) {
        clearHover();
        return;
      }

      const currentLine = position.lineNumber;
      const { start, end } = boundariesRef.current;

      // Only show the plus hover effect IF it's outside the editable zone
      const isExpandable = currentLine < start || currentLine > end;

      if (currentLine !== hoveredLineRef.current) {
        hoveredLineRef.current = currentLine;

        if (isExpandable) {
          hoverDecorationsRef.current?.set([{
            range: new monaco.Range(currentLine, 1, currentLine, 1),
            options: {
              isWholeLine: true,
              className: styles['monaco-hover-line-yellow'],
              // New specific class for the plus button
              marginClassName: styles['monaco-expand-plus-btn']
            }
          }]);
        } else {
          clearHover(); // Clear it if they hover inside the editable zone
        }
      }
    });

    modifiedEditor.onMouseLeave(() => clearHover());

    function clearHover() {
      if (hoveredLineRef.current !== null) {
        hoveredLineRef.current = null;
        hoverDecorationsRef.current?.clear();
      }
    }

    modifiedEditor.onDidChangeModelContent(() => {
      const totalLines = modifiedEditor.getModel()?.getLineCount() || 0;
      // Adjust the end line dynamically if they type/delete inside the editor
      boundariesRef.current.end = totalLines - boundariesRef.current.afterLines;
      updateDecorations();

      if (onCodeChange) {
        const model = modifiedEditor.getModel();
        if (model) {
          const { start, end } = boundariesRef.current;
          let extractedCode = "";

          if (end >= start) {
            const endColumn = model.getLineMaxColumn(end);
            extractedCode = model.getValueInRange(
              new monaco.Range(start, 1, end, endColumn)
            ).replace(/\r\n/g, '\n');
          }

          const { beforeCode, originalCode, afterCode } = latestPropsRef.current;
          onCodeChange(beforeCode, originalCode, extractedCode, afterCode);
        }
      }
    });


    updateDecorations();
    const startLine = boundariesRef.current.start;
    setTimeout(() => {
      modifiedEditor.revealLineNearTop(startLine);
    }, 50);
  };

  return { handleEditorMount };
}