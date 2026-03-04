import styles from "./page.module.css"
import ConflictResolution from "@components/ConflictResolution/ConflictResolution";
import { MergeOutputSchema, MergeOutput } from "@lib/merge-conflict-finder/merge-github.types"
import { cookies } from "next/headers";

export interface ConflictResolutionProp {
    mergeOutput: MergeOutput,
    cookieHeader: any
}

export default async function Page() {
    // 1. Define your parameters
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString();

    const params = new URLSearchParams({
        owner: "nithinsenthil",
        repo: "IntestiSat",
        targetBranch: "RTOS_Task_low_pwr",
        featureBranch: "RTOS_Training_Base"
    });

    const response = await fetch(`/api/v1/nithinsenthil/IntestiSat/pulls/4/RTOS_Task_low_pwr/Conflict_Resolution_Our_Solution/merge-conflict?`, { 
        cache: 'no-store',
        headers: {
            // Reconstruct the cookie string for the backend to read
            Cookie: cookieHeader
        }
    });
        
    if (!response.ok) {
        return <div>Error loading conflict data.</div>;
    }

    const rawData = await response.json()
    const mergeOutput: MergeOutput = MergeOutputSchema.parse(rawData)
    const conflictResolutionProp: ConflictResolutionProp = {
        mergeOutput: mergeOutput,
        cookieHeader: cookieHeader
    }
    return (
        <div className={styles.page}>
            <h1>Conflict Resolution</h1>
            <ConflictResolution conflictResolutionProp={conflictResolutionProp}/>
        </div>
    );
}