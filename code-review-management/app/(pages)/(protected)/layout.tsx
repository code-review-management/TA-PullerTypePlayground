import Navbar from "../_components/Navbar/Navbar";
import ProtectedLayout from "../_components/ProtectedLayout/ProtectedLayout";
import styles from "./layout.module.css";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedLayout>
      <div className={styles.layout}>
        <Navbar />
        <div className={styles.main}>{children}</div>
      </div>
    </ProtectedLayout>
  );
}
