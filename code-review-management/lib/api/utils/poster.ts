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
