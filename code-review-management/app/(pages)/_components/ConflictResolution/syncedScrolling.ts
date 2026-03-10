import type * as MonacoEditor from "monaco-editor";
import { ParsedConflict } from "./parseMerge";
import { FileWorkspaceState } from "./ConflictResolution"; // Adjust import as needed

export interface SyncAnchor {
    currentLine: number;
    incomingLine: number;
    resultLine: number;
}

export const generateAnchors = (
    conflicts: ParsedConflict[], 
    resultModel: MonacoEditor.editor.ITextModel,
    resultDecorations: Record<string, string[]>, 
    currentMaxLine: number,
    incomingMaxLine: number,
    resultMaxLine: number
): SyncAnchor[] => {
    const anchors: SyncAnchor[] = [];
    
    anchors.push({ currentLine: 1, incomingLine: 1, resultLine: 1 });

    conflicts.forEach(c => {
        const decorationIds = resultDecorations[c.id];
        const resultRange = decorationIds ? resultModel.getDecorationRange(decorationIds[0]) : null;
        
        const resStart = resultRange ? resultRange.startLineNumber : c.resultInsertLine;
        const resEnd = resultRange ? resultRange.endLineNumber : c.resultInsertLine;

        const curLineCount = c.currentText ? c.currentText.split('\n').length : 1;
        const incLineCount = c.incomingText ? c.incomingText.split('\n').length : 1;

        const curStart = c.currentStartLine; 
        const incStart = c.incomingStartLine; 

        const curEnd = curStart + curLineCount - 1;
        const incEnd = incStart + incLineCount - 1;

        anchors.push({ currentLine: curStart, incomingLine: incStart, resultLine: resStart });
        anchors.push({ currentLine: curEnd, incomingLine: incEnd, resultLine: resEnd });
    });

    anchors.push({ currentLine: currentMaxLine, incomingLine: incomingMaxLine, resultLine: resultMaxLine });

    return anchors;
};

export const refreshAnchors = (cache: FileWorkspaceState) => {
    if (!cache) return;

    const currentMax = cache.currentModel.getLineCount();
    const incomingMax = cache.incomingModel.getLineCount();
    const resultMax = cache.resultModel.getLineCount();

    cache.syncAnchors = generateAnchors(
        cache.conflicts,
        cache.resultModel,
        cache.resultDecorations,
        currentMax,
        incomingMax,
        resultMax
    );
};

export const bindInterpolatedScroll = (
    sourceEditor: MonacoEditor.editor.IStandaloneCodeEditor,
    targetEditor1: MonacoEditor.editor.IStandaloneCodeEditor,
    targetEditor2: MonacoEditor.editor.IStandaloneCodeEditor,
    getAnchors: () => SyncAnchor[], // Pass as a function so it always gets the latest array
    sourceKey: keyof SyncAnchor,
    target1Key: keyof SyncAnchor,
    target2Key: keyof SyncAnchor,
    syncState: { isSyncing: boolean } // Shared state object
) => {
    return sourceEditor.onDidScrollChange((e: MonacoEditor.IScrollEvent) => {
        if (syncState.isSyncing || !e.scrollTopChanged) return;
        syncState.isSyncing = true;

        const sourceY = e.scrollTop;
        const anchors = getAnchors(); // Grab the live anchors dynamically

        let i = 0;
        let sourceY1 = 0, sourceY2 = 0;
        
        for (; i < anchors.length - 1; i++) {
            sourceY1 = sourceEditor.getTopForLineNumber(anchors[i][sourceKey]);
            sourceY2 = sourceEditor.getTopForLineNumber(anchors[i + 1][sourceKey]);
            
            if (sourceY >= sourceY1 && sourceY <= sourceY2) {
                break;
            }
        }

        const range = sourceY2 - sourceY1;
        const progress = range === 0 ? 0 : (sourceY - sourceY1) / range;

        const t1Y1 = targetEditor1.getTopForLineNumber(anchors[i][target1Key]);
        const t1Y2 = targetEditor1.getTopForLineNumber(anchors[i + 1][target1Key]);
        targetEditor1.setScrollTop(t1Y1 + progress * (t1Y2 - t1Y1));

        const t2Y1 = targetEditor2.getTopForLineNumber(anchors[i][target2Key]);
        const t2Y2 = targetEditor2.getTopForLineNumber(anchors[i + 1][target2Key]);
        targetEditor2.setScrollTop(t2Y1 + progress * (t2Y2 - t2Y1));

        if (e.scrollLeftChanged) {
            targetEditor1.setScrollLeft(e.scrollLeft);
            targetEditor2.setScrollLeft(e.scrollLeft);
        }

        requestAnimationFrame(() => {
            syncState.isSyncing = false;
        });
    });
};