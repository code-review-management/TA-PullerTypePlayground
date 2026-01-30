'use client';

import { usePollRepositories } from "@/hooks/usePoll";
import { useState } from "react";
import { type repo } from "@/lib/github.types"

export default function DashboardPage() {
  const [data, setData] = useState<repo[]>([]);
  const { data: pollData, error: pollError, loading: pollLoading } = usePollRepositories(() => {});
  
  const fetchData = async () => {
    try {
      // Replace with your API endpoint (e.g., '/api/your-endpoint' or external URL)
      const response = await fetch('http://localhost:3000/api/v1/repos');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const apiData = await response.json();
      setData(apiData);
      // setData(JSON.stringify(apiData, null, 2));
    } catch (err) {
      // setError(err.message);
    } finally {
      // setIsLoading(false);
    }
  };
  
  // not actually protected yet lol
  return (
    <div>
      <div>Protected authenticated page (not actually yet lol)</div>
      <button onClick={ fetchData }>
        CLICK ME
      </button>
      <pre>{ pollData.map((repo) => 
        <div key={repo.name}>{repo.name}</div>
      )}</pre>
    </div>
  );
}
