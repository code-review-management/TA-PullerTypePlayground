"use client"

import styles from "./page.module.css"
// import ConflictResolution from "@components/ConflictResolution/ConflictResolution";
import { MergeOutputSchema, MergeOutput } from "@lib/merge-conflict-finder/merge-github.types"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // 1. Import useParams
import dynamic from 'next/dynamic';

// 2. Replace the static import with a dynamic one, disabling SSR
const ConflictResolution = dynamic(
    () => import("@components/ConflictResolution/ConflictResolution"),
    { 
        ssr: false,
        loading: () => <p>Loading editor...</p> // Optional: shows while Monaco is downloading
    }
);

export interface ConflictResolutionProp {
    mergeOutput: MergeOutput,
    branchInfoProp: BranchInfoProp
}

interface BranchInfoProp {
    owner: string,
    repo: string,
    pullId: string,
    targetBranch: string,
    featureBranch: string
}
export default function Page() {
    const [conflictResolutionData, setConflictResolutionData] = useState<ConflictResolutionProp>();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // 2. Extract path variables using useParams()
    const params = useParams();
    const owner = params.username as string;
    const repo = params.repo_name as string;
    const pullId = params.id as string;
    const targetBranch = params.target_branch as string;
    const featureBranch = params.feature_branch as string;

    useEffect(() => {
        const fetchData = async () => {
            // Ensure we have all necessary data before fetching
            if (!owner || !repo || !pullId || !targetBranch || !featureBranch) {
                console.warn("Missing required parameters for API call.");
                setIsLoading(false);
                return; 
            }

            try {
                // 4. Inject all variables into the fetch URL
                const response = await fetch(
                    `/api/v1/${owner}/${repo}/pulls/${pullId}/${targetBranch}/${featureBranch}/merge-conflict`, 
                    { cache: 'no-store' }
                );
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const rawData = await response.json();
                const mergeOutput: MergeOutput = MergeOutputSchema.parse(rawData);
                
                setConflictResolutionData({
                    mergeOutput: mergeOutput,
                    branchInfoProp: {
                        owner: owner,
                        repo: repo,
                        pullId: pullId,
                        targetBranch: targetBranch,
                        featureBranch: featureBranch
                    }
                });
            } catch (err) {
                console.error("Failed to fetch merge conflict data:", err);
                setError("Error loading conflict data.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [owner, repo, pullId, targetBranch, featureBranch]); // Add all variables to dependency array
        
    return (
        <div className={styles.page}>
            <h1 className={styles.header}>Merge conflicts from {targetBranch} </h1>
            
            {isLoading && <div>Loading conflict data...</div>}
            {error && <div>{error}</div>}
            {conflictResolutionData && !error && (
                <ConflictResolution conflictResolutionProp={conflictResolutionData} />
            )}
        </div>
    );
}