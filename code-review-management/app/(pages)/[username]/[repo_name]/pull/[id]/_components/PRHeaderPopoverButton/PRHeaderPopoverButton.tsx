import { ReactNode } from "react";
import { Popover } from "react-tiny-popover";
import HeaderButton from "@components/HeaderButton/HeaderButton";
import styles from "./PRHeaderPopoverButton.module.css";

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
    >
      <div className={isPopoverOpen ? styles.popoverButtonEnabled : ""}>
        <HeaderButton onClick={onToggle} variant={buttonVariant ?? "primary"}>
          {buttonLabel}
        </HeaderButton>
      </div>
    </Popover>
  );
}
