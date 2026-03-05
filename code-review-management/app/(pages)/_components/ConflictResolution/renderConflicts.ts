import styles from "./ConflictResolution.module.css";
import { Monaco } from "@monaco-editor/react";
import type * as MonacoEditor from "monaco-editor";

// A generic representation of a conflict block for a specific side (Current or Incoming)
export interface SideConflictBlock {
    id: string;      // Unique ID linking this conflict across all 3 windows
    start: number;   // Start line in this specific read-only editor
    end: number;     // End line in this specific read-only editor
    text: string;    // The text content to transfer to the bottom
    isResolved: boolean; // Whether the user has already transferred this block
}

/**
 * Create and add a new conflict widget for a specific side (Current or Incoming).
 * Also creates a new view zone to create line-space for the widget.
 */
function insertSideWidget(
    block: SideConflictBlock, 
    side: "current" | "incoming",
    monaco: Monaco, 
    editor: MonacoEditor.editor.IStandaloneCodeEditor, 
    acceptFunc: (block: SideConflictBlock) => void
): [MonacoEditor.editor.IContentWidget, string] {
    const widget: MonacoEditor.editor.IContentWidget = {
      getId() {
        return `conflict.widget.${side}.${block.id}`;
      },

      getDomNode() {
        const node = document.createElement("div");
        node.className = styles.conflictWidget;

        const acceptBtn = document.createElement("button");
        acceptBtn.innerText = side === "current" ? "Accept Current" : "Accept Incoming";
        acceptBtn.className = styles.conflictWidgetButton;
        
        // Single action: Transfer this block's text
        acceptBtn.addEventListener("click", () => {
            acceptFunc(block);
        });

        node.appendChild(acceptBtn);
        return node;
      },

      getPosition() {
        return {
          position: {
            lineNumber: block.start,
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
        afterLineNumber: block.start - 1,
        heightInLines: 1,
        domNode,
      });
    });

    editor.addContentWidget(widget);
    return [widget, zoneId];
}

/**
 * Remove all widgets and view zones from the Monaco editor.
 * (Decorations are now cleared via the Model, not here)
 */
function clearWidgets(
    editor: MonacoEditor.editor.IStandaloneCodeEditor, 
    widgets: Map<string, MonacoEditor.editor.IContentWidget>,
    zoneIds: Map<string, string>
): void {
    for (const widget of widgets.values()) {
        editor.removeContentWidget(widget);
    }
    editor.changeViewZones(accessor => {
        for (const zoneId of zoneIds.values()) {
            accessor.removeZone(zoneId);
        }
    });
}

/**
 * Render conflicts in ONE of the read-only top Monaco editors.
 * Applies line highlighting, and inserts the widget IF the block hasn't been accepted yet.
 * RETURNS: An array of the new decoration string IDs so the parent can track them.
 */
export function renderSideConflicts(
    editor: MonacoEditor.editor.IStandaloneCodeEditor, 
    model: MonacoEditor.editor.ITextModel, // NEW: Takes the model directly
    monaco: Monaco, 
    blocks: SideConflictBlock[], 
    side: "current" | "incoming",
    oldDecorationIds: string[], // NEW: Takes old string IDs instead of a collection
    widgets: Map<string, MonacoEditor.editor.IContentWidget>,
    zoneIds: Map<string, string>,
    acceptFunc: (block: SideConflictBlock) => void
): string[] { // NEW: Returns the new string IDs
    // 1. Clear old widgets and zones
    clearWidgets(editor, widgets, zoneIds);
    
    const newDecorationsList: MonacoEditor.editor.IModelDeltaDecoration[] = [];

    for (const block of blocks) {
        // Only render the Widget/Button if it hasn't been transferred to the bottom yet
        if (!block.isResolved) {
            const [widget, zoneId] = insertSideWidget(block, side, monaco, editor, acceptFunc);
            widgets.set(block.id, widget);
            zoneIds.set(block.id, zoneId);
        }

        // ALWAYS render the background highlighting so the user can see what the conflict was
        if (block.start !== block.end){
            newDecorationsList.push({
                range: new monaco.Range(block.start, 1, block.end, 1),
                options: {
                    isWholeLine: true,
                    className: side === "current" ? styles.current : styles.incoming,
                }
            });
        } else {
            console.log("Empty block found, skipping visual highlight");
        }
    }

    // 2. Apply to the Model and return the new tracking IDs
    return model.deltaDecorations(oldDecorationIds, newDecorationsList);
}

export function insertReverseWidget(
    editor: MonacoEditor.editor.IStandaloneCodeEditor,
    monaco: Monaco,
    conflictId: string,
    lineNumber: number,
    handleReverseFunc: (id: string) => void
): [MonacoEditor.editor.IContentWidget, string] {
    const widget: MonacoEditor.editor.IContentWidget = {
        getId() {
            return `conflict.widget.reverse.${conflictId}`;
        },

        getDomNode() {
            const node = document.createElement("div");
            node.className = styles.conflictWidget; 

            const reverseBtn = document.createElement("button");
            reverseBtn.innerText = "Reverse Changes";
            reverseBtn.className = styles.conflictWidgetButton;

            reverseBtn.addEventListener("click", () => {
                handleReverseFunc(conflictId);
            });

            node.appendChild(reverseBtn);
            return node;
        },

        getPosition() {
            return {
                position: {
                    lineNumber: lineNumber,
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
            afterLineNumber: lineNumber - 1,
            heightInLines: 1,
            domNode,
        });
    });

    editor.addContentWidget(widget);

    return [widget, zoneId];
}