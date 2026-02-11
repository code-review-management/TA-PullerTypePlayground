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

function insertConflictWidget(conflictBlock: ConflictBlock, monaco: Monaco, editor: MonacoEditor.editor.IStandaloneCodeEditor, acceptBothFunc) {
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
		});

		const acceptIncoming = document.createElement("button");
		acceptIncoming.innerText = "Accept incoming";
		acceptIncoming.className = styles.conflictWidgetButton;
		acceptIncoming.addEventListener("click", (e) => {
			console.log("accept incoming");
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

	editor.changeViewZones((accessor) => {
      const dom = document.createElement("div");
      dom.style.padding = "8px";

      accessor.addZone({
        afterLineNumber: conflictBlock.start - 1,
        heightInLines: 1,
        domNode: dom,
      });
    });

	editor.addContentWidget(widget);
}

function configEditor(editor: MonacoEditor.editor.IStandaloneCodeEditor, monaco: Monaco, initValue: string, conflictBlocks: Map<number, ConflictBlock>, setConflictBlocks) {
	editor.setValue(initValue);
	editor.updateOptions({
		fontSize: 12,
	})

    const decorationsList = [];
	const model = editor.getModel();

	function acceptBothFunc(conflictBlock: ConflictBlock) {
		const currentValue = model?.getValue();
		const lines = currentValue.split('\n');
		const newLines = lines.slice(0, conflictBlock.start - 1).concat(
			lines.slice(conflictBlock.start, conflictBlock.divider - 1), 
			lines.slice(conflictBlock.divider, conflictBlock.end - 1), 
			lines.slice(conflictBlock.end, -1)
		);
		const newFileValue = newLines.join('\n');
		model.setValue(newFileValue);
		const newConflictBlocks = conflictBlocks;
		conflictBlocks.delete(conflictBlock.start);
		setConflictBlocks(newConflictBlocks);
		console.log("newFileValue", newFileValue);
		console.log("newConflictBlocks", newConflictBlocks);
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

		insertConflictWidget(conflictBlock, monaco, editor, acceptBothFunc);
    }

    editor.createDecorationsCollection(decorationsList);
}

export default function ConflictResolution() {
	const [conflictBlocks, setConflictBlocks] = useState<Map<number, ConflictBlock>>(getConflictBlocks(testValue));

    return (
        <div className={styles.conflictResolution}>
			<Editor
				onMount={(editor, monaco) => configEditor(editor, monaco, testValue, conflictBlocks, setConflictBlocks)}
				className={styles.container}
			/>
        </div>
    );
}