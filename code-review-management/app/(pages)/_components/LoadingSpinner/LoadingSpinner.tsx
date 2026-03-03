import { RotatingLines } from "react-loader-spinner";

/**
 * Renders a loading spinner.
 *
 * @param size: Height and width of the spinner in px units. Defaults to 20px.
 */
export default function LoadingSpinner({ size = 20 }: { size?: number }) {
  return (
    <RotatingLines height={size} width={size} color="var(--color-disabled)" />
  );
}
