import { ReactNode } from "react";
import styles from "./AlertBanner.module.css";

export default function AlertBanner({ children }: { children: ReactNode }) {
  return <div className={styles.banner}>{children}</div>;
}
