"use client"
import styles from "./ConflictResolution.module.css"
import { Editor, Monaco } from "@monaco-editor/react";
import type * as MonacoEditor from "monaco-editor";
import { SetStateAction, useState } from "react";

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

function getConflictBlocks(value: string) {
    const startMarker = "<<<<<<<";
    const dividerMarker = "=======";
    const endMarker = ">>>>>>>";
    const conflictBlocks: Map<number, ConflictBlock> = new Map<number, ConflictBlock>();

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
	acceptCurrentFunc, 
	acceptIncomingFunc, 
	acceptBothFunc
): [MonacoEditor.editor.IContentWidget, string] {
    const widget: MonacoEditor.editor.IContentWidget = {
      getId() {
        return "example.widget";
      },

      getDomNode() {
        const node = document.createElement("div");
		node.className = styles.conflictWidget;

		const acceptCurrent = document.createElement("button");
		acceptCurrent.innerText = "Accept current";
		acceptCurrent.className = styles.conflictWidgetButton;
		acceptCurrent.addEventListener("click", (e: PointerEvent) => {
			console.log("accept current");
			acceptCurrentFunc(conflictBlock);
		});

		const acceptIncoming = document.createElement("button");
		acceptIncoming.innerText = "Accept incoming";
		acceptIncoming.className = styles.conflictWidgetButton;
		acceptIncoming.addEventListener("click", (e) => {
			console.log("accept incoming");
			acceptIncomingFunc(conflictBlock);
		});

		const acceptBoth = document.createElement("button");
		acceptBoth.innerText = "Accept both";
		acceptBoth.className = styles.conflictWidgetButton;
		acceptBoth.addEventListener("click", (e) => {
			console.log("accept both");
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
      const dom = document.createElement("div");
      dom.style.padding = "8px";

      zoneId = accessor.addZone({
        afterLineNumber: conflictBlock.start - 1,
        heightInLines: 1,
        domNode: dom,
      });
    });

	editor.addContentWidget(widget);
	return [widget, zoneId];
}

function configEditor(
	editor: MonacoEditor.editor.IStandaloneCodeEditor, 
	monaco: Monaco, initValue: string, 
	conflictBlocks: Map<number, ConflictBlock>, 
	setConflictBlocks, 
	widgets: Map<number, MonacoEditor.editor.IContentWidget>,
	zoneIds: Map<number, string>,
) {
	editor.setValue(initValue);
	editor.updateOptions({
		fontSize: 12,
	})

    const decorationsList = [];
	const model = editor.getModel();

	function processBlock(newLines: string[], blockStart: number) {
		const newFileValue = newLines.join('\n');
		model.setValue(newFileValue);
		const newConflictBlocks = conflictBlocks;
		conflictBlocks.delete(blockStart);
		setConflictBlocks(newConflictBlocks);
		console.log("newFileValue", newFileValue);
		console.log("newConflictBlocks", newConflictBlocks);
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

	function acceptCurrentFunc(conflictBlock: ConflictBlock) {
		const currentValue = model?.getValue();
		const lines = currentValue.split('\n');
		const newLines = lines.slice(0, conflictBlock.start - 1).concat(
			lines.slice(conflictBlock.start, conflictBlock.divider - 1), 
			lines.slice(conflictBlock.end, -1)
		);
		
		processBlock(newLines, conflictBlock.start)
	}

	function acceptIncomingFunc(conflictBlock: ConflictBlock) {
		const currentValue = model?.getValue();
		const lines = currentValue.split('\n');
		const newLines = lines.slice(0, conflictBlock.start - 1).concat(
			lines.slice(conflictBlock.divider, conflictBlock.end - 1), 
			lines.slice(conflictBlock.end, -1)
		);
		
		processBlock(newLines, conflictBlock.start)
	}

	function acceptBothFunc(conflictBlock: ConflictBlock) {
		const currentValue = model?.getValue();
		const lines = currentValue.split('\n');
		const newLines = lines.slice(0, conflictBlock.start - 1).concat(
			lines.slice(conflictBlock.start, conflictBlock.divider - 1), 
			lines.slice(conflictBlock.divider, conflictBlock.end - 1), 
			lines.slice(conflictBlock.end, -1)
		);
		
		processBlock(newLines, conflictBlock.start)
	}

    for (const [start, conflictBlock] of conflictBlocks.entries()) {
        decorationsList.push({
            range: new monaco.Range(conflictBlock.start, 1, conflictBlock.start, 1),
            options: {
                isWholeLine: true,
			    className: styles.currentStrong,
            }
        });
        decorationsList.push({
            range: new monaco.Range(conflictBlock.start + 1, 1, conflictBlock.divider - 1, 1),
            options: {
                isWholeLine: true,
			    className: styles.current,
            }
        });
        decorationsList.push({
            range: new monaco.Range(conflictBlock.divider + 1, 1, conflictBlock.end - 1, 1),
            options: {
                isWholeLine: true,
			    className: styles.incoming,
            }
        });
        decorationsList.push({
            range: new monaco.Range(conflictBlock.end, 1, conflictBlock.end, 1),
            options: {
                isWholeLine: true,
			    className: styles.incomingStrong,
            }
        });

		const [widget, zoneId]: [MonacoEditor.editor.IContentWidget, string] = insertConflictWidget(conflictBlock, monaco, editor, acceptCurrentFunc, acceptIncomingFunc, acceptBothFunc);
		widgets.set(start, widget);
		zoneIds.set(start, zoneId);
    }

    editor.createDecorationsCollection(decorationsList);
}

export default function ConflictResolution() {
	const [conflictBlocks, setConflictBlocks] = useState<Map<number, ConflictBlock>>(getConflictBlocks(testValue));
	const widgets = new Map<number, MonacoEditor.editor.IContentWidget>();
	const zoneIds = new Map<number, string>();

    return (
        <div className={styles.conflictResolution}>
			<Editor
				onMount={(editor, monaco) => configEditor(editor, monaco, testValue, conflictBlocks, setConflictBlocks, widgets, zoneIds)}
				className={styles.container}
			/>
        </div>
    );
}