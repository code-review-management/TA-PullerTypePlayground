import React from 'react';
import Editor from '@monaco-editor/react';

// You can pass in code, language, and whether the user is allowed to type in it
export function makeTopEditor(codeString: string, language: string, isReadOnly = true) {
  return (
    <Editor
      height="100%"
      width="100%"
      language={language}
      value={codeString}
      theme="light"
      options={{
        wordWrap: 'on',
        minimap: { enabled: false },
        fontSize: 14,
        padding: { top: 40 }, // Pushes code down so the X button doesn't overlap
        readOnly: isReadOnly,
        scrollBeyondLastLine: false,
        lineNumbersMinChars: 4,
        renderLineHighlight: 'all',
      }}
    />
  );
}

export function makeBottomEditor(codeString: string, language: string, replaceEndLine: number, isReadOnly = true) {
  return (
    <Editor
      height="100%"
      width="100%"
      language={language}
      value={codeString}
      theme="light"
      options={{
        automaticLayout: true,
        wordWrap: 'on',
        minimap: { enabled: false },
        fontSize: 14,
        padding: { top: 0 }, // Pushes code down so the X button doesn't overlap
        readOnly: isReadOnly,
        lineNumbers: (num: number) => (num + replaceEndLine - 1).toString(),
        scrollBeyondLastLine: false,
        lineNumbersMinChars: 4,
        renderLineHighlight: 'all',
      }}
    />
  );
}