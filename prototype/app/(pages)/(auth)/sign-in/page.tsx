import Button from "@mui/material/Button";
import { signIn } from "@/lib/auth";
import { FaGithub } from "react-icons/fa";

/**
 * https://authjs.dev/getting-started/session-management/login
 */
export default function SignInPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <span className="mb-4 text-2xl font-bold">Log in to Pullertype</span>
      <form
        action={async () => {
          "use server";
          await signIn("github", { redirectTo: "/dashboard" });
        }}
      >
        <Button variant="contained" type="submit">
          <FaGithub className="mr-2" />
          Sign in on GitHub.com
        </Button>
      </form>
    </div>
  );
}
