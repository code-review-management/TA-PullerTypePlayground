/**
 * A component that uses the Monaco editor to implement a text editor for merge conflict resolution.
 */

"use client"
import styles from "./ConflictResolution.module.css"
import { Editor } from "@monaco-editor/react";
import type * as MonacoEditor from "monaco-editor";
import { useState } from "react";
import { testValue } from "./conflictTestValue"
import configureEditor from "./configureEditor"
import { type ConflictBlock } from "./conflictBlock"
import getConflictBlocks from "./getConflictBlocks";
import useIsDark from "@components/ConflictResolution/useIsDark"
import { MergeOutput, MergeFileOutput } from "@/lib/merge-conflict-finder/merge-github.types";

export default function ConflictResolution( { mergeOutput }: {mergeOutput: MergeOutput} ) {
	let firstConflict: MergeFileOutput = mergeOutput.mergedFiles[0];
	let foundConflict: boolean = false;
	mergeOutput.mergedFiles.forEach(element => {
		if (!foundConflict && element.hasConflict){
			firstConflict = element;
			foundConflict = true;
		}
	});

	const [conflictBlocks, setConflictBlocks] = useState<Map<number, ConflictBlock>>(getConflictBlocks(firstConflict));
	const { isDark } = useIsDark();
	const widgets = new Map<number, MonacoEditor.editor.IContentWidget>();
	const zoneIds = new Map<number, string>();

    return (
		<div className={styles.conflictResolution}>
			<Editor
				onMount={(editor, monaco) => configureEditor(editor, monaco, testValue, conflictBlocks, setConflictBlocks, widgets, zoneIds)}
				className={styles.container}
				theme={isDark ? "vs-dark" : "vs-light"}
			/>
        </div>
    );
}
