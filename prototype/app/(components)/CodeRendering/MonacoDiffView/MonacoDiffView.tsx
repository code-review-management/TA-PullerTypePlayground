'use client';
import { Monaco, useMonaco } from '@monaco-editor/react';
import { Container } from '@mui/material';
import { useEffect } from 'react';

const sampleCodeString = `export default function Page() {
    return (
        <div>
        <h1>Hello world</h1>
        </div>
    );
}`

const newSampleCodeString = `export default function Page() {
    const message = "Hello world";

    return (
        <div>
        <h1>{message}</h1>
        </div>
    );
}`
  
function CreateDiffEditor(monaco: Monaco) {
    const originalModel = monaco?.editor.createModel(
        sampleCodeString,
        "text/plain"
    );
    const modifiedModel = monaco?.editor.createModel(
        newSampleCodeString,
        "text/plain"
    );
    const diffEditor = monaco?.editor.createDiffEditor(
        document.getElementById("container") as HTMLElement,
        {
        originalEditable: false,
        automaticLayout: true,
        readOnly: true,
        scrollBeyondLastLine: false,
        }
    );
    diffEditor?.setModel({
        original: originalModel,
        modified: modifiedModel,
    });
    return diffEditor;
}

export default function DiffView() {
    const monaco = useMonaco();

    useEffect(() => {
      if (monaco) {
        CreateDiffEditor(monaco);
      }
    }, [monaco]);

    return (
        <Container id="container" sx={{height: "400px", border: "1px solid red"}}></Container>
    );
}