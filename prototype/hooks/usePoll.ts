import { useEffect, useState } from "react";
import { Endpoints } from "@octokit/types";
import { type repo } from "@/lib/github.types"

const fetchRepositories = async () => {
    const response = await fetch('http://localhost:3000/api/v1/repos');
    return response.json();
}

export function usePollRepositories(callback: () => void) {
    const [data, setData] = useState<repo[]>([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const interval = setInterval(() => {
            try {
                fetchRepositories().then((fetched) => {
                    setData(fetched);
                }).catch((error) => {
                    setError(error);
                });
            } finally {
                setLoading(false);
                callback();
            }
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return { data, error, loading };
}