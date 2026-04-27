import { StatusError } from "@/lib/api/errors/statusError";
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

export function getErrorMessageProps(
  error: StatusError | null,
  resource: string | null,
) {
  resource = resource ?? "resource";
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  switch (error?.status) {
    case 404:
      return {
        title: `${capitalize(resource)} not found`,
        description: `This ${resource.toLowerCase()} could not be found.`,
      };
    case 422:
      if (resource === "commit") {
        return {
          title: "Commit not found",
          description: "This commit could not be found.",
        };
      }
      break;
    case 406:
      if (resource === "diff") {
        return {
          title: "Diff unavailable",
          description:
            "This diff may have exceeded the limit of 20,000 lines or 300 files.",
        };
      }
      break;
  }

  return {
    title: "Something went wrong",
    description: "An unexpected error occurred. Please try again.",
  };
}
