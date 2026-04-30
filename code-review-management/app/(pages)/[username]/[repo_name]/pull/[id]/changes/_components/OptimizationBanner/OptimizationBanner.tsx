import Image from "next/image";
import AlertSmallIcon from "@/public/icons/alert_small.svg";
import styles from "./OptimizationBanner.module.css";

export default function OptimizationBanner({ limit }: { limit: number }) {
  return (
    <div className={styles.banner}>
      <Image src={AlertSmallIcon} alt="Alert" />
      To optimize performance for large diffs, only the first {limit} files are
      expanded by default.
    </div>
  );
}
