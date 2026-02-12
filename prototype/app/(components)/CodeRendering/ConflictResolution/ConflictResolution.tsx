"use client"
import styles from "./ConflictResolution.module.css"
import { Editor, Monaco } from "@monaco-editor/react";
import type * as MonacoEditor from "monaco-editor";
import { type Dispatch, type SetStateAction, useState } from "react";

const testValue = 
`void pwm_timer_gpio() {
#if OP_REV == 3 
	/* OP R3 GPIO pinout
	 * 		TIM1 CH1	 GPIO E9	AF - 1
	 *      TIM2 CH4     GPIO A3     AF - 1
	 */

<<<<<<< HEAD
#if OP_REV == 2 || OP_REV == 3
=======
	// Clock setup
	RCC->AHB2ENR  |= RCC_AHB2ENR_GPIOAEN;
	RCC->AHB2ENR |= RCC_AHB2ENR_GPIOEEN;
>>>>>>> 9742747e11d9f4b627346d423922cf5fa5b9f49a

	// Reset pin state
	GPIOE->MODER &= ~GPIO_MODER_MODE9_Msk;
	GPIOA->MODER  &= ~GPIO_MODER_MODE3_Msk;
	GPIOE->AFR[1] &= ~GPIO_AFRH_AFSEL9_Msk;
	GPIOA->AFR[0] &= ~GPIO_AFRL_AFSEL3_Msk;
`;

type ConflictBlock = {
  start: number;
  divider: number;
  end: number;
};

function getConflictBlocks(value: string): Map<number, ConflictBlock> {
    const startMarker = "<<<<<<<";
    const dividerMarker = "=======";
    const endMarker = ">>>>>>>";
    const conflictBlocks= new Map<number, ConflictBlock>();

    let currentStart = -1
    let currentDivider = -1

    const lines = value.split('\n');
    for (let idx = 0; idx < lines.length; idx ++) {
        const lineNum = idx + 1;
        const line = lines[idx];
        if (line.startsWith(startMarker)) {
            currentStart = lineNum;
        } else if (line.startsWith(dividerMarker)) {
            currentDivider = lineNum;
        } else if (line.startsWith(endMarker)) {
            const block: ConflictBlock = {
                start: currentStart,
                divider: currentDivider,
                end: lineNum,
            };
            conflictBlocks.set(currentStart, block);
        }
    }

    return conflictBlocks;
}

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

		node.appendChild(acceptCurrent);
		node.appendChild(acceptIncoming);
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

function clearWidgets(
	editor: MonacoEditor.editor.IStandaloneCodeEditor, 
	widgets: Map<number, MonacoEditor.editor.IContentWidget>,
	zoneIds: Map<number, string>,
	decorationsCollection: MonacoEditor.editor.IEditorDecorationsCollection,
) {
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

function renderConflicts(
	editor: MonacoEditor.editor.IStandaloneCodeEditor, 
	monaco: Monaco, 
	conflictBlocks: Map<number, ConflictBlock>, 
	decorationsCollection: MonacoEditor.editor.IEditorDecorationsCollection,
	widgets: Map<number, MonacoEditor.editor.IContentWidget>,
	zoneIds: Map<number, string>,
	acceptCurrentFunc: (conflictBlock: ConflictBlock) => void, 
	acceptIncomingFunc: (conflictBlock: ConflictBlock) => void, 
	acceptBothFunc: (conflictBlock: ConflictBlock) => void,
) {
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

function configureEditor(
	editor: MonacoEditor.editor.IStandaloneCodeEditor, 
	monaco: Monaco, 
	initValue: string,
	conflictBlocks: Map<number, ConflictBlock>, 
	setConflictBlocks: Dispatch<SetStateAction<Map<number, ConflictBlock>>>, 
	widgets: Map<number, MonacoEditor.editor.IContentWidget>,
	zoneIds: Map<number, string>,
): void {
	editor.setValue(initValue);
	editor.updateOptions({
		fontSize: 12,
	});
	const decorationsCollection: MonacoEditor.editor.IEditorDecorationsCollection = editor.createDecorationsCollection([]);
	const model = editor.getModel();

	function processBlock(newLines: string[], blockStart: number): void {
		const newFileValue: string = newLines.join('\n');
		model?.setValue(newFileValue);
		const newConflictBlocks: Map<number, ConflictBlock> = conflictBlocks;
		conflictBlocks.delete(blockStart);
		setConflictBlocks(newConflictBlocks);
		const widget = widgets.get(blockStart);
		const zoneId = zoneIds.get(blockStart);
		if (widget && zoneId) {
			editor.removeContentWidget(widget);
			editor.changeViewZones(accessor => {
				accessor.removeZone(zoneId);
			});
		} else {
			console.error("Couldn't remove widget");
		}
		widgets.delete(blockStart);
	}

	function acceptCurrentFunc(conflictBlock: ConflictBlock): void {
		const currentValue = model?.getValue();
		if (currentValue) {
			const lines = currentValue.split('\n');
			const newLines = lines.slice(0, conflictBlock.start - 1).concat(
				lines.slice(conflictBlock.start, conflictBlock.divider - 1), 
				lines.slice(conflictBlock.end, -1)
			);
			processBlock(newLines, conflictBlock.start);
		} else {
			console.error("Couldn't get current value.");
		}
	}

	function acceptIncomingFunc(conflictBlock: ConflictBlock): void {
		const currentValue = model?.getValue();
		if (currentValue) {
			const lines = currentValue.split('\n');
			const newLines = lines.slice(0, conflictBlock.start - 1).concat(
				lines.slice(conflictBlock.divider, conflictBlock.end - 1), 
				lines.slice(conflictBlock.end, -1)
			);
			processBlock(newLines, conflictBlock.start);
		} else {
			console.error("Couldn't get current value.");
		}
	}

	function acceptBothFunc(conflictBlock: ConflictBlock): void {
		const currentValue = model?.getValue();
		if (currentValue) {
			const lines = currentValue.split('\n');
			const newLines = lines.slice(0, conflictBlock.start - 1).concat(
				lines.slice(conflictBlock.start, conflictBlock.divider - 1), 
				lines.slice(conflictBlock.divider, conflictBlock.end - 1), 
				lines.slice(conflictBlock.end, -1)
			);
			
			processBlock(newLines, conflictBlock.start);
		} else {
			console.error("Couldn't get current value.");
		}
	}

    
	renderConflicts(editor, monaco, conflictBlocks, decorationsCollection, widgets, zoneIds, acceptCurrentFunc, acceptIncomingFunc, acceptBothFunc);

	editor.onDidChangeModelContent(() => {
		const newConflictBlocks = getConflictBlocks(editor.getValue());
		setConflictBlocks(newConflictBlocks);
		renderConflicts(editor, monaco, newConflictBlocks, decorationsCollection, widgets, zoneIds, acceptCurrentFunc, acceptIncomingFunc, acceptBothFunc);
	})
}

export default function ConflictResolution() {
	const [conflictBlocks, setConflictBlocks] = useState<Map<number, ConflictBlock>>(getConflictBlocks(testValue));
	const widgets = new Map<number, MonacoEditor.editor.IContentWidget>();
	const zoneIds = new Map<number, string>();

    return (
        <div className={styles.conflictResolution}>
			<Editor
				onMount={(editor, monaco) => configureEditor(editor, monaco, testValue, conflictBlocks, setConflictBlocks, widgets, zoneIds)}
				className={styles.container}
			/>
        </div>
    );
}