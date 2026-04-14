import styles from "./Subheader.module.css"
import { ReactNode } from "react";

export default function Subheader({ children }: { children: ReactNode }) {
  return <h4 className={styles.subheader}>{children}</h4>;
}
