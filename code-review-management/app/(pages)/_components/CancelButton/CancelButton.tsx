import { PlacesType } from "react-tooltip";
import Image from "next/image";
import CancelIcon from "@/public/icons/cancel.svg";
import IconTooltip from "../IconTooltip/IconTooltip";
import styles from "./CancelButton.module.css";

/**
 * Cancel button that renders an "x" icon.
 *
 * @param tooltipContent: Tooltip message shown when hovering over the button.
 *                        Defaults to "Discard".
 * @param tooltipPlace: Location of the tooltip with respect to the cancel
 *                      button. Defaults to the left-side.
 */
export default function CancelButton({
  tooltipContent = "Discard",
  tooltipPlace = "left",
}: {
  tooltipContent?: string;
  tooltipPlace?: PlacesType;
}) {
  return (
    <div>
      <button
        className={styles.cancel}
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
