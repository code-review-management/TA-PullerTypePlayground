import { Button } from "@mui/material";
import { signIn } from "@/lib/auth";
import styles from "./page.module.css";

/**
 * Docs:
 * 1. https://authjs.dev/getting-started/session-management/login?framework=Next.js
 */

export default function SignIn() {
  return (
    <div className={styles.page}>
      <form
        action={async () => {
          "use server";
          await signIn("github", { redirectTo: "/dashboard" });
        }}
      >
        <Button variant="contained" type="submit">
          Sign in with GitHub
        </Button>
      </form>
    </div>
  );
}
