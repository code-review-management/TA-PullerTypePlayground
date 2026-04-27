import Image from "next/image";
import AlertIcon from "@/public/icons/alert.svg";
import ExternalLinkIcon from "@/public/icons/external_link.svg";
import styles from "./ErrorMessage.module.css";

export default function ErrorMessage({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url?: string;
}) {
  return (
    <div className={styles.container}>
      <Image src={AlertIcon} alt="Alert" />
      <h1>{title}</h1>
      <p className={styles.description}>{description}</p>
      {url && (
        <a href={url} className={styles.link}>
          View on GitHub <Image src={ExternalLinkIcon} alt="External link" />
        </a>
      )}
    </div>
  );
}
