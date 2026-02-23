import styles from "./InlineThreadHeader.module.css";

export default function InlineThreadHeader({ title }: { title: string }) {
  return <div className={styles.header}>{title}</div>;
}
