"use client";

import { Button } from "@mui/material";
import { signIn } from "next-auth/react";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      Home page
      <Button variant="contained" sx={{ m: 1 }} onClick={() => signIn()}>
        Get started
      </Button>
    </div>
  );
}
