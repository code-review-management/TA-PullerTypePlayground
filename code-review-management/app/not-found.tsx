import { StatusError } from "@/lib/api/errors/statusError";
import ErrorMessage from "@components/ErrorMessage/ErrorMessage";

export default function NotFound() {
  const notFoundError = new StatusError(404, "This page could not be found.");

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <ErrorMessage
        error={notFoundError}
        resource="page"
        internalLabel="Back to home"
        internalHref="/"
      />
    </div>
  );
}
