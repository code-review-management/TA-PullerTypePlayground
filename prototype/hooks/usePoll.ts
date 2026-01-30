import { useEffect, useState } from "react";
import { type repo } from "@/lib/github.types";

const fetchRepositories = async (ignoreCache: boolean) => {
  const lastAccessTime = sessionStorage.getItem("api/v1/repos");
  const headers: Record<string, string> = {};

  console.log(ignoreCache, lastAccessTime)
  if (!ignoreCache && lastAccessTime) {
    headers["If-Modified-Since"] = new Date(lastAccessTime).toISOString();
  }

  const response = await fetch("http://localhost:3000/api/v1/repos", { headers });

  if (response.status === 200) {
    const lastModified = response.headers.get("Last-Modified");
    if (lastModified) {
      sessionStorage.setItem("api/v1/repos", lastModified);
    }
  }

  return response.json();
};

export function usePollRepositories(callback: () => void) {
  const [data, setData] = useState<repo[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const runFetch = async (ignoreCache: boolean) => {
      try {
        fetchRepositories(ignoreCache)
          .then((fetched) => {
            setData(fetched);
          })
          .catch((error) => {
            setError(error);
          });
      } finally {
        setLoading(false);
        callback();
      }
    };

    runFetch(true);
    const interval = setInterval(() => {runFetch(false)}, 5000);
    return () => clearInterval(interval);
  }, []);

  return { data, error, loading };
}
