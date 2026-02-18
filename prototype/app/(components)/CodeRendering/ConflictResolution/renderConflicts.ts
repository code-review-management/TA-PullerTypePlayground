

import styles from "./ConflictResolution.module.css";
import { Monaco } from "@monaco-editor/react";
import type * as MonacoEditor from "monaco-editor";
import { type ConflictBlock } from "./conflictBlock";

/**
 * Create and add a new conflict widget for a given conflict to a Monaco editor.
 * Also creates new view zone to create line-space for the widget.
 */
function insertConflictWidget(
	conflictBlock: ConflictBlock, 
	monaco: Monaco, 
	editor: MonacoEditor.editor.IStandaloneCodeEditor, 
	acceptCurrentFunc: (conflictBlock: ConflictBlock) => void, 
	acceptIncomingFunc: (conflictBlock: ConflictBlock) => void, 
	acceptBothFunc: (conflictBlock: ConflictBlock) => void,
): [MonacoEditor.editor.IContentWidget, string] {
    const widget: MonacoEditor.editor.IContentWidget = {
      getId() {
        return `conflict.widget.${conflictBlock.start}`;
      },

      getDomNode() {
        const node = document.createElement("div");
		node.className = styles.conflictWidget;

		const acceptCurrent = document.createElement("button");
		acceptCurrent.innerText = "Accept current";
		acceptCurrent.className = styles.conflictWidgetButton;
		acceptCurrent.addEventListener("click", () => {
			acceptCurrentFunc(conflictBlock);
		});

		const acceptIncoming = document.createElement("button");
		acceptIncoming.innerText = "Accept incoming";
		acceptIncoming.className = styles.conflictWidgetButton;
		acceptIncoming.addEventListener("click", () => {
			acceptIncomingFunc(conflictBlock);
		});

		const acceptBoth = document.createElement("button");
		acceptBoth.innerText = "Accept both";
		acceptBoth.className = styles.conflictWidgetButton;
		acceptBoth.addEventListener("click", () => {
			acceptBothFunc(conflictBlock);
		});

		const appendButtonDivider = () => {
			const buttonDivider = document.createElement("span");
			buttonDivider.innerText = "|";
			buttonDivider.className = styles.buttonDivider;
			node.appendChild(buttonDivider);
		}

		node.appendChild(acceptCurrent);
		appendButtonDivider();
		node.appendChild(acceptIncoming);
		appendButtonDivider();
		node.appendChild(acceptBoth);

        return node;
      },

      getPosition() {
        return {
          position: {
            lineNumber: conflictBlock.start,
            column: 1,
          },
          preference: [
            monaco.editor.ContentWidgetPositionPreference.ABOVE,
          ],
        };
      },
    };

	let zoneId: string = "";

	editor.changeViewZones((accessor) => {
      const domNode = document.createElement("div");
	  domNode.className = styles.viewZone;

      zoneId = accessor.addZone({
        afterLineNumber: conflictBlock.start - 1,
        heightInLines: 1,
        domNode,
      });
    });

	editor.addContentWidget(widget);
	return [widget, zoneId];
}

/**
 * Remove all widgets, view zones, and decorations (highlighting) from the Monaco editor.
 */
function clearWidgets(
	editor: MonacoEditor.editor.IStandaloneCodeEditor, 
	widgets: Map<number, MonacoEditor.editor.IContentWidget>,
	zoneIds: Map<number, string>,
	decorationsCollection: MonacoEditor.editor.IEditorDecorationsCollection,
): void {
	for (const widget of widgets.values()) {
		editor.removeContentWidget(widget);
	}
	editor.changeViewZones(accessor => {
		for (const zoneId of zoneIds.values()) {
			accessor.removeZone(zoneId);
		}
	});
	decorationsCollection.clear();
}

/**
 * Render conflicts in the Monaco editor with line highlighting, a widget with acceptance buttons, 
 * and view zones for spacing.
 * TODO: Optimize so widgets, conflict blocks, and view zones are not recomputed upon every change.
 */
export default function renderConflicts(
	editor: MonacoEditor.editor.IStandaloneCodeEditor, 
	monaco: Monaco, 
	conflictBlocks: Map<number, ConflictBlock>, 
	decorationsCollection: MonacoEditor.editor.IEditorDecorationsCollection,
	widgets: Map<number, MonacoEditor.editor.IContentWidget>,
	zoneIds: Map<number, string>,
	acceptCurrentFunc: (conflictBlock: ConflictBlock) => void, 
	acceptIncomingFunc: (conflictBlock: ConflictBlock) => void, 
	acceptBothFunc: (conflictBlock: ConflictBlock) => void,
): void {
	clearWidgets(editor, widgets, zoneIds, decorationsCollection);
	const newDecorationsList = [];
	for (const [start, conflictBlock] of conflictBlocks.entries()) {
        newDecorationsList.push({
            range: new monaco.Range(conflictBlock.start, 1, conflictBlock.start, 1),
            options: {
                isWholeLine: true,
			    className: styles.currentStrong,
            }
        });
        newDecorationsList.push({
            range: new monaco.Range(conflictBlock.start + 1, 1, conflictBlock.divider - 1, 1),
            options: {
                isWholeLine: true,
			    className: styles.current,
            }
        });
        newDecorationsList.push({
            range: new monaco.Range(conflictBlock.divider + 1, 1, conflictBlock.end - 1, 1),
            options: {
                isWholeLine: true,
			    className: styles.incoming,
            }
        });
        newDecorationsList.push({
            range: new monaco.Range(conflictBlock.end, 1, conflictBlock.end, 1),
            options: {
                isWholeLine: true,
			    className: styles.incomingStrong,
            }
        });

		const [widget, zoneId]: [MonacoEditor.editor.IContentWidget, string] = insertConflictWidget(conflictBlock, monaco, editor, acceptCurrentFunc, acceptIncomingFunc, acceptBothFunc);
		widgets.set(start, widget);
		zoneIds.set(start, zoneId);
		decorationsCollection.set(newDecorationsList);
    }
}
