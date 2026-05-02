import Navbar from "../_components/Navbar/Navbar";
import styles from "./layout.module.css";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.layout}>
      <Navbar />
      <div className={styles.main}>{children}</div>
    </div>
  );
}
