import { PlacesType } from "react-tooltip";
import Image from "next/image";
import CancelIcon from "@/public/icons/cancel.svg";
import IconTooltip from "../IconTooltip/IconTooltip";
import styles from "./CancelButton.module.css";

/**
 * Cancel button that renders an "x" icon.
 *
 * @param onClick: Function executed on button click.
 * @param tooltipContent: Tooltip message shown when hovering over the button.
 *                        Defaults to "Cancel".
 * @param tooltipPlace: Location of the tooltip with respect to the cancel
 *                      button. Defaults to the left-side.
 */
export default function CancelButton({
  onClick,
  tooltipContent = "Cancel",
  tooltipPlace = "left",
}: {
  onClick: () => void;
  tooltipContent?: string;
  tooltipPlace?: PlacesType;
}) {
  return (
    <div>
      <button
        className={styles.cancel}
        onClick={onClick}
        data-tooltip-id="cancel"
        data-tooltip-content={tooltipContent}
        data-tooltip-place={tooltipPlace}
        data-tooltip-delay-show={100}
      >
        <Image src={CancelIcon} alt="Cancel" />
      </button>
      <IconTooltip id="cancel" />
    </div>
  );
}
