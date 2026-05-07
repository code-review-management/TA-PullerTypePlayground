"use client";

import { signIn } from "next-auth/react";
import styles from "./page.module.css";
import Header from "./_components/Header/Header";

export default function Home() {
  return (
    <div className={styles.page}>
      <Header/>
      <button className={styles.onboardingButton} onClick={() => signIn()}>
        Get started
      </button>
    </div>
  );
}
