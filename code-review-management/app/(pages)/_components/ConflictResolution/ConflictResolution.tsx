"use client"
import styles from "./ConflictResolution.module.css"
import { Editor, useMonaco } from "@monaco-editor/react";
import type * as MonacoEditor from "monaco-editor";
import { useState, useMemo, useRef, useEffect } from "react";
import useIsDark from "@components/ConflictResolution/useIsDark"
import { parseMerge, ParsedConflict } from "@components/ConflictResolution/parseMerge";
import { ConflictResolutionProp } from "../../[username]/[repo_name]/pull/[id]/conflict-resolution/page";
import { MergeOutput, MergeFileOutput } from "@/lib/merge-conflict-finder/merge-github.types";

// State to track if a block was moved to the bottom
type ResolvedState = Record<string, { ours: boolean; theirs: boolean }>;

export default function ConflictResolution({ conflictResolutionProp }: { conflictResolutionProp: ConflictResolutionProp }) {
    const mergeOutput: MergeOutput = conflictResolutionProp.mergeOutput;
    const monaco = useMonaco();
    const { isDark } = useIsDark();
    const themeStr = isDark ? "vs-dark" : "vs-light";
    
    const conflictingFiles = useMemo(() => mergeOutput.mergedFiles.filter(file => file.hasConflict), [mergeOutput]);
    const [activeFile, setActiveFile] = useState<MergeFileOutput | null>(conflictingFiles.length > 0 ? conflictingFiles[0] : null);

    // Editor references
    const currentEditorRef = useRef<MonacoEditor.editor.IStandaloneCodeEditor | null>(null);
    const incomingEditorRef = useRef<MonacoEditor.editor.IStandaloneCodeEditor | null>(null);
    const resultEditorRef = useRef<MonacoEditor.editor.IStandaloneCodeEditor | null>(null);

    // Data references
    const [conflicts, setConflicts] = useState<ParsedConflict[]>([]);
    const [resolvedState, setResolvedState] = useState<ResolvedState>({});
    
    // Maps a Conflict ID to the Monaco Decoration ID in the Result Editor
    const resultTrackerIds = useRef<Record<string, string>>({});
    const widgetsRef = useRef<MonacoEditor.editor.IContentWidget[]>([]);

    const [fileData, setFileData] = useState({ current: "", incoming: "", result: "" });

    // Parse the file whenever the active file changes
    useEffect(() => {
        if (activeFile) {
            const parsed = parseMerge(activeFile.contents);
            setFileData({ current: parsed.currentContent, incoming: parsed.incomingContent, result: parsed.resultContent });
            setConflicts(parsed.conflicts);
            setResolvedState({}); // Reset block states
        }
    }, [activeFile?.filename]);

    // Setup the tracking in the result editor whenever file changes
    const setupResultTracking = (editor: MonacoEditor.editor.IStandaloneCodeEditor) => {
        if (!monaco) return;
        
        // Create invisible trackers in the result editor to follow line shifts
        const decorations = conflicts.map(c => ({
            range: new monaco.Range(c.resultInsertLine, 1, c.resultInsertLine, 1),
            options: { stickiness: monaco.editor.TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges }
        }));
        
        const newIds = editor.deltaDecorations([], decorations);
        conflicts.forEach((c, i) => { resultTrackerIds.current[c.id] = newIds[i]; });
    };

    // The core function to transfer blocks
    const handleTransferBlock = (conflictId: string, side: 'ours' | 'theirs', textToInsert: string) => {
        const resultEditor = resultEditorRef.current;
        if (!resultEditor) return;

        const decorationId = resultTrackerIds.current[conflictId];
        const currentRange = resultEditor.getModel()?.getDecorationRange(decorationId);
        
        if (currentRange) {
            // Insert the text at the end of the tracked range (allows combining ours + theirs)
            resultEditor.executeEdits("merge-resolver", [{
                range: new monaco.Range(currentRange.endLineNumber, 1, currentRange.endLineNumber, 1),
                text: textToInsert + '\n',
                forceMoveMarkers: true
            }]);
        }

        // Hide the widget
        setResolvedState(prev => ({ ...prev, [conflictId]: { ...prev[conflictId], [side]: true } }));
    };

    // Render custom UI Widgets for the top editors
    useEffect(() => {
        if (!monaco || !currentEditorRef.current || !incomingEditorRef.current) return;

        // Cleanup old widgets
        widgetsRef.current.forEach(w => {
            currentEditorRef.current?.removeContentWidget(w);
            incomingEditorRef.current?.removeContentWidget(w);
        });
        widgetsRef.current = [];

        conflicts.forEach(c => {
            // Top-Left (Ours) Widget
            if (!resolvedState[c.id]?.ours) {
                const widgetNode = document.createElement('div');
                widgetNode.innerHTML = `<button style="background: var(--vscode-button-background); color: white; border: none; padding: 4px 8px; cursor: pointer;">Accept Current</button>`;
                widgetNode.onclick = () => handleTransferBlock(c.id, 'ours', c.currentText);
                
                const currentWidget: MonacoEditor.editor.IContentWidget = {
                    getId: () => `widget-current-${c.id}`,
                    getDomNode: () => widgetNode,
                    getPosition: () => ({ position: { lineNumber: c.currentStartLine, column: 1 }, preference: [monaco.editor.ContentWidgetPositionPreference.ABOVE] })
                };
                currentEditorRef.current!.addContentWidget(currentWidget);
                widgetsRef.current.push(currentWidget);
            }

            // Top-Right (Theirs) Widget
            if (!resolvedState[c.id]?.theirs) {
                const widgetNode = document.createElement('div');
                widgetNode.innerHTML = `<button style="background: var(--vscode-button-background); color: white; border: none; padding: 4px 8px; cursor: pointer;">Accept Incoming</button>`;
                widgetNode.onclick = () => handleTransferBlock(c.id, 'theirs', c.incomingText);
                
                const incomingWidget: MonacoEditor.editor.IContentWidget = {
                    getId: () => `widget-incoming-${c.id}`,
                    getDomNode: () => widgetNode,
                    getPosition: () => ({ position: { lineNumber: c.incomingStartLine, column: 1 }, preference: [monaco.editor.ContentWidgetPositionPreference.ABOVE] })
                };
                incomingEditorRef.current!.addContentWidget(incomingWidget);
                widgetsRef.current.push(incomingWidget);
            }
        });
    }, [conflicts, resolvedState, monaco]);

    if (!activeFile) return <div className={styles.noConflicts}>No conflicts to resolve.</div>;

    return (
        <div className={styles.conflictResolution} style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* Header / File Tabs */}
            <div className={styles.fileTabBar}>
               {/* Keep your existing tabs and complete merge button here */}
            </div>

            {/* 3-Way Merge Layout */}
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', minHeight: 0 }}>
                {/* Top Half: Split Views */}
                <div style={{ display: 'flex', flex: 1, borderBottom: '2px solid #ccc' }}>
                    
                    <div style={{ flex: 1, borderRight: '1px solid #ccc', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '8px', fontWeight: 'bold' }}>Current (Ours)</div>
                        <Editor
                            value={fileData.current}
                            theme={themeStr}
                            options={{ readOnly: true, minimap: { enabled: false } }}
                            onMount={(editor) => { currentEditorRef.current = editor; }}
                        />
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '8px', fontWeight: 'bold' }}>Incoming (Theirs)</div>
                        <Editor
                            value={fileData.incoming}
                            theme={themeStr}
                            options={{ readOnly: true, minimap: { enabled: false } }}
                            onMount={(editor) => { incomingEditorRef.current = editor; }}
                        />
                    </div>
                </div>

                {/* Bottom Half: Result */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '8px', fontWeight: 'bold' }}>Result (Interactive)</div>
                    <Editor
                        value={fileData.result}
                        theme={themeStr}
                        options={{ minimap: { enabled: true } }}
                        onMount={(editor) => {
                            resultEditorRef.current = editor;
                            setupResultTracking(editor);
                        }}
                        onChange={(val) => {
                            if (val !== undefined) activeFile.contents = val; // Store final result
                        }}
                    />
                </div>
            </div>
        </div>
    );
}