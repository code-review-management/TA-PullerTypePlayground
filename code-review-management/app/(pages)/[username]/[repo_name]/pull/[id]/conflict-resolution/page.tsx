"use client"

import styles from "./page.module.css"
import ConflictResolution from "@components/ConflictResolution/ConflictResolution";
import { MergeOutputSchema, MergeOutput } from "@lib/merge-conflict-finder/merge-github.types"
import { useEffect, useState } from "react";

export interface ConflictResolutionProp {
    mergeOutput: MergeOutput
}

export default function Page() {
    // 1. Define your parameters
    // const cookieStore = await cookies()
    // const cookieHeader = cookieStore.toString();
    const [conflictResolutionData, setConflictResolutionData] = useState<ConflictResolutionProp>();

    const params = new URLSearchParams({
        owner: "nithinsenthil",
        repo: "IntestiSat",
        targetBranch: "RTOS_Task_low_pwr",
        featureBranch: "RTOS_Training_Base"
    });

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/v1/nithinsenthil/IntestiSat/pulls/4/RTOS_Task_low_pwr/Conflict_Resolution_Our_Solution/merge-conflict`, { 
                cache: 'no-store',
            });
            if (response) {
                const rawData = await response.json()
                const mergeOutput: MergeOutput = MergeOutputSchema.parse(rawData)
                const conflictResolutionProp: ConflictResolutionProp = {
                    mergeOutput: mergeOutput,
                }
                setConflictResolutionData(conflictResolutionProp);
            }
        }

        fetchData();
    }, [])
        
    // if (!response.ok) {
    //     return <div>Error loading conflict data.</div>;
    // }
    
    return (
        <div className={styles.page}>
            <h1>Conflict Resolution</h1>
            {conflictResolutionData && <ConflictResolution conflictResolutionProp={conflictResolutionData} />}
        </div>
    );
}