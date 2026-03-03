// /**
//  * Although the Monaco editor is instantiated in the main ConflictResolution.tsx component,
//  * the value, other options, and conflict rendering is all managed in this function configureEditor.
//  * 
//  * configureEditor calls renderConflicts to generate widgets, highlighting, and other UI indicators for conflicts.
//  */

// import { Monaco } from "@monaco-editor/react";
// import type * as MonacoEditor from "monaco-editor";
// import { type Dispatch, type SetStateAction } from "react";
// import { type ConflictBlock } from "./conflictBlock";
// import getConflictBlocks from "./parseMerge"
// import renderConflicts from "./renderConflicts"

// export default function configureEditor(
// 	editor: MonacoEditor.editor.IStandaloneCodeEditor, 
// 	monaco: Monaco, 
// 	initValue: string,
// 	conflictBlocks: Map<number, ConflictBlock>, 
// 	setConflictBlocks: Dispatch<SetStateAction<Map<number, ConflictBlock>>>, 
// 	widgets: Map<number, MonacoEditor.editor.IContentWidget>,
// 	zoneIds: Map<number, string>,
// ): void {
// 	editor.setValue(initValue);
// 	editor.updateOptions({
// 		fontSize: 12,
// 	});
// 	const decorationsCollection: MonacoEditor.editor.IEditorDecorationsCollection = editor.createDecorationsCollection([]);
// 	const model = editor.getModel();

// 	function processBlock(newLines: string[], blockStart: number): void {
// 		const newFileValue: string = newLines.join('\n');
// 		model?.setValue(newFileValue);
// 		const newConflictBlocks: Map<number, ConflictBlock> = conflictBlocks;
// 		conflictBlocks.delete(blockStart);
// 		setConflictBlocks(newConflictBlocks);
// 		const widget = widgets.get(blockStart);
// 		const zoneId = zoneIds.get(blockStart);
// 		if (widget && zoneId) {
// 			editor.removeContentWidget(widget);
// 			editor.changeViewZones(accessor => {
// 				accessor.removeZone(zoneId);
// 			});
// 		} else {
// 			console.error("Couldn't remove widget");
// 		}
// 		widgets.delete(blockStart);
// 	}

// 	function acceptCurrentFunc(conflictBlock: ConflictBlock): void {
// 		const currentValue = model?.getValue();
// 		if (currentValue) {
// 			const lines = currentValue.split('\n');
// 			const newLines = lines.slice(0, conflictBlock.start - 1).concat(
// 				lines.slice(conflictBlock.start, conflictBlock.divider - 1), 
// 				lines.slice(conflictBlock.end)
// 			);
// 			processBlock(newLines, conflictBlock.start);
// 		} else {
// 			console.error("Couldn't get current value.");
// 		}
// 	}

// 	function acceptIncomingFunc(conflictBlock: ConflictBlock): void {
// 		const currentValue = model?.getValue();
// 		if (currentValue) {
// 			const lines = currentValue.split('\n');
// 			const newLines = lines.slice(0, conflictBlock.start - 1).concat(
// 				lines.slice(conflictBlock.divider, conflictBlock.end - 1), 
// 				lines.slice(conflictBlock.end)
// 			);
// 			processBlock(newLines, conflictBlock.start);
// 		} else {
// 			console.error("Couldn't get current value.");
// 		}
// 	}

// 	function acceptBothFunc(conflictBlock: ConflictBlock): void {
// 		const currentValue = model?.getValue();
// 		if (currentValue) {
// 			const lines = currentValue.split('\n');
// 			const newLines = lines.slice(0, conflictBlock.start - 1).concat(
// 				lines.slice(conflictBlock.start, conflictBlock.divider - 1), 
// 				lines.slice(conflictBlock.divider, conflictBlock.end - 1), 
// 				lines.slice(conflictBlock.end)
// 			);
			
// 			processBlock(newLines, conflictBlock.start);
// 		} else {
// 			console.error("Couldn't get current value.");
// 		}
// 	}
    
// 	renderConflicts(editor, monaco, conflictBlocks, decorationsCollection, widgets, zoneIds, acceptCurrentFunc, acceptIncomingFunc, acceptBothFunc);

// 	editor.onDidChangeModelContent(() => {
// 		const newConflictBlocks = getConflictBlocks(editor.getValue());
// 		setConflictBlocks(newConflictBlocks);
// 		renderConflicts(editor, monaco, newConflictBlocks, decorationsCollection, widgets, zoneIds, acceptCurrentFunc, acceptIncomingFunc, acceptBothFunc);
// 	})
// }