import { useRef, useEffect } from "react";
import type { editor } from "monaco-editor";
import { DiffOnMount } from "@monaco-editor/react";
import { SuggestionDiffEditorProps, RegionData } from "./SuggestionDiffEditor";
import {
  getLineCount,
  calculateExpandedRegions,
  getLanguageIdFromFilename,
  vsCodeLightPlus,
} from "./mountUtils";
import styles from "./SuggestionDiffEditor.module.css";

/**
 * This function orchestrates the initialization of each editor. This is how we add the properties of each editor from user interactions.
 * This includes the decorative regions, line gutter clicking, bounds enforcing, and code change
 * This also intiliazes style choises of the editor such as themeing and language
 * @param props Contians information about the suggestion, mostly the code regions, file information,
 *              and a function to update regions
 * @returns It returns the function that will be run on the mount of the editor
 */
export function useDiffEditorSetup(
  props: SuggestionDiffEditorProps,
): DiffOnMount {
  const {
    beforeCode,
    originalCode,
    modifiedCode,
    afterCode,
    hasCarriageReturn,
    onCodeChange,
  } = props;

  const diffEditorRef = useRef<editor.IStandaloneDiffEditor | null>(null);
  const hoveredLineRef = useRef<number | null>(null);
  const hoverDecorationsRef =
    useRef<editor.IEditorDecorationsCollection | null>(null);

  // We store the updater function so React can trigger Monaco to redraw
  const updateDecorationsRef = useRef<(() => void) | null>(null);

  const boundariesRef = useRef({
    start: 1,
    end: 1,
    originalEnd: 1,
    afterLines: 0,
  });

  const latestPropsRef = useRef<RegionData>({
    beforeCode,
    originalCode,
    modifiedCode,
    afterCode,
  });

  useEffect(() => {
    latestPropsRef.current = {
      beforeCode,
      originalCode,
      modifiedCode,
      afterCode,
    };

    const beforeLines = getLineCount(beforeCode);
    const afterLines = getLineCount(afterCode);
    const startLine = beforeLines > 0 ? beforeLines + 1 : 1;

    boundariesRef.current = {
      start: startLine,
      end: startLine + getLineCount(modifiedCode) - 1,
      originalEnd: startLine + getLineCount(originalCode) - 1,
      afterLines: afterLines,
    };

    if (updateDecorationsRef.current) {
      updateDecorationsRef.current();
    }
  }, [beforeCode, originalCode, modifiedCode, afterCode]);

  const handleEditorMount: DiffOnMount = (editorInstance, monaco) => {
    // This section is how we theme and language set, as well as handle carriage returns
    monaco.editor.defineTheme("vs-light-plus", vsCodeLightPlus);
    monaco.editor.setTheme("vs-light-plus");

    diffEditorRef.current = editorInstance;

    const originalEditor = editorInstance.getOriginalEditor();
    const modifiedEditor = editorInstance.getModifiedEditor();

    const languageId = getLanguageIdFromFilename(props.filename, monaco);

    const originalModel = originalEditor.getModel();
    const modifiedModel = modifiedEditor.getModel();

    if (originalModel) {
      monaco.editor.setModelLanguage(originalModel, languageId);
      if (hasCarriageReturn)
        originalModel.setEOL(monaco.editor.EndOfLineSequence.CRLF);
      else originalModel.setEOL(monaco.editor.EndOfLineSequence.LF);
    }

    if (modifiedModel) {
      monaco.editor.setModelLanguage(modifiedModel, languageId);
      if (hasCarriageReturn)
        modifiedModel.setEOL(monaco.editor.EndOfLineSequence.CRLF);
      else modifiedModel.setEOL(monaco.editor.EndOfLineSequence.LF);
    }

    const modifiedDecorations = modifiedEditor.createDecorationsCollection();
    const originalDecorations = originalEditor.createDecorationsCollection();
    hoverDecorationsRef.current = modifiedEditor.createDecorationsCollection(
      [],
    );

    // We update the decorations dynamically, decorations are the heart of how this works
    // We use decorations to determine regions, enforce editability, and style our regions
    const updateDecorations = () => {
      const { start, end, originalEnd, afterLines } = boundariesRef.current;

      const modifiedTotalLines = modifiedEditor.getModel()?.getLineCount() || 0;
      const originalTotalLines = originalEditor.getModel()?.getLineCount() || 0;

      const dimOptions = {
        isWholeLine: true,
        inlineClassName: "readOnlyTextDim",
        className: "readOnlyBackgroundDim",
      };

      const newModifiedDecorations = [];
      const newOriginalDecorations = [];

      // We attach dimming here (to distinguish between editable regions)
      if (start > 1) {
        const topRange = new monaco.Range(1, 1, start - 1, 1);
        newModifiedDecorations.push({ range: topRange, options: dimOptions });
        newOriginalDecorations.push({ range: topRange, options: dimOptions });
      }

      if (afterLines > 0) {
        newModifiedDecorations.push({
          range: new monaco.Range(end + 1, 1, modifiedTotalLines, 1),
          options: dimOptions,
        });
        newOriginalDecorations.push({
          range: new monaco.Range(originalEnd + 1, 1, originalTotalLines, 1),
          options: dimOptions,
        });
      }

      // We add the modified content styling here
      if (end >= start) {
        newModifiedDecorations.push({
          range: new monaco.Range(start, 1, end, 1),
          options: { isWholeLine: true, className: "modifiedBlockBg" },
        });
        newModifiedDecorations.push({
          range: new monaco.Range(start, 1, start, 1),
          options: { isWholeLine: true, className: "modifiedBlockTop" },
        });
        newModifiedDecorations.push({
          range: new monaco.Range(end, 1, end, 1),
          options: { isWholeLine: true, className: "modifiedBlockBottom" },
        });
      }

      // We add the deleted content styling here
      if (originalEnd >= start) {
        newOriginalDecorations.push({
          range: new monaco.Range(start, 1, originalEnd, 1),
          options: { isWholeLine: true, className: "originalBlockBg" },
        });
        newOriginalDecorations.push({
          range: new monaco.Range(start, 1, start, 1),
          options: { isWholeLine: true, className: "originalBlockTop" },
        });
        newOriginalDecorations.push({
          range: new monaco.Range(originalEnd, 1, originalEnd, 1),
          options: { isWholeLine: true, className: "originalBlockBottom" },
        });
      }

      modifiedDecorations.set(newModifiedDecorations);
      originalDecorations.set(newOriginalDecorations);
    };

    updateDecorationsRef.current = updateDecorations;

    // This is used to enforce region editability by toggling.
    // This is the primary method to enforce editability rules
    modifiedEditor.onDidChangeCursorPosition((e) => {
      const currentLine = e.position.lineNumber;
      const { start, end } = boundariesRef.current;

      if (currentLine < start || currentLine > end) {
        modifiedEditor.updateOptions({ readOnly: true });
      } else {
        modifiedEditor.updateOptions({ readOnly: false });
      }
    });

    // This is our second line of defense for editability.
    // We check to make sure that no keydown is both crossing a section and modifing content
    modifiedEditor.onKeyDown((e) => {
      const { start, end } = boundariesRef.current;
      const selections = modifiedEditor.getSelections();
      const position = modifiedEditor.getPosition();

      if (!selections || !position) return;
      const isSelectionCrossingBoundaries = selections.some((selection) => {
        return (
          selection.startLineNumber < start || selection.endLineNumber > end
        );
      });

      const isSelectionEmpty = selections.every((sel) => sel.isEmpty());
      if (!isSelectionEmpty && isSelectionCrossingBoundaries) {
        const isModifyingKey =
          e.keyCode === monaco.KeyCode.Backspace ||
          e.keyCode === monaco.KeyCode.Delete ||
          e.keyCode === monaco.KeyCode.Enter ||
          e.keyCode === monaco.KeyCode.Space ||
          (e.keyCode >= monaco.KeyCode.KeyA &&
            e.keyCode <= monaco.KeyCode.KeyZ) ||
          (e.keyCode >= monaco.KeyCode.Digit0 &&
            e.keyCode <= monaco.KeyCode.Digit9);

        if (isModifyingKey) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      }

      if (isSelectionEmpty) {
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
      }
    });

    // On click, it will determine the new text content related to the regional change
    // It then tells the parents the new code content of the regions
    const handleExpandRegionClick = (clickedLine: number) => {
      const newRegions = calculateExpandedRegions(
        clickedLine,
        latestPropsRef.current,
      );
      if (newRegions) {
        onCodeChange(
          newRegions.beforeCode,
          newRegions.originalCode,
          newRegions.modifiedCode,
          newRegions.afterCode,
        );
      }
    };

    // This is the line gutter click handling, it expands the region
    modifiedEditor.onMouseDown((e) => {
      if (e.target.type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS) {
        const clickedLine = e.target.position?.lineNumber;
        if (clickedLine && clickedLine === hoveredLineRef.current) {
          handleExpandRegionClick(clickedLine);
        }
      }
    });

    // This is the hover logic, this is used for region expansion styling
    modifiedEditor.onMouseMove((e) => {
      const target = e.target;
      const position = target.position;

      if (
        !position ||
        target.type !== monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS
      ) {
        clearHover();
        return;
      }

      const currentLine = position.lineNumber;
      const { start, end } = boundariesRef.current;
      const isExpandable = currentLine < start || currentLine > end;

      if (currentLine !== hoveredLineRef.current) {
        hoveredLineRef.current = currentLine;

        if (isExpandable) {
          hoverDecorationsRef.current?.set([
            {
              range: new monaco.Range(currentLine, 1, currentLine, 1),
              options: {
                isWholeLine: true,
                className: styles["monaco-hover-line-yellow"],
                // This is the class we use to make the plus button you see in gutters
                marginClassName: styles["monaco-expand-plus-btn"],
              },
            },
          ]);
        } else {
          clearHover();
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

    // This function handles model content change. It updates the bounds with the new line count
    // It then fires the function to let the parent component know
    modifiedEditor.onDidChangeModelContent(() => {
      const totalLines = modifiedEditor.getModel()?.getLineCount() || 0;
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
              new monaco.Range(start, 1, end, endColumn),
            );
          }

          const { beforeCode, originalCode, afterCode } =
            latestPropsRef.current;
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

  return handleEditorMount;
}
