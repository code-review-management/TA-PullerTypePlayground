"use client";

import styles from "./page.module.css";
import Header from "./_components/Header/Header";
import Hero from "./_components/Hero/Hero";
import Blurb from "./_components/Blurb/Blurb";

export default function Home() {
  return (
    <div className={styles.page}>
      <Header/>
      <div className={styles.pageBody}>
        <Hero />
        <Blurb />
      </div>
    </div>
  );
}
