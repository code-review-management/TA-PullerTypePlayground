// /**
//  * Although the Monaco editor is instantiated in the main ConflictResolution.tsx component,
//  * the value, other options, and conflict rendering is all managed in this function configureEditor.
//  * 
//  * configureEditor calls renderConflicts to generate widgets, highlighting, and other UI indicators for conflicts.
//  */

import { Monaco } from "@monaco-editor/react";
import type * as MonacoEditor from "monaco-editor";
import { ParsedConflict } from "./parseMerge";
import { SideConflictBlock, renderSideConflicts, insertReverseWidget } from "./renderConflicts";

// Define base options that all 3 editors will share
export const sharedEditorOptions: MonacoEditor.editor.IEditorConstructionOptions = {
    fontSize: 20,             
    // This is the default VS Code font stack
    fontFamily: 'Menlo, Monaco, "Courier New", monospace', 
    fontWeight: "400",         // VS Code's default weight
    letterSpacing: 0,
    lineHeight: 1.5,           // Standard VS Code line spacing
    renderValidationDecorations: "off",
    };

// --- Function 1: Handle Side Panels (Current & Incoming) ---
export function updateSidePanelsUI(
    monaco: Monaco,
    currentEditor: MonacoEditor.editor.IStandaloneCodeEditor,
    incomingEditor: MonacoEditor.editor.IStandaloneCodeEditor,
    currentModel: MonacoEditor.editor.ITextModel,
    incomingModel: MonacoEditor.editor.ITextModel,
    conflicts: ParsedConflict[],
    resolvedState: Record<string, { ours?: boolean, theirs?: boolean }>,
    oldCurrentIds: string[], // NEW: Pass in the old IDs
    oldIncomingIds: string[], // NEW: Pass in the old IDs
    currentWidgetsMap: Map<string, MonacoEditor.editor.IContentWidget>,
    incomingWidgetsMap: Map<string, MonacoEditor.editor.IContentWidget>,
    currentZonesMap: Map<string, string>,
    incomingZonesMap: Map<string, string>,
    onAcceptCurrent: (blockId: string, text: string) => void,
    onAcceptIncoming: (blockId: string, text: string) => void
): { newCurrentIds: string[], newIncomingIds: string[] } {
    // Map Current Blocks
    const currentBlocks: SideConflictBlock[] = conflicts.map(c => {
        const lineCount = c.currentText ? c.currentText.split('\n').length : 1;
        return {
            id: c.id,
            start: c.currentStartLine,
            end: c.currentStartLine + lineCount - 1,
            text: c.currentText,
            isResolved: !!resolvedState[c.id]?.ours
        };
    });

    // Map Incoming Blocks
    const incomingBlocks: SideConflictBlock[] = conflicts.map(c => {
        const lineCount = c.incomingText ? c.incomingText.split('\n').length : 1;
        return {
            id: c.id,
            start: c.incomingStartLine,
            end: c.incomingStartLine + lineCount - 1,
            text: c.incomingText,
            isResolved: !!resolvedState[c.id]?.theirs
        };
    });

    const newCurrentIds = renderSideConflicts(
        currentEditor,
        currentModel,
        monaco,
        currentBlocks,
        "current",
        oldCurrentIds,
        currentWidgetsMap,
        currentZonesMap,
        (block) => onAcceptCurrent(block.id, block.text)
    );

    const newIncomingIds = renderSideConflicts(
        incomingEditor,
        incomingModel,
        monaco,
        incomingBlocks,
        "incoming",
        oldIncomingIds,
        incomingWidgetsMap,
        incomingZonesMap,
        (block) => onAcceptIncoming(block.id, block.text)
    );

    return { newCurrentIds, newIncomingIds };
}


// --- Function 2: Handle Result Panel (Bottom) ---
export function updateResultPanelUI(
    monaco: Monaco,
    resultEditor: MonacoEditor.editor.IStandaloneCodeEditor,
    resultModel: MonacoEditor.editor.ITextModel,
    conflicts: ParsedConflict[],
    resolvedState: Record<string, { ours?: boolean, theirs?: boolean }>,
    resultDecorations: Record<string, string[]>,
    resultWidgetsMap: Map<string, MonacoEditor.editor.IContentWidget>,
    resultZonesMap: Map<string, string>,
    onReverseBlock: (blockId: string) => void
) {
    // Clear existing bottom widgets
    resultWidgetsMap.forEach(w => resultEditor.removeContentWidget(w));
    resultWidgetsMap.clear();
    
    // Clear existing view zones
    resultEditor.changeViewZones(accessor => {
        resultZonesMap.forEach(z => accessor.removeZone(z));
        resultZonesMap.clear();
    });

    // Draw new widgets based on resolved state
    conflicts.forEach(c => {
        const isResolved = resolvedState[c.id]?.ours || resolvedState[c.id]?.theirs;
        
        if (isResolved) {
            const decorationIds = resultDecorations[c.id];
            if (!decorationIds || decorationIds.length === 0) return;

            const currentRange = resultModel.getDecorationRange(decorationIds[0]);
            if (!currentRange) return;

            const [widget, zoneId] = insertReverseWidget(
                resultEditor,
                monaco,
                c.id,
                currentRange.startLineNumber,
                onReverseBlock
            );

            resultWidgetsMap.set(c.id, widget);
            resultZonesMap.set(c.id, zoneId);
        }
    });
}