import { ReactNode } from "react";
import styles from "./WarningBanner.module.css";

export default function WarningBanner({ children }: { children: ReactNode }) {
  return <div className={styles.banner}>{children}</div>;
}
