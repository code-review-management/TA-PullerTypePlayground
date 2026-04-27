import { StatusError } from "../errors/status-error";

/**
 * Copied from the TanStack documentation to query JSON data from the given
 * route. Throws an error if the response is not ok (response status outside the
 * range 200-299), which signals to TanStack Query that the fetch failed.
 * Since rejected Promises are considered errors, we do not need to wrap our
 * call around a try-catch block.
 *
 * Docs:
 * 1. https://tanstack.com/query/v5/docs/framework/react/guides/query-functions#usage-with-fetch-and-other-clients-that-do-not-throw-by-default
 *
 * @param route: The route to fetch from.
 * @returns: A promise that will resolve the data.
 */
export async function fetcher(route: string) {
  const response = await fetch(route);
  if (!response.ok) {
    throw new StatusError(
      response.status,
      "Network GET response was unsuccessful.",
    );
  }
  return response.json();
}
