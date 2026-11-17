import { useCallback, useEffect, useState } from "react";

import { ApiError, apiRequest } from "../services/api";

export interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Small fetch hook used by every page. It intentionally keeps a null data
 * state on failure so the UI cannot fall back to fabricated numbers.
 */
export function useApi<T>(path: string): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);

  const refetch = useCallback(() => {
    setRequestVersion((version) => version + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    apiRequest<T>(path)
      .then((result) => {
        if (!cancelled) {
          setData(result);
        }
      })
      .catch((cause: unknown) => {
        if (cancelled) {
          return;
        }
        setData(null);
        setError(
          cause instanceof ApiError
            ? cause.message
            : "Unexpected error while loading data.",
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [path, requestVersion]);

  return { data, loading, error, refetch };
}
