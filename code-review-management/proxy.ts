export { auth as proxy } from "@/lib/auth";

export const config = {
  matcher: ["/dashboard", "/:username/:repo_name/pull/:id*"],
};
