import React, { useState, useRef } from 'react';
import Editor, { OnMount, Monaco} from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import styles from './AutoResizingEditor.module.css'

export interface ResizingEditorProps{
    codeString: string,
    filename: string,
    isReadOnly: boolean,
    startLine: number,
    includeSuggestionBlock: (lineNumber: number) => void
}

export function AutoResizingEditor({ 
    codeString,
    filename, 
    isReadOnly, 
    startLine,
    includeSuggestionBlock
  } : ResizingEditorProps) {
  // 1. State to track the exact pixel height of the code
  const [editorHeight, setEditorHeight] = useState(100);
  const decorationsRef = useRef<editor.IEditorDecorationsCollection | null>(null);
  const hoveredLineRef = useRef<number | null>(null);

const handleEditorDidMount: OnMount = (editor, monaco) => {
    decorationsRef.current = editor.createDecorationsCollection([]);

    const updateHeight = () => {
      const contentHeight = editor.getContentHeight();
      setEditorHeight(contentHeight);
    };

    editor.onDidContentSizeChange(updateHeight);
    updateHeight();

    // --- HOVER LOGIC ---
    editor.onMouseMove((e) => {
      const target = e.target;
      const position = target.position;

      if (!position) {
        clearHover();
        return;
      }

      const currentLine = position.lineNumber;
      
      if (currentLine !== hoveredLineRef.current) {
        hoveredLineRef.current = currentLine;

        decorationsRef.current?.set([{
          range: new monaco.Range(currentLine, 1, currentLine, 1),
          options: {
            isWholeLine: true,
            className: styles['monaco-hover-line-yellow'],
            marginClassName: styles['monaco-hover-btn-overlay'] 
          }
        }]);
      }
    });

    editor.onMouseLeave(() => {
      clearHover();
    });

    function clearHover() {
      if (hoveredLineRef.current !== null) {
        hoveredLineRef.current = null;
        decorationsRef.current?.clear();
      }
    }

    // --- CLICK LOGIC ---
    editor.onMouseDown((e) => {
      // CHANGE 2: Listen for clicks on the LINE NUMBERS instead of the glyph margin
      if (e.target.type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS) {
        const clickedLine = e.target.position?.lineNumber;
        if (clickedLine && clickedLine === hoveredLineRef.current) {
          console.log(`Button clicked on line ${clickedLine}!`);
          includeSuggestionBlock(clickedLine);
        }
      }
    });
  };

  return (
    <div style={{position: 'relative', height: editorHeight, width: '100%' }}>
      <Editor
        height="100%"
        width="100%"
        path={filename}
        value={codeString}
        theme="light"
        onMount={handleEditorDidMount}
        options={{
          lineNumbers: (num) => (num + startLine - 1).toString(),
          wordWrap: 'on',
          minimap: { enabled: false },
          readOnly: isReadOnly,
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 }, 
          scrollbar: getScrollBarOptions(),
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true
        }}
      />
    </div>
  );
}

function getScrollBarOptions() : editor.IEditorScrollbarOptions {
  return {
    vertical: 'hidden',
    horizontal: 'hidden',
    handleMouseWheel: false
  }
}