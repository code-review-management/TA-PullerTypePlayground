/**
 * Makes a POST request to the given route with the provided JSON body. Throws
 * an error if the response is not ok (response status outside the range
 * 200-299), which signals to TanStack Query that the fetch failed. Since
 * rejected Promises are considered errors, we do not need to wrap our call
 * around a try-catch block.
 *
 * @param route: The route to make the POST request to.
 * @param body: JSON string to include in the POST request body.
 * @returns: A promise that will resolve the data.
 */
export async function poster(route: string, body: string) {
  const response = await fetch(route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  if (!response.ok) {
    throw new Error("Network POST response was not successful.");
  }

  return response.json();
}
