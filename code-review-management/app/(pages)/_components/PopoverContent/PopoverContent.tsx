import { ReactNode } from "react";

export default function PopoverContent({ children }: { children: ReactNode }) {
  return <div className={styles.popoverContent}>{children}</div>;
}
