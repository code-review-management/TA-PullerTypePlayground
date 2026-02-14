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
        <button type="submit" className={styles.signInButton}>
          Sign in with GitHub
        </button>
      </form>
    </div>
  );
}
