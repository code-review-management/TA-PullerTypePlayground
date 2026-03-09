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
 */
export default function PRHeaderPopoverButton({
  buttonLabel,
  buttonVariant,
  isPopoverOpen,
  popoverContent,
  onToggle,
}: {
  buttonLabel: string;
  buttonVariant?: "primary" | "secondary";
  isPopoverOpen: boolean;
  popoverContent: ReactNode;
  onToggle: () => void;
}) {
  return (
    <Popover
      isOpen={isPopoverOpen}
      positions={["bottom"]}
      content={popoverContent}
      containerClassName={styles.popoverContainer}
      onClickOutside={onToggle}
    >
      <div className={isPopoverOpen ? styles.popoverButtonEnabled : ""}>
        <HeaderButton onClick={onToggle} variant={buttonVariant ?? "primary"}>
          {buttonLabel}
        </HeaderButton>
      </div>
    </Popover>
  );
}
