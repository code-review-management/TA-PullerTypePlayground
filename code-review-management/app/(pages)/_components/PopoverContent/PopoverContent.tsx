import { ReactNode } from "react";
import styles from "./PopoverContent.module.css";

export default function PopoverContent({ children }: { children: ReactNode }) {
  return <div className={styles.popoverContent}>{children}</div>;
}
