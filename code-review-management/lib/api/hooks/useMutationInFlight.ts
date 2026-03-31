import { MutationKey, useMutationState } from "@tanstack/react-query";

/**
 * Check if there exists a mutation with the given key that is currently in-
 * flight.
 *
 * Docs:
 * 1. https://tanstack.com/query/v5/docs/framework/react/reference/useMutationState
 *
 * @param mutationKey: Unique key to identify the mutation.
 * @return: True if there is a pending mutation, and false otherwise.
 */
export function useMutationInFlight({
  mutationKey,
}: {
  mutationKey: MutationKey;
}) {
  return (
    useMutationState({
      filters: {
        mutationKey,
        status: "pending",
      },
    }).length > 0
  );
}
