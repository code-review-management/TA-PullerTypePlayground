import { ReactNode } from "react";
import { Popover } from "react-tiny-popover";
import HeaderButton from "@components/HeaderButton/HeaderButton";
import styles from "./PRHeaderPopoverButton.module.css";

/**
 * Button used by PR page-level headers that displays a popover when clicked.
 *
 * @param buttonLabel: Label to display on the button.
 * @param buttonVariant: Styling variant for the button.
 * @param isPopoverOpen: Whether the popover is currently open or not.
 * @param popoverContent: Content to display for the open popover.
 * @param onToggle: Function to execute when the popover is toggled between open and closed.
 * @param isDisabled: Whether the button is disabled or not.
 * @param tooltip: Tooltip message shown when hovering over the button.
 */
export default function PRHeaderPopoverButton({
  buttonLabel,
  buttonVariant,
  isPopoverOpen,
  popoverContent,
  onToggle,
  isDisabled,
  tooltip,
}: {
  buttonLabel: string;
  buttonVariant?: "primary" | "secondary";
  isPopoverOpen: boolean;
  popoverContent: ReactNode;
  onToggle: () => void;
  isDisabled?: boolean;
  tooltip?: string;
}) {
  return (
    <Popover
      isOpen={isPopoverOpen}
      positions={["bottom"]}
      content={popoverContent}
      containerClassName={styles.popoverContainer}
      onClickOutside={onToggle}
    >
      <div
        className={isPopoverOpen ? styles.popoverButtonEnabled : ""}
        {...(tooltip && {
          "data-tooltip-id": "page-header",
          "data-tooltip-content": tooltip,
          "data-tooltip-place": "bottom-end",
          "data-tooltip-delay-show": 100,
        })}
      >
        <HeaderButton
          onClick={onToggle}
          variant={buttonVariant ?? "primary"}
          isDisabled={isDisabled}
        >
          {buttonLabel}
        </HeaderButton>
      </div>
    </Popover>
  );
}
