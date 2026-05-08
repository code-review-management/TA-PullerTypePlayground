import Image from "next/image";
import styles from "./HeroInstall.module.css";
import GitHubIcon from "@/public/icons/github.svg";

export default function HeroInstall() {
  return (
    <button className={styles.btn}>
      <Image src={GitHubIcon} alt="GitHub" height={30} width={30} />
      Install GitHub App
    </button>
  );
}
