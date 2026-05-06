import styles from "./PendingReviewError.module.css";

export default function PendingReviewError({
  message,
  externalUrl,
}: {
  message: string;
  externalUrl?: string;
}) {
  return (
    <div>
      {message} Please ensure all pending reviews are submitted
      {externalUrl && (
        <>
          {" "}
          <a
            href={`${externalUrl}/changes`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            here
          </a>
        </>
      )}
      .
    </div>
  );
}
