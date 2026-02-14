"use client";

import { signIn } from "next-auth/react";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      Home page
      <button className={styles.onboardingButton} onClick={() => signIn()}>
        Get started
      </button>
    </div>
  );
}
