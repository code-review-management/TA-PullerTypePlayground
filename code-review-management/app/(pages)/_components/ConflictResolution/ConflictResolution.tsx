"use client"
import styles from "./ConflictResolution.module.css"
import { Editor, useMonaco, } from "@monaco-editor/react";
import * as MonacoEditor from "monaco-editor";
import { useState, useMemo, useRef, useEffect } from "react";
import useIsDark from "@components/ConflictResolution/useIsDark"
import { parseMerge, ParsedConflict } from "@components/ConflictResolution/parseMerge";
import { updateSidePanelsUI, updateResultPanelUI, sharedEditorOptions } from "./configureEditor";
import { ConflictResolutionProp } from "../../[username]/[repo_name]/pull/[id]/conflict-resolution/page";
import { MergeOutput, MergeFileOutput, MergeCommitInputData, MergeCommitContent } from "@/lib/merge-conflict-finder/merge-github.types";

interface FileWorkspaceState {
    currentModel: MonacoEditor.editor.ITextModel;
    incomingModel: MonacoEditor.editor.ITextModel;
    resultModel: MonacoEditor.editor.ITextModel;
    conflicts: ParsedConflict[];
    resultDecorations: Record<string, string[]>;
    // NEW: Track the side panel highlight IDs per-file
    currentDecorations: string[]; 
    incomingDecorations: string[];
    viewState?: MonacoEditor.editor.ICodeEditorViewState | null; 
}

export default function ConflictResolution({ conflictResolutionProp }: { conflictResolutionProp: ConflictResolutionProp }) {
    const mergeOutput: MergeOutput = conflictResolutionProp.mergeOutput;
    const monaco = useMonaco();
    const { isDark } = useIsDark();
    const themeStr = isDark ? "vs-dark" : "vs-light";
    
    const conflictingFiles = useMemo(() => mergeOutput.mergedFiles.filter(file => file.hasConflict), [mergeOutput]);
    const [activeFile, setActiveFile] = useState<MergeFileOutput | null>(conflictingFiles.length > 0 ? conflictingFiles[0] : null);

    // Editor references
    const [currentEditor, setCurrentEditor] = useState<MonacoEditor.editor.IStandaloneCodeEditor | null>(null);
    const [incomingEditor, setIncomingEditor] = useState<MonacoEditor.editor.IStandaloneCodeEditor | null>(null);
    const [resultEditor, setResultEditor] = useState<MonacoEditor.editor.IStandaloneCodeEditor | null>(null);

    // Model Cache
    const workspaceCache = useRef<Record<string, FileWorkspaceState>>({});
    const prevFileRef = useRef<string | null>(null);

    // Global Widget Refs
    const currentWidgetsRef = useRef(new Map<string, MonacoEditor.editor.IContentWidget>());
    const currentZoneIdsRef = useRef(new Map<string, string>());

    const incomingWidgetsRef = useRef(new Map<string, MonacoEditor.editor.IContentWidget>());
    const incomingZoneIdsRef = useRef(new Map<string, string>());

    const resultWidgetsRef = useRef(new Map<string, MonacoEditor.editor.IContentWidget>());
    const resultZoneIdsRef = useRef(new Map<string, string>());

    // State Tracking
    const [globalResolvedState, setGlobalResolvedState] = useState<Record<string, Record<string, { ours?: boolean, theirs?: boolean }>>>({});
    const resolvedState = activeFile ? (globalResolvedState[activeFile.filename] || {}) : {};

    const setResolvedState = (updater: any) => {
        if (!activeFile) return;
        setGlobalResolvedState(prev => {
            const currentState = prev[activeFile.filename] || {};
            const newState = typeof updater === 'function' ? updater(currentState) : updater;
            return { ...prev, [activeFile.filename]: newState };
        });
    };

    // --- 3. Manage Models & Tab Switching ---
    useEffect(() => {
        if (!monaco || !currentEditor || !incomingEditor || !resultEditor || !activeFile) return;

        const filename = activeFile.filename;

        // Save scroll/cursor position of the outgoing file
        if (prevFileRef.current && workspaceCache.current[prevFileRef.current]) {
            workspaceCache.current[prevFileRef.current].viewState = resultEditor.saveViewState();
        }

        // If this is the first time opening this file, parse and create models
        if (!workspaceCache.current[filename]) {
            const parsed = parseMerge(activeFile.contents);
            
            const cModel = monaco.editor.createModel(parsed.currentContent, 'javascript');
            const iModel = monaco.editor.createModel(parsed.incomingContent, 'javascript');
            const rModel = monaco.editor.createModel(parsed.resultContent, 'javascript');

            // NEW: Inject directly into the Model!
            const resultDecs: Record<string, string[]> = {};
            
            parsed.conflicts.forEach(c => {
                // model.deltaDecorations(oldIds, newDecorations) returns an array of string IDs
                resultDecs[c.id] = rModel.deltaDecorations([], [{
                    range: new monaco.Range(c.resultInsertLine, 1, c.resultInsertLine, 1),
                    options: { stickiness: monaco.editor.TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges }
                }]);
            });

            // Inside your model creation logic:
            workspaceCache.current[filename] = {
                currentModel: cModel,
                incomingModel: iModel,
                resultModel: rModel,
                conflicts: parsed.conflicts,
                resultDecorations: resultDecs,
                currentDecorations: [], // INITIALIZE HERE
                incomingDecorations: [], // INITIALIZE HERE
                viewState: null
            };
        }

        // Swap the models into the editors!
        const cache = workspaceCache.current[filename];
        currentEditor.setModel(cache.currentModel);
        incomingEditor.setModel(cache.incomingModel);
        resultEditor.setModel(cache.resultModel);

        if (cache.viewState) {
            resultEditor.restoreViewState(cache.viewState);
        }

        prevFileRef.current = filename;
    }, [activeFile, monaco, currentEditor, incomingEditor, resultEditor]);


    // --- Handlers (Referencing the active cache) ---
    const handleTransferBlock = (conflictId: string, side: 'ours' | 'theirs', textToInsert: string) => {
        if (!resultEditor || !monaco || !activeFile) return;
        
        const cache = workspaceCache.current[activeFile.filename];
        const decorationIds = cache?.resultDecorations[conflictId];
        if (!decorationIds) return;

        const currentRange = cache.resultModel.getDecorationRange(decorationIds[0]);
        if (!currentRange) return;

        const linesToInsert = textToInsert ? textToInsert.split('\n').length : 0;
        const textPayload = textToInsert ? textToInsert + '\n' : '';
        const insertLine = currentRange.endLineNumber;

        resultEditor.executeEdits("merge-resolver", [{
            range: new monaco.Range(insertLine, 1, insertLine, 1),
            text: textPayload,
            forceMoveMarkers: true
        }]);

        const trackingEndLine = insertLine + linesToInsert; 
        const visualEndLine = trackingEndLine - 1;
        const totalLinesInBlock = trackingEndLine - currentRange.startLineNumber;
        
        const deltaDecorations: MonacoEditor.editor.IModelDeltaDecoration[] = [
            {
                range: new monaco.Range(currentRange.startLineNumber, 1, trackingEndLine, 1),
                options: { stickiness: monaco.editor.TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges, zIndex: 0 }
            }
        ];
        
        if (totalLinesInBlock > 0) {
            deltaDecorations.push({
                range: new monaco.Range(currentRange.startLineNumber, 1, visualEndLine, 1),
                options: {
                    stickiness: monaco.editor.TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges,
                    isWholeLine: true,
                    className: styles.resolvedHighlight,
                    zIndex: 10
                }
            });
        }
        
        cache.resultDecorations[conflictId] = cache.resultModel.deltaDecorations(decorationIds, deltaDecorations);
        setResolvedState((prev: any) => ({ ...prev, [conflictId]: { ...prev[conflictId], [side]: true } }));
    };

    const handleReverseBlock = (conflictId: string) => {
        if (!resultEditor || !monaco || !activeFile) return;

        const cache = workspaceCache.current[activeFile.filename];
        const decorationIds = cache?.resultDecorations[conflictId];
        if (!decorationIds) return;

        const currentRange = cache.resultModel.getDecorationRange(decorationIds[0]);
        if (!currentRange) return;

        resultEditor.executeEdits("merge-resolver-undo", [{
            range: new monaco.Range(currentRange.startLineNumber, 1, currentRange.endLineNumber, 1),
            text: "",
            forceMoveMarkers: true
        }]);

        cache.resultDecorations[conflictId] = cache.resultModel.deltaDecorations(decorationIds, [{
            range: new monaco.Range(currentRange.startLineNumber, 1, currentRange.startLineNumber, 1),
            options: { stickiness: monaco.editor.TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges }
        }]);

        setResolvedState((prev: any) => {
            const newState = { ...prev };
            delete newState[conflictId];
            return newState;
        });
    };

    const handleCompleteMerge = async () => {
        try {
            const contentPayload: MergeCommitContent[] = mergeOutput.mergedFiles.map(file => {
                const cachedWorkspace = workspaceCache.current[file.filename];
                return {
                    filename: file.filename,
                    content: cachedWorkspace ? cachedWorkspace.resultModel.getValue() : file.contents 
                };
            });

            const inputPayload: MergeCommitInputData = {
                owner: "nithinsenthil",
                repo: "IntestiSat",
                targetMergeSha: mergeOutput.targetShaAtMerge,
                targetBranch: "RTOS_Task_low_pwr",
                featureBranch: "Conflict_Resolution_Our_Solution"
            }

            // 2. Send the POST request
            const response = await fetch("http://localhost:3000/api/v1/nithinsenthil/IntestiSat/pulls/4/RTOS_low_pwr/RTOS_Training_Base/commit-merge", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    cookie: conflictResolutionProp.cookieHeader
                },
                body: JSON.stringify({
                    mergeCommitData: inputPayload,
                    mergeContent: contentPayload
                }), 
            });

            if (!response.ok) {
                throw new Error(`Server rejected with status: ${response.status}`);
            }

            alert("Merge Success!");

        } catch (error) {
            console.error("Merge submission failed:", error);
            alert("Merge Failed, something went wrong");
        }
    };

    useEffect(() => {
        if (!activeFile || !currentEditor || !incomingEditor || !resultEditor || !monaco) return;
        
        const cache = workspaceCache.current[activeFile.filename];
        if (!cache) return; // Wait until models are created

        // WIPE Current/Incoming Widgets
        currentWidgetsRef.current.forEach(w => currentEditor.removeContentWidget(w));
        currentWidgetsRef.current.clear();
        currentEditor.changeViewZones(accessor => {
            currentZoneIdsRef.current.forEach(z => accessor.removeZone(z));
            currentZoneIdsRef.current.clear();
        });

        incomingWidgetsRef.current.forEach(w => incomingEditor.removeContentWidget(w));
        incomingWidgetsRef.current.clear();
        incomingEditor.changeViewZones(accessor => {
            incomingZoneIdsRef.current.forEach(z => accessor.removeZone(z));
            incomingZoneIdsRef.current.clear();
        });

        // WIPE Result Widgets
        resultWidgetsRef.current.forEach(w => resultEditor.removeContentWidget(w));
        resultWidgetsRef.current.clear();
        resultEditor.changeViewZones(accessor => {
            resultZoneIdsRef.current.forEach(z => accessor.removeZone(z));
            resultZoneIdsRef.current.clear();
        });

        const { newCurrentIds, newIncomingIds } = updateSidePanelsUI(
            monaco,
            currentEditor,
            incomingEditor,
            cache.currentModel, 
            cache.incomingModel, 
            cache.conflicts,
            resolvedState,
            cache.currentDecorations, // Pass from cache
            cache.incomingDecorations, // Pass from cache
            currentWidgetsRef.current,
            incomingWidgetsRef.current,
            currentZoneIdsRef.current,
            incomingZoneIdsRef.current,
            (blockId, text) => handleTransferBlock(blockId, 'ours', text),
            (blockId, text) => handleTransferBlock(blockId, 'theirs', text)
        );

        // SAVE the new IDs back to the cache so they can be cleaned up next time!
        cache.currentDecorations = newCurrentIds;
        cache.incomingDecorations = newIncomingIds;

        updateResultPanelUI(
            monaco,
            resultEditor,
            cache.resultModel, // NEW
            cache.conflicts,
            resolvedState,
            cache.resultDecorations, // Now strictly an array of string IDs
            resultWidgetsRef.current,
            resultZoneIdsRef.current,
            handleReverseBlock
        );

    }, [activeFile, resolvedState, currentEditor, incomingEditor, resultEditor, monaco]);


    if (!activeFile) return <div className={styles.noConflicts}>No conflicts to resolve.</div>;

    return (
        <div className={styles.conflictResolution}>
            <div className={styles.fileTabBar}>
                {conflictingFiles.map((file) => (
                    <button
                        key={file.filename}
                        className={`${styles.tabButton} ${activeFile?.filename === file.filename ? styles.activeTab : ''}`}
                        onClick={() => setActiveFile(file)}
                    >
                        {file.filename}
                    </button>
                ))}
                
                <button className={styles.completeMergeButton} 
                onClick={() => handleCompleteMerge()}
                >Complete Merge</button>
            </div>

            <div className={styles.mergeLayout}>
                <div className={styles.topHalf}>
                    
                    <div className={styles.splitPaneLeft}>
                        <div className={styles.paneHeader}>Current (Ours)</div>
                        <Editor
                            theme={themeStr}
                            defaultLanguage="javascript"
                            options={{ ...sharedEditorOptions, readOnly: true, minimap: { enabled: false } }}
                            onMount={(editor) => { 
                                setCurrentEditor(editor); 
                            }}
                        />
                    </div>

                    <div className={styles.splitPaneRight}>
                        <div className={styles.paneHeader}>Incoming (Theirs)</div>
                        <Editor
                            theme={themeStr}
                            defaultLanguage="javascript"
                            options={{ ...sharedEditorOptions, readOnly: true, minimap: { enabled: false } }}
                            onMount={(editor) => { 
                                setIncomingEditor(editor); 
                            }}
                        />
                    </div>
                </div>

                <div className={styles.bottomHalf}>
                    <div className={styles.paneHeader}>Result (Interactive)</div>
                    <Editor
                        theme={themeStr}
                        defaultLanguage="javascript"
                        options={{ ...sharedEditorOptions, minimap: { enabled: true } }}
                        onMount={(editor) => {
                            setResultEditor(editor); 
                        }}
                    />
                </div>
            </div>
        </div>
    );
}