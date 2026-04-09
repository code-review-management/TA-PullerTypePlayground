import { useEffect } from "react";

/**
 * Automatically fetches all paginated pages when `useInfiniteQuery` hook is
 * used.
 *
 * Docs:
 * 1. https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries
 *
 * @param hasNextPage: `hasNextPage` field from `useInfiniteQuery` TanStack hook.
 * @param isFetching: `isFetching` field from `useInfiniteQuery` TanStack hook.
 * @param fetchNextPage: `fetchNextPage` field from `useInfiniteQuery` TanStack hook.
 */
export function useAutoFetchAllPages(
  hasNextPage: boolean,
  isFetching: boolean,
  fetchNextPage: () => void,
) {
  useEffect(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetching, fetchNextPage]);
}
