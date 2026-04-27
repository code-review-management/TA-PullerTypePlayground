import { StatusError } from "@/lib/api/errors/statusError";
import Image from "next/image";
import Link from "next/link";
import AlertIcon from "@/public/icons/alert.svg";
import ArrowReturnIcon from "@/public/icons/arrow_return.svg";
import ExternalLinkIcon from "@/public/icons/external_link.svg";
import styles from "./ErrorMessage.module.css";

export default function ErrorMessage({
  error,
  resource,
  internalLabel,
  internalHref,
  externalHref,
}: {
  error: StatusError | null;
  resource?: string | null;
  internalLabel?: string;
  internalHref?: string;
  externalHref?: string;
}) {
  resource = resource ?? "resource";
  const { title, description } = getErrorMessageProps(error, resource);

  return (
    <div className={styles.container}>
      <Image src={AlertIcon} alt="Alert" />
      <h1>{title}</h1>
      <p className={styles.description}>{description}</p>
      {internalLabel && internalHref && (
        <Link href={internalHref} className={styles.link}>
          {internalLabel} <Image src={ArrowReturnIcon} alt="Arrow return" />
        </Link>
      )}
      {externalHref && (
        <a href={externalHref} className={styles.link}>
          View on GitHub <Image src={ExternalLinkIcon} alt="External link" />
        </a>
      )}
    </div>
  );
}

function getErrorMessageProps(error: StatusError | null, resource: string) {
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
