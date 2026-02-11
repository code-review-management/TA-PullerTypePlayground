"use client"
import styles from "./ConflictResolution.module.css"
import { Monaco, useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";

const testValue = 
`/**
 * Configures the Startup Timer registers to generate
 * an interrupt in 30 minutes
 *
 * @returns Boolean to indicate if the initialization was successful
 */
bool is_startup_count_under_max() { return startup_count < MAX_STARTUP_COUNT; }
void timer_waitStartupTime() {
	timer_initStartupTimer();

	timer_startupTimerOn();
<<<<<<< HEAD
	while (startup_count < MAX_STARTUP_COUNT) {
		nop(1);
	}
=======
	wait_with_timeout(is_startup_count_under_max, DEFAULT_TIMEOUT_MS);
>>>>>>> 9742747e11d9f4b627346d423922cf5fa5b9f49a
	timer_startupTimerOff();
}`;

function CreateEditor(monaco: Monaco) {
    console.log(testValue);
    const editor = monaco?.editor.create(
        document.getElementById("container") as HTMLElement,
        {
            value: testValue,
            automaticLayout: true,
        }
    );

    const decorations = editor.createDecorationsCollection([
        {
            range: new monaco.Range(12, 1, 12, 1),
            options: {
                isWholeLine: true,
			    className: styles.currentStrong,
            }
        },
        {
            range: new monaco.Range(13, 1, 15, 1),
            options: {
                isWholeLine: true,
			    className: styles.current,
            }
        },
        {
            range: new monaco.Range(17, 1, 17, 1),
            options: {
                isWholeLine: true,
			    className: styles.incoming,
            }
        },
        {
            range: new monaco.Range(18, 1, 18, 1),
            options: {
                isWholeLine: true,
			    className: styles.incomingStrong,
            }
        },
    ]);

    return editor;
}

export default function ConflictResolution() {
    const monaco = useMonaco();

    useEffect(() => {
      if (monaco) {
        CreateEditor(monaco);
      }
    }, [monaco]);

    return (
        <div className={styles.conflictResolution}>
            <div className={styles.container} id="container"/>
        </div>
    );
}