import { ReactNode } from "react";
import AlertFillIcon from "@/public/icons/alert_fill.svg";
import styles from "./AlertBanner.module.css";
import Image from "next/image";

/**
 * Banner for displaying alert messages.
 * @param children: Content to display in the banner.
 */
export default function AlertBanner({ children }: { children: ReactNode }) {
  return (
    <div className={styles.banner}>
      <Image src={AlertFillIcon} alt="Alert" />
      {children}
    </div>
  );
}
