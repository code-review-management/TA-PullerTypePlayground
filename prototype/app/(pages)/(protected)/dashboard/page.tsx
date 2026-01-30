'use client';

import { useState } from "react";


export default function DashboardPage() {
  const [data, setData] = useState('');
  
  const fetchData = async () => {
    try {
      // Replace with your API endpoint (e.g., '/api/your-endpoint' or external URL)
      const response = await fetch('http://localhost:3000/api/v1/repos');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const apiData = await response.json();
      setData(JSON.stringify(apiData, null, 2));
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
      <button onClick={fetchData}>
        CLICK ME
      </button>
      <pre>{data}</pre>
    </div>
  );
}
